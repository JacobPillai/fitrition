'use strict';

/**
 * Firebase Authentication Module
 * Handles user authentication operations like login, signup, logout
 * and profile management
 */

// Initialize auth when the script loads
let auth;

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Firebase and get auth
  const firebase = initializeFirebase();
  auth = firebase.auth();

  // Set up UI based on auth state
  setupAuthUI();

  // Set up event listeners for auth-related UI elements
  setupAuthListeners();
});

/**
 * Setup UI based on authentication state
 */
function setupAuthUI() {
  auth.onAuthStateChanged(user => {
    const authButtons = document.querySelectorAll('[data-auth-action]');
    const profileElements = document.querySelectorAll('[data-profile]');
    const userProfile = document.querySelector('.user-profile');
    
    if (user) {
      // User is signed in
      console.log('User is signed in:', user.displayName || user.email);
      
      // Update UI for authenticated user
      authButtons.forEach(button => {
        const action = button.getAttribute('data-auth-action');
        if (action === 'login') {
          button.style.display = 'none';
        } else if (action === 'logout') {
          button.style.display = 'block';
        }
      });

      // Show user profile
      if (userProfile) {
        userProfile.style.display = 'flex';
      }

      // Update profile elements
      profileElements.forEach(element => {
        const field = element.getAttribute('data-profile');
        if (field === 'name' && user.displayName) {
          element.textContent = user.displayName;
        } else if (field === 'email') {
          element.textContent = user.email;
        } else if (field === 'photo' && user.photoURL) {
          if (element.tagName === 'IMG') {
            element.src = user.photoURL;
          }
        }
      });
    } else {
      // User is signed out
      console.log('User is signed out');
      
      // Update UI for non-authenticated user
      authButtons.forEach(button => {
        const action = button.getAttribute('data-auth-action');
        if (action === 'login') {
          button.style.display = 'block';
        } else if (action === 'logout') {
          button.style.display = 'none';
        }
      });

      // Hide user profile
      if (userProfile) {
        userProfile.style.display = 'none';
      }

      // Reset profile elements
      profileElements.forEach(element => {
        if (element.tagName === 'IMG') {
          element.src = ''; // Reset profile image
        } else {
          element.textContent = ''; // Reset text content
        }
      });
    }
  });
}

/**
 * Setup event listeners for auth-related UI elements
 */
function setupAuthListeners() {
  // Set up event delegation for all auth-related clicks
  document.addEventListener('click', function(e) {
    // Handle auth action buttons (login, logout, etc.)
    const authActionElement = e.target.closest('[data-auth-action]');
    if (authActionElement) {
      const action = authActionElement.getAttribute('data-auth-action');
      
      if (action === 'login') {
        e.preventDefault();
        openAuthModal('login');
      } else if (action === 'logout') {
        e.preventDefault();
        logout();
      } else if (action === 'google' || action === 'facebook' || action === 'twitter') {
        e.preventDefault();
        loginWithSocialProvider(action);
      }
    }
    
    // Handle forgot password link
    if (e.target.classList.contains('forgot-password')) {
      e.preventDefault();
      handleForgotPassword();
    }
  });

  // Setup form submission with event delegation
  document.addEventListener('submit', function(e) {
    const form = e.target;
    
    if (form.id === 'login-form') {
      e.preventDefault();
      const email = form.querySelector('[name="email"]').value.trim();
      const password = form.querySelector('[name="password"]').value;
      
      loginWithEmail(email, password);
    } else if (form.id === 'signup-form') {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const password = form.querySelector('[name="password"]').value;
      
      signupWithEmail(name, email, password);
    }
  });
}

/**
 * Handle forgot password functionality
 */
function handleForgotPassword() {
  const emailInput = document.getElementById('login-email');
  const email = emailInput ? emailInput.value.trim() : '';
  
  if (!email) {
    alert('Please enter your email address in the email field to reset your password.');
    return;
  }
  
  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert(`Password reset email sent to ${email}. Please check your inbox.`);
    })
    .catch((error) => {
      console.error('Password reset error:', error);
      alert(`Error: ${error.message}`);
    });
}

/**
 * Login with social provider
 * @param {string} provider - 'google', 'facebook', or 'twitter'
 */
function loginWithSocialProvider(providerName) {
  let provider;
  
  if (providerName === 'google') {
    provider = new firebase.auth.GoogleAuthProvider();
  } else if (providerName === 'facebook') {
    provider = new firebase.auth.FacebookAuthProvider();
  } else if (providerName === 'twitter') {
    provider = new firebase.auth.TwitterAuthProvider();
  } else {
    console.error('Unknown provider:', providerName);
    return;
  }
  
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log(`${providerName} user logged in:`, user.displayName);
      
      // Update user profile in Firestore
      return updateUserProfile(user);
    })
    .then(() => {
      // Close modal
      closeAuthModal();
    })
    .catch((error) => {
      console.error(`${providerName} login error:`, error.message);
      alert(`Login Error: ${error.message}`);
    });
}

/**
 * Login with email and password
 * @param {string} email 
 * @param {string} password 
 */
function loginWithEmail(email, password) {
  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }
  
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('User logged in:', user.email);
      
      // Update user profile in Firestore
      updateUserProfile(user);
      
      // Close modal
      closeAuthModal();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Login error:', errorMessage);
      // Display error to user
      alert(`Login Error: ${errorMessage}`);
    });
}

/**
 * Signup with email, password, and name
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 */
function signupWithEmail(name, email, password) {
  if (!name || !email || !password) {
    alert('Please fill in all required fields');
    return;
  }
  
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log('User created:', user.email);
      
      // Update profile with name
      return user.updateProfile({
        displayName: name
      });
    })
    .then(() => {
      console.log('Profile updated with name');
      
      // Update Firestore with user profile
      const user = auth.currentUser;
      return updateUserProfile(user, {
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        fitnessGoals: {}
      });
    })
    .then(() => {
      // Close modal
      closeAuthModal();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Signup error:', errorMessage);
      // Display error to user
      alert(`Signup Error: ${errorMessage}`);
    });
}

/**
 * Update user profile in Firestore
 * @param {object} user - Firebase user object
 * @param {object} additionalData - Additional data to store
 */
function updateUserProfile(user, additionalData = {}) {
  if (!user || !firebase.firestore) return Promise.resolve();
  
  const userRef = firebase.firestore().collection('users').doc(user.uid);
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
    ...additionalData
  };
  
  return userRef.set(userData, { merge: true })
    .then(() => {
      console.log('User profile updated in Firestore');
    })
    .catch((error) => {
      console.error('Error updating user profile:', error);
    });
}

/**
 * Logout the current user
 */
function logout() {
  auth.signOut().then(() => {
    console.log('User signed out');
  }).catch((error) => {
    console.error('Logout error:', error);
  });
} 