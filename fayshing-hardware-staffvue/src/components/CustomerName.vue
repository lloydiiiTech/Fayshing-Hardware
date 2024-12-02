<template>
  <div class="home">
    <!-- Home Page Content -->
    <div class="camera-container">
      <div class="header">
        <img src="../assets/logo_white.png" alt="Logo" class="logo" />
        <div class="profile-container" @click="toggleDropdown">
          <img src="../assets/profile.png" alt="Profile" class="profile-picture" />
          <div v-if="isDropdownVisible" class="dropdown-menu">
            <p>user name</p>
            <a @click="logout" href="/" class="dropdown-logout">LOGOUT</a>
          </div>
        </div>
      </div>
      <video ref="video" autoplay></video>
      <div class="scan-box">
        <div class="line top-left horizontal"></div>
        <div class="line top-right horizontal"></div>
        <div class="line bottom-left horizontal"></div>
        <div class="line bottom-right horizontal"></div>
        <div class="line top-left vertical"></div>
        <div class="line top-right vertical"></div>
        <div class="line bottom-left vertical"></div>
        <div class="line bottom-right vertical"></div>
      </div>
    </div>
    <div class="input-section">
      <div class="button-container">
        <a href="/ordered-product" class="button-text1">Check Order Product</a>
        <a href="/home" class="button-text">Scan a QR code</a>
        <span class="or-text">or</span>
        <a href="/manual-encoding" class="button-text2">Manual Encoding</a>
      </div>
    </div>

    <!-- Login Form Overlay -->
    <div class="login-overlay">
      <div class="login-box">
        <img src="../assets/logo_orange.png" alt="Fayshing Hardware Logo" class="logo" />
        <h6>Please Enter Customer Information</h6>
        <form @submit.prevent="handleSubmit">
          <label for="customerName">Customer Name</label>
          <input type="text" id="customerName" v-model="customerName" placeholder="Enter Customer Name" required />

          <label for="contactNumber">Contact Number</label>
          <input type="tel" id="contactNumber" v-model="contactNumber" placeholder="Enter Contact Number" />

          <button type="submit" class="submit-btn">SUBMIT</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isDropdownVisible: false,
      customerName: '',
      contactNumber: '',
      showLoginForm: false, // Controls whether the form is visible
    };
  },
  mounted() {
    this.checkTableEmpty();
    const session = sessionStorage.getItem('staffSession');
    if (!session) {
      this.$router.push('/'); // Redirect to login page
    }
  },
  methods: {
    async checkTableEmpty() {
  try {
    // Retrieve staffID (from sessionStorage or localStorage)
    const session = JSON.parse(sessionStorage.getItem('staffSession'));

    if (!session.id) {
      console.error("Staff ID is not available in the session.");
      return;
    }

    const response = await axios.get('http://localhost:2313/staff/checkTableEmpty', {
      headers: {
        staffID: session.id, // Pass staffID in headers
      },
    });

    if (response.data.isEmpty) {
      this.showLoginForm = true; // Show login form
    } else {
      this.$router.push('/home');
    }
  } catch (error) {
    console.error("Error checking table status: ", error);
  }
},
    setupCamera() {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.$refs.video.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing camera: ", error);
        });
    },
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    logout() {
      console.log("Logout clicked");
      this.isDropdownVisible = false;
    },
    async handleSubmit() {
      if (this.customerName && this.contactNumber) {
        try {

          const session = JSON.parse(sessionStorage.getItem('staffSession'));
          if (!session || !session.id) {
            alert('Session expired. Please log in again.');
            this.$router.push('/login');
            return;
          }
      
          const staffID = session.id;

          const response = await axios.post('http://localhost:2313/staff/saveCustomer', {
            customerName: this.customerName,
            contactNumber: this.contactNumber,
            staffID: staffID,
          });
          if (response.data.success) {
            this.showLoginForm = false;
            this.$router.push('/home'); 
          } else {
            console.error("Error saving customer: ", response.data.message);
          }
        } catch (error) {
          console.error("Error saving customer: ", error);
        }
      }
    },
  },
};
</script>


