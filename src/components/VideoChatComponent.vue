<template>
  <div>
    <div class="video-container">
      <video id="localVideo" autoplay muted></video>
      <video id="remoteVideo" autoplay></video>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.startLocalVideo();
  },
  methods: {
    async startLocalVideo() {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const localVideo = document.getElementById('localVideo');
        if (localVideo) {
          localVideo.srcObject = localStream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    },
  },
};
</script>

<style>
.video-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

video {
  width: 300px;
  height: auto;
  border: 1px solid #ddd;
  margin: 0 10px;
}
</style>

