<template>
  <div class="m-4">
    <div class="product container table-responsive mx-auto" style="border: 4px solid #ec993a; max-width: 600px; height: 800px; border-radius: 10px; padding: 30px 60px; margin: 10px; font-weight: 700;">
      <div class="row">
        <div class="col">
          <label><strong>Product Code</strong></label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control" placeholder="Product Code" v-model="productCode" readonly/>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label><strong>Product Name</strong></label>
        </div>x
      </div>
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control" placeholder="Enter Product Name" v-model="productName" />
        </div>
      </div>
      
      <div class="row mb-3">
        <div class="col">
          <label><strong>Product Category</strong></label>
        </div>
        <div class="col">
          <select class="form-control mb-3" v-model="selectedCategory" @change="updateSelectionOptions">
            <option disabled value="">Select a category</option>
            <option value="paint">Paint</option>
            <option value="pipe">Pipe</option>
            <option value="nailsAndScrews">Nails & Screws</option>
            <option value="woodAndLumber">Wood & Lumber</option>
            <option value="tiles">Tiles</option>
            <option value="cementAndMortar">Cement & Mortar</option>
            <option value="lightingFixtures">Lighting Fixtures</option>
            <option value="electricalWire">Electrical Wire</option>
            <option value="doorAndWindowHardware">Door & Window Hardware</option>
            <option value="powerTools">Power Tools</option>
            <option value="handTools">Hand Tools</option>
          </select>
        </div>
      </div>

      <!-- Dynamic Inputs Based on Selected Category -->
      <div class="row mb-1" v-for="(option, index) in options1" :key="index">
        <div class="col-3 mb-2" v-if="getInputFields(selectedCategory).includes('color')">
          <input type="text" class="form-control" placeholder="Color" v-model="option.color" />
        </div>
        <div class="col-3 mb-2" v-if="getInputFields(selectedCategory).includes('liter')">
          <input type="text" class="form-control" placeholder="Liter" v-model="option.liter" />
          
        </div>
        <div class="col-3 mb-2" v-if="getInputFields(selectedCategory).includes('type')">
          <input type="text" class="form-control" placeholder="Type" v-model="option.type" />
        </div>
 
        <div class="col-3 mb-2" v-if="getInputFields(selectedCategory).includes('size')">
          <input type="text" class="form-control" placeholder="Size" v-model="option.size" />
        </div>
        <div class="col-3 mb-2" v-if="getInputFields(selectedCategory).includes('length')">
          <input type="text" class="form-control" placeholder="Length" v-model="option.length" />
        </div>
     
        <div class="col-3 mb-2" v-if="getInputFields(selectedCategory).includes('weight')">
          <input type="text" class="form-control" placeholder="Weight" v-model="option.weight" />
        </div>
        
        <div class="col-4 mb-2" v-if="getInputFields(selectedCategory).includes('dimension')">
          <input type="text" class="form-control" placeholder="Dimension" v-model="option.dimension" />
        </div>

        <div class="col-4 mb-2" v-if="getInputFields(selectedCategory).includes('wattage')">
          <input type="text" class="form-control" placeholder="Wattage" v-model="option.wattage" />
        </div>


        
        
        
        

        

        <div class="col-2 mb-2" v-if="getInputFields(selectedCategory).includes('stock')">
          <input type="text" class="form-control" placeholder="Stock" v-model="option.stock"  />
        </div>
        <div class="col-3 mb-2" v-if="getInputFields(selectedCategory).includes('price')">
          <input type="text" class="form-control" placeholder="Price" v-model="option.price"  />
        </div>
        
        
        <div class="col-1" v-if="getInputFields(selectedCategory).includes('stock')">
          <button class="remove" @click="removeOption(index)">x</button>
        </div>
        
      </div>
      <div class="row mb-3">
        <div class="col">
          <button class="btnadd" @click="addOption1">+ Add Option</button>
        </div>
      </div>

      <!-- Add Product Button -->
      <div class="row mb-3">
        <div class="col d-flex justify-content-center">
          <button class="btn-add-product" @click="addProduct">Add Product</button>
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
      selectedCategory: '',
      options1: [{ stock: '', price: '', color: '', liter: '', size: '', length: '', dimension: '', type: '', weight: '', wattage: '' }],
    };
  },
  methods: {
    addOption1() {
      this.options1.push({ stock: '', price: '', color: '', liter: '', size: '', length: '', dimension: '', type: '', weight: '', wattage: '' });
    },
    removeOption(index) {
      this.options1.splice(index, 1);
    },
    getInputFields(category) {
      const inputFields = {
        paint: ['stock', 'price', 'color', 'liter'],
        pipe: ['stock', 'price', 'size', 'length'],
        nailsAndScrews: ['stock', 'price', 'length', 'weight'],
        woodAndLumber: ['stock', 'price', 'dimension'],
        tiles: ['stock', 'price', 'type', 'size'],
        cementAndMortar: ['stock', 'price', 'weight'],
        lightingFixtures: ['stock', 'price', 'wattage'],
        electricalWire: ['stock', 'price', 'length'],
        doorAndWindowHardware: ['stock', 'price', 'type'],
        powerTools: ['stock', 'price', 'type'],
        handTools: ['stock', 'price', 'type'],
      };
      return inputFields[category] || [];
    },
    addProduct() {
  // Get the required fields based on the selected category
  const requiredFields = this.getInputFields(this.selectedCategory);

  // Validate each option entry based on the required fields
  const hasEmptyFields = this.options1.some(option => {
    // Only check fields that are in the requiredFields array
    return requiredFields.some(field => !option[field]);
  });

  // If any required field is empty, alert the user and return
  if (!this.productName || !this.selectedCategory || hasEmptyFields) {
    alert('Please fill in all required fields.');
    return;
  }

  // Prepare the product data for submission by including only relevant fields
  const productData = {
    productName: this.productName,
    selectedCategory: this.selectedCategory,
    options: this.options1.map(option => {
      // Filter the fields to include only those that are relevant to the selected category
      return requiredFields.reduce((acc, field) => {
        acc[field] = option[field];
        return acc;
      }, {});
    })
  };

  // Submit the product data to the backend
  fetch('http://localhost:2313/admin/addproducts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Product added successfully:', data);
        

        // Redirect to the QR code generation page
        this.$router.push({
          name: 'GenerateQRCode',
          params: { productCode: data.qrCode }
          
        });
      } else {
        console.error('Error:', data.message);
        alert('Error adding product: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product.');
    });
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
  background-color: #e0761e;
  border-radius: 10px;
  border: none;
  padding: 8px;
  color: rgb(240, 210, 166);
  font-weight: 900;
  text-align: left;
}
.btn-add-product {
  width: 100%;
  background-color: #ff914c;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-add-product:hover {
  background-color: #ff7722;
}

.btn-add-product:active {
  background-color: #ff914c;
}

.remove {
  border: none;
  color: rgb(0, 0, 0);
  font-weight: 900;
}
</style>