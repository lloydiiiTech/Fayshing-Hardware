<template>
  <div class="verified-container">
    <div class="verified-message">
      <h2>Your Account is Verified!</h2>
      <p>Thank you for verifying your email address. You can now log in to your account.</p>
    </div>
    <div class="button-container">
      <button @click="goToLogin">Go to Login</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      token: this.$route.query.token,
      error: null,
    };
  },
  created() {
    this.verifyAccount();
  },
  methods: {
    async verifyAccount() {
      try {
        const token = this.$route.query.token;
        await axios.get(`http://localhost:5000/api/admin/verifyAccount?token=${token}`);
      } catch (err) {
        if (err.response) {
          this.error = err.response.data.message;
        } else {
          this.error = "An error occurred";
        }
      }
    },
    goToLogin() {
      // Use Vue Router to navigate to the login page
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.verified-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f8ff;
}

.verified-message {
  text-align: center;
  margin-bottom: 20px;
}

.verified-message h2 {
  color: #4CAF50;
}

.verified-message p {
  font-size: 16px;
  color: #333;
}

.button-container {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #4CAF50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
