<template>
    <div class="m-4">
      <div class="product container table-responsive mx-auto" style="border: 4px solid #ec993a; max-width: 600px; border-radius: 10px; padding: 30px 60px; margin: 10px; font-weight: 700;">
        <div class="row">
          <div class="col">
            <label><strong>Admin ID</strong></label>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <input type="text" class="form-control" placeholder="Enter Admin ID" v-model="adminID" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label><strong>Admin Name</strong></label>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <input type="text" class="form-control" placeholder="Enter Admin Name" v-model="adminName" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label><strong>Contact Number</strong></label>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <input type="text" class="form-control" placeholder="Enter Contact Number" v-model="contactNumber" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label><strong>Password</strong></label>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <input type="password" class="form-control" placeholder="Enter Password" v-model="password" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label><strong>Confirm Password</strong></label>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <input type="password" class="form-control" placeholder="Confirm Password" v-model="confirmPassword" />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col d-flex justify-content-center">
            <button class="btnadd" @click="addAdmin">
              Add Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        adminID: '',
        adminName: '',
        contactNumber: '',
        password: '',
        confirmPassword: ''
      };
    },
    methods: {
      addAdmin() {
        if (this.password !== this.confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
        // Logic to add admin goes here
        alert('Admin added successfully!');
        this.resetForm();
      },
      resetForm() {
        this.adminID = '';
        this.adminName = '';
        this.contactNumber = '';
        this.password = '';
        this.confirmPassword = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .form-control::placeholder {
    color: #eeab81; 
    font-weight: 700;
  }
  .form-control {
    border: 3px solid #e79224;
    border-radius: 10px;
    color: #ff914c;
    font-weight: 700;
  }
  .btnadd {
    width: 35%;
    height: 55px;
    background-color: #ff914c; /* Orange background */
    border: none;
    border-radius: 10px;
    padding: 8px;
    color: white; /* Text color */
    font-weight: 900;
  }
  </style>
  