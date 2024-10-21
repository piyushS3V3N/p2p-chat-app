<template>
  <div class="login-container">
    <div class="ascii-banner">
      <pre>
        <code class="ascii-art">


───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
─██████████████─██████──██████─████████████████───██████──██████────██████████████─██████──██████─██████████████─██████████████────
─██░░░░░░░░░░██─██░░██──██░░██─██░░░░░░░░░░░░██───██░░██──██░░██────██░░░░░░░░░░██─██░░██──██░░██─██░░░░░░░░░░██─██░░░░░░░░░░██────
─██░░██████░░██─██░░██──██░░██─██░░████████░░██───██░░██──██░░██────██░░██████████─██░░██──██░░██─██░░██████░░██─██████░░██████────
─██░░██──██░░██─██░░██──██░░██─██░░██────██░░██───██░░██──██░░██────██░░██─────────██░░██──██░░██─██░░██──██░░██─────██░░██────────
─██░░██████░░██─██░░██████░░██─██░░████████░░██───██░░██████░░██────██░░██─────────██░░██████░░██─██░░██████░░██─────██░░██────────
─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░░░██───██░░░░░░░░░░██────██░░██─────────██░░░░░░░░░░██─██░░░░░░░░░░██─────██░░██────────
─██░░██████████─██████████░░██─██░░██████░░████───██████████░░██────██░░██─────────██░░██████░░██─██░░██████░░██─────██░░██────────
─██░░██─────────────────██░░██─██░░██──██░░██─────────────██░░██────██░░██─────────██░░██──██░░██─██░░██──██░░██─────██░░██────────
─██░░██─────────────────██░░██─██░░██──██░░██████─────────██░░██────██░░██████████─██░░██──██░░██─██░░██──██░░██─────██░░██────────
─██░░██─────────────────██░░██─██░░██──██░░░░░░██─────────██░░██────██░░░░░░░░░░██─██░░██──██░░██─██░░██──██░░██─────██░░██────────
─██████─────────────────██████─██████──██████████─────────██████────██████████████─██████──██████─██████──██████─────██████────────
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
─────────────────────────────────────────────────────────────────────────────────────────────────────────
─██████████████─██████─────────██████████████─██████──██████─██████████████────██████──██████─████████───
─██░░░░░░░░░░██─██░░██─────────██░░░░░░░░░░██─██░░██──██░░██─██░░░░░░░░░░██────██░░██──██░░██─██░░░░██───
─██░░██████░░██─██░░██─────────██░░██████░░██─██░░██──██░░██─██░░██████░░██────██░░██──██░░██─████░░██───
─██░░██──██░░██─██░░██─────────██░░██──██░░██─██░░██──██░░██─██░░██──██░░██────██░░██──██░░██───██░░██───
─██░░██████░░██─██░░██─────────██░░██████░░██─██░░██████░░██─██░░██████░░██────██░░██──██░░██───██░░██───
─██░░░░░░░░░░██─██░░██─────────██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░██────██░░██──██░░██───██░░██───
─██░░██████░░██─██░░██─────────██░░██████████─██░░██████░░██─██░░██████░░██────██░░██──██░░██───██░░██───
─██░░██──██░░██─██░░██─────────██░░██─────────██░░██──██░░██─██░░██──██░░██────██░░░░██░░░░██───██░░██───
─██░░██──██░░██─██░░██████████─██░░██─────────██░░██──██░░██─██░░██──██░░██────████░░░░░░████─████░░████─
─██░░██──██░░██─██░░░░░░░░░░██─██░░██─────────██░░██──██░░██─██░░██──██░░██──────████░░████───██░░░░░░██─
─██████──██████─██████████████─██████─────────██████──██████─██████──██████────────██████─────██████████─
─────────────────────────────────────────────────────────────────────────────────────────────────────────
        </code>
      </pre>
    </div>
    
    <div class="login-box">
      <h2>Please Log In</h2>
      <button @click="loginWithGoogle" class="login-button">Login with Google</button>
      <button @click="loginAnonymously" class="login-button">Login Anonymously</button>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';

export default {
  methods: {
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('User logged in:', user);
        this.$router.push({ name: 'chat' });
      } catch (error) {
        console.error('Login error:', error);
        alert('Error logging in: ' + error.message);
      }
    },
    async loginAnonymously() {
      const auth = getAuth();
      try {
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;
        console.log('Anonymous user logged in:', user);
        this.$router.push({ name: 'chat' });
      } catch (error) {
        console.error('Anonymous login error:', error);
        alert('Error logging in: ' + error.message);
      }
    },
  },
};
</script>

<style scoped>
.login-container[data-v-dcfd9078] {
    display: flex;
    align-items: center;
    height: 100vh;
    background-color: #1a1a1a;
    align-content: flex-start;
    flex-wrap: nowrap;
    flex-direction: column;
}
.ascii-banner {
  margin-bottom: 20px; /* Space below the ASCII art */
}

.ascii-art {
  font-family: monospace; /* Use monospace font */
  font-size: 10px; /* Smaller font size */
  line-height: 1.1; /* Adjust line height for compactness */
  color: #33ff33; /* Green text color */
  white-space: pre; /* Preserve whitespace and line breaks */
}
.login-box {
  background-color: #333; /* Dark box background */
  border: 2px solid #33ff33; /* Green border */
  border-radius: 10px; /* Rounded corners */
  padding: 20px; /* Padding around content */
  text-align: center; /* Center text within the box */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* Subtle shadow */
}

h2 {
  color: #33ff33; /* Green color for the title */
  margin-bottom: 20px; /* Space below the title */
}

.login-button {
  background-color: #33ff33; /* Green button background */
  color: #1a1a1a; /* Dark text for buttons */
  border: none; /* Remove default border */
  padding: 10px 15px; /* Padding for button */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
  margin: 5px; /* Space between buttons */
  transition: background-color 0.3s ease; /* Smooth transition */
}

.login-button:hover {
  background-color: #29cc29; /* Lighter green on hover */
}
</style>




