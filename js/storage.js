'use strict';

/**
 * Firebase Storage Module
 * Handles file upload operations and storage-related functions
 */

let storage;

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Firebase and get Storage
  const firebase = initializeFirebase();
  storage = firebase.storage();
});

/**
 * Upload a file to Firebase Storage
 * @param {string} path - Storage path where file will be stored
 * @param {File} file - File object to upload
 * @returns {Promise<string>} - Promise that resolves with download URL
 */
function uploadFile(path, file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Create storage reference
    const storageRef = storage.ref(path);
    const fileRef = storageRef.child(file.name);
    
    // Upload file
    const uploadTask = fileRef.put(file);
    
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', 
      // Progress observer
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      // Error observer
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      }, 
      // Success observer
      () => {
        // Get download URL and resolve promise
        uploadTask.snapshot.ref.getDownloadURL()
          .then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          })
          .catch((error) => {
            console.error('Error getting download URL:', error);
            reject(error);
          });
      }
    );
  });
}

/**
 * Upload a user profile picture
 * @param {string} userId - User ID
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<string>} - Promise that resolves with download URL
 */
function uploadProfilePicture(userId, imageFile) {
  if (!userId) {
    return Promise.reject(new Error('User ID is required'));
  }
  
  const path = `profile_pictures/${userId}`;
  return uploadFile(path, imageFile);
}

/**
 * Upload a course image
 * @param {string} courseId - Course ID
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<string>} - Promise that resolves with download URL
 */
function uploadCourseImage(courseId, imageFile) {
  if (!courseId) {
    return Promise.reject(new Error('Course ID is required'));
  }
  
  const path = `course_images/${courseId}`;
  return uploadFile(path, imageFile);
}

/**
 * Delete a file from Firebase Storage
 * @param {string} fileUrl - Full URL of the file to delete
 * @returns {Promise<void>}
 */
function deleteFile(fileUrl) {
  // Extract the file path from the URL
  const fileRef = storage.refFromURL(fileUrl);
  
  return fileRef.delete()
    .then(() => {
      console.log('File deleted successfully');
    })
    .catch((error) => {
      console.error('Error deleting file:', error);
      throw error;
    });
} 