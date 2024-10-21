<template>
  <div class="profile-container">
    <h2>Your Profile</h2>
    <div>
      <p v-if="user">Welcome, {{ user.displayName || 'Guest' }}!</p>
      <p v-else>Please log in to see your profile.</p>
      <div class="friend-add-section" v-if="user">
        <input
          v-model="friendUid"
          placeholder="Enter friend's UID"
          class="friend-input"
        />
        <button @click="addFriend" class="add-friend-button">Add Friend</button>
      </div>
      <h3>Your Friends</h3>
      <ul>
        <li v-for="friend in friends" :key="friend.id">{{ friend.displayName || friend.id }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, onValue } from 'firebase/database';

export default {
  data() {
    return {
      user: null,
      friendUid: '',
      friends: [],
    };
  },
  created() {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      this.user = user; // Set the user object

      if (user) {
        this.fetchFriends(user.uid); // Fetch friends only if user is logged in
      } else {
        this.$router.push({ name: 'login' }); // Redirect if not logged in
      }
    });
  },
  methods: {
    async addFriend() {
      if (this.friendUid.trim() === '' || this.friendUid === this.user.uid) return;

      const db = getDatabase();
      const friendsRef = ref(db, 'friends/' + this.user.uid + '/' + this.friendUid);

      // Adding friend to the user's friends list
      await set(friendsRef, { displayName: this.friendUid }); // Optionally, store additional data
      this.friendUid = ''; // Clear input after adding
      this.fetchFriends(this.user.uid); // Refresh friends list
    },
    fetchFriends(uid) {
      const friendsRef = ref(getDatabase(), 'friends/' + uid);
      onValue(friendsRef, (snapshot) => {
        this.friends = [];
        snapshot.forEach((childSnapshot) => {
          const friendData = childSnapshot.val();
          this.friends.push({ id: childSnapshot.key, ...friendData });
        });
      });
    },
  },
};
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.friend-add-section {
  margin-bottom: 20px;
}

.friend-input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #0078d7;
  margin-right: 10px;
}

.add-friend-button {
  background-color: #0078d7;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-friend-button:hover {
  background-color: #0056a1;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 5px 0;
}
</style>

