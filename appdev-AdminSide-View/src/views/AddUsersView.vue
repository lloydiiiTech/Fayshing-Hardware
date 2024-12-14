<template>
  <div class="m-4">
    <div class="product container table-responsive mx-auto" style="border: 4px solid #ec993a; max-width: 600px; border-radius: 10px; padding: 40px; margin: 10px; font-weight: 700;">
      
      <div class="row"> 
        <div class="col">
          <label><strong>Staff ID</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control input-custom" placeholder="Enter Staff ID" v-model="staffID" readonly/>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label><strong>Staff Username</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control input-custom" placeholder="Enter Staff Username" v-model="staffuserName" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label><strong>Staff Fullname</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control input-custom" placeholder="Enter Staff Fullname" v-model="staffName" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label><strong>Email</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="email" class="form-control input-custom" placeholder="Enter Email" v-model="staffEmail" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label><strong>Address</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control input-custom" placeholder="Enter Address" v-model="staffAddress" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label><strong>Contact Number</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control input-custom" placeholder="Enter Contact Number" v-model="contactNumber" />
        </div>
      </div>


      
      <div class="row">
        <div class="col">
          <label><strong>MPIN</strong></label>
        </div>
      </div>
      <div class="row mb-3 justify-content-center">
        <div class="col-auto d-flex justify-content-center">
          <input
            type="password"
            class="form-control mpin-input"
            maxlength="1"
            v-for="(digit, index) in 6"
            :key="`mpin-${index}`"
            v-model="mpin[index]"
            @input="onMpinInput(index, 'mpin')"
            :ref="`mpin-${index}`"
          />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label><strong>Confirm MPIN</strong></label>
        </div>
      </div>
      <div class="row mb-3 justify-content-center">
        <div class="col-auto d-flex justify-content-center">
          <input
            type="password"
            class="form-control mpin-input"
            maxlength="1"
            v-for="(digit, index) in 6"
            :key="`confirmMpin-${index}`"
            v-model="confirmMpin[index]"
            @input="onMpinInput(index, 'confirmMpin')"
            :ref="`confirmMpin-${index}`"
          />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col d-flex justify-content-center">
          <button class="btnadd d-flex justify-content-center" @click="addStaff">
            Add Staff
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      imageUrl: null,
      defaultImage: 'https://via.placeholder.com/100',
      staffID: '',
      staffuserName: '',
      staffName: '',
      staffEmail: '',
      staffAddress: '',
      contactNumber: '',
      mpin: Array(6).fill(''),
      confirmMpin: Array(6).fill(''),
      status: 'uunverified'
    };
  },
  methods: {
    onImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageUrl = URL.createObjectURL(file);
      }
    },
    onMpinInput(index, field) {
      const currentInput = this[field][index];
      if (!/^\d$/.test(currentInput)) {
        this[field][index] = ''; // Clear non-numeric values
      } else if (index < 5) {
        const nextRef = `${field}-${index + 1}`;
        this.$refs[nextRef][0].focus();
      }
    },
    async addStaff() {
      if (this.mpin.join('').length !== 6 || this.confirmMpin.join('').length !== 6) {
        alert('Both MPIN and Confirm MPIN must be 6 digits!');
        return;
      }
      if (this.mpin.join('') !== this.confirmMpin.join('')) {
        alert('MPIN and Confirm MPIN do not match!');
        return;
      }
      
      const staffData = {
        staffID: this.staffID,
        staffuserName: this.staffuserName,
        staffName: this.staffName,
        staffEmail: this.staffEmail,
        staffAddress: this.staffAddress,
        contactNumber: this.contactNumber,
        mpin: this.mpin.join(''), // Combine MPIN array into a single string
        token: this.token,
        status: this.status
      };

      try {
  const response = await axios.post('http://localhost:2313/admin/addstaff', staffData);
  alert(response.data.message);
  this.resetForm();
} catch (error) {
  const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
  alert(`Failed to add staff: ${errorMessage}`);
  console.error('Error details:', error.response?.data || error);
}


    },
    resetForm() {
      this.staffID = '';
      this.staffuserName = '';
      this.staffName = '';
      this.staffEmail = '';
      this.staffAddress = '';
      this.contactNumber = '';
      this.mpin = Array(6).fill('');
      this.confirmMpin = Array(6).fill('');
      this.imageUrl = null;
    }
  },
  mounted() {
    
    sessionStorage.removeItem('productCode');
    sessionStorage.removeItem('productName');
    const session = sessionStorage.getItem('user_id');
    console.log(session);
    if (!session) {
      this.$router.push('/'); // Redirect to login page
    }
  
  }, 
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
.img-preview {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
.btn-upload {
  background-color: #ff914c;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  display: inline-block;
  margin-top: 10px;
}
.mpin-input {
  width: 50px;
  height: 50px;
  margin-right: 5px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  border: 3px solid #e79224;
  border-radius: 10px;
}
.btnadd {
  background-color: #ff914c;
  color: white;
  font-weight: 900;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  transition: background-color 0.3s;
}
.btnadd:hover {
  background-color: #e6792e;
  color: #f8f8f8;
}
</style>