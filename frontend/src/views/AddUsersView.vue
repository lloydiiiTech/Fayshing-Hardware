<template>
    <div class="m-4">
      <div class="product container table-responsive mx-auto" style="border: 4px solid #ec993a; max-width: 800px; border-radius: 10px; padding: 40px 80px; font-weight: 700;">
        <div class="row">
          <div class="col">
            <label><strong>Staff ID</strong></label>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <input type="text" class="form-control" placeholder="Enter Staff ID" v-model="staffID" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label><strong>Staff Name</strong></label>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <input type="text" class="form-control" placeholder="Enter Staff Name" v-model="staffName" />
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
            <label><strong>MPIN</strong></label>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <input type="password" class="form-control" placeholder="Enter MPIN" v-model="mpin" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label><strong>Confirm MPIN</strong></label>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <input type="password" class="form-control" placeholder="Confirm MPIN" v-model="confirmMpin" />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col d-flex justify-content-center">
            <button class="btnadd d-flex justify-content-center" style="max-width: 25%; background-color: #ff914c; color: azure; font-weight: 900; border-radius: 10px;" @click="addStaff">
              Add Staff
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
        staffID: '',
        staffName: '',
        contactNumber: '',
        mpin: '',
        confirmMpin: ''
      };
    },
    methods: {
      addStaff() {
        // Logic to add staff goes here, e.g., form validation or API call
        if (this.mpin !== this.confirmMpin) {
          alert('MPINs do not match!');
          return;
        }
        alert('Staff Added Successfully!');
        // Reset form fields
        this.resetForm();
      },
      resetForm() {
        this.staffID = '';
        this.staffName = '';
        this.contactNumber = '';
        this.mpin = '';
        this.confirmMpin = '';
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
}
.btnadd {
  width: 100%;
  background-color: #ff914c; 
  border-radius: 10px;
  border: none;
  padding: 8px;
  color: rgb(240, 210, 166);
  font-weight: 900;
  text-align: center;
}
.d-flex {
  display: flex;
}
.vh-100 {
  height: 100vh;
}
.align-items-center {
  align-items: center;
}
.justify-content-center {
  justify-content: center;
}
</style>
  