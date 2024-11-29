<template>
  <div class="m-4 d-flex justify-content-center align-items-center" style="height: 100vh;">
    <div class="product container table-responsive mx-auto" 
         style="border: 4px solid #ec993a; max-width: 600px; border-radius: 10px; padding: 30px 60px; margin: 10px; font-weight: 700;">
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
      <br>
      <div class="row">
        <div class="col">
          <label><strong>Username</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control" placeholder="Enter Username" v-model="username" />
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col">
          <label><strong>Email</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="email" class="form-control" placeholder="Enter Email" v-model="email" />
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col">
          <label><strong>Location</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control" placeholder="Enter Location" v-model="location" />
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col">
          <label><strong>Contact</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control" placeholder="Enter Contact" v-model="contact" />
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col">
          <label><strong>User Role</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control" placeholder="Enter User Role" v-model="userRole" />
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col">
          <label><strong>User Image</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="file" class="form-control" @change="onFileChange" />
        </div>
      </div>
      <br>

      <div class="row mb-3">
        <div class="col d-flex justify-content-between">
          <button class="btn btn-success" @click="updateAdmin">Update</button>
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
      username: '',
      email: '',
      location: '',
      contact: '',
     
      userImage: null
    };
  },
  methods: {
    deleteAdmin() {
      // Logic to delete the admin goes here
      alert('Admin deleted successfully!');
    },
    updateAdmin() {
      // Logic to update the admin goes here
      if (!this.validateForm()) {
        alert('Please fill out all fields!');
        return;
      }
      alert('Admin updated successfully!');
      // Reset form fields
      this.resetForm();
    },
    resetForm() {
      this.adminID = '';
      this.username = '';
      this.email = '';
      this.location = '';
      this.contact = '';
      this.userImage = null;
    },
    validateForm() {
      return (
        this.adminID &&
        this.username &&
        this.email &&
        this.location &&
        this.contact 
      );
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.userImage = file;
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
  color: #eb7d38; 
  font-weight: 700;
}
.btn {
  width: 30%; /* Adjust button width for alignment */
  border-radius: 10px;
  height: 50px;
  font-weight: 700;
}
.btn-danger {
  background-color: #dc3545; /* Bootstrap red */
  color: white;
}
.btn-success {
  background-color: #28a745; /* Bootstrap green */
  color: white;
}
</style>
