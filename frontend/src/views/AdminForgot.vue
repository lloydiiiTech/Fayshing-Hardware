<template>
  <div class="forgot-password-container">
    <div class="background-image"></div>

    <div class="forgot-password-box">
      <img src="../assets/logo_orange.png" alt="Fayshing Hardware Logo" class="logo" />

      <h2>Forgot Password</h2>
      <p>Enter your email address to receive a password reset link.</p>

      <form @submit.prevent="handleForgotPassword">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Enter your email"
          required
        />
        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? "SENDING..." : "SEND RESET LINK" }}
        </button>
      </form>
      <br>
      
      <button @click="goToLogin" class="back-to-login-btn">Back to Login</button>

      <!-- Popup Notification -->
      <div v-if="showPopup" class="popup">
        <p>{{ popupMessage }}</p>
      </div>

      <!-- Error Notification -->
      <div v-if="errorMessage" class="error">
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      showPopup: false,
      popupMessage: "",
      errorMessage: "",
      isLoading: false,
    };
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: "Login" });
    },
    async handleForgotPassword() {
      this.isLoading = true;
      this.errorMessage = ""; // Clear previous error
      try {
        // Send a request to check if the email exists in the database
        const response = await axios.post("http://localhost:3000/api/admin/validate-email", {
          email: this.email,
        });

        if (response.data.exists) {
          // If the email exists, show a success message
          this.popupMessage = "Email exists. A password reset link has been sent to your email.";
          this.showPopup = true;
          setTimeout(() => {
            this.showPopup = false;
          }, 2000);
        } else {
          // If the email does not exist, show an error message
          this.errorMessage = "This email address is not registered.";
        }
      } catch (error) {
        // Handle unexpected errors
        this.errorMessage = error.response?.data?.error || "An unexpected error occurred.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Add styles for error notifications */
.error {
  color: red;
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
}
</style>
