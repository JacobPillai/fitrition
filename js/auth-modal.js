'use strict';

/**
 * Authentication Modal Component
 * Provides UI for login and signup functionalities with a unified interface
 */

// Unified auth modal template
const authModalTemplate = `
<div class="auth-modal" id="auth-modal">
  <div class="auth-modal-content">
    <span class="auth-modal-close">&times;</span>
    
    <div class="auth-tabs">
      <div class="auth-tab active" data-auth-tab="login">Login</div>
      <div class="auth-tab" data-auth-tab="signup">Sign up</div>
    </div>
    
    <!-- Login Form -->
    <div class="auth-form-container active" id="login-form-container">
      <h3 class="auth-modal-title">Welcome back!</h3>
      <p class="auth-subtitle">Enter your email and password to continue</p>
      
      <form id="login-form" class="auth-form">
        <div class="auth-form-group">
          <label for="login-email">Email</label>
          <input type="email" id="login-email" name="email" placeholder="Enter your email" required>
        </div>
        
        <div class="auth-form-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" name="password" placeholder="Enter your password" required>
          <a href="#" class="forgot-password">Forgot your password?</a>
        </div>
        
        <button type="submit" class="btn btn-primary auth-submit-btn">Login</button>
      </form>
      
      <div class="auth-divider">
        <span>or continue with</span>
      </div>
      
      <div class="auth-social-login">
        <button type="button" class="btn btn-social" data-auth-action="google">
          <ion-icon name="logo-google"></ion-icon>
        </button>
        <button type="button" class="btn btn-social" data-auth-action="facebook">
          <ion-icon name="logo-facebook"></ion-icon>
        </button>
        <button type="button" class="btn btn-social" data-auth-action="twitter">
          <ion-icon name="logo-twitter"></ion-icon>
        </button>
      </div>
      
      <p class="auth-switch-text">
        Don't have an account? <a href="#" class="auth-switch" data-auth-switch="signup">Sign up</a>
      </p>
    </div>
    
    <!-- Signup Form -->
    <div class="auth-form-container" id="signup-form-container">
      <h3 class="auth-modal-title">Create an Account</h3>
      <p class="auth-subtitle">Start your fitness journey with us</p>
      
      <form id="signup-form" class="auth-form">
        <div class="auth-form-group">
          <label for="signup-name">Name</label>
          <input type="text" id="signup-name" name="name" placeholder="Enter your name" required>
        </div>
        
        <div class="auth-form-group">
          <label for="signup-email">Email</label>
          <input type="email" id="signup-email" name="email" placeholder="Enter your email" required>
        </div>
        
        <div class="auth-form-group">
          <label for="signup-password">Password</label>
          <input type="password" id="signup-password" name="password" placeholder="Enter your password" required minlength="6">
        </div>
        
        <button type="submit" class="btn btn-primary auth-submit-btn">Sign Up</button>
      </form>
      
      <div class="auth-divider">
        <span>or continue with</span>
      </div>
      
      <div class="auth-social-login">
        <button type="button" class="btn btn-social" data-auth-action="google">
          <ion-icon name="logo-google"></ion-icon>
        </button>
        <button type="button" class="btn btn-social" data-auth-action="facebook">
          <ion-icon name="logo-facebook"></ion-icon>
        </button>
        <button type="button" class="btn btn-social" data-auth-action="twitter">
          <ion-icon name="logo-twitter"></ion-icon>
        </button>
      </div>
      
      <p class="auth-switch-text">
        Already have an account? <a href="#" class="auth-switch" data-auth-switch="login">Login</a>
      </p>
    </div>
  </div>
</div>
`;

// Current active modal
let currentModal = null;
let currentTab = 'login';

/**
 * Initialize the authentication modals
 */
function initAuthModals() {
  // Create modal container if it doesn't exist
  if (!document.getElementById('auth-modal-container')) {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'auth-modal-container';
    document.body.appendChild(modalContainer);
  }
}

/**
 * Open the authentication modal
 * @param {string} type - 'login' or 'signup'
 */
function openAuthModal(type = 'login') {
  // Initialize modals if needed
  initAuthModals();
  
  // Close any open modal
  if (currentModal) {
    closeAuthModal();
  }
  
  // Get the modal container
  const modalContainer = document.getElementById('auth-modal-container');
  
  // Add the modal HTML
  modalContainer.innerHTML = authModalTemplate;
  
  // Set current modal and tab
  currentModal = 'auth';
  switchTab(type);
  
  // Add event listeners
  addModalEventListeners();
  
  // Show the modal
  setTimeout(() => {
    const modal = document.querySelector('.auth-modal');
    if (modal) {
      modal.classList.add('active');
    }
  }, 10);
}

/**
 * Switch between login and signup tabs
 * @param {string} tab - 'login' or 'signup'
 */
function switchTab(tab) {
  if (tab !== 'login' && tab !== 'signup') return;
  
  currentTab = tab;
  
  // Update tab states
  const tabs = document.querySelectorAll('.auth-tab');
  tabs.forEach(tabElement => {
    const tabType = tabElement.getAttribute('data-auth-tab');
    if (tabType === tab) {
      tabElement.classList.add('active');
    } else {
      tabElement.classList.remove('active');
    }
  });
  
  // Update form container visibility
  const formContainers = document.querySelectorAll('.auth-form-container');
  formContainers.forEach(container => {
    if (container.id === `${tab}-form-container`) {
      container.classList.add('active');
    } else {
      container.classList.remove('active');
    }
  });
}

/**
 * Close the authentication modal
 */
function closeAuthModal() {
  const modal = document.querySelector('.auth-modal');
  if (modal) {
    modal.classList.remove('active');
    
    // Remove modal after animation
    setTimeout(() => {
      const modalContainer = document.getElementById('auth-modal-container');
      modalContainer.innerHTML = '';
      currentModal = null;
    }, 300); // Match this with CSS transition time
  }
}

/**
 * Add event listeners to modal elements
 */
function addModalEventListeners() {
  // Close button
  const closeBtn = document.querySelector('.auth-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeAuthModal);
  }
  
  // Click outside to close
  const modal = document.querySelector('.auth-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeAuthModal();
      }
    });
  }
  
  // Tab switching
  const tabs = document.querySelectorAll('.auth-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabType = tab.getAttribute('data-auth-tab');
      switchTab(tabType);
    });
  });
  
  // Switch links (login/signup)
  const switchLinks = document.querySelectorAll('.auth-switch');
  switchLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const switchTo = link.getAttribute('data-auth-switch');
      switchTab(switchTo);
    });
  });
}

// Export functions that need to be accessible from other modules
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal; 