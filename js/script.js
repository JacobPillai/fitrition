'use strict'; //use strict mode to prevent errors 



/**
 * add event on element to add event listeners to elements
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle to open and close the navigation bar
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navLinks, "click", closeNavbar);



/**
 * header active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * scroll reveal effect
 */

const sections = document.querySelectorAll("[data-section]");

const reveal = function () {
  for (let i = 0; i < sections.length; i++) {

    if (sections[i].getBoundingClientRect().top < window.innerHeight / 2) {
      sections[i].classList.add("active");
    }

  }
}

reveal();
addEventOnElem(window, "scroll", reveal);



/**
 * PROGRAM FILTERS
 */

const filterButtons = document.querySelectorAll('.filter-btn');
const programCards = document.querySelectorAll('.program-card');

if (filterButtons.length > 0 && programCards.length > 0) {
  // Add click event to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter value
      const filterValue = this.getAttribute('data-filter');
      
      // Show/hide program cards based on filter
      programCards.forEach(card => {
        const cardCategories = card.getAttribute('data-category');
        
        // If "all" is selected or card matches the filter category
        if (filterValue === 'all' || cardCategories.includes(filterValue)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * Plan selection and payment page handling
 */
function initPlansSelection() {
  // Find all "Choose Plan" buttons
  const planButtons = document.querySelectorAll('.choose-plan');
  
  // Add click event listeners to all plan buttons
  planButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Prevent the default navigation
      e.preventDefault();
      
      // Get plan details from data attributes
      const planName = this.getAttribute('data-plan-name');
      const planPrice = this.getAttribute('data-plan-price');
      const planDescription = this.getAttribute('data-plan-desc');
      
      // Save the plan details to localStorage
      const planData = {
        name: planName,
        price: planPrice,
        description: planDescription
      };
      
      localStorage.setItem('selectedPlan', JSON.stringify(planData));
      
      // Navigate to the payment page
      window.location.href = this.getAttribute('href');
    });
  });
}

// Initialize plan selection functionality if on the courses page
if (document.querySelector('.coaching-card')) {
  initPlansSelection();
}