<style scoped>
/* Base Styles */
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
}

.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative; /* Allow absolute positioning of login form */
}

/* Camera Section */
.camera-container {
  flex: 0 0 80%;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Header */
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 14, 14, 0.7);
  padding: 0 15px;
  z-index: 10;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.logo {
  height: 50px;
  margin-top: 7px;
  width: 50%;
}

.profile-container {
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.profile-picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Login Overlay */
.login-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20; /* Ensure it appears above the camera */
}

.login-box {
  background-color: white;
  padding: 30px 100px;
  border-radius: 20px;
  border: 3px solid #ff914d;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 550px;
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
  margin-bottom: -10px;
  text-align: left;
}

h6 {
  margin-bottom: 20px;
}

input[type="text"],
input[type="tel"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 50px;
  margin-top: 15px;
  border: 2px solid #ff914d;
  border-radius: 10px;
  outline: none;
}

input[type="text"]::placeholder,
input[type="tel"]::placeholder {
  color: #ebab83;
}

.submit-btn {
  background-color: #ff914d;
  color: white;
  padding: 0 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  width: auto;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 15px;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background-color: #e2600f;
}

/* Input Section */
.input-section {
  flex: 0 0 30%;
  background-color: rgb(238, 233, 233);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -30px;
}

/* Media Queries */
@media (max-width: 740px) {
  .login-box {
    padding: 30px 20px;
    width: 90%;
  }

  .logo {
    width: 70%;
    max-width: 200px;
  }
}

.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.dropdown-menu {
  position: absolute;
  top: 55px; /* Adjust as needed */
  right: 10px; /* Align with profile container */
  background-color: rgb(247, 126, 12); /* Background color for dropdown */
  border: 1px solid #ddd; /* Border for dropdown */
  border-radius: 5px; /* Rounded corners */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Shadow for dropdown */
  z-index: 20; /* Ensure dropdown is above other elements */
  color:#fff;
  width: 60px;
  font-weight:700;
  padding:8px;
  text-align: center;
}
p{
  margin-top: -5px;
  font-size: 12;
 margin-bottom: 7px;
}
.dropdown-item {
  display: block; /* Make it a block for better click area */
  color: rgb(255, 255, 255); /* Text color */
  text-decoration: none; /* Remove underline */
}
.dropdown-logout{
  background-color: #ddd;
  color:#ec7921;
  border-radius: 5px;
  padding:5px;
 font-size: 12px;
}

.dropdown-logout:hover {
  background-color: #ec7921; /* Highlight on hover */
  color:#ffffff
}

.camera-container {
  flex: 0 0 80%; /* Takes up 80% of the height */
  background-color: black; /* Optional: set background color for the camera section */
  display: flex;
  justify-content: center;
  align-items: center;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the area without distorting aspect ratio */
}

.input-section {
  flex: 0 0 30%; /* Takes up 20% of the height */
  background-color: rgb(238, 233, 233);
  border-top-left-radius: 20px; /* Rounded corners */
  border-top-right-radius: 20px; /* Rounded corners */
  display: flex;
  justify-content: center; /* Center align the button container */
  align-items: center; /* Center vertically */
  margin-top: -30px;
}

.button-container {
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
  align-items: center; /* Center align text */
  margin-top: -90px;
}

