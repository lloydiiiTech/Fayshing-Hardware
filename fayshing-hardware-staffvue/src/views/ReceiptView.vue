<template>
  <div class="background">
    <div class="container">
      <!-- Logo and Title -->
      <div class="row logo">
        <img src="../assets/logo_orange.png" alt="Logo">
      </div>
      <div class="info">
        <p1>Lumang Bayan, Calapan City</p1>
        <p1>Luis S. Lin</p1>
        <p1>0905-573-1397</p1>
      </div>
      <div class="row title">
        <h1>Receipt</h1>
      </div>

      <!-- Client Name -->
      <div class="row">
        <p>{{ clientName }}</p>
     
      </div>


      <!-- Staff Name and Purchase Details -->
      <div class="staff-purchase-row"><hr>
        <div class="staff-row">
          <p class="staff-label">Staff</p>
          <p class="staff-name">{{ staffName }}</p>
        </div>
        <div class="details-row">
          <div class="details-left">{{ purchaseType }}</div>
          <div class="details-center">{{ formattedDate }}</div>
          <div class="details-right">{{ formattedTime }}</div>
        </div>
        <hr>
      </div>

   

      <!-- Product List Container -->
      <div class="product-container">
        <div class="product-line" v-for="(product, index) in products" :key="index">
          <div class="product-col col1">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-size">{{ product.size }} mm</div>
          </div>
          <div class="product-col col2">{{ product.price.toFixed(2) }}</div>
          <div class="product-col col3">
            <div class="quantity-container">
              <input type="text" class="quantity-input" v-model="product.quantity" readonly />
            </div>
          </div>
          <div class="product-col col4">{{ (product.quantity * product.price).toFixed(2) }}</div>
        </div>
        <hr style="margin-top: -6px;">
      </div>

     
      <!-- Overall Totals -->
      <div class="product-totalcontainer">   
        <div class="product-line">
          <div class="product-col col1">
            <div class="item-count">Item {{ totalItems }} </div>
            <div class="qty-label">Qty {{ totalQuantity }}</div>
          </div>
          <div class="product-col col22">
            <div class="total-label">Total</div>
            <div class="payment-method">Gcash </div>
            <div class="change-label">Change </div>
          </div>
          <div class="product-col col33">
            <div class="overall-total">{{ totalPrice.toFixed(2) }}</div>
            <div class="amount-paid">{{ amountPaid.toFixed(2) }}</div>
            <div class="total-change">{{ changeAmount }}</div>
          </div>
        </div>
        <hr style="margin-top: -6px;">
      </div>


      <div class="details-row">
          <div class="details-center">{{ formattedDate }}</div>
          <div class="details-right">{{ formattedTime }}</div>
        </div>
     

      <!-- Submit Button -->
      <div class="submit-container">
  <button class="submit-button left-button" @click="downloadReceipt">Download</button>
  <button class="submit-button right-button" @click="submitOrder">Done</button>
</div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clientName: 'Paul Janssen Martinez', // Example client name
      staffName: 'Dan Lloyd Clanor', // Example staff name
      purchaseType: 'Walk In', // Example purchase type
      dateTime: new Date(), // Current date and time
      products: [
        { name: 'Product 1', price: 100, quantity: 1, size: 50 },
        { name: 'Product 2', price: 150, quantity: 5, size: 100 },
      ],
      amountPaid: 1000, // Example amount paid
    };
  },
  computed: {
    formattedDate() {
      return this.dateTime.toLocaleDateString(); // Format the date
    },
    formattedTime() {
      return this.dateTime.toLocaleTimeString(); // Format the time
    },
    totalPrice() {
      return this.products.reduce((total, product) => total + (product.price * product.quantity), 0);
    },
    totalItems() {
      return this.products.length;
    },
    totalQuantity() {
      return this.products.reduce((total, product) => total + product.quantity, 0);
    },
    changeAmount() {
      const change = (this.amountPaid - this.totalPrice).toFixed(2);
      return change >= 0 ? change : "0.00";
    },
  },
  methods: {
    submitOrder() {
      this.$router.push('/home'); // Navigate back to home
    },
    downloadReceipt() {
      // Logic for downloading receipt goes here
      console.log('Downloading receipt...');
    },
  }
};
</script>

