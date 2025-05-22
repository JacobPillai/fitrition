'use strict';

/**
 * Firestore Database Module
 * Handles database operations for user profiles, courses, etc.
 */

let db;

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Firebase and get Firestore
  const firebase = initializeFirebase();
  db = firebase.firestore();
  
  // Enable offline persistence
  db.enablePersistence()
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.log('Persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support persistence
        console.log('Persistence not supported by this browser');
      }
    });
});

/**
 * Create or update a user profile in Firestore
 * @param {Object} user - Firebase auth user object
 * @param {Object} additionalData - Additional profile data
 */
function updateUserProfile(user, additionalData = {}) {
  if (!user || !user.uid) {
    console.error('Invalid user provided to updateUserProfile');
    return Promise.reject('Invalid user');
  }
  
  const userRef = db.collection('users').doc(user.uid);
  
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
      console.log('User profile updated');
      return userData;
    })
    .catch(error => {
      console.error('Error updating user profile:', error);
      throw error;
    });
}

/**
 * Get user profile data
 * @param {string} userId - User ID
 */
function getUserProfile(userId) {
  if (!userId) {
    return Promise.reject('No user ID provided');
  }
  
  return db.collection('users').doc(userId).get()
    .then(doc => {
      if (doc.exists) {
        return doc.data();
      } else {
        console.log('No profile found for user:', userId);
        return null;
      }
    })
    .catch(error => {
      console.error('Error getting user profile:', error);
      throw error;
    });
}

/**
 * Update user fitness goals
 * @param {string} userId - User ID
 * @param {Object} goals - Fitness goals object
 */
function updateUserGoals(userId, goals) {
  if (!userId || !goals) {
    return Promise.reject('Invalid user ID or goals');
  }
  
  return db.collection('users').doc(userId).update({
    'fitnessGoals': goals,
    'updatedAt': firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log('Fitness goals updated');
    return goals;
  })
  .catch(error => {
    console.error('Error updating fitness goals:', error);
    throw error;
  });
}

/**
 * Get all available courses
 * @param {Object} filters - Optional filters for course query
 */
function getCourses(filters = {}) {
  let coursesRef = db.collection('courses');
  
  // Apply filters if provided
  if (filters.category) {
    coursesRef = coursesRef.where('category', '==', filters.category);
  }
  
  if (filters.level) {
    coursesRef = coursesRef.where('level', '==', filters.level);
  }
  
  if (filters.price) {
    // Example: price: { min: 10, max: 50 }
    if (filters.price.min !== undefined) {
      coursesRef = coursesRef.where('price', '>=', filters.price.min);
    }
    if (filters.price.max !== undefined) {
      coursesRef = coursesRef.where('price', '<=', filters.price.max);
    }
  }
  
  // Apply sorting
  if (filters.sortBy) {
    coursesRef = coursesRef.orderBy(filters.sortBy, filters.sortDirection || 'asc');
  }
  
  return coursesRef.get()
    .then(snapshot => {
      const courses = [];
      snapshot.forEach(doc => {
        courses.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return courses;
    })
    .catch(error => {
      console.error('Error getting courses:', error);
      throw error;
    });
}

/**
 * Enroll user in a course
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 */
function enrollUserInCourse(userId, courseId) {
  if (!userId || !courseId) {
    return Promise.reject('Invalid user ID or course ID');
  }
  
  const enrollmentData = {
    userId,
    courseId,
    enrolledAt: firebase.firestore.FieldValue.serverTimestamp(),
    status: 'active',
    progress: 0
  };
  
  return db.collection('enrollments').add(enrollmentData)
    .then(docRef => {
      console.log('User enrolled in course with ID:', docRef.id);
      return docRef.id;
    })
    .catch(error => {
      console.error('Error enrolling user in course:', error);
      throw error;
    });
}

/**
 * Get courses enrolled by a user
 * @param {string} userId - User ID
 */
function getUserEnrollments(userId) {
  if (!userId) {
    return Promise.reject('No user ID provided');
  }
  
  return db.collection('enrollments')
    .where('userId', '==', userId)
    .get()
    .then(snapshot => {
      const enrollmentIds = [];
      snapshot.forEach(doc => {
        enrollmentIds.push(doc.data().courseId);
      });
      
      if (enrollmentIds.length === 0) {
        return [];
      }
      
      // Get course details for each enrollment
      return db.collection('courses')
        .where(firebase.firestore.FieldPath.documentId(), 'in', enrollmentIds)
        .get()
        .then(courseSnapshot => {
          const courses = [];
          courseSnapshot.forEach(doc => {
            courses.push({
              id: doc.id,
              ...doc.data()
            });
          });
          return courses;
        });
    })
    .catch(error => {
      console.error('Error getting user enrollments:', error);
      throw error;
    });
}

/**
 * Save contact form submission to Firestore
 * @param {Object} contactData - Contact form data containing name, email, subject, and message
 * @returns {Promise<string>} - Promise that resolves with the document ID
 */
function saveContactSubmission(contactData) {
  if (!contactData) {
    return Promise.reject(new Error('Contact data is required'));
  }
  
  // Add timestamp to the data and set status to 'new' 
  const submissionData = { // Create a new object with the submission data
    ...contactData, // Spread the contact data into the new object
    submittedAt: firebase.firestore.FieldValue.serverTimestamp(), // Add the timestamp to the data
    status: 'new' // Set the status to 'new'
  };
  // Add the submission data to the 'contactSubmissions' collection
  return db.collection('contactSubmissions').add(submissionData)
    .then(docRef => { // Return the document ID of the saved submission
      console.log('Contact form submission saved with ID:', docRef.id); // Log the document ID of the saved submission
      return docRef.id; // Return the document ID of the saved submission
    })
    .catch(error => {
      console.error('Error saving contact form submission:', error);
      throw error;
    });
}

/**
 * Save newsletter subscription to Firestore
 * @param {Object} subscriptionData - Subscription data containing email
 * @returns {Promise<string>} - Promise that resolves with the document ID
 */
function saveNewsletterSubscription(subscriptionData) {
  if (!subscriptionData || !subscriptionData.email) {
    return Promise.reject(new Error('Email is required for newsletter subscription'));
  }
  
  // Add timestamp to the data and set status to 'active'
  const data = {
    email: subscriptionData.email,
    subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
    status: 'active',
    source: subscriptionData.source || 'website'
  };
  
  // Add the subscription data to the 'newsletterSubscriptions' collection
  return db.collection('newsletterSubscriptions').add(data)
    .then(docRef => {
      console.log('Newsletter subscription saved with ID:', docRef.id);
      return docRef.id;
    })
    .catch(error => {
      console.error('Error saving newsletter subscription:', error);
      throw error;
    });
}

// Export functions to window object for accessibility from other modules (e.g. contact form)
window.updateUserProfile = updateUserProfile; // Update user profile
window.getUserProfile = getUserProfile; // Get user profile
window.updateUserGoals = updateUserGoals; // Update user goals
window.getCourses = getCourses; // Get courses
window.enrollUserInCourse = enrollUserInCourse; // Enroll user in a course
window.getUserEnrollments = getUserEnrollments; // Get courses enrolled by a user
window.saveContactSubmission = saveContactSubmission; // Save contact form submission
window.saveNewsletterSubscription = saveNewsletterSubscription; // Save newsletter subscription
