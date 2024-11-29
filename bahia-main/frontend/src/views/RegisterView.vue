<template>
  <div class="login-container">
    <div class="background-image"></div>

    <!-- Registration Form -->
    <div v-if="showRegistration" class="registration-box">
      <img src="../assets/logo_orange.png" alt="Fayshing Hardware Logo" class="logo" />

      <form @submit.prevent="handleRegister">
        <label for="userImage">Profile Image</label>
        <input type="file" id="userImage" ref="userImage" @change="previewImage" />

        <!-- Display chosen image or default placeholder image as a circle -->
        <div class="image-circle">
          <img :src="userImagePreview || 'path/to/default/image.jpg'" alt="Selected Image" />
        </div>
        
        <!-- Form organized into a grid layout -->
        <div class="form-grid">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" placeholder="Enter Username" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="reg-email" v-model="regEmail" placeholder="Enter Your Email" required />
          </div>

          <div class="form-group">
            <label for="location">Location</label>
            <input type="text" id="location" v-model="location" placeholder="Enter Location" />
          </div>
          <div class="form-group">
            <label for="contact">Contact</label>
            <input type="text" id="contact" v-model="contact" placeholder="Enter Contact Number" />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="reg-password" v-model="regPassword" placeholder="Enter Password" required />
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input type="password" id="confirm-password" v-model="confirmPassword" placeholder="Confirm Password" required />
          </div>
        </div>

        <button type="submit" class="login-btn">REGISTER</button>
        <!-- Button to go back to login page -->
        <button type="button" @click="goToLogin" class="back-btn">Back to Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      showRegistration: true,
      email: "",
      password: "",
      regEmail: "",
      regPassword: "",
      confirmPassword: "",
      username: "",
      location: "",
      contact: "",
      userImagePreview: null,
    };
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: "Login" });
    },
    async handleRegister() {
      if (this.regEmail && this.regPassword && this.confirmPassword === this.regPassword) {
        if (this.regPassword !== this.confirmPassword) {
          alert("Confirm password does not match the password.");
          return;
        }

        const formData = new FormData();
        formData.append("username", this.username);
        formData.append("email", this.regEmail);
        formData.append("location", this.location);
        formData.append("contact", this.contact);
        formData.append("password", this.regPassword);

        if (this.$refs.userImage.files[0]) {
          formData.append("userImage", this.$refs.userImage.files[0]);
        }

        try {
          const response = await axios.post("http://localhost:5000/api/admin/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("Registration Successful:", response.data);
          alert("You have successfully registered an account!");
          this.$router.push({ name: "Login" });

          setTimeout(() => {
            this.showRegistration = false;
          }, 500);
        } catch (error) {
          console.error("Error during registration:", error);
        }
      } else {
        alert("Please ensure all fields are filled out correctly.");
      }
    },
    previewImage() {
      const file = this.$refs.userImage.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.userImagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>

<style scoped>
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

.registration-box {
  background-color: white;
  padding: 40px 50px;
  border-radius: 20px;
  border: 3px solid #ff914d;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 600px;
  position: relative;
  z-index: 1;
}

.logo {
  width: 300px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  text-align: left;
  font-size: 18px;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 2px solid #ff914d;
  border-radius: 10px;
  outline: none;
  font-size: 16px;
}

input::placeholder {
  color: #ebab83;
}

.login-btn,
.back-btn {
  background-color: #ff914d;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin: 10px auto;
  transition: background 0.3s ease;
}

.login-btn:hover,
.back-btn:hover {
  background-color: #e2600f;
}

.image-circle {
  width: 120px;
  height: 120px;
  margin: 15px auto;
  border-radius: 50%;
  overflow: hidden;
}

.image-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .registration-box {
    padding: 20px;
    width: 90%;
  }
}
</style>
