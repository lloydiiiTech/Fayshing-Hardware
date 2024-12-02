<template>
  <div class="background">
    <div class="container">
      <!-- Logo and Title -->
      <div class="row logo">
        <img src="../assets/logo_orange.png" alt="Logo">
      </div>
      <div class="row title">
        <h1>Payment</h1>
      </div>

      <div class="row staff-section">
        <label for="staffName">Name:</label>
        <input type="text" id="clientName" class="textbox-client" v-model="customername" placeholder="Name of Client" readonly/>
      </div>
      <div class="row staff-section">
        <label for="staffName">Contact No.: </label>
        <input type="text" id="clientContact" class="textbox-client" v-model="customercontact_number" placeholder="Contact Number of Client" readonly />
      </div>
      
      <div class="row">
        <select id="purchaseType" class="textboxes">
          <option>Walk In</option>
          <option>Order</option>
        </select>
      </div>

      <!-- Product List Container -->
      <div class="productcontainer">
        <div class="product-line" v-for="(product, index) in products" :key="index">
          <div class="product-col col1">
            <div class="product-name">{{ product.product_name }}</div>
            <div class="product-">{{ product.category1 }}</div>
            <div class="product-size">{{ product.category2 }}</div>
          </div>
          <div class="product-col col2">{{ product.product_price }}</div>
          <div class="product-col col3">
            <div class="quantity-container">
              <input type="text" class="quantity-input" v-model="product.quantity" readonly />
            </div>
          </div>
          <div class="product-col col4">{{ (product.quantity * product.product_price).toFixed(2) }}</div>
        </div>
      </div>

      <!-- Overall Totals -->
      <div class="producttotalcontainer">
        <div class="product-line">
          <div class="product-col col1">
            <div class="item-count">Item: {{ totalItems }}</div>
            <div class="quantity-label">Qty: {{ totalQuantity }}</div>
          </div>
          <div class="product-col col2">
            <label class="total-label">Total</label>
          </div>
          <div class="product-col col3">{{ totalPrice.toFixed(2) }}</div>
        </div>
      </div>

      <!-- Payment Method Section -->
      <div class="row payment-method">
        <label for="paymentMethod">Payment Method</label>
        <div class="paymentinputcontainer">
          <select id="paymentMethod" class="textboxes" v-model="selectedPaymentMethod">
            <option>Cash</option>
            <option>GCash</option>
          </select>
          <input type="number" id="clientPayment" class="textboxpayment" v-model="amountPaid" placeholder="Enter amount" />
        </div>
      </div>

      <!-- Change Display -->
      <div class="changecontainer">
        <label for="change">Change</label>
        <span class="change-amount">{{ changeAmount }}</span>
        
      </div>
      <div class="change-message" v-if="changeMessage" :class="{'error-message': isError, 'success-message': !isError}">
          {{ changeMessage }}
        </div>

      <div class="row staff-section">
        <label for="staffName">Staff</label>
        <input type="text" id="staffName" class="textbox-staff" v-model="staffName" placeholder="Enter Staff Name" />
      </div>

        <div class="submitcontainer">
          <button class="submit-button" @click="backorder">CANCEL</button>
          <button class="submit-button" @click="submitOrder">SUBMIT</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      customername: '',
      customercontact_number: '',
      selectedPaymentMethod: 'Cash', // Default selection for payment method
      amountPaid: 0, // Amount paid by the client
      staffName: '', // Property to hold the staff name
      isError: false,
    };
  },
  computed: {
    totalPrice() {
    return this.products.reduce(
      (total, product) => total + product.product_price * product.quantity,
      0
    );
  },
  totalItems() {
    return this.products.length;
  },
  totalQuantity() {
    return this.products.reduce((total, product) => total + product.quantity, 0);
  },
  changeAmount() {
    const change = this.amountPaid - this.totalPrice;
    return change >= 0 ? change.toFixed(2) : "0.00";
  },
  changeMessage() {
    const change = this.amountPaid - this.totalPrice;
    if (this.amountPaid == 0) {
      this.isError = true; // Highlight error
      return;
    }
    else if (change < 0) {
      this.isError = true; // Highlight error
      return "Please pay the exact or higher amount.";
    } else if (change === 0) {
      this.isError = false; // Success message
      return "The payment is exact. Thank you!";
    } else {
      this.isError = false; // Success message
      return "You have change. Please collect it.";
    }
  },

    backorder() {
            this.$router.push('/ordered-product');
        },
  },
  methods: {
    async fetchCartData() {
      try {
        const session = JSON.parse(sessionStorage.getItem('staffSession'));

        if (!session?.id) {
          console.error("Staff ID is not available in the session.");
          return;
        }

        // Fetch cart data
        const cartResponse = await fetch('http://localhost:2313/staff/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ staff_id: session.id }),
        });

        const cartData = await cartResponse.json();

        if (cartData.products) {
          this.products = cartData.products;
        } else {
          console.warn('No products found in cart');
        }

        // Fetch customer data
        const customerResponse = await fetch('http://localhost:2313/staff/costumer', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ staff_id: session.id }),
        });


        const customerData = await customerResponse.json();
          if (customerData.costumer && customerData.costumer.length > 0) { // Access 'costumer'
            const customer = customerData.costumer[0]; // Access first customer in the array
            this.customername = customer.name || 'Unknown';
            this.customercontact_number = customer.contact_number || 'N/A';
          } else {
            console.warn('Customer data not found or invalid format');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
    submitOrder() {
  // Check if the payment is sufficient

  const session = JSON.parse(sessionStorage.getItem('staffSession'));
  if (this.amountPaid < this.totalPrice) {
    return;
  }

  if (!this.staffName || !this.selectedPaymentMethod) {
    return;
  }

  const saleData = {
    customer_name: this.customername || "Unknown",
    customer_contact: this.customercontact_number || "N/A",
    purchase_type: document.getElementById('purchaseType').value,
    products: this.products.map(product => ({
      product_detail_id: product.product_detail_id,
      product_id: product.id, // Ensure the product object has an `id`
      product_name: product.product_name,
      product_selection: product.category1 + " " + product.category2,
      quantity: product.quantity,
      price: product.product_price,
      subtotal: product.quantity * product.product_price,
    })),
    total_items: this.totalItems,
    total_quantity: this.totalQuantity,
    total_price: this.totalPrice,
    payment_method: this.selectedPaymentMethod,
    amount_paid: this.amountPaid,
    change: parseFloat(this.changeAmount),
    staff_id: session.id,
    staff_name: this.staffName,
  };

  fetch('http://localhost:2313/staff/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(saleData),
  })
    .then(async response => {
      const result = await response.json();
      if (response.ok) {
        alert('Order submitted successfully!');
        this.$router.push('/receipt'); // Redirect to receipt page
      } else {
        alert(`Error: ${result.message}`);
      }
    })
    .catch(error => {
      console.error('Error submitting order:', error);
      alert('An error occurred while submitting the order.');
    });
},
  },
  mounted() {
    const session = JSON.parse(sessionStorage.getItem('staffSession'));
    if (!session) {
      this.$router.push('/login'); // Redirect to login page
    } else {
      // Retrieve staff name from session
      this.staffName = session.staffName || '';
    }
    this.fetchCartData();
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.change-message {
  margin-top: 5px;
  font-size: 14px;
}

.error-message {
  color: red;
}

.success-message {
  color: green;
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
  width: calc(100% - 20px); /* Adjusted to avoid overflow due to padding */
  height: calc(100% - 20px); /* Adjusted to avoid overflow due to padding */
  background-color: white;
  border: 2px solid rgb(233, 161, 29);
  border-radius: 20px;
  box-sizing: border-box;
  padding: 15px 20px; /* Reduced padding */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
}

.row {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}

.logo img {
  width: 180px;
  display: block;
  margin: auto;
  margin-top: -40px;
}

.title h1 {
  text-align: center;
  width: 100%;
  margin: 0;
  font-size: 22px;
  margin-top: -20px;
}

.textboxes {
  width: 100%;
  padding: 5px;
  border: 1px solid rgb(233, 161, 29);
  border-radius: 5px;
  font-size: 16px;
}

.textbox-client {
  width: 70%;
  padding: 5px;
  border: 1px solid rgb(233, 161, 29);
  border-radius: 5px;
  font-size: 16px;
}

.staff-section .textbox-client{
  right: 0;
}

#clientName{
  margin-left: 42px;
}
.textboxpayment {
  flex: 0; /* Allow the textbox to fill available space */
  padding: 5px;
  border: 1px solid rgb(233, 161, 29);
  border-radius: 5px;
  font-size: 16px;
  margin-left: 40px;
}
.textbox-staff {
  flex: 0; /* Allow the textbox to fill available space */
  padding: 5px;
  border: 1px solid rgb(233, 161, 29);
  border-radius: 5px;
  font-size: 16px;
  margin-left: 55px;
  width: 1000px;
  right: 0;
}


