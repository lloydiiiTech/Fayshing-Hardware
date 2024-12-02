<template>
  <div class="home">
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

      <!-- QR Code Scanner -->
      <div id="reader" class="qr-scanner"></div>

      <!-- <div class="scan-box">
        <div class="line top-left horizontal"></div>
        <div class="line top-right horizontal"></div>
        <div class="line bottom-left horizontal"></div>
        <div class="line bottom-right horizontal"></div>
        <div class="line top-left vertical"></div>
        <div class="line top-right vertical"></div>
        <div class="line bottom-left vertical"></div>
        <div class="line bottom-right vertical"></div>
      </div> -->
    </div>

    <!-- Alert Section -->
    <div v-if="showAlert" class="alert alert-warning">
      <p>Invalid QR Code: This QR Code is not compatible with this scanner.</p>
    </div>

    <div class="input-section">
      <div class="button-container">
        <a href="/ordered-product" class="button-text1">Check Order Product</a>
        <a href="/home" class="button-text">Scan a QR code</a>
        <span class="or-text">or</span>
        <a href="/manual-encoding" class="button-text2">Manual Encoding</a>
      </div>
    </div>
  </div>
</template>
<script>
import { Html5Qrcode } from "html5-qrcode"; // Import correct QR code library
import axios from "axios";

export default {
  data() {
    return {
      isDropdownVisible: false,
      isScanning: false, // Controls QR scanning visibility
      scannedData: null, // Store the scanned QR code data
      showAlert: false, // Controls visibility of the alert
      product: null,
    };
  },
  mounted() {
    this.checkTableEmpty();
    const session = sessionStorage.getItem("staffSession");
    if (!session) {
      this.$router.push("/"); // Redirect to login page
    }


    const productData = this.$route.query.productData;
    if (productData) {
      this.product = JSON.parse(productData); // Parse the stringified product data
    }
  },
  methods: {
    async checkTableEmpty() {
      try {
        const session = JSON.parse(sessionStorage.getItem("staffSession"));

        if (!session.id) {
          console.error("Staff ID is not available in the session.");
          return;
        }

        const response = await axios.get(
          "http://localhost:2313/staff/checkTableEmpty",
          {
            headers: {
              staffID: session.id, // Pass staffID in headers
            },
          }
        );

        if (response.data.isEmpty) {
          this.$router.push("/customername");
        } else {
          this.startScanning();
        }
      } catch (error) {
        console.error("Error checking table status: ", error);
      }
    },

    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },

    logout() {
      console.log("Logout clicked");
      this.isDropdownVisible = false;
    },

    startScanning() {
      this.isScanning = true;

      // Initialize QR scanner
      const scanner = new Html5Qrcode("reader"); // `reader` is the div where the scanner will be rendered
      scanner
        .start(
          { facingMode: "environment" }, // Use rear camera
          {
            fps: 10, // Frames per second
            qrbox: { width: 270, height: 280 }, // Scan box size
          },
          this.onScanSuccess, // Success callback
          this.onScanError // Error callback
        )
        .catch((err) => {
          console.error("QR scanner start error:", err);
        });

      // Stop scanning method
      this.stopScanner = () => scanner.stop();
    },

    onScanSuccess(decodedText, decodedResult) {
      console.log("QR Code scanned successfully:", decodedText, decodedResult);

      // Validate the scanned data to ensure it's a 6-digit number
      const isValidQRCode = /^\d{6}$/.test(decodedText);

      if (!isValidQRCode) {
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 5000); // Hide the alert after 5 seconds
        return;
      }

      this.scannedData = decodedText; // Store the scanned QR code data

      // Stop scanning
      this.stopScanner();

      // Validate scanned product data
      this.checkScannedProduct(decodedText);
    },

    onScanError(errorMessage) {
      console.warn("QR Code scan error:", errorMessage);
    },

    async checkScannedProduct(scannedData) {
  try {
    const response = await axios.post(
      "http://localhost:2313/staff/checkProduct",
      { code: scannedData } // Send QR code to backend
    );

    // Log the backend response for debugging
    console.log("Backend Response:", response.data);

    if (response.data.exists) {
      // Extract product_code only
      const productCode = response.data.product_data.product_code;

      // Navigate to the scanned-product page, passing only product_code
      this.$router.push({
        path: "/scanned-product",
        query: { productCode }, // Sending only the product_code
      });
    } else {
      // Show alert if the product doesn't exist
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
  } catch (error) {
    console.error("Error checking product:", error);
  }
}







  },
};
</script>
<style scoped>
.alert {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  padding: 15px;
  background-color: #ffcc00;
  color: #333;
  border: 1px solid #e6b800;
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffeeba;
  color: #856404;
}


</style>

<style scoped>

.qr-scanner {
  width: 100%;
  height: 300px;

  object-fit: cover;
  margin: 20px auto;
  border: 2px dashed #ccc;
  border-radius: 10px;
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
  /*transform: scaleX(-1);*/
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
  z-index: 1000;
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
  color: rgb(255, 255, 255);
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
