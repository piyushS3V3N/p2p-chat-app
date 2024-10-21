<template>
  <div class="main-layout">
    <AppNavigation />
    <div class="router-view">
      <router-view />
         <ProfileComponent />
      <FeedComponent /> <!-- Include the feed component here --> 
    </div>
  </div>
</template>

<script>
import AppNavigation from '@/components/AppNavigation.vue'; // Adjust the path as necessary

export default {
  components: {
    AppNavigation,
  },
};
</script>

<style scoped>
.main-layout {
  background-color: #0a0a0a; /* Dark background */
  color: #00ff00; /* Green text for hacker vibes */
  height: 100vh; /* Full height to cover the viewport */
  width: 100vw; /* Full width */
  overflow: hidden; /* Hide any overflowing content */
  font-family: 'Courier New', Courier, monospace; /* Monospace font for a tech feel */
  display: flex; /* Use flexbox for layout */
  flex-direction: column; /* Stack navigation and main content vertically */
  box-sizing: border-box; /* Include padding and border in element's width and height */
}

h1,
h2,
h3 {
  color: #00ff00; /* Green for headings */
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.7); /* Glowing effect */
}

p {
  color: #e0e0e0; /* Light gray text for paragraphs */
}

a {
  color: #00ff00; /* Green links */
  text-decoration: none; /* Remove underline */
  transition: color 0.3s;
}

a:hover {
  color: #b3ffb3; /* Lighter green on hover */
}

/* App Navigation Styles */
.AppNavigation {
  background-color: #1a1a1a; /* Darker background for the navigation */
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); /* Shadow for depth */
  z-index: 1; /* Ensure navigation stays on top */
  position: relative; /* Relative positioning to ensure content doesn't overlap */
  width: 100%; /* Full width of the layout */
  flex-shrink: 0; /* Prevent shrinking when window resizes */
}

.AppNavigation a {
  margin: 0 15px; /* Space out links */
  font-weight: bold; /* Make links bold */
}

/* Content area */
.router-view {
  flex-grow: 1; /* Allow the router-view to grow and take up the remaining space */
  overflow-y: auto; /* Allow vertical scrolling if content overflows */
  padding: 20px; /* Add padding for content inside the router view */
}

/* Responsive styles */
@media (max-width: 600px) {
  .AppNavigation {
    padding: 10px; /* Less padding on smaller screens */
  }
  .AppNavigation a {
    margin: 0 10px; /* Adjust link spacing on small screens */
  }
  .router-view {
    padding: 20vh; /* Less padding for content on small screens */
  }
}
</style>

