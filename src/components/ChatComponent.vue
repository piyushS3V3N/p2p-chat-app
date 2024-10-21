<template>
  <head>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    />
  </head>

  <div class="chat-room">
    <p v-if="user">Welcome, {{ user.displayName || 'Guest' }}!</p>
    <p v-else>Please log in to participate in the chat.</p>
    <div class="peer-id-section">
      <span>Your Peer ID: {{ peerId }}</span>
      <button @click="copyPeerId" class="copy-peer-id-button">
        <i class="fas fa-copy"></i>
      </button>
    </div>
    <div class="action-buttons">
      <button @click="startPeerConnection" class="action-button">
        <i class="fas fa-plug"></i>
      </button>
      <button @click="startCall" class="action-button">
        <i class="fas fa-phone"></i>
      </button>
    </div>

    <div class="floating-windows">
      <div class="video-wrapper">
        <div class="video-title">Video Conference</div>
        <div class="video-container floating-window">
          <div class="local-video-container">
            <video id="localVideo" autoplay muted class="local-video"></video>
          </div>
          <div class="remote-video-container">
            <video id="remoteVideo" autoplay class="remote-video"></video>
          </div>
        </div>
      </div>

      <div class="chat-box floating-window">
        <h3>Chat Messages</h3>
        <div class="chat-messages">
          <ul>
            <li v-for="(msg, index) in messages" :key="index" class="message">
              <img :src="msg.profilePicture" class="pfp" alt="Profile Picture" />
              <div class="message-content">
                <span class="username">{{ msg.username }}</span>
                <p class="text">{{ msg.text }}</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="input-container">
          <input
            v-model="message"
            @keyup.enter="sendMessage"
            placeholder="Type a message..."
            class="message-input"
          />
          <button @click="sendMessage" class="send-button">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAuth, signOut } from 'firebase/auth';
import Peer from 'peerjs';
import { getDatabase, ref, push, onChildAdded, get } from 'firebase/database';

