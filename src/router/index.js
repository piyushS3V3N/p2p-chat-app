// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import MainLayout from "@/layouts/MainLayouts.vue"; // Import the MainLayout
import ChatComponent from "@/components/ChatComponent.vue";
import LoginComponent from "@/components/LoginComponent.vue";
import UserProfile from "@/components/ProfileComponent.vue";
import AppSettings from "@/components/SettingsComponent.vue";
import FeedComponent from "@/components/FeedComponent.vue";

// Define routes
const routes = [
  { path: "/", name: "login", component: LoginComponent }, // Login route
  {
    path: "/",
    component: MainLayout, // Use MainLayout for all protected routes
    children: [
      {
        path: "chat",
        name: "chat",
        component: ChatComponent,
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        name: "profile",
        component: UserProfile,
        meta: { requiresAuth: true },
      },
      {
        path: "feed",
        name: "feed",
        component: FeedComponent,
        meta: { requiresAuth: true },
      },
      {
        path: "settings",
        name: "settings",
        component: AppSettings,
        meta: { requiresAuth: true },
      },
    ],
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const auth = getAuth(); // Get the auth instance
  const user = auth.currentUser; // Check if the user is authenticated

  if (to.path === "/" && user) {
    // If the user is authenticated and tries to access the root, redirect to feed
    next({ name: "feed" });
  } else if (to.matched.some((record) => record.meta.requiresAuth) && !user) {
    // Redirect to login if user is not authenticated
    next({ name: "login" });
  } else {
    next(); // Proceed to the requested route
  }
});

// Export the router
export default router;