<style>
.info {
  display: flex; /* Use flexbox for alignment */
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically if there's extra space */
  text-align: center; /* Center the text */
  font-size: 9px; /* Set font size to 9 */
  font-weight: 800; /* Set font weight to 800 */
  margin: 0 auto; /* Center the container itself if it's a block element */
  margin-top: -30px;
  margin-bottom: 5px;
}
.p1 {
  margin-top: -8px;
}
.staff-name {
  margin-right: 0;
}
.details-row {
  display: flex;
  justify-content: space-between; /* Aligns items within the row */
  width: 270px; /* Ensure the row takes full width */
  
}
.details-left,
.details-center,
.details-right {
  flex: 1; /* Allow each section to grow equally */
  text-align: center; /* Center align text in each section */
}
.details-left {
  text-align: left; /* Align left section to the left */
}
.details-center {
  text-align: center; /* Center the center section */
}
.details-right {
  text-align: right; /* Align right section to the right */
}
.product-totalcontainer {
  width: 100%;
  font-weight: bold;
  color: #474343;
}
.product-line {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr; /* Define three columns */
  padding: 5px;
}
.product-col {
  padding: 5px;
}
.item-count, 
.qty-label,
.total-label, 
.payment-method, 
.change-label,
.overall-total, 
.amount-paid, 
.total-change {
  margin: 5px 0; /* Add space between lines */
  text-align: center; /* Center align all text in the column */
}
.product-container {
  width: 100%;
  font-weight: bold;
  color: #474343;
  border: none; /* Remove any border if previously defined */
  margin-top: -20px;
}
.product-totalcontainer {
  width: 100%;
  margin-top: -30px;
  font-weight: bold;
  color: #474343;
  border: none; /* Remove any border if previously defined */
  gap: 40px;
}
.product-line {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
  align-items: center;
  padding: 5px;
  border-bottom: none; /* Remove border between product lines */
}
.product-col {
  padding: 5px;
  border: none; /* Ensure no border for columns */
}
.staff-purchase-row {
  margin-top: -35px;
}
.staff-row {
  display: flex;
  justify-content: space-between; /* Aligns staff and name */
  margin-top: -18px;
}
.details-row {
  display: flex;
  justify-content: space-between; /* Aligns purchase type, date, and time */
  margin-top: -15px;
}
.col22,.col33{
  margin-left: 20px;
}

hr {
  border: none; /* Remove any default styling */
  height: 2px; /* Set the height of the line */
  background-color: orange; /* Set the background color to orange */
  margin: 10px 0; /* Adjust spacing for the divider line */
}

/* Remove background for inputs and buttons */
.textbox, 
.textbox-payment, 
.submit-button {
  background: transparent; /* No background */
  border: none; /* No border */
  outline: none; /* Remove outline on focus */
  padding: 5px; /* Add padding for better appearance */
  font-size: 1em; /* Ensure consistent font size */
}

.submit-container {
  display: flex;
  justify-content: space-between; /* Distribute buttons to left and right */
  width: 100%; /* Ensure the container takes the full width */
  margin-top: 20px; /* Add some space above the container */
  margin-left: 0;
}

.submit-button {
  cursor: pointer; /* Pointer cursor for buttons */
  color: #fff; /* White text */
  background-color: #ff8c00; /* Example button color */
  padding: 10px 15px; /* Add padding */
  border-radius: 5px; /* Rounded corners */
  transition: background-color 0.3s; /* Smooth transition */
}

.submit-button:hover {
  background-color: #e07d00; /* Darker shade on hover */
}

</style>
