<template>
  <div class="feed-container">
    <h2>Feed</h2>
    <div class="topic-selector">
      <label for="community-select">Select Topic:</label>
      <select v-model="selectedCommunity" id="community-select" class="community-select">
        <option v-for="community in communities" :key="community" :value="community">
          {{ community }}
        </option>
      </select>
    </div>
    <form @submit.prevent="submitPost" class="post-form">
      <textarea
        v-model="newPost"
        placeholder="What's on your mind?"
        required
      ></textarea>
      <button type="submit">Post</button>
    </form>
    <div class="posts">
      <h3 v-if="filteredPosts.length">Posts in "{{ selectedCommunity }}"</h3>
      <div v-for="post in filteredPosts" :key="post.id" class="post">
        <p>
          <strong>{{ post.username || 'Anonymous' }}</strong> - {{ formatDate(post.timestamp) }}
        </p>
        <p>{{ post.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, getDatabase, push, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      newPost: '',
      posts: [],
      communities: ['General', 'Tech', 'Health', 'Sports', 'Entertainment'],
    };
  },
  computed: {
    selectedCommunity() {
      return this.$route.query.community || 'General'; // Default to 'General'
    },
    filteredPosts() {
      return this.posts.filter(post => post.community === this.selectedCommunity);
    },
  },
  created() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      const db = getDatabase();
      const postsRef = ref(db, 'posts');

      onValue(postsRef, (snapshot) => {
        const postsArray = [];
        snapshot.forEach((childSnapshot) => {
          const postData = childSnapshot.val();
          postsArray.push({ id: childSnapshot.key, ...postData });
        });
        this.posts = postsArray;
      });
    },
    async submitPost() {
      const user = getAuth().currentUser;
      const db = getDatabase();
      const postsRef = ref(db, 'posts');

      const postData = {
        content: this.newPost,
        username: user ? user.displayName : 'Anonymous',
        timestamp: Date.now(),
        community: this.selectedCommunity,
      };

      await push(postsRef, postData);
      this.newPost = '';
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
  },
};
</script>

<style scoped>
.feed-container {
  padding: 20px;
}

.topic-selector {
  margin-bottom: 20px;
}

.community-select {
  width: 100px; /* Set width for compactness */
  padding: 5px;
  background-color: #1a1a1a; /* Match with dark theme */
  color: #e0e0e0; /* Light gray text */
  border: none;
  border-radius: 5px; /* Rounded corners */
  cursor: pointer;
}

.post-form {
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  height: 80px;
  margin-bottom: 10px;
  resize: none; /* Prevent resizing */
}

button {
  background-color: #00ff00; /* Green button */
  color: #0a0a0a; /* Dark text */
  border: none;
  padding: 10px 15px;
  cursor: pointer;
}

.posts {
  margin-top: 20px;
}

.post {
  background-color: #1a1a1a; /* Darker background for posts */
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px; /* Rounded corners */
}
</style>