.productcontainer {
  width: 100%;
  border: 1px solid rgb(233, 161, 29);
  border-radius: 10px;
  margin-top: 10px;
  font-weight: bold;
  color: #474343;
}

.producttotalcontainer {
  width: 100%;
  border: 1px solid rgb(233, 161, 29);
  border-radius: 10px;
  margin-top: 0;
  font-weight: bold;
  color: #474343;
}

.product-line {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
  align-items: center;
  padding: 5px;
}

.product-col {
  padding: 5px;
}

.quantity-input {
  width: 50px;
  text-align: left;
  border: none; /* Removes the border */
  padding: 7px;
  font-size: 14px;
}

.staff-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 3px;
}

.payment-method {
  display: flex;
  align-items: start; /* Align items vertically center */
  gap: 10px; /* Space between select and input */
}

.paymentinputcontainer {
  display: flex;
  align-items: center; /* Center align input and select */
}

.textbox {
  flex: 1; /* Allow textbox to fill available space */
  margin-right: 10px; /* Add some space between select and input */
}

#clientPayment {
  width: 150px; /* Set a fixed width for the amount input */
}

.changecontainer {
  display: flex; /* Use flexbox for layout */
  align-items: center; /* Vertically center the items */
  border: 1px solid rgb(233, 161, 29); /* Add border */
  border-radius: 10px; /* Optional: rounded corners */
  padding: 7px; /* Optional: padding for aesthetics */
  width: 92%;
}

.change-container label {
  flex: 1; /* Allow label to take available space */
  margin-right: 10px; /* Space between label and amount */
  font-weight: bold; /* Make label bold for emphasis */
}

.change-amount {
  font-weight: bold; /* Make change amount bold */
  margin-left: auto; /* Align to the right of the container */
}

.submitcontainer {
  display: flex;
  justify-content: space-between;
  width: 85%;
  margin-top: 13px;
  gap: 50%;
}

.submit-button {
  background-color: #ff914d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 30px;
  font-size: 14px;
  cursor: pointer;
}
</style>
