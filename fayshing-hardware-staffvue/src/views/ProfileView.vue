<template>
  <div class="background">
    <div class="container">
      <!-- Alert Message -->
      
      <!-- Logo and Title -->
      <div class="row logo">
        <img src="../assets/logo_orange.png" alt="Logo">
      </div>

      <!-- Back Button -->
      <div class="back-button">
        <button @click="goBack">← Back</button>
      </div>

      <!-- Staff Profile -->
      <div class="profile-container">
        <div class="profile-header">
    <!-- Profile Image -->
        <img 
          class="profile-img" 
          :src="profileImage" 
          alt="Profile Picture"
          @click="showUpdateButton = true" 
        />
        <h2 class="profile-name">{{ username }}</h2>

        <!-- Update Profile Picture Button (Initially Hidden) -->
        <button 
          class="update-profile-img-btn" 
          v-if="showUpdateButton" 
          @click="openImageModal"
        >
          Update Profile Picture
        </button>
        
        <!-- Modal for Image Upload -->
        <div v-if="isModalVisible" class="modal">
    <div class="modal-content">
      <h3>Upload New Profile Picture</h3>

      <!-- Image preview section -->
      <div v-if="imagePreview">
        <img :src="imagePreview" alt="Selected Profile Picture" class="image-preview" />
      </div>

      <!-- File input for uploading image -->
      <input type="file" @change="handleImageUpload" accept="image/*" />

      <!-- Buttons for submit and cancel -->
      <div class="modal-buttons">
        <button @click="submitImage">Submit</button>
        <button @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
      </div>
        <div class="profile-info">
          <div class="info-row">
            <label>Full Name:</label>
            <p>{{ name }}</p>
          </div>
          <div class="info-row">
            <label>Email:</label>
            <p>{{ email }}</p>
          </div>
          <div class="info-row">
            <label>Address:</label>
            <p>{{ address }}</p>
          </div>
          <div class="info-row">
            <label>Contact:</label>
            <p>{{ contact }}</p>
          </div>
        </div>
        
        <div class="profile-actions">
          <button class="change-pass" @click="toggleChangeMPINModal">Change MPIN</button>
        </div>

        <div class="profile-actions">
          <button class="action-button update-but" @click="toggleUpdateModal">Update</button>
          <button class="action-button cancel-but" @click="logout">Logout</button>
        </div>
      </div>

      <!-- Update Modal -->
      <div v-if="showUpdateModal" class="modal">
        <div class="modal-content">
          <h3>Update Profile</h3>
          <div class="update-form">
            <label>Username:</label>
            <input v-model="updatedUserName" :placeholder="username" />
            <label>Full Name:</label>
            <input v-model="updatedName" :placeholder="name" />
            <label>Address:</label>
            <input v-model="updatedAddress" :placeholder="address" />
            <label>Contact:</label>
            <input v-model="updatedContact" :placeholder="contact" />
          </div>
          <div class="modal-actions">
            <button class="action-but save-but" @click="submitUpdate">
              Save
            </button>
            <button class="action-but cancel-but" @click="toggleUpdateModal">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Change MPIN Modal -->
      <div v-if="showChangeMPINModal" class="modal">
        <div class="modal-content">
          <h3>Change MPIN</h3>
          <div v-if="alertMessage" class="alert" :class="alertType">
            <p>{{ alertMessage }}</p>
          </div>

          <div class="change-mpin-form">
            <label>New MPIN:</label>
            <input 
              type="password" 
              id="new-mpin"
              v-model="newMPIN" 
              placeholder="Enter 6-digit MPIN" 
              maxlength="6" 
              pattern="\d{6}" 
              required
              @input="validateMPINInput('new')"
            />
            <label>Confirm MPIN:</label>
            <input 
            type="password" 
            id="confirm-mpin"
            v-model="confirmMPIN" 
            placeholder="Confirm MPIN" 
            maxlength="6" 
            pattern="\d{6}" 
            required
            @input="validateMPINInput('confirm')"
          />
          </div>
          <div class="modal-actions">
            <button class="action-but save-but" @click="submitChangeMPIN">
              Save
            </button>
            <button class="action-but cancel-but" @click="toggleChangeMPINModal">
              Cancel
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      staffID: null,
      username: "",
      name: "",
      email: "",
      address: "",
      contact: "",
      staffStatus: "",
      showUpdateModal: false,
      showChangeMPINModal: false,
      updatedUserName: "",
      updatedName: "",
      updatedEmail: "",
      updatedAddress: "",
      updatedContact: "",
      newMPIN: "",
      confirmMPIN: "",
      alertMessage: "", // Holds the alert message
      alertType: "", // Holds the type of alert: 'success', 'error', etc.
      profileImage: require('@/assets/profile.png'),
      showUpdateButton: false, // Initially hide the button
      isModalVisible: false, // Initially hide the modal
        };
  },
  created() {
    this.staffID = this.getStaffIDFromSession();
    if (this.staffID) {
      this.fetchProfileData();
    } else {
      console.error("Staff ID not found in session.");
    }
    const session = sessionStorage.getItem('staffSession');
    if (!session) {
      this.$router.push('/login'); // Redirect to login page
    }
  },
  methods: {
    async cancelOrder() {
            try {
                const session = JSON.parse(sessionStorage.getItem('staffSession'));
                if (!session?.id) {
                    console.error("Staff ID is not available in the session.");
                    return;
                }

                // Send the cancellation request to the backend
                const response = await fetch('http://localhost:2313/staff/cancel-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ staff_id: session.id }),
                });

                const result = await response.json();

                if (response.ok) {
                    this.$router.push('/home');
                } else {
                    console.error('Error:', result.message);
                }
            } catch (error) {
                console.error('Error cancelling order:', error);
                alert('An error occurred while cancelling the order.');
            } finally {
                this.showModal = false;
            }
        },

    validateMPINInput(field) {
      const numericPattern = /^[0-9]*$/;
      let target = field === 'new' ? this.newMPIN : this.confirmMPIN;
      
      if (!numericPattern.test(target)) {
        this.alertMessage = "MPIN must contain only numbers.";
        this.alertType = "error";
      } else {
        this.alertMessage = '';
        this.alertType = '';
      }
    },

    openImageModal() {
      this.isModalVisible = true; // Show the modal for image upload
    },
    // Close the modal
    closeModal() {
      this.isModalVisible = false;
    },
    // Handle the image upload
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.profileImage = reader.result; // Update the profile image with the uploaded one
          this.closeModal(); // Close the modal after the image is uploaded
        };
        reader.readAsDataURL(file); // Read the uploaded file as a data URL
      }
    },
    getStaffIDFromSession() {
      const session = JSON.parse(sessionStorage.getItem("staffSession"));
      return session?.token || null;
    },
    async fetchProfileData() {
      try {
        const response = await fetch(`http://localhost:2313/staff/profile/${this.staffID}`);
        
        if (response.ok) {
          const data = await response.json();
          this.array = data;
          this.username = data.username;
          this.name = data.name;
          this.email = data.email;
          this.address = data.address;
          this.contact = data.contact;
          this.staffStatus = data.staffStatus;
        } else {
          console.error("Failed to fetch profile data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    },
    toggleUpdateModal() {
      if (!this.showUpdateModal) {
        this.updatedUserName = this.username;
        this.updatedName = this.name;
        this.updatedAddress = this.address;
        this.updatedContact = this.contact;
      }
      this.showUpdateModal = !this.showUpdateModal;
    },
    async submitUpdate() {
      try {
        const updatedData = {
          username: this.updatedUserName,
          name: this.updatedName,
          address: this.updatedAddress,
          contact: this.updatedContact,
        };
        const response = await fetch(`http://localhost:2313/staff/update-profile/${this.staffID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          this.fetchProfileData();
          this.toggleUpdateModal();
          this.showAlert("Profile updated successfully.", "success");
        } else {
          console.error("Failed to update profile:", response.statusText);
          this.showAlert("Failed to update profile. Please try again.", "error");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        this.showAlert("An error occurred while updating profile. Please try again.", "error");
      }
    },
    toggleChangeMPINModal() {
      this.showChangeMPINModal = !this.showChangeMPINModal;
    },
    async submitChangeMPIN() {
      if (this.newMPIN !== this.confirmMPIN) {
        this.showAlert("MPIN and Confirm MPIN must match.", "error");
        return;
      }
      
      if (!/^\d{6}$/.test(this.newMPIN)) {
        this.showAlert("MPIN must be a 6-digit number.", "error");
        return;
      }

      try {
        const updatedMPINData = {
          mpin: this.newMPIN,
        };
        const response = await fetch(`http://localhost:2313/staff/change-mpin/${this.staffID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMPINData),
        });

        if (response.ok) {
          this.showAlert("MPIN successfully updated.", "success");
          this.showChangeMPINModal = false;
        } else {
          console.error("Failed to update MPIN:", response.statusText);
          this.showAlert("Failed to update MPIN. Please try again.", "error");
        }
      } catch (error) {
        console.error("Error updating MPIN:", error);
        this.showAlert("An error occurred while updating MPIN. Please try again.", "error");
      }
    },
    showAlert(message, type) {
      this.alertMessage = message;
      this.alertType = type;
      // Automatically hide the alert after 5 seconds
      setTimeout(() => {
        this.alertMessage = "";
        this.alertType = "";
      }, 5000);
    },
    logout() {
      console.log("Logging out...");
      this.cancelOrder();
      sessionStorage.removeItem("staffSession"); // Clear the session storage
      this.$router.push("/"); // Redirect to the login page or home page
    },

    goBack() {
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
/* Styling for profile header */
.profile-header {
  position: relative;
  text-align: center;
}

.profile-img {
  cursor: pointer;
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.update-profile-img-btn {
  background-color: #ff8c00;
  color: white;
  border: none;
  padding: 0px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 10px;
  width: 40%;
}

/* Styling for the modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
</style>

<style scoped>
.change-mpin-form .form-group {
  margin-bottom: 15px;
}

.change-mpin-form label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
}

.change-mpin-form input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.change-mpin-form input:focus {
  border-color: #4caf50;
  outline: none;
}
.alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px;
  border-radius: 5px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  z-index: 1000;
  font-size: 16px;
}

.alert.success {
  background-color: #4caf50;
  color: white;
}

.alert.error {
  background-color: #f44336;
  color: white;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  padding: 0%;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 70%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.3s ease;
}

.modal-content h3 {
  text-align: center;
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

.update-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.update-form label {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.update-form input {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  outline: none;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.update-form input:focus {
  border-color: #ff8c00;
  background-color: #fff;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.action-but {
  width: 30%;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.save-but {
  background-color: #4caf50;
  color: #fff;
}

.save-but:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.cancel-but {
  background-color: #f44336;
  color: #fff;
}

.cancel-but:hover {
  background-color: #e53935;
  transform: translateY(-2px);
}

/* Animations */
@keyframes fadeIn {
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.5);
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}


/* Logo Styling */
.logo img {
  max-width: 150px;
  margin-bottom: 20px;
}

/* Back Button Styling */
.back-button {
  text-align: left;
  margin-top: -140px;
}

.back-button button {
  color: rgb(243, 132, 28);
  border: none;
  padding: 8px 15px;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 12px;
}


/* Profile Section */
.profile-container {
  margin-top: 30px;

}

.profile-header {
  margin-bottom: 20px;
  background-color: #dfbe82;
  width: 120%;
  padding:20px;
  margin-left: -20px;
}


.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-name {
  font-size: 1.6em;
  font-weight: bold;
  margin-top: 10px;
}

.profile-info {
  margin-top: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1.1em;
}

.info-row label {
  font-weight: bold;
}

.info-row p {
  color: #333;
  margin-top:-3px;

}

/* Action Buttons */
.profile-actions {
  margin-top: 20px;
}
/* Action Buttons */
.profile-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center; 
  align-items: center; 
}

.action-button {
  color: white;
  border: none;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  width: 130px;
}
.update-but{
  background-color: #ff8c00;

}
.action-button:hover {
  background-color: #a56416;
}

.change-pass{
  width: 100%;
  font-size: 14px;
  border-radius: 5px;
}
</style>