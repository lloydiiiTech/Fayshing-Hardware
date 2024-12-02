<template>
    <div class="login-container">
      <div class="background-image"></div>
      <div class="login-box">
        <img src="../assets/logo_orange.png" alt="Fayshing Hardware Logo" class="logo" />
  
        <form @submit.prevent="handleLogin">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Enter Admin Email" required />
  
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Enter Password" required />
  
          <button type="submit" class="login-btn">LOG IN</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      handleLogin() {
        // Example login logic (replace with your actual logic)
        if (this.email && this.password) {
          console.log('Email:', this.email);
          console.log('Password:', this.password);
          // Navigate to the home page after login
          this.$router.push('/home');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Oswald', sans-serif;
    font-weight: bold;
  }
  
  body {
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center top;
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
    background-image: url('../assets/bg.png');
    background-size: cover;
    background-position: center;
  }
  
  .login-box {
    background-color: white;
    padding: 30px 100px;
    border-radius: 20px;
    border: 3px solid #ff914d;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 550px;
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
  
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 50px;
    margin-top: 15px;
    border: 2px solid #ff914d;
    border-radius: 10px;
    outline: none;
  }
  
  input[type="email"]::placeholder,
  input[type="password"]::placeholder {
    color: #ebab83;
  }
  
  .login-btn {
    background-color: #ff914d;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    width: 25vh;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 15px;
    transition: background 0.3s ease;
  }
  
  .login-btn:hover {
    background-color: #e2600f;
  }
  
  .link {
    display: inline-block;
    margin-top: 10px;
    color: #d86925;
    text-decoration: none;
    font-weight: normal;
  }
  
  .link:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .login-box {
      padding: 30px 20px;
      width: 90%;
      margin-top: 20px;
    }
  
    .login-btn {
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
      margin-top: 20px;
    }
  
    .logo {
      width: 70%;
      max-width: 170px;
    }
  
    input[type="email"],
    input[type="password"] {
      margin-bottom: 30px;
      padding: 8px;
    }
  
    .login-btn {
      width: 100%;
      padding: 10px;
    }
  }
  </style>
  