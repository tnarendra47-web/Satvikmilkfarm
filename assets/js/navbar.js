// Sticky Navbar
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const navbarHeight = navbar.offsetHeight;
  const topBar = document.querySelector(".top-bar");
  const topBarHeight = topBar ? topBar.offsetHeight : 0;

  function handleScroll() {
    if (window.scrollY > topBarHeight) {
      navbar.classList.add("sticky");
    } else {
      navbar.classList.remove("sticky");
    }
  }

  window.addEventListener("scroll", handleScroll);
});

// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener("click", function () {
      navbarCollapse.classList.toggle("show");
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !navbarCollapse.contains(event.target) &&
        !navbarToggler.contains(event.target)
      ) {
        navbarCollapse.classList.remove("show");
      }
    });
  }
});
