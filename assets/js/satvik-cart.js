(function () {
  var STORAGE_KEY = "satvikCart";
  var WHATSAPP_NUMBER = "918200718103";

  function readCart() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(data)) return [];
      return data.filter(function (item) {
        return item && item.name && typeof item.price === "number" && item.qty > 0;
      });
    } catch (err) {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    render();
  }

  function cleanText(node) {
    return (node && node.textContent ? node.textContent : "").replace(/\s+/g, " ").trim();
  }

  function parsePrice(text) {
    var match = String(text).replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  }

  function packFrom(name) {
    var match = name.match(/\[([^\]]+)\]|\(([^)]+)\)/);
    return match ? (match[1] || match[2] || "").trim() : "";
  }

  function currencyOf(label) {
    if (String(label).indexOf("₹") !== -1) return "₹";
    if (String(label).indexOf("$") !== -1) return "$";
    return "";
  }

  function formatPriceLabel(label) {
    return String(label)
      .replace(/₹\s+/g, "₹")
      .replace(/\/per\s+lit(?:er|re)/gi, " per litre")
      .replace(/\s+/g, " ")
      .trim();
  }

  function formatAmount(amount, label) {
    var symbol = currencyOf(label);
    return symbol + (Math.round(amount * 100) / 100).toFixed(2);
  }

  function subtotal(cart) {
    return cart.reduce(function (sum, item) {
      return sum + item.price * item.qty;
    }, 0);
  }

  function itemCount(cart) {
    return cart.reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
  }

  function formatSubtotal(cart) {
    var symbols = cart.map(function (item) {
      return currencyOf(item.priceLabel);
    });
    var hasRupee = symbols.indexOf("₹") !== -1;
    var hasDollar = symbols.indexOf("$") !== -1;
    if (hasRupee && hasDollar) return "see line totals";
    var symbol = hasRupee ? "₹" : hasDollar ? "$" : "";
    return symbol + subtotal(cart).toFixed(2);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function displayName(item) {
    if (item.pack && item.name.indexOf(item.pack) === -1) {
      return item.name + " [" + item.pack + "]";
    }
    return item.name;
  }

  function addItem(item) {
    var cart = readCart();
    var id = item.name + "|" + item.price;
    var existing = null;
    cart.forEach(function (entry) {
      if (entry.id === id) existing = entry;
    });
    if (existing) {
      existing.qty += item.qty || 1;
    } else {
      cart.push({
        id: id,
        name: item.name,
        pack: item.pack || "",
        price: item.price,
        priceLabel: item.priceLabel,
        image: item.image || "",
        qty: item.qty || 1
      });
    }
    writeCart(cart);
    setOpen(true);
  }

  function changeQty(id, nextQty) {
    var cart = readCart()
      .map(function (item) {
        if (item.id === id) item.qty = nextQty;
        return item;
      })
      .filter(function (item) {
        return item.qty > 0;
      });
    writeCart(cart);
  }

  function ensureStyles() {
    if (document.querySelector('link[data-satvik-cart]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "assets/css/satvik-cart.css";
    link.setAttribute("data-satvik-cart", "true");
    document.head.appendChild(link);
  }

  function sidebarMarkup() {
    return (
      '<div class="cartmini__wrapper">' +
      '<div class="cartmini__title"><h4 id="satvik-minicart-title">Shopping Cart</h4></div>' +
      '<div class="cartmini__close"><button type="button" aria-label="Close shopping cart"><i class="fal fa-times" aria-hidden="true"></i></button></div>' +
      '<div class="cartmini__widget"><div class="cartmini__inner"><ul id="satvik-minicart-items"></ul></div>' +
      '<div class="cartmini__checkout"><div class="cartmini__checkout-title mb-30"><h4>Subtotal:</h4><span id="satvik-minicart-subtotal">₹0.00</span></div>' +
      '<div class="cartmini__checkout-btn">' +
      '<a href="cart.html" class="bd-fill__btn w-100 satvik-cart-link"><span></span> view cart</a>' +
      '<a href="checkout.html" class="bd-fill__btn-2 w-100 satvik-cart-link"><span></span> checkout</a>' +
      "</div></div></div></div>"
    );
  }

  function ensureChrome() {
    var sidebar = document.querySelector(".shoping__sidebar");
    if (!sidebar) {
      sidebar = document.createElement("div");
      sidebar.className = "shoping__sidebar";
      sidebar.innerHTML = sidebarMarkup();
      document.body.appendChild(sidebar);
    }
    sidebar.id = "satvik-minicart";
    sidebar.setAttribute("role", "dialog");
    sidebar.setAttribute("aria-modal", "true");
    sidebar.setAttribute("aria-labelledby", "satvik-minicart-title");
    var title = sidebar.querySelector(".cartmini__title h4");
    if (title && !title.id) title.id = "satvik-minicart-title";
    var list = sidebar.querySelector(".cartmini__inner ul");
    if (list && !list.id) list.id = "satvik-minicart-items";
    var subtotalNode = sidebar.querySelector(".cartmini__checkout-title span");
    if (subtotalNode && !subtotalNode.id) subtotalNode.id = "satvik-minicart-subtotal";
    var close = sidebar.querySelector(".cartmini__close button");
    if (close && !close.dataset.satvikBound) {
      close.dataset.satvikBound = "true";
      close.setAttribute("aria-label", "Close shopping cart");
      close.addEventListener("click", function () {
        setOpen(false);
      });
    }
    if (!sidebar.dataset.satvikBound) {
      sidebar.dataset.satvikBound = "true";
      sidebar.addEventListener("click", onSidebarClick);
    }

    var nav = document.querySelector("nav.navbar .container");
    if (nav && !nav.querySelector(".satvik-cart-toggle")) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "satvik-cart-toggle";
      button.setAttribute("aria-label", "Open shopping cart");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", "satvik-minicart");
      button.innerHTML =
        '<i class="fas fa-shopping-basket" aria-hidden="true"></i>' +
        '<span class="satvik-cart-count">0</span>' +
        '<span class="visually-hidden" id="satvik-cart-live" aria-live="polite"></span>';
      var toggler = nav.querySelector(".navbar-toggler");
      if (toggler) nav.insertBefore(button, toggler);
      else nav.appendChild(button);
      button.addEventListener("click", function () {
        setOpen(!document.getElementById("satvik-minicart").classList.contains("cart-open"));
      });
    }
  }

  function setOpen(open) {
    var sidebar = document.getElementById("satvik-minicart");
    var button = document.querySelector(".satvik-cart-toggle");
    if (!sidebar) return;
    sidebar.classList.toggle("cart-open", open);
    sidebar.setAttribute("aria-hidden", open ? "false" : "true");
    if (button) button.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function onSidebarClick(event) {
    var button = event.target.closest("[data-satvik-action]");
    if (!button) return;
    var id = button.getAttribute("data-id");
    var cart = readCart();
    var item = null;
    cart.forEach(function (entry) {
      if (entry.id === id) item = entry;
    });
    if (!item) return;
    if (button.getAttribute("data-satvik-action") === "inc") changeQty(id, item.qty + 1);
    if (button.getAttribute("data-satvik-action") === "dec") changeQty(id, Math.max(1, item.qty - 1));
    if (button.getAttribute("data-satvik-action") === "remove") changeQty(id, 0);
  }

  function lineHtml(item) {
    var name = displayName(item);
    var pack = item.pack && item.name.indexOf(item.pack) === -1
      ? '<span class="satvik-pack">Pack size: ' + escapeHtml(item.pack) + "</span>"
      : "";
    var image = item.image
      ? '<img src="' + escapeHtml(item.image) + '" alt="">'
      : "";
    return (
      "<li>" +
      '<div class="cartmini__thumb">' + image + "</div>" +
      '<div class="cartmini__content satvik-mini-item">' +
      "<h5>" + escapeHtml(name) + "</h5>" +
      pack +
      '<span class="satvik-price-label">' + escapeHtml(item.priceLabel) + "</span>" +
      '<div class="satvik-qty-row">' +
      '<button type="button" class="satvik-qty" data-satvik-action="dec" data-id="' + escapeHtml(item.id) + '" aria-label="Decrease quantity of ' + escapeHtml(name) + '">−</button>' +
      '<span class="satvik-qty-value">' + item.qty + "</span>" +
      '<button type="button" class="satvik-qty" data-satvik-action="inc" data-id="' + escapeHtml(item.id) + '" aria-label="Increase quantity of ' + escapeHtml(name) + '">+</button>' +
      '<button type="button" class="satvik-remove" data-satvik-action="remove" data-id="' + escapeHtml(item.id) + '" aria-label="Remove ' + escapeHtml(name) + ' from cart"><i class="fal fa-times" aria-hidden="true"></i></button>' +
      "</div></div></li>"
    );
  }

  function renderMini(cart) {
    var list = document.getElementById("satvik-minicart-items");
    var total = document.getElementById("satvik-minicart-subtotal");
    if (!list) return;
    if (!cart.length) {
      list.innerHTML = '<li class="satvik-empty">Your cart is empty. <a href="shop.html">Browse the shop</a>.</li>';
    } else {
      list.innerHTML = cart.map(lineHtml).join("");
    }
    if (total) total.textContent = cart.length ? formatSubtotal(cart) : "₹0.00";
    var count = itemCount(cart);
    document.querySelectorAll(".satvik-cart-count").forEach(function (node) {
      node.textContent = String(count);
    });
    var live = document.getElementById("satvik-cart-live");
    if (live) live.textContent = count + (count === 1 ? " item in cart" : " items in cart");
  }

  function renderPage(cart) {
    var page = document.getElementById("satvik-cart-page");
    if (!page) return;
    if (!cart.length) {
      page.innerHTML = '<p>Your cart is empty.</p><a class="satvik-add-cart" href="shop.html">Browse the shop</a>';
      return;
    }
    var rows = cart.map(function (item) {
      var name = displayName(item);
      return (
        '<article class="satvik-cart-row">' +
        (item.image ? '<img src="' + escapeHtml(item.image) + '" alt="">' : "<span></span>") +
        "<div><h2>" + escapeHtml(name) + "</h2>" +
        (item.pack && item.name.indexOf(item.pack) === -1 ? "<p>Pack size: " + escapeHtml(item.pack) + "</p>" : "") +
        "<p>" + escapeHtml(item.priceLabel) + "</p>" +
        '<div class="satvik-qty-row">' +
        '<button type="button" class="satvik-qty" data-satvik-action="dec" data-id="' + escapeHtml(item.id) + '" aria-label="Decrease quantity of ' + escapeHtml(name) + '">−</button>' +
        '<span class="satvik-qty-value">' + item.qty + "</span>" +
        '<button type="button" class="satvik-qty" data-satvik-action="inc" data-id="' + escapeHtml(item.id) + '" aria-label="Increase quantity of ' + escapeHtml(name) + '">+</button>' +
        '<button type="button" class="satvik-remove" data-satvik-action="remove" data-id="' + escapeHtml(item.id) + '" aria-label="Remove ' + escapeHtml(name) + '">Remove</button>' +
        "</div></div>" +
        '<p class="satvik-line-total">' + escapeHtml(formatAmount(item.price * item.qty, item.priceLabel)) + "</p>" +
        "</article>"
      );
    }).join("");
    page.innerHTML =
      '<div class="satvik-cart-table" id="satvik-cart-lines">' + rows +
      '<div class="satvik-subtotal"><span>Subtotal</span><span>' + escapeHtml(formatSubtotal(cart)) + "</span></div></div>" +
      '<p style="margin-top:20px"><a class="satvik-place-order" href="checkout.html">Continue to checkout</a></p>';
    page.querySelector("#satvik-cart-lines").addEventListener("click", onSidebarClick);
  }

  function orderLines(cart) {
    return cart.map(function (item, index) {
      var line = index + 1 + ". " + displayName(item);
      if (item.pack && item.name.indexOf(item.pack) === -1) line += "\n   Pack size: " + item.pack;
      line += "\n   " + item.qty + " x " + formatPriceLabel(item.priceLabel) + " = " + formatAmount(item.price * item.qty, item.priceLabel);
      return line;
    }).join("\n");
  }

  function buildMessage(cart, details) {
    var lines = [
      "Satvik Milk Farm order",
      "",
      "Items:",
      orderLines(cart),
      "",
      "Subtotal: " + formatSubtotal(cart),
      "",
      "Name: " + details.name,
      "Phone: " + details.phone,
      "Delivery address: " + details.address,
      "Area or pincode: " + details.area,
      "Preferred delivery: " + details.delivery
    ];
    if (details.note) lines.push("Note: " + details.note);
    lines.push("", "The final price and delivery are confirmed on WhatsApp.");
    return lines.join("\n");
  }

  function whatsappUrl(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  function readCheckout() {
    var form = document.getElementById("satvik-checkout");
    if (!form) return null;
    var data = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      area: form.area.value.trim(),
      date: form.deliveryDate.value,
      slot: form.timeSlot.value,
      note: form.note.value.trim()
    };
    data.delivery = [data.date, data.slot].filter(Boolean).join(", ");
    data.ok = Boolean(data.name && data.phone && data.address && data.area && data.delivery && readCart().length);
    return data;
  }

  function showFieldError(form, name, message) {
    var field = form.elements[name];
    var error = form.querySelector('[data-error-for="' + name + '"]');
    if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message || "";
  }

  function validateCheckout(form, data) {
    var valid = true;
    function check(name, ok, message) {
      showFieldError(form, name, ok ? "" : message);
      if (!ok) valid = false;
    }
    check("name", data.name, "Enter your name.");
    check("phone", data.phone, "Enter your phone number.");
    check("address", data.address, "Enter the delivery address.");
    check("area", data.area, "Enter the area or pincode.");
    check("deliveryDate", data.delivery, "Choose a delivery date or a time slot.");
    var cartError = form.querySelector("[data-error-for='cart']");
    if (cartError) cartError.textContent = readCart().length ? "" : "Add at least one product before placing an order.";
    if (!readCart().length) valid = false;
    return valid;
  }

  function refreshCheckoutLink() {
    var link = document.getElementById("satvik-place-order");
    var form = document.getElementById("satvik-checkout");
    if (!link || !form) return;
    var data = readCheckout();
    var ready = data && data.ok;
    link.setAttribute("aria-disabled", ready ? "false" : "true");
    if (!ready) {
      link.href = "#satvik-checkout";
      delete link.dataset.orderUrl;
      return;
    }
    var url = whatsappUrl(buildMessage(readCart(), data));
    link.href = url;
    link.dataset.orderUrl = url;
  }

  function bindCheckout() {
    var form = document.getElementById("satvik-checkout");
    var link = document.getElementById("satvik-place-order");
    if (!form || !link || form.dataset.satvikBound) return;
    form.dataset.satvikBound = "true";
    form.addEventListener("input", refreshCheckoutLink);
    form.addEventListener("change", refreshCheckoutLink);
    link.addEventListener("click", function (event) {
      var data = readCheckout();
      if (!validateCheckout(form, data)) {
        event.preventDefault();
        refreshCheckoutLink();
        return;
      }
      link.href = whatsappUrl(buildMessage(readCart(), data));
      link.dataset.orderUrl = link.href;
    });
    refreshCheckoutLink();
  }

  function bindProductCards() {
    document.querySelectorAll(".bd-product__item").forEach(function (card) {
      if (card.querySelector(".satvik-add-cart")) return;
      var nameNode = card.querySelector("h4");
      var priceNode = card.querySelector(".bd-product__new-price");
      if (!nameNode || !priceNode) return;
      var name = cleanText(nameNode);
      var priceLabel = cleanText(priceNode);
      var price = parsePrice(priceLabel);
      if (!name || price === null) return;
      var image = card.querySelector(".bd-product__img img");
      var button = document.createElement("button");
      button.type = "button";
      button.className = "satvik-add-cart";
      button.textContent = "Add to cart";
      button.setAttribute("aria-label", "Add " + name + " to cart");
      (card.querySelector(".bd-product__content") || card).appendChild(button);
      button.addEventListener("click", function () {
        addItem({
          name: name,
          pack: packFrom(name),
          price: price,
          priceLabel: priceLabel,
          image: image ? image.getAttribute("src") : "",
          qty: 1
        });
      });
    });
  }

  function bindProductDetails() {
    document.querySelectorAll(".product__add-cart .cart-btn").forEach(function (button) {
      if (button.dataset.satvikBound) return;
      button.dataset.satvikBound = "true";
      button.addEventListener("click", function () {
        var panel = button.closest(".product__modal-content") || document;
        var name = cleanText(panel.querySelector(".product__modal-title"));
        var priceNode = panel.querySelector(".product__details-price .new-price");
        var priceLabel = cleanText(priceNode);
        var price = parsePrice(priceLabel);
        var qtyInput = button.closest(".product__details-action");
        qtyInput = qtyInput ? qtyInput.querySelector(".cart-input") : null;
        var qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
        if (!name || price === null) return;
        addItem({
          name: name,
          pack: packFrom(name),
          price: price,
          priceLabel: priceLabel,
          image: "",
          qty: qty > 0 ? qty : 1
        });
      });
    });
  }

  function render() {
    var cart = readCart();
    renderMini(cart);
    renderPage(cart);
    refreshCheckoutLink();
  }

  function boot() {
    ensureStyles();
    ensureChrome();
    bindProductCards();
    bindProductDetails();
    bindCheckout();
    render();
    var sidebar = document.getElementById("satvik-minicart");
    if (sidebar) sidebar.setAttribute("aria-hidden", sidebar.classList.contains("cart-open") ? "false" : "true");
  }

  window.SatvikCart = {
    read: readCart,
    add: addItem,
    buildMessage: buildMessage,
    whatsappUrl: whatsappUrl,
    formatSubtotal: formatSubtotal
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
