import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initializeApp, getApps } from "firebase/app"; // Import getApps to check existing apps
import "./assets/styles/global.css";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeIO1D-AQCS1A7mRrX02IRqqN3n4_D8bk",
  authDomain: "planhacker-6675b.firebaseapp.com",
  databaseURL: "https://planhacker-6675b-default-rtdb.firebaseio.com",
  projectId: "planhacker-6675b",
  storageBucket: "planhacker-6675b.appspot.com",
  messagingSenderId: "805012971657",
  appId: "1:805012971657:web:b871ce8a503dd2c86d2658",
};

// Initialize Firebase only if it hasn't been initialized yet
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Create and mount the Vue app
const app = createApp(App);
app.use(router);
app.mount("#app");
