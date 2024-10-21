<!-- src/components/AppNavigation.vue -->
<template>
  

  <nav>
    <p1>Chat Room </p1>
    <router-link to="/">Home</router-link>
    <router-link to="/chat">Chat</router-link>
    <router-link to="/settings">Settings</router-link>
    <router-link to="/profile">Profile</router-link>

    <button @click="logout">Logout</button>
  </nav>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';

export default {
  name: 'AppNavigation', // Use a multi-word name
  methods: {
    async logout() {
      await signOut(getAuth());
      this.$router.push({ name: 'login' }); // Redirect to login page
    },
  },
};
</script>

<style>
nav {
  display: flex;
  justify-content: space-between;
  background-color: #00000;
  padding: 10px;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #007bff;
}
nav h3 {
  size: 20px;
}
nav button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

nav button:hover {
  background-color: #c82333;
}
</style>

