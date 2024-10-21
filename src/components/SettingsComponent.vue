<template>
  <div class="settings-container">
    <h2>Settings</h2>
    <input
      v-model="customUsername"
      placeholder="Enter your username"
      class="username-input"     />
    <button @click="updateProfile" class="update-button">Update Profile</button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>


<script>
import { getDatabase, ref, set, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      customUsername: '',
      message: '', // To display messages to the user
    };
  },
  created() {
    const user = getAuth().currentUser;
    if (user) {
      // If user is logged in, fetch the existing custom username
      this.fetchCustomUsername(user.uid);
    }
  },
  methods: {
    async updateProfile() {
      const user = getAuth().currentUser; // Ensure you get the current user on update
      if (user) {
        const userRef = ref(getDatabase(), 'users/' + user.uid);
        try {
          console.log('Updating profile for user:', user.uid); // Debugging
          await set(userRef, {
            customUsername: this.customUsername,
          });
          this.message = 'Profile updated successfully!'; // Success message
        } catch (error) {
          console.error('Error updating profile:', error);
          this.message = 'Failed to update profile. Please try again.'; // Error message
        }
      } else {
        this.message = 'User is not authenticated.'; // Error message if no user
      }
    },
    async fetchCustomUsername(uid) {
      const userRef = ref(getDatabase(), 'users/' + uid);
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          this.customUsername = snapshot.val().customUsername; // Set the existing username
          console.log('Fetched existing username:', this.customUsername); // Debugging
        } else {
          this.message = 'No username found, please set one.'; // Message if no username is found
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        this.message = 'Failed to fetch username. Please try again.'; // Error message
      }
    },
  },
};
</script>

<style>
.settings-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the content */
  margin-top: 20px;
}

.username-input {
  width: 300px; /* Set a fixed width */
  padding: 10px; /* Add padding for better appearance */
  margin-bottom: 10px; /* Space between input and button */
  border: 1px solid #ccc; /* Light border for the input */
  border-radius: 5px; /* Rounded corners */
  font-size: 16px; /* Adjust font size */
}

.update-button {
  padding: 10px 20px; /* Add padding to the button */
  background-color: #0078d7; /* Button background */
  color: white; /* Button text color */
  border: none;
  border-radius: 5px; /* Rounded corners */
  cursor: pointer;
}

.update-button:hover {
  background-color: #0056a1; /* Darker blue on hover */
}

p {
  margin-top: 10px;
  color: #00ff00; /* Green text for the message */
}

</style>
