// Firebase configuration
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8Ocuh4k_eLR8qDOzWv0t_401nhCEjn70", // Your Firebase API key
  authDomain: "nextjs-fitness.firebaseapp.com", // Your Firebase auth domain
  projectId: "nextjs-fitness", // Your Firebase project ID
  storageBucket: "nextjs-fitness.appspot.com", // Your Firebase storage bucket
  messagingSenderId: "177829820207", // Your Firebase messaging sender ID
  appId: "1:177829820207:web:c410a23a366958741353da", // Your Firebase app ID
  measurementId: "G-562E4GDG62" // Your Firebase measurement ID
};

// Initialize Firebase to avoid multiple initializations
function initializeFirebase() {
  try {
    // We're checking if Firebase is already initialized to avoid multiple initializations
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      
      // Initialize Analytics if available (optional)
      if (firebase.analytics && typeof firebase.analytics === 'function') {
        firebase.analytics(); // Initialize analytics
      }
      
      console.log('Firebase initialized successfully');
    }
    return firebase; // Return the initialized Firebase instance
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    alert('There was an error connecting to our services. Please try again later.');
    return null;
  }
} 