export default {
  data() {
    return {
      message: '',
      messages: [],
      peer: null,
      peerId: null,
      user: null,
      localStream: null,
      remoteStream: null, // Added to hold remote stream
      remoteVideoWidth: 400,
      friends: [], // Store friends here
    };
  },
  created() {
    const auth = getAuth();
    this.peer = new Peer();

    this.peer.on('open', (id) => {
      this.peerId = id;
    });

    this.peer.on('call', (call) => {
      if (this.localStream) {
        call.answer(this.localStream);
        call.on('stream', (remoteStream) => {
          this.remoteStream = remoteStream; // Store remote stream
          const remoteVideo = document.getElementById('remoteVideo');
          if (remoteVideo) {
            remoteVideo.srcObject = remoteStream;
          }
        });
      }
    });

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.user = user;
        await this.fetchFriends(user.uid); // Fetch friends only after user is authenticated
        this.startLocalVideo();
        this.listenForMessages();
      } else {
        this.$router.push({ name: 'login' });
      }
    });
  },
  methods: {
    async logout() {
      await signOut(getAuth());
      this.$router.push({ name: 'login' });
    },
    async sendMessage() {
      if (!this.user || this.message.trim() === '') return; // Ensure user is defined

      const profilePicture = await this.getProfilePicture(this.user.uid);
      const username = await this.getUsername(this.user.uid);

      // Create message object
      const msg = {
        text: this.message,
        senderId: this.user.uid,
        profilePicture,
        username,
        visibleTo: this.friends.map(friend => friend.id), // Only friends can see this message
      };

      // Push the message to Firebase
      await push(ref(getDatabase(), 'messages'), msg);
      
      // Add the message to the local messages array to display it immediately
      this.messages.push(msg);

      // Clear the input field
      this.message = '';
    },
    listenForMessages() {
      onChildAdded(ref(getDatabase(), 'messages'), async (snapshot) => {
        const msg = snapshot.val();
        msg.profilePicture = await this.getProfilePicture(msg.senderId);
        msg.username = await this.getUsername(msg.senderId);

        // Check if msg.visibleTo is defined and the current user is allowed to see the message
        if (msg.visibleTo && msg.visibleTo.includes(this.user.uid)) {
          this.messages.push(msg);
        }
      });
    },
    async fetchFriends(uid) {
      const friendsRef = ref(getDatabase(), 'friends/' + uid);
      try {
        const snapshot = await get(friendsRef);
        if (snapshot.exists()) {
          this.friends = Object.entries(snapshot.val()).map(([key, value]) => ({
            id: key,
            ...value,
          }));
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    },
    async getProfilePicture(uid) {
      try {
        const userRef = ref(getDatabase(), 'users/' + uid);
        const snapshot = await get(userRef);
        return snapshot.exists() ? snapshot.val().profilePicture : 'default_profile_picture_url';
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        return 'default_profile_picture_url';
      }
    },
    async getUsername(uid) {
      try {
        const userRef = ref(getDatabase(), 'users/' + uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          return userData.customUsername || userData.displayName || 'Anonymous';
        }
        return 'Anonymous';
      } catch (error) {
        console.error('Error fetching username:', error);
        return 'Anonymous';
      }
    },
    startPeerConnection() {
      const peerIdToConnect = prompt('Enter peer ID to connect:');
      if (peerIdToConnect) {
        const conn = this.peer.connect(peerIdToConnect);
        conn.on('open', () => {
          console.log('Connected to peer:', peerIdToConnect);
          conn.on('data', (data) => {
            console.log('Received data from peer:', data);
          });
        });
      }
    },
    copyPeerId() {
      navigator.clipboard.writeText(this.peerId).then(() => {
        alert('Peer ID copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    },
    async startLocalVideo() {
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const localVideo = document.getElementById('localVideo');
        if (localVideo) {
          localVideo.srcObject = this.localStream;
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    },
    startCall() {
      const peerIdToCall = prompt('Enter peer ID to call:');
      if (peerIdToCall) {
        const call = this.peer.call(peerIdToCall, this.localStream);
        call.on('stream', (remoteStream) => {
          this.remoteStream = remoteStream; // Store remote stream
          const remoteVideo = document.getElementById('remoteVideo');
          if (remoteVideo) {
            remoteVideo.srcObject = remoteStream;
          }
        });
      }
    },
    endCall() {
      // Stop local and remote video streams
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
      }
      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach(track => track.stop());
      }

      // Clear the video elements
      const remoteVideo = document.getElementById('remoteVideo');
      const localVideo = document.getElementById('localVideo');
      if (remoteVideo) {
        remoteVideo.srcObject = null;
      }
      if (localVideo) {
        localVideo.srcObject = null;
      }

      // Optionally reset the remoteStream
      this.remoteStream = null;

      // Disconnect the peer connection if necessary
      // Note: This may not be strictly necessary as PeerJS handles this automatically
      this.peer.disconnect();
    },
  },
};
</script>

<style>
.chat-room {
  background-color: #0a0a0a; /* Dark background */
  color: #00ff00; /* Green text */
  height: 100vh; /* Full viewport height */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 20px;
  position: relative;
}

h2 {
  text-align: center;
  color: #00ff00;
  margin-bottom: 10px; /* Space below the header */
}

/* Position the action buttons below the header */
.action-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px; /* Space below the buttons */
}

.action-button {
  background-color: #0078d7;
  color: white;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 8px;
}

.action-button:hover {
  background-color: #0056a1;
}

.floating-windows {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 80%; /* Reduce height to fit the action buttons above */
}


/* Video container styles */
.video-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 70%; /* 70% width for video container */
  position: relative;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%; /* Full height of container */
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center; /* Center the video */
  justify-content: center;
}

.local-video-container {
  position: absolute; /* Float local video */
  bottom: 20px;
  right: 20px;
  width: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #0078d7;
  z-index: 10;
}

.local-video {
  width: 100%; /* Make video responsive */
  height: auto;
}

.remote-video-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.remote-video {
  width: 100%; /* Full width for remote video */
  height: 100%; /* Full height */
  object-fit: cover; /* Cover the container without stretching */
}

/* Chat box styles */
.chat-box {
  width: 25%; /* Chat box takes 25% of the screen width */
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.peer-id-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #00ff00; /* Green text for Peer ID */
}

.peer-id-section span {
  margin-right: 10px; /* Space between Peer ID and the copy button */
}

.copy-peer-id-button {
  background-color: transparent;
  border: none;
  color: #00ff00; /* Green icon color */
  cursor: pointer;
  font-size: 16px; /* Adjust icon size */
  padding: 0;
}

.copy-peer-id-button:hover {
  color: #b3ffb3; /* Lighter green on hover */
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto; /* Enable scrolling for chat messages */
  padding: 10px;
  background-color: #2a2a2a;
  border-radius: 8px;
}

.message {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.pfp {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.message-content {
  color: #e0e0e0;
}

.username {
  font-weight: bold;
  color: #00ff00;
}

.text {
  margin-top: 5px;
}

.input-container {
  display: flex;
  margin-top: 10px;
  padding: 10px;
  background-color: #333;
  border-radius: 8px;
}

.message-input {
  flex-grow: 1;
  padding: 10px;
  margin-right: 10px;
  border-radius: 8px;
  background-color: #444;
  border: 1px solid #0078d7;
  color: #00ff00;
}

.send-button {
  background-color: #0078d7;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
}

.send-button:hover {
  background-color: #0056a1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-windows {
    flex-direction: column;
    align-items: center;
  }

  .video-wrapper {
    width: 100%;
  }

  .chat-box {
    width: 100%;
    margin-top: 20px;
  }

  .action-buttons {
    flex-direction: column;
    margin-top: 10px;
  }

  .action-button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
