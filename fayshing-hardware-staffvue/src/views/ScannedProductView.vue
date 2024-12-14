<template>
  <div class="background">
    <div class="container">
      <div class="row logo">
        <img src="../assets/logo_orange.png" alt="Logo" />
      </div>
      <div class="row title">
        <h1>Scanned Product</h1>
      </div>
      <div class="row ">
      <div class="row search-container"> 
        
        <button class="cart-icon" @click="ViewCart">🛒</button>
        
      </div>
 
    </div>

      <div class="row">
        <label>Product Code</label>
        <input type="text" class="textboxes" readonly :value="selectedProduct?.product_code" />
      </div>
      <div class="row">
        <label>Product Name</label>
        <input type="text" class="textboxes" readonly :value="selectedProduct?.product_name" />
      </div>

      <div v-if="productDetails">
        <div class="row" v-if="productDetails.color && productDetails.color.length">
          <label>Color</label>
          <select class="textboxes" v-model="selectedColor">
            <option v-for="color in productDetails.color" :key="color" :value="color">{{ color }}</option>
          </select>
        </div>
        <div class="row" v-if="productDetails.liter && productDetails.liter.length">
          <label>Liter</label>
          <select class="textboxes" v-model="selectedLiter">
            <option v-for="liter in productDetails.liter" :key="liter" :value="liter">{{ liter }}L</option>
          </select>
        </div>
        <div class="row" v-if="productDetails.size && productDetails.size.length">
          <label>Size</label>
          <select class="textboxes" v-model="selectedSize">
            <option v-for="size in productDetails.size" :key="size" :value="size">{{ size }}</option>
          </select>
        </div>
        <div class="row" v-if="productDetails.length && productDetails.length.length">
          <label>Length</label>
          <select class="textboxes" v-model="selectedLength">
            <option v-for="length in productDetails.length" :key="length" :value="length">{{ length }}m</option>
          </select>
        </div>
        <div class="row" v-if="productDetails.weight && productDetails.weight.length">
          <label>Weight</label>
          <select class="textboxes" v-model="selectedWeight">
            <option v-for="weight in productDetails.weight" :key="weight" :value="weight">{{ weight }}kg</option>
          </select>
        </div>
        <div class="row" v-if="productDetails.dimension && productDetails.dimension.length">
          <label>Dimension</label>
          <select class="textboxes" v-model="selectedDimension">
            <option v-for="dimension in productDetails.dimension" :key="dimension" :value="dimension">{{ dimension }}</option>
          </select>
        </div>
        <div class="row" v-if="productDetails.wattage && productDetails.wattage.length">
          <label>Wattage</label>
          <select class="textboxes" v-model="selectedWattage">
            <option v-for="wattage in productDetails.wattage" :key="wattage" :value="wattage">{{ wattage }}W</option>
          </select>
        </div>
        <div class="row" v-if="productDetails.type && productDetails.type.length">
          <label>Type</label>
          <select class="textboxes" v-model="selectedType">
            <option v-for="type in productDetails.type" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>

      <div v-if="stockMessage" class="stock-message" :class="stockMessageClass">{{ stockMessage }}</div>

      <div class="row">
        <label>Price</label>
        <input type="text" class="textboxes" readonly :value="selectedProductPrice" />
      </div>

      <div class="row quantity">
        <label>Quantity</label>
        <div class="quantity-wrapper">
            <button class="arrow-button arrow-down" @click="decreaseQuantity">-</button>
            <div class="quantitycontainer">
                <input
                    type="number"
                    class="textbox quantity-input"
                    v-model="quantity"
                    :min="1"
                    :max="stock"
                    @input="validateQuantity"
                />
            </div>
            <button class="arrow-button arrow-up" @click="increaseQuantity">+</button>
        </div>
        <p v-if="stockMessage" :class="stockMessageClass">{{ stockMessage }}</p>
      </div>


      <div class="row">
        <label>Total Price</label>
        <input type="text" class="textboxes" readonly :value="totalPrice" />
      </div>

      <div class="row foot">
        <div class="rowbtn center-button">
          <button class="submit-button " @click="AddtoCart">ADD TO CART</button>
          <button class="submit-button " @click="PurchaceOrder">PURCHACE</button>
        </div>
        <div class="center-button">
          <button class="button-group" @click="goToHome">Cancel</button>
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
      quantity: 1,
      searchQuery: '',
      selectedProduct: null,
      selectedProductPrice: 0,
      productDetailsID: 0,
      stock: 0,
      productDetails: null,
      selectedColor: '',
      selectedLiter: '',
      selectedSize: '',
      selectedLength: '',
      selectedWeight: '',
      selectedDimension: '',
      selectedWattage: '',
      selectedType: '',
      products: [], // For the products to be searched
    };
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) {
        return [];
      }
      const query = this.searchQuery.toLowerCase();
      return this.products.filter(
        product =>
          product.product_name.toLowerCase().includes(query) ||
          product.product_code.toLowerCase().includes(query)
      );
    },
    totalPrice() {
      return this.selectedProductPrice * this.quantity;
    },
    selectedAttributes() {
      return {
        color: this.selectedColor,
        liter: this.selectedLiter,
        size: this.selectedSize,
        length: this.selectedLength,
        weight: this.selectedWeight,
        dimension: this.selectedDimension,
        wattage: this.selectedWattage,
        type: this.selectedType,
      };
    },
  },
  watch: {
    selectedAttributes: {
      handler(newValues) {
        // Check if at least one field is filled
        const hasSelectedAttribute = Object.values(newValues).some(value => value);
        if (hasSelectedAttribute) {
          this.updateProductPrice();
        }
      },
      deep: true, // Deep watch to detect changes within the object
    },
  },
  methods: {
    goToHome() {
      sessionStorage.removeItem('productSession');
      this.$router.push('/home');
    },
    ViewCart() {
      this.$router.push('/ordered-product');
    },
    validateQuantity() {
      if (this.quantity > this.stock) {
        this.quantity = this.stock; // Reset to max stock if exceeded
        this.showStockWarning();
      } else if (this.quantity < 1) {
        this.quantity = 1; // Ensure minimum is 1
      }
    },
    increaseQuantity() {
      if (this.quantity < this.stock) {
        this.quantity++;
      } else {
        this.showStockWarning();
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    showStockWarning() {
      this.stockMessage = `Only ${this.stock} items available in stock.`;
      this.stockMessageClass = 'warning';
    },

    
    AddtoCart() {
  const session = JSON.parse(sessionStorage.getItem('staffSession'));
  sessionStorage.removeItem('productSession');
  if (!session?.id) {
    console.error("Staff ID is not available in the session.");
    return;
  }

  if (!this.productDetailsID || !this.productDetailsID) {
    console.error("Product details or detail_id is not available.");
    return;
  }

  const requestData = {
    product_code: this.selectedProduct?.product_code, 
    product_detail_id: this.productDetailsID, // Ensure detail_id is included
    product_name: this.selectedProduct?.product_name, 
    product_price: this.selectedProductPrice, 
    quantity: this.quantity,
    staffID: session.id,
    color: this.selectedColor || null, // Default to null if empty
    liter: this.selectedLiter || null, // Default to null if empty
    size: this.selectedSize || null, // Default to null if empty
    length: this.selectedLength || null, // Default to null if empty
    weight: this.selectedWeight || null, // Default to null if empty
    dimension: this.selectedDimension || null, // Default to null if empty
    wattage: this.selectedWattage || null, // Default to null if empty
    type: this.selectedType || null, // Default to null if empty
  };

  // Ensure the price is greater than 0 before making the API call
  if (this.selectedProductPrice > 0) {
    axios
      .post('http://localhost:2313/staff/add-cart', requestData)
      .then(response => {
        const { exists } = response.data;

        if (exists) {
          this.$router.push('/ordered-product');
        } else {
          this.stockMessage = 'Error adding product to cart.';
          this.stockMessageClass = 'low-stock';
        }
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
      });
  } else {
    console.warn("The product price must be greater than 0 to add to the cart.");
  }
},

    PurchaceOrder() {
      const session = JSON.parse(sessionStorage.getItem('staffSession'));
      sessionStorage.removeItem('productSession');
      if (!session?.id) {
        console.error("Staff ID is not available in the session.");
        return;
      }

      if (!this.productDetailsID || !this.productDetailsID) {
        console.error("Product details or detail_id is not available.");
        return;
      }

      const requestData = {
        product_code: this.selectedProduct?.product_code, 
        product_detail_id: this.productDetailsID, // Ensure detail_id is included
        product_name: this.selectedProduct?.product_name, 
        product_price: this.selectedProductPrice, 
        quantity: this.quantity,
        staffID: session.id,
        color: this.selectedColor || null, // Default to null if empty
        liter: this.selectedLiter || null, // Default to null if empty
        size: this.selectedSize || null, // Default to null if empty
        length: this.selectedLength || null, // Default to null if empty
        weight: this.selectedWeight || null, // Default to null if empty
        dimension: this.selectedDimension || null, // Default to null if empty
        wattage: this.selectedWattage || null, // Default to null if empty
        type: this.selectedType || null, // Default to null if empty
      };

      // Ensure the price is greater than 0 before making the API call
      if (this.selectedProductPrice > 0) {
        axios
          .post('http://localhost:2313/staff/add-cart', requestData)
          .then(response => {
            const { exists } = response.data;

            if (exists) {
              this.$router.push('/payment');
            } else {
              this.stockMessage = 'Error adding product to cart.';
              this.stockMessageClass = 'low-stock';
            }
          })
          .catch(error => {
            console.error('Error adding product to cart:', error);
          });
      } else {
        console.warn("The product price must be greater than 0 to add to the cart.");
      }
    },

        
    fetchProductDetailsFromQuery() {
      const productData = JSON.parse(sessionStorage.getItem('productSession'));;

      // Log the raw productData for debugging
      console.log("Raw productData:", productData);

      if (productData) {
        console.log("Parsed Product Code (String):", productData);

        axios
          .post("http://localhost:2313/staff/checkProduct", { code: productData }) // Send product code to backend
          .then((response) => {
            // Log the backend response for debugging
            console.log("Backend Response:", response.data);

            if (response.data.exists) {
              // Assign the product details to selectedProduct
              this.selectedProduct = response.data.product_data;
              this.fetchProductDetails(productData);
            } else {
              console.error("Product does not exist.");
              this.selectedProduct = null; // Clear the fields if product not found
            }
          })
          .catch((error) => {
            console.error("Error checking product:", error);
            this.selectedProduct = null; // Clear the fields on error
          });
      } else {
        console.error("No productData found in the route query.");
        this.selectedProduct = null; // Clear the fields if no query parameter
      }
    },


    fetchProductDetails(productCode) {
      axios
        .get(`http://localhost:2313/staff/product-details/${productCode}`)
        .then(response => {
          this.productDetails = this.groupProductDetails(response.data);
        })
        .catch(error => {
          console.error('Error fetching product details:', error);
        });
    },
    selectProduct(product) {
      this.selectedProduct = product;
      this.searchQuery = `${product.product_name} (${product.product_code})`;
      this.fetchProductDetails(product.product_code);
    },
    groupProductDetails(details) {
      const groupedDetails = {
        color: [],
        liter: [],
        size: [],
        length: [],
        weight: [],
        dimension: [],
        wattage: [],
        type: [],
      };  

      details.forEach(detail => {
        if (detail.color && !groupedDetails.color.includes(detail.color)) {
          groupedDetails.color.push(detail.color);
        }
        if (detail.liter && !groupedDetails.liter.includes(detail.liter)) {
          groupedDetails.liter.push(detail.liter);
        }
        if (detail.size && !groupedDetails.size.includes(detail.size)) {
          groupedDetails.size.push(detail.size);
        }
        if (detail.length && !groupedDetails.length.includes(detail.length)) {
          groupedDetails.length.push(detail.length);
        }
        if (detail.weight && !groupedDetails.weight.includes(detail.weight)) {
          groupedDetails.weight.push(detail.weight);
        }
        if (detail.dimension && !groupedDetails.dimension.includes(detail.dimension)) {
          groupedDetails.dimension.push(detail.dimension);
        }
        if (detail.wattage && !groupedDetails.wattage.includes(detail.wattage)) {
          groupedDetails.wattage.push(detail.wattage);
        }
        if (detail.type && !groupedDetails.type.includes(detail.type)) {
          groupedDetails.type.push(detail.type);
        }
      });

      return groupedDetails;
    },
    updateProductPrice() {
  if (this.selectedProduct) {
    console.log("Triggering price update...");

    // Log all the selected attributes for debugging
    console.log("Selected attributes:", {
      product_code: this.selectedProduct.product_code,
      color: this.selectedColor,
      liter: this.selectedLiter,
      size: this.selectedSize,
      length: this.selectedLength,
      weight: this.selectedWeight,
      dimension: this.selectedDimension,
      wattage: this.selectedWattage,
      type: this.selectedType,
    });

    // Collect all selected attributes (even if they are empty or null)
    const requestData = {
      product_code: this.selectedProduct.product_code, // Ensure product code is included
      color: this.selectedColor || null, // Default to null if empty
      liter: this.selectedLiter || null, // Default to null if empty
      size: this.selectedSize || null, // Default to null if empty
      length: this.selectedLength || null, // Default to null if empty
      weight: this.selectedWeight || null, // Default to null if empty
      dimension: this.selectedDimension || null, // Default to null if empty
      wattage: this.selectedWattage || null, // Default to null if empty
      type: this.selectedType || null, // Default to null if empty
    };

    // Log the final request data to ensure it's correct
    console.log("Request Data:", requestData);

    // Make the request to the server
    axios
      .post('http://localhost:2313/staff/get-product-price', requestData)
      .then(response => {
            const { message, productData } = response.data;
            this.selectedProductPrice = productData?.price || 0;
            this.productDetailsID = productData?.detail_id || 0;
            this.stock = productData?.stock || 0;

            if (message.includes('Low Stock')) {
              this.stockMessage = message;
              this.stockMessageClass = 'low-stock';
            } else if (message.includes('Out')) {
              this.stockMessage = message;
              this.stockMessageClass = 'out-of-stock';
            } else {
              this.stockMessage = '';
              this.stockMessageClass = '';
            }
          })
          .catch(error => {
            console.error('Error updating product price:', error);
          });
  } else {
    // Log if selectedProduct is not set
    console.error("No product selected.");
  }
},

    checkStockAvailability(stock) {
      if (stock >= this.quantity) {
        this.selectedProductPrice = this.selectedProductPrice; // Maintain the price
      } else {
        alert('Not enough stock available for this product.');
      }
    },
  },
  mounted() {
  const staffSession = sessionStorage.getItem('staffSession');
  if (!staffSession) {
    this.$router.push('/login'); // Redirect to login page
    return; // Prevent further execution
  }

  const productSession = sessionStorage.getItem('productSession');
  if (!productSession) {
    this.$router.go(-1); // Go back to the previous page
    return; // Prevent further execution
  }

  // Fetch the list of products
  axios.get('http://localhost:2313/staff/products').then(response => {
    this.products = response.data;
  });

  // Fetch product details from query parameters
  this.fetchProductDetailsFromQuery(); 
}

};
</script>


<style>
.low-stock {
  color: orange;
  font-weight: bold;
}
.out-of-stock {
  color: red;
  font-weight: bold;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.background {
  background-color: rgb(233, 161, 29);
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  width: calc(100% - 20px); /* Adjusted width calculation */
  max-height: 100vh; /* Set maximum height for scrollability */
  background-color: rgb(253, 248, 248);
  border: 2px solid rgb(233, 161, 29); /* Orange border */
  border-radius: 20px;
  box-sizing: border-box;
  padding:30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px; /* Reduced gap for closer spacing between rows */
  overflow-y: auto; /* Enable vertical scrolling */
}


.row {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo img {
  width: 180px;
  display: block;
  margin: auto;
  margin-top: 20px;
}

.title h1 {
  text-align: center;
  width: 100%;
  margin: 0;
  font-size: 22px;
  margin-top: -20px;
}

label {
  font-weight: 900;
}

.textboxes {
  width: 98%;
  padding: 4px; /* Reduced padding for smaller height */
  border: 1px solid rgb(233, 161, 29); /* Orange border */
  border-radius: 5px;
  font-size: 15px;
}
.txtsearch{
  width: 90%;
  padding: 4px; /* Reduced padding for smaller height */
  border: 1px solid rgb(233, 161, 29); /* Orange border */
  border-radius: 5px;
  font-size: 15px;
}
.search-container {
  position: relative; /* Position relative to place the icon */
  width: 100%;
}

.cart-icon {
  position: absolute;
  right: 10px; 
  top: 5%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 35px;
  text-shadow: 3px 3px 3px rgb(239, 114, 46);
  background-color: transparent;
  border: none;
  color: inherit;
  transition: none;
}
.cart-icon:hover {
  background-color: transparent;
  color: inherit;
}

.sizes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.size-options {
  display: flex;
  gap: 25px;
  margin: 0 auto; /* Centers the .sizes container itself */
}

.circle-option {
  display: flex;
  align-items: center;
  gap: 5px;
}

.circle-option input[type="radio"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgb(255, 255, 255); /* Set the default background to white */
  border: 2px solid rgb(233, 161, 29); /* Orange border for unselected */
  margin: 0;
  cursor: pointer;
  position: relative; /* Position for the inner circle */
}

.circle-option input[type="radio"]:checked {
  background-color: rgb(233, 161, 29); /* Orange background when checked */
  border: 2px solid rgb(233, 161, 29); /* Keep the border color the same when checked */
}

.circle-option input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  top: 4px; /* Adjust to center the inner circle */
  left: 4px; /* Adjust to center the inner circle */
  width: 12px; /* Inner circle size */
  height: 12px; /* Inner circle size */
  border-radius: 50%; /* Make it circular */
  background-color: rgb(233, 161, 29); /* White inner circle */
}

.quantity {
    display: flex; /* Use flexbox for layout */
    flex-direction: column; /* Stack label and quantity container vertically */
    margin-bottom: 10px; /* Space below each row */
    width: 1000px;
}

.quantity-wrapper {
    display: flex; /* Use flexbox for the quantity wrapper */
    align-items: center; /* Center items vertically */
    width: 100%;
}

.quantitycontainer {
    display: flex; /* Use flexbox for the quantity container */
    align-items: center; /* Center items vertically */
    border: 1px solid rgb(233, 161, 29); /* Border around the container */
    border-radius: 4px; /* Rounded corners */
    width: 100%; /* Fixed width for the quantity container */
}

.quantity-input {
    width: 60px; /* Fixed width for the input */
    text-align: center; /* Center the input value */
    border: none; /* Remove default border */
    outline: none; /* Remove outline on focus */
    padding: 5px; /* Padding for the input */
    font-size: 16px; /* Increase font size for better readability */
}

.arrow-button {
    background-color: #f0f0f0; /* Light background for buttons */
    border: 1px solid rgb(233, 161, 29); /* Border color */
    border-radius: 4px; /* Rounded corners */
    cursor: pointer; /* Pointer cursor on hover */
    padding: 15px !important; /* Increased padding for larger buttons */
    font-size: 28px !important; /* Increased font size for larger buttons */
    width: 50px !important; /* Increased width for buttons */
    height: 30px !important;
    display: flex; /* Flexbox for centering */
    align-items: center; /* Center items vertically */
    justify-content: center; /* Center items horizontally */
}

/* Hover effect for buttons */
.arrow-button:hover {
    background-color: rgb(233, 161, 29); /* Change background on hover */
    color: white; /* Change text color on hover */
}

/* Optional: Add focus effect to input */
.quantity-input:focus {
    border: 1px solid rgb(233, 161, 29); /* Highlight border on focus */
    background-color: #f9f9f9; /* Light background on focus */
}
.submit {
  display: flex;
  justify-content: center;
  width: 20%;
}

.submit-button {
  padding: 10px 20px;
  background-color: rgb(233, 161, 29);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 10px;
  
}


.center-button {
  display: flex;
  justify-content: center;
  width: 80%;
}

.button-group {
  background-color: transparent;
  border: 2px solid orange;
  border-radius: 30px;
  padding: 10px; /* Adjust padding as needed */
  cursor: pointer;
  font-size: 16px;
  color: gray;
  font-weight: bold;
  text-align: center;
  height: 40px;
  width: 100%;
}
.dropdown-list {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid rgb(233, 161, 29);
  border-radius: 5px;
  max-height: 150px;
  overflow-y: auto;
  margin-top: 5px;
  list-style-type: none;
  padding: 0;
  z-index: 10;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: rgb(233, 161, 29);
  color: white;
}
.rowbtn{
  justify-content: space-between;
}
.foot {
  position: fixed;
  bottom: 0px;
  width: 50px;
  padding: 0px 0px; /* Adjust for spacing */
  margin: 10px;
}

</style>
    