.button-text {
  padding: 1px 5px;
  font-size: 16px;
  font-weight: 800;
  color: rgb(19, 17, 17);
  border-radius: 10px; /* Rounded button corners */
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-text:hover {
  background-color: #ff7033; /* Darken button on hover */
}
a {
  text-decoration: none; /* Remove underline from links */
}

.button-text1 {
  padding: 5px 5px;
  font-size: 16px;
  font-weight: 800;
  color: rgb(0, 0, 0);
  border-radius: 19px; /* Rounded button corners */
  cursor: pointer;
  transition: background-color 0.3s;
  border:3px solid #ee9873;
  width:200px;
  text-align: center;
  margin-top: -70px;
  margin-bottom: 50px;
  
}

.button-text1:hover {
  background-color: #ff7033; /* Darken button on hover */
}


.button-text2 {
  padding: 5px 5px;
  font-size: 16px;
  font-weight: 800;
  color: rgb(19, 17, 17);
  border-radius: 19px; /* Rounded button corners */
  cursor: pointer;
  transition: background-color 0.3s;
  border:3px solid #ee9873;
  width:280px;
  text-align: center;
  
}

.button-text2:hover {
  background-color: #ff7033; /* Darken button on hover */
}

.or-text {
  margin: 10px 0; /* Space around the 'or' text */
  font-size: 16px; /* Same font size as buttons */
  color: #333; /* Dark text color */
}

/*header*/
.header {
  position: absolute; /* Overlay header on camera feed */
  top: 0;
  left: 0;
  right: 0;
  height: 60px; /* Adjust height as necessary */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 14, 14, 0.7); /* Light transparent background */
  padding: 0 15px; /* Horizontal padding */
  z-index: 10; /* Ensure header is above the video */
  border-bottom-left-radius: 20px; /* Rounded corners */
  border-bottom-right-radius: 20px; /* Rounded corners */
}

.logo {
  height: 50px; /* Adjust logo size as needed */
  margin-top: 7px;
  padding: 2px;
 margin-left: 75px;
 width:50%;
}

.profile-container {
  width: 40px; /* Set width for profile picture container */
  height: 40px; /* Set height for profile picture container */
  overflow: hidden; /* Crop any overflow */
  border-radius: 50%; /* Circular profile picture */
  border: 2px solid #fff; /* Optional: white border around the profile */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); /* Optional: shadow for depth */
}

.profile-picture {
  width: 100%; /* Cover container */
  height: 100%; /* Cover container */
  object-fit: cover; /* Ensure image covers the area */
}

 /*scanner */
 .scan-box {
    position: absolute;
    top: 15%; /* Adjust to place the box where desired */
    left: 15%; /* Adjust to center the box */
    width: 70%; /* Width of the scanning box */
    height: 35%; /* Height of the scanning box */
}

/* Line styles */
.line {
    position: absolute;
    background-color: #ff7033; /* Line color */
}

/* Horizontal line styles */
.horizontal {
    height: 5px; /* Line thickness */
}

/* Top-left line */
.top-left.horizontal {
    top: 0; /* Align to the top */
    left: 0; /* Align to the left */
    width: 30%; /* Extend 30% from the left */
}

/* Top-right line */
.top-right.horizontal {
    top: 0; /* Align to the top */
    right: 0; /* Align to the right */
    width: 30%; /* Extend 30% from the right */
}

/* Bottom-left line */
.bottom-left.horizontal {
    bottom: 0; /* Align to the bottom */
    left: 0; /* Align to the left */
    width: 30%; /* Extend 30% from the left */
}

/* Bottom-right line */
.bottom-right.horizontal {
    bottom: 0; /* Align to the bottom */
    right: 0; /* Align to the right */
    width: 30%; /* Extend 30% from the right */
}

/* Vertical line styles */
.vertical {
    width: 5px; /* Line thickness */
}

/* Top-left vertical line */
.top-left.vertical {
    top: 0; /* Align to the top */
    left: 0; /* Align to the left */
    height: 30%; /* Extend downward 30% */
}

/* Top-right vertical line */
.top-right.vertical {
    top: 0; /* Align to the top */
    right: 0; /* Align to the right */
    height: 30%; /* Extend downward 30% */
}

/* Bottom-left vertical line */
.bottom-left.vertical {
    bottom: 0; /* Align to the bottom */
    left: 0; /* Align to the left */
    height: 30%; /* Extend upward 30% */
}

/* Bottom-right vertical line */
.bottom-right.vertical {
    bottom: 0; /* Align to the bottom */
    right: 0; /* Align to the right */
    height: 30%; /* Extend upward 30% */
}
</style>
