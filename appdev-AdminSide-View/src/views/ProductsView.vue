<template>
  <div class="products-container">
    <!-- Error Message -->
    <p v-if="errorMessage" class="error alert">{{ errorMessage }}</p>

    <!-- Grouped Products -->
    <div v-if="groupedProducts">
      <div 
        v-for="(group, productName) in groupedProducts" 
        :key="productName" 
        class="product-group"
      >
        <!-- Display product name and code -->
        <h3 class="product-group-title">
          {{ productName }} (Code: {{ group.productCode }})
          <button class="btn" @click="showQRCode(group.productCode, productName)">Show QR Code</button>
        </h3>

        <!-- QR Code Modal -->
        <div v-if="qrCodeToShow" class="qr-modal">
          <div class="qr-modal-content">
            <span class="close-btn" @click="qrCodeToShow = null">&times;</span>
            <h4>QR Code for Product: {{ qrCodeToShow }}</h4>
            <img :src="getQRCodePath(qrCodeToShow)" alt="QR Code" width="150" />
          </div>
        </div>

        <!-- Product Table -->
        <table class="product-table">
          <thead>
            <tr>
              <th hidden>Product Detail ID</th>
              <th>Product Type</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in group.products"
              :key="product.detail_id"
              :class="{
                'low-stock': product.stock <= 10,
                'out-of-stock': product.stock === 0
              }"
              @click="openRestockModal(product)"
            >
              <td hidden>{{ product.detail_id }}</td>
              <td>{{ product.all }}</td>
              <td>${{ formatPrice(product.price) }}</td>
              <td>{{ product.stock }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Restock Modal -->
    <div v-if="showModal" class="modal-overlay" ref="modalOverlay">
      <div class="modal-content">
        <span class="close-btn" @click="showModal = false">&times;</span>
        <h4>Restock Product</h4>
        <form @submit.prevent="submitRestock" class="restock-form">
          <div class="form-group">
            <label>Product Name: </label>
            <span>{{ restockProduct.productName }}</span>
          </div>
          <div class="form-group">
            <label>Product All: </label>
            <span>{{ restockProduct.productall }}</span>
          </div>
          <div class="form-group">
            <label>Product Price: </label>
            <input type="number" v-model="restockProduct.price" placeholder="Enter new price" required />
          </div>
          <div class="form-group">
            <label>Current Stock: </label>
            <span>{{ restockProduct.stock }}</span>
          </div>
          <div class="form-group">
            <label>Change Type: </label>
            <select v-model="restockProduct.changeType">
              <option value="restock">Restock</option>
              <option value="deduct">Deduct</option>
            </select>
          </div>
          <div class="form-group">
            <label>Quantity: </label>
            <input type="number" v-model="restockProduct.quantity" min="1" placeholder="Enter quantity" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-btn">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      groupedProducts: null,
      errorMessage: null,
      qrCodeToShow: null,
      showModal: false,
      restockProduct: {
        productId: null,
        productName: null,
        productall: null,
        price: null,
        stock: null,
        changeType: 'restock',
        quantity: 1,
      },
    };
  },
  mounted() {
    sessionStorage.removeItem('productCode');
    sessionStorage.removeItem('productName');
    this.fetchProducts();

    // Close modal when clicking outside
    window.addEventListener('click', this.closeModalOnOutsideClick);
  },
  beforeDestroy() {
    // Cleanup the event listener
    window.removeEventListener('click', this.closeModalOnOutsideClick);
  },
  methods: {
    async fetchProducts() {
      try {
        const productResponse = await axios.get("http://localhost:2313/admin/products");
        const products = productResponse.data;

        // Group products by product_name and include the first product_code for each name
        this.groupedProducts = products.reduce((acc, product) => {
          if (!acc[product.product_name]) {
            acc[product.product_name] = {
              productCode: product.product_code,
              products: [],
            };
          }
          acc[product.product_name].products.push(product);
          return acc;
        }, {});
      } catch (error) {
        this.errorMessage = "Failed to fetch products.";
        console.error(error);
      }
    },

    openRestockModal(product) {
      this.restockProduct.productId = product.detail_id;
      this.restockProduct.productName = product.product_name;
      this.restockProduct.productall = product.all;
      this.restockProduct.price = product.price;
      this.restockProduct.stock = product.stock;
      this.showModal = true;
    },
    async submitRestock() {
  try {
    const updatedData = {
      productId: this.restockProduct.productId,
      price: this.restockProduct.price,
      quantity: this.restockProduct.quantity,
      changes: this.restockProduct.changeType,
    };

    console.log('Sending data to backend:', updatedData);

    // Validate input before sending to the backend
    if (!updatedData.productId || updatedData.price === undefined || updatedData.quantity === undefined) {
      console.error('Invalid data:', updatedData);
      this.showAlert("Invalid data provided for restocking.", "error");
      return;
    }

    const response = await axios.post('http://localhost:2313/admin/restock-product', updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log('Server response:', response.data);

    if (response.status === 200) {
      const { message } = response.data;
      this.showAlert(`${message}`, "success");
      window.location.reload();
      
    } else {
      this.showAlert("Failed to restock product. Please try again.", "error");
    }
  } catch (error) {
    console.error('Error with restock request:', error.response ? error.response.data : error.message);
    this.showAlert("Failed to restock product!", "error");
  }
},


    showAlert(message, type) {
      // Simple alert implementation
      alert(`${type.toUpperCase()}: ${message}`);
      // You can replace this with a more sophisticated alert system if needed
    },

    showQRCode(productCode, productName) {
      sessionStorage.setItem('productCode', productCode);
      sessionStorage.setItem('productName', productName);
      this.$router.push({
        name: 'GenerateQRCode'
      });
    },

    getQRCodePath(productCode) {
      return require(`@/assets/product/qrcode/${productCode}.png`);
    },

    formatPrice(price) {
      const numericPrice = parseFloat(price);
      return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
    },

    closeModalOnOutsideClick(event) {
      if (event.target === this.$refs.modalOverlay) {
        this.showModal = false;
      }
    }
  }
};
</script>

<style scoped>
/* Modal overlay style */
.modal-overlay {
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
}

/* Modal content style */
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* Close button style */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #aaa;
}

/* Form styling */
.restock-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  display: block;
}

.form-group span {
  display: block;
  margin-top: 5px;
  font-size: 16px;
  color: #333;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 5px;
}

.form-group input:focus, .form-group select:focus {
  border-color: #007bff;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>

<style scoped>
/* General styling */
.products-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

/* Error message */
.alert {
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.alert.error {
  background-color: #f8d7da;
  color: #721c24;
}

/* Product Group and Table Styling */
.product-group {
  margin-bottom: 30px;
}

.product-group-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top:  15px;
}

.product-table th,
.product-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.product-table th {
  background-color: #f4f4f4;
}

.product-table tr:hover {
  background-color: #f1f1f1;
}

/* Row color based on stock */
.low-stock {
  background-color: #fff3cd; /* Light yellow */
}

.out-of-stock {
  background-color: #f8d7da; /* Light red */
}

/* Button Styling */
.btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 4px;
}

.btn:hover {
  background-color: #0056b3;
}

/* QR Code Modal Styling */
.qr-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.qr-modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  max-width: 450px;
  width: 100%;
}

.qr-modal img {
  margin-top: 20px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 28px;
  font-weight: bold;
  color: #555;
  cursor: pointer;
}

.close-btn:hover {
  color: #000;
}
</style>