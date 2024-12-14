<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <img src="../assets/logo_orange.png" alt="Logo" class="logo" />

      <h2>Forgot Password</h2>
      <p>Enter your email to receive a reset link.</p>

      <form @submit.prevent="handleForgotPassword" class="form">
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Enter your email"
          class="input-field"
          required
        />
        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? "Sending..." : "Send Reset Link" }}
        </button>
      </form>

      <button @click="goToLogin" class="back-btn">Back to Login</button>

      <!-- Popup Notification -->
      <div v-if="showPopup" class="notification success">
        {{ popupMessage }}
      </div>

      <!-- Error Notification -->
      <div v-if="errorMessage" class="notification error">
        {{ errorMessage }}
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
      this.errorMessage = ""; 
      try {
        console.log("Email entered:", this.email); // Debugging
        const response = await axios.post("http://localhost:3000/api/admin/validate-email", {
          email: this.email,
        });

        if (response.data.exists) {
          this.popupMessage = "Email exists. A password reset link has been sent to your email.";
          this.showPopup = true;
          setTimeout(() => {
            this.showPopup = false;
          }, 2000);
        } else {
          this.errorMessage = "This email address is not registered.";
        }
      } catch (error) {
        console.error("Error in handleForgotPassword:", error); // Debugging
        this.errorMessage = error.response?.data?.error || "An unexpected error occurred.";
      } finally {
        this.isLoading = false;
      }
    },

  },
};
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
  padding: 20px;
}

.forgot-password-box {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  max-width: 360px;
  width: 100%;
}

.logo {
  width: 100px;
  margin-bottom: 20px;
}

h2 {
  font-size: 22px;
  color: #333;
  margin-bottom: 10px;
}

p {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

.input-field {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  margin-bottom: 15px;
  width: 93%;
}

.submit-btn,
.back-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #ff7300;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.submit-btn:disabled {
  background-color: #ccc;
}

.submit-btn:hover:not(:disabled),
.back-btn:hover {
  background-color: #e66500;
}

.notification {
  font-size: 14px;
  padding: 10px;
  margin-top: 15px;
  border-radius: 5px;
  width: 100%;
}

.notification.success {
  color: #2c7a7b;
  background-color: #e6fffa;
  border: 1px solid #81e6d9;
}

.notification.error {
  color: #e53e3e;
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
}
</style>

