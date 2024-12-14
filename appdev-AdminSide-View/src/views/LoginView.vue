<template>
  <div class="login-container">
    <div class="background-image"></div>

    <!-- Login Form -->
    <div v-if="!showRegistration" class="login-box">
      <img src="../assets/logo_orange.png" alt="Fayshing Hardware Logo" class="logo" />

      <form @submit.prevent="handleLogin">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter Admin Email" required />

        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter Password" required />

        <button type="submit" class="login-btn">LOG IN</button>
      </form>
      <button @click="navigateToRegister" class="forgot-password-btn">Register</button>
<br>
      

     
    </div>

    <!-- Popup Notification -->
    
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      token: this.$route.query.token, // Retrieve token from query if passed
      showPopup: false,
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post(`http://localhost:2313/admin/login`, {
          email: this.email,
          password: this.password,
        });

        // Destructure the response data
        const { token, user_id, username, user_role, message, status } = response.data;

        // Debugging: Log the response data to ensure all fields are returned
        console.log("Login Response:", response.data);

        // Check if the account is verified
        if (status !== 1) {
          alert("This account is not verified. Please verify your account before logging in.");
          return;
        }

        // Save login details to session storage
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user_id", user_id);
        sessionStorage.setItem("user_role", user_role);

        // Show popup and redirect to home after 2 seconds
        this.showPopup = true;
        setTimeout(() => {
          this.showPopup = false;
          this.$router.push("/home");
        }, 2000);

      } catch (error) {
        // Handle error response
        if (error.response && error.response.data && error.response.data.error) {
          alert("Login failed: " + error.response.data.error);
        } else {
          alert("An error occurred during login");
        }

        // Log the error for debugging
        console.error("Login error:", error);
      }
    },
    navigateToRegister() {
      this.$router.push("/register"); // Navigate to the registration page
    },
    navigateToForgotPassword() {
      this.$router.push("/forgot-password"); // Navigate to the forgot password page
    },
    checkSession() {
  // Retrieve session storage items
  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("token");
  const admin_id = sessionStorage.getItem("user_id");
  const user_role = sessionStorage.getItem("user_role");

  const session = sessionStorage.getItem('user_id');
    console.log(session);
    if (session) {
      this.$router.push('/home'); // Redirect to login page
    }
}


  },
  mounted() {
    // Check session storage on component mount
    this.checkSession();
  },
};
</script>




<style scoped>
/* Existing Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Oswald", sans-serif;
  font-weight: bold;
}

body {
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  z-index: -1;
  background-image: url("../assets/bg.png");
  background-size: cover;
}

.login-box {
  background-color: white;
  padding: 50px 120px; /* Increased padding */
  border-radius: 20px;
  border: 3px solid #ff914d;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 600px; /* Increased width */
  margin-top: 50px;
  position: relative;
  z-index: 1;
}

.logo {
  width: 280px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  text-align: left;
}

input[type="email"], input[type="password"], input[type="text"] {
  width: 100%;
  padding: 15px; /* Increased padding */
  margin-bottom: 30px;
  margin-top: 15px;
  border: 3px solid #ff914d; /* Increased border width */
  border-radius: 10px;
  outline: none;
  font-size: 18px; /* Increased font size */
}

input::placeholder {
  color: #ebab83;
}

.login-btn, .register-btn {
  background-color: #ff914d;
  color: white;
  padding: 15px; /* Increased padding */
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  width: 30vh; /* Increased width */
  margin: 10px auto;
  transition: background 0.3s ease;
}

.login-btn:hover, .register-btn:hover {
  background-color: #e2600f;
}

/* Popup Styling */
.popup {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff914d;
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  font-size: 18px;
  font-weight: bold;
  display: none;
  z-index: 1000;
}

.hidden {
  display: none;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .login-box {
    padding: 30px 20px;
    width: 90%;
  }

  .login-btn, .register-btn {
    width: 80%;
  }

  .logo {
    width: 70%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .login-box {
    padding: 10px 50px;
    width: 95%;
  }

  input {
    margin-bottom: 20px;
  }

  .login-btn, .register-btn {
    width: 100%;
  }
}
.forgot-password-btn {
  background: none;
  color: #ff914d;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.forgot-password-btn:hover {
  color: #e2600f;
}

</style>


