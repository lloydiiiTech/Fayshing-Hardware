<template>
    <div class="m-4">
      <div class="product container table-responsive mx-auto" style="border: 4px solid #ec993a; max-width: 600px; border-radius: 10px; padding: 30px 60px; margin: 10px; font-weight: 700;">
        <div class="row">
          <div class="col">
            <label><strong>Product Code</strong></label>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <input type="text" class="form-control" placeholder="Enter Product Code" v-model="productCode" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label><strong>Product Name</strong></label>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <input type="text" class="form-control" placeholder="Enter Product Name" v-model="productName" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label><strong>Option 1</strong></label>
          </div>
        </div>
        <div class="row mb-1" v-for="(option, index) in options1" :key="index">
          <div class="col-12 col-sm mb-2">
            <input type="text" class="form-control" placeholder="Product Name" v-model="option.name" />
          </div>
          <div class="col-12 col-sm mb-2">
            <input type="text" class="form-control" placeholder="Stock" v-model="option.stock" />
          </div>
          <div class="col-12 col-sm mb-2">
            <input type="text" class="form-control" placeholder="Price" v-model="option.price" />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <button class="btnadd" @click="addOption1">+ Add Selection to Option 1</button>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label><strong>Option 2</strong></label>
          </div>
        </div>
        <div class="row mb-1" v-for="(option, index) in options2" :key="index">
          <div class="col-12 col-sm mb-2">
            <input type="text" class="form-control" placeholder="mm" v-model="option.name" />
          </div>
          <div class="col-12 col-sm mb-2">
            <input type="text" class="form-control" placeholder="Stock" v-model="option.stock" />
          </div>
          <div class="col-12 col-sm mb-2">
            <input type="text" class="form-control" placeholder="Price" v-model="option.price" />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <button class="btnadd" @click="addOption2">+ Add Selection to Option 2</button>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col d-flex justify-content-center">
            <router-link to="/generate-qr-code" class="btn" style="max-width: 90%; background-color: #ff914c; color: azure; font-weight: 900; border-radius: 10px; padding: 3px 13px;">
              <div style="text-align: center;">
                <span style="display: block;">Generate</span>
                <span style="display: block;">QR Code</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        productCode: '',
        productName: '',
        options1: [{ name: '', stock: '', price: '' }],
        options2: [{ name: '', stock: '', price: '' }]
      };
    },
    methods: {
      addOption1() {
        this.options1.push({ name: '', stock: '', price: '' });
      },
      addOption2() {
        this.options2.push({ name: '', stock: '', price: '' });
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
    width: 100%;
    background-color: #ff914c;
    border-radius: 10px;
    border: none;
    padding: 8px;
    color: rgb(240, 210, 166);
    font-weight: 900;
    text-align: left;
  }
  </style>
  