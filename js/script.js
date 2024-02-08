document.addEventListener("DOMContentLoaded", () => {
  // Step 1: Setup header and mobile menu functionality
  setupHeaderAndMobileMenu();

  // Step 2: Update menu text based on screen width
  updateMenuTextOnResize();

  // Step 3: Add active class to the current page in the navigation
  addActiveClassToCurrentPage();

  let summaries = document.getElementsByTagName("summary");
  let h2 = document.getElementsByTagName("h2");
  addSummaryClickListeners(summaries, h2);

  let summaryElements = document.getElementsByClassName("summary-element");
  let summaryTargets = document.getElementsByClassName("summary-target");
  addSummaryClickListeners(summaryElements, summaryTargets);

});

function setupHeaderAndMobileMenu() {
  const header = document.querySelector("header");
  const mobileMenu = document.getElementById("mobile-menu");
  const headerLinks = document.querySelectorAll(".header-link");

  header.addEventListener("click", () => {
    header.classList.toggle("hidden");
    mobileMenu.classList.toggle("mobile-menu");
    headerLinks.forEach((link) => link.classList.toggle("hidden"));
  });
}

function updateMenuTextOnResize() {
  const menuText = document.getElementById("menu-text");

  const checkScreenWidth = () => {
    menuText.textContent = window.innerWidth <= 768 ? "Menu" : "";
  };

  checkScreenWidth();
  window.addEventListener("resize", checkScreenWidth);
}

function addActiveClassToCurrentPage() {
  const currentUrl = window.location.href;
  const navLinks = document.querySelectorAll(".menu a");

  navLinks.forEach((link) => {
    if (!link.classList.contains("logo-link") && link.href === currentUrl) {
      link.classList.add("active");
    }
  });
}

function addSummaryClickListeners(elements, targets) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', function() {
      scrollToTarget(targets[i]);
    });
  }
}

function scrollToTarget(target) {
  if (target) {
    window.scrollTo({
      top: target.offsetTop,
      behavior: 'smooth'
    });
    target.classList.add('flash-effect');

    setTimeout(function() {
      target.classList.remove('flash-effect');
    }, 800); // Adjust the delay as needed
  }
}
