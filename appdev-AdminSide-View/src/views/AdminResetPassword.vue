<template>
    <div class="change-password-container">
      <div class="background-image"></div>
  
      <!-- Change Password Form -->
      <div class="change-password-box">
        <img src="../assets/logo_orange.png" alt="Fayshing Hardware Logo" class="logo" />
  
        <form @submit.prevent="handleChangePassword">
         
  
          <label for="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            v-model="newPassword"
            placeholder="Enter New Password"
            required
          />
  
          <label for="confirm-password">Confirm New Password</label>
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            placeholder="Confirm New Password"
            required
          />
  
          <button type="submit" class="change-password-btn">CHANGE PASSWORD</button>
        </form>
  
        <button @click="navigateBack" class="back-btn">BACK</button>
      </div>
  
      <!-- Popup Notification -->
      <div v-if="showPopup" class="popup">
        <p>Password Updated Successfully!</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showPopup: false, // Control popup visibility
      };
    },
    methods: {
        async handleChangePassword() {
            if (this.newPassword !== this.confirmPassword) {
                alert("New password and confirmation do not match.");
                return;
            }

            try {
                const response = await axios.post(
                "http://localhost:3000/api/admin/change-password",
                {
                    newPassword: this.newPassword,
                    confirmPassword: this.confirmPassword,
                },
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
                    },
                }
                );

                const { message } = response.data;

                this.showPopup = true;
                setTimeout(() => {
                this.showPopup = false;
                }, 2000);

                alert(message);
                this.$router.push({ name: "Login" });
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                alert("Password change failed: " + error.response.data.error);
                } else {
                alert("An error occurred during password change");
                }
                console.error("Password change error:", error);
            }
        },
      navigateBack() {
        this.$router.push("/home"); // Adjust path as needed
      },
    },
  };
  </script>
  
  <style scoped>
  /* Reuse existing styles */
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
  
  .change-password-container {
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
  
  .change-password-box {
    background-color: white;
    padding: 50px 120px;
    border-radius: 20px;
    border: 3px solid #ff914d;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 600px;
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
  
  input[type="password"] {
    width: 100%;
    padding: 15px;
    margin-bottom: 30px;
    margin-top: 15px;
    border: 3px solid #ff914d;
    border-radius: 10px;
    outline: none;
    font-size: 18px;
  }
  
  input::placeholder {
    color: #ebab83;
  }
  
  .change-password-btn {
    background-color: #ff914d;
    color: white;
    padding: 15px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    width: 30vh;
    margin: 10px auto;
    transition: background 0.3s ease;
  }
  
  .change-password-btn:hover {
    background-color: #e2600f;
  }
  
  .back-btn {
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
  
  .back-btn:hover {
    color: #e2600f;
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
    z-index: 1000;
  }
  
  /* Responsive Styles */
  @media (max-width: 768px) {
    .change-password-box {
      padding: 30px 20px;
      width: 90%;
    }
  
    .change-password-btn {
      width: 80%;
    }
  
    .logo {
      width: 70%;
      max-width: 200px;
    }
  }
  
  @media (max-width: 480px) {
    .change-password-box {
      padding: 10px 50px;
      width: 95%;
    }
  
    input {
      margin-bottom: 20px;
    }
  
    .change-password-btn {
      width: 100%;
    }
  }
  </style>
  