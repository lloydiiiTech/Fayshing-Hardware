<template>
  <div class="background">
    <div class="container">
      <!-- Logo and Title -->
      <div class="row logo">
        <img src="../assets/logo_orange.png" alt="Logo" />
      </div>
      <div class="info">
        <p>Lumang Bayan, Calapan City</p>
        <p>Luis S. Lin</p>
        <p>0905-573-1397</p>
      </div>
      <div class="row title">
        <h1>Receipt</h1>
      </div>


      <div class="details-row">
          <div class="details-center">{{ clientName }}</div>
          <div class="details-right">{{ customerContact }}</div>
        </div>

      <!-- Staff Name and Purchase Details -->
      <div class="staff-purchase-row">
        <hr />
        <div class="staff-row">
          <p class="staff-label">Staff</p>
          <p class="staff-name">{{ staffName }}</p>
        </div>
        <div class="details-row">
          <div class="details-left">{{ purchaseType }}</div>
          <div class="details-center">{{ formattedDate }}</div>
          <div class="details-right">{{ formattedTime }}</div>
        </div>
        <hr />
      </div>

      <!-- Product List Container -->
      <div class="product-container">
        <div
          class="product-line"
          v-for="(product, index) in products"
          :key="index"
        >
          <div class="product-col col1">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-size">{{ product.size }}</div>
          </div>
          <div class="product-col col2">{{ product.price.toFixed(2) }}</div>
          <div class="product-col col3">{{ product.quantity }}</div>
          <div class="product-col col4">
            {{ (product.quantity * product.price).toFixed(2) }}
          </div>
        </div>
        <hr style="margin-top: -6px;" />
      </div>

      <!-- Overall Totals -->
      <div class="product-totalcontainer">
        <div class="product-line">
          <div class="product-col col1">
            <div class="item-count">Item: {{ totalItems }}</div>
            <div class="qty-label">Qty: {{ totalQuantity }}</div>
          </div>
          <div class="product-col col22">
            <div class="total-label">Total</div>
            <div class="payment-method">{{ paymentMethod }}</div>
            <div class="change-label">Change</div>
          </div>
          <div class="product-col col33">
            <div class="overall-total">{{ totalPrice.toFixed(2) }}</div>
            <div class="amount-paid">{{ amountPaid.toFixed(2) }}</div>
            <div class="total-change">{{ amountChange.toFixed(2) }}</div>
          </div>
        </div>
        <hr style="margin-top: -6px;" />
        
      </div>
      <div class="details-row">
          <div class="details-center">{{ formattedDate }}</div>
          <div class="details-right">{{ formattedTime }}</div>
        </div>

      <!-- Submit Buttons -->
      <div class="submit-container">
        <button class="submit-button left-button" @click="downloadReceipt">
          Download
        </button>
        <button class="submit-button right-button" @click="submitOrder">
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// Import html2canvas for capturing the HTML content
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      clientName: "",
      customerContact: "",
      staffName: "",
      purchaseType: "",
      paymentMethod: "",
      totalItems: 0,
      totalQuantity: 0,
      totalPrice: 0,
      amountPaid: 0,
      amountChange: 0,
      saleDate: "",
      products: [],
      salesId: sessionStorage.getItem('receiptSession'), // Fetch salesId from route
    };
  },
  mounted() {


    this.fetchSaleDetails();
  },
  methods: {
    async fetchSaleDetails() {
      try {
        const response = await fetch(
          `http://localhost:2313/staff/sales/${this.salesId}`
        );
        const result = await response.json();
        if (response.ok) {
          this.clientName = result.customerName;
          this.customerContact = result.customerContact;
          this.staffName = result.staffName;
          this.purchaseType = result.purchaseType;
          this.paymentMethod = result.paymentMethod;
          this.totalItems = result.totalItems;
          this.totalQuantity = result.totalQuantity;
          this.totalPrice = parseFloat(result.totalPrice);
          this.amountPaid = parseFloat(result.amountPaid);
          this.amountChange = parseFloat(result.amountChange);
          this.saleDate = result.saleDate;
          this.products = result.products.map((product) => ({
            name: product.productName,
            size: product.productOption.trim(),
            price: parseFloat(product.productPrice),
            quantity: product.quantity,
          }));
        } else {
          window.history.back();
        }
      } catch (error) {
        window.history.back();
      }
    },
    downloadReceipt() {
  const receiptElement = document.querySelector('.container'); // Make sure this is the correct selector
  const buttonContainer = document.querySelector('.submit-container'); // The container for the buttons
  
  if (receiptElement) {
    // Hide the buttons before capturing
    if (buttonContainer) {
      buttonContainer.style.display = 'none';
    }

    html2canvas(receiptElement)
      .then((canvas) => {
        // Convert the canvas to an image
        const img = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = img;
        link.download = 'receipt.png'; // Set the file name for download
        link.click(); // Trigger the download
      })
      .catch((error) => {
        console.error('Error while capturing receipt:', error);
      })
      .finally(() => {
        // Show the buttons again after capturing
        if (buttonContainer) {
          buttonContainer.style.display = 'flex';
        }
      });
  } else {
    console.error('Receipt element not found for capturing.');
  }
},

    submitOrder() {
      sessionStorage.removeItem('receiptSession');
      this.$router.push("/home"); // Redirect to home
    },
  },
  computed: {
    formattedDate() {
      return new Date(this.saleDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    formattedTime() {
      return new Date(this.saleDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>
<style>
.info {
  display: flex; /* Use flexbox for alignment */
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically if there's extra space */
  text-align: center; /* Center the text */
  font-size: 10px; /* Set font size to 9 */
  font-weight: 800; /* Set font weight to 800 */
  margin: 0 auto; /* Center the container itself if it's a block element */
  margin-top: -30px;
  margin-bottom: 15px;
}
.info p{
  padding: -5px;
  margin: 0;

}
.p1 {
  margin-top: 5px;
}
.staff-name {
  margin-right: 0;
}
.details-row {
  display: flex;
  justify-content: space-between; /* Aligns items within the row */
  width: 270px; /* Ensure the row takes full width */
  margin-bottom: 20px;
  margin-top: 10px

  
}
.details-left,
.details-center,
.details-right {
  flex: 1; /* Allow each section to grow equally */
}
.details-left {
  text-align: left; /* Align left section to the left */
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
  width: 100%;
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
  width: 100%;
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
