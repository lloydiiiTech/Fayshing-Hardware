<template>
  <div class="form-container">
    <div class="form-box">
      <h2 class="form-title">Admin Details</h2>
      
      <!-- Only show the form when the data is successfully loaded -->
      <form v-if="adminData" @submit.prevent="updateAdmin" class="form-content">
        <input type="hidden" v-model="adminID" />

        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            class="form-control"
            placeholder="Enter Username"
            v-model="adminData.username"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            class="form-control"
            placeholder="Enter Email"
            v-model="adminData.email"
            required
          />
        </div>

        <div class="form-group">
          <label for="location">Location</label>
          <input
            type="text"
            id="location"
            class="form-control"
            placeholder="Enter Location"
            v-model="adminData.location"
            required
          />
        </div>

        <div class="form-group">
          <label for="contact">Contact</label>
          <input
            type="text"
            id="contact"
            class="form-control"
            placeholder="Enter Contact"
            v-model="adminData.contact"
            required
          />
        </div>
        <div class="form-buttons">
          <button type="submit" class="btn btn-success">Update</button>
       
        </div>
      </form>
      
      <!-- Show loading spinner until data is loaded -->
      <div v-else class="loading">Loading...</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      adminID: '',
      adminData: { username: '', email: '', location: '', contact: '' },
      userImage: null,
    };
  },
  mounted() {
    this.loadAdminData();
  },
  methods: {
    loadAdminData() {
      const adminID = sessionStorage.getItem('admin_id');
      if (!adminID) {
        alert('Admin is not authenticated.');
        return;
      }

      console.log(`Fetching data for adminID: ${adminID}`);  // Debug log

      axios.get(`http://localhost:2313/admin/get-admin/${adminID}`)
        .then(response => {
          console.log('Admin data fetched successfully:', response.data);  // Debug log

          if (response.data && response.data.username) {
            this.adminData = response.data;
            this.adminID = adminID;
          } else {
            alert('No data received for admin.');
            console.error('Invalid admin data:', response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching admin data:', error);
          alert('Failed to load admin data.');
        });
    },
    updateAdmin() {
      const updatedData = {
        username: this.adminData.username,
        email: this.adminData.email,
        location: this.adminData.location,
        contact: this.adminData.contact,
        userImage: this.userImage ? this.userImage.name : null,
      };

      axios.put(`http://localhost:2313/admin/update-admin/${this.adminID}`, updatedData)
        .then(response => {
          alert('Admin updated successfully!');
        })
        .catch(error => {
          console.error('Error updating admin:', error);
          alert('Failed to update admin.');
        });
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.userImage = file;
    },
    resetForm() {
      this.adminData = null;
      this.userImage = null;
    }
  }
};

</script>

<style scoped>
/* Container and alignment */
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  background-color: #f9f9f9;
  padding: 20px;
}

.form-box {
  background: #fff;
  border-radius: 12px;
  padding: 40px 30px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Form Title */
.form-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #ec993a;
  margin-bottom: 20px;
}

/* Form Elements */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.form-control {
  padding: 10px;
  border: 2px solid #ec993a;
  border-radius: 8px;
  font-size: 14px;
  color: #555;
}

.form-control::placeholder {
  color: #aaa;
}

/* Buttons */
.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-success {
  background-color: #28a745;
  color: #fff;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>

