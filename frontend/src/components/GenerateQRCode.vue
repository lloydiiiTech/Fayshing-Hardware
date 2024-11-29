<template>
  <div class="m-4">
    <div class="product container mx-auto" style="border: 4px solid #ec993a; max-width: 600px; border-radius: 10px; padding: 40px 80px; margin: 10px; font-weight: 700;">
      <div class="row mb-3">
        <div class="col">
          <label style="color: black;font-weight: 700;font-size: 18px;"><strong>Product Code</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <div class="bordered-container">
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col d-flex justify-content-center">
          <!-- Ensure the buttons are in a row -->
          <button class="btnadd" @click="addProduct">Add Product Download</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productCode: ''
    };
  },
  methods: {
    addProduct() {
      // Logic to add product goes here
      alert('Product Added Download successfully!');
    }
  }
};
</script>

<style scoped>
.form-control::placeholder {
  color: #ff914c; 
  font-weight: 700;
}
.form-control {
  border: 3px solid #e79224;
  border-radius: 10px;
}
.bordered-container {
  border: 2px solid #e79224; /* Orange border */
  padding: 10px;
  border-radius: 10px;
  text-align: center; /* Center the content */
  color: black; /* Text color */
  font-weight: 700; /* Bold text */
  height: 450px;
}
.btnadd {
  background-color: #ff914c; /* Orange background */
  border: none;
  border-radius: 10px;
  padding: 2px 10px;
  color: white; /* Text color */
  font-weight: 900;
  margin: 10px; /* Spacing between buttons */
  height: 90% ;
  width: 30%;
}
</style>
