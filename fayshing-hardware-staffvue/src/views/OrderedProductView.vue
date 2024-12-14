<template>
    <div class="background">
        <div class="container">
            <div class="row logo">
                <img :src="require('@/assets/logo_orange.png')" alt="Logo">
            </div>
            <div class="row title">
                <h1>Ordered Products</h1>
            </div>
            <div class="row">
                <label for="">Costumer Information</label>
                <input 
                    type="text" 
                    class="textbox" 
                    placeholder="Name of Client" 
                    v-model="customername" 
                    readonly
                >
                <input 
                    type="text" 
                    class="textbox" 
                    placeholder="Contact Number" 
                    v-model="customercontact_number" 
                    readonly
                >
            </div>
            <div v-if="cartWarning" class="warning-message">
    {{ cartWarning }}
</div>

            <div class="product-container">
                <!-- Loop through products fetched from the API -->
                <div class="product-row" v-for="(product, index) in products" :key="product.product_code">
                    <div class="product-col col1">
                        <div class="product-name">{{ product.product_name }}</div>
                        <div class="product-size">-{{ product.category1 }}</div>
                        <div class="product-size">-{{ product.category2 }}</div>
                    </div>
                    <div class="product-col col2">{{ product.product_price }}</div>
                    <div class="product-col col3">
    <button class="arrow-button arrow-up" @click="increaseQuantity(product)">▲</button>
    <div class="quantitycontainer">
        <input 
            type="text" 
            class="quantity-input" 
            v-model="product.quantity" 
            readonly
        >
    
        <p v-if="product.quantity >= product.stock" class="stock-warning">
        </p>
    </div>
    <button class="arrow-button arrow-down" @click="decreaseQuantity(product)">▼</button>

</div>

                    
                    <div class="product-col col4">{{ product.quantity * product.product_price }}</div>
                    <div class="product-col col5">
                        <button @click="deleteProduct(index)" class="delete-icon">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="icon"
  >
    <path d="M9 3v1H4v2h16V4h-5V3H9zm11 5H4v13c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V8zM8 10h2v9H8v-9zm6 0h2v9h-2v-9z" />
  </svg>
</button>
                    </div>
                </div>
            </div>

            <div class="foot">
                <div class="submit-container">
                    <button class="combined-button" @click="goToHome">
                        <span class="scan-text">Scan Again</span>
                    </button>
                    <button class="combined-button" @click="ManualEncoding">
                        <span class="scan-text">Manual Encoding</span>
                    </button>
                </div>

            <!-- Total Price Section -->
                <div class="total-section">
                    <label for="totalPrice">Total Price</label>
                    <input type="text" id="totalPrice" class="textbox" v-model="totalPrice" readonly>
                </div>

            <!-- Submit Button -->
                <div class="submit-container">
                    <button class="submit-button" style="background-color: #df2828;" @click="showCancelConfirmation">
                        Cancel Order
                    </button>
                    <button class="submit-button" @click="submitOrder">SUBMIT</button>
                </div>
                <div v-if="showModal" class="modal-overlay">
                    <div class="modal">
                        <h3>Confirm Cancellation</h3>
                        <p>Are you sure you want to cancel the order?</p>
                        <div class="modal-buttons">
                            <button class="confirm-button" @click="cancelOrder">Yes, Cancel</button>
                            <button class="cancel-button" @click="hideCancelConfirmation">No, Go Back</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            products: [], // To store the fetched product data
            customername: '', // Initialize customer name
            customercontact_number: '',
            showModal: false, 
            cartWarning: '',
        };
    },
    computed: {
        // Calculate the total price of all products in the cart
        totalPrice() {
            return this.products.reduce((total, product) => {
                return total + (product.product_price * product.quantity);
            }, 0);
        },
    },
    methods: {
        
        // Fetch the cart data from the backend when the component is mounted
        async fetchCartData() {
            try {
                const session = JSON.parse(sessionStorage.getItem('staffSession'));

        if (!session?.id) {
            console.error("Staff ID is not available in the session.");
            return;
        }

            
        

        // Fetch cart data
        const cartResponse = await fetch('http://localhost:2313/staff/cart', {
            method: 'POST', // Use POST to send the staff_id
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ staff_id: session.id }), // Send staff_id in the request body
        });

        const cartData = await cartResponse.json();
        if (cartData.products) {
            this.products = cartData.products.map(product => {
                if (product.quantity > product.stock) {
                    product.quantity = product.stock; // Adjust quantity to match stock
                }
                return product;
            });
        } else {
            console.error('No products found in cart');
        }

        const customerResponse = await fetch('http://localhost:2313/staff/costumer', {
            method: 'PUT', // Use POST to send the staff_id
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ staff_id: session.id }), // Send staff_id in the request body
        });
        // Fetch customer data (unchanged)
        const customerData = await customerResponse.json();

        if (customerData.costumer && customerData.costumer.length > 0) {
            const customer = customerData.costumer[0];
            this.customername = "Name:    " + customer.name || 'Unknown';
            this.customercontact_number = "Number: " + customer.contact_number || 'N/A';
        } else {
            console.warn('Customer data not found or invalid format');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
},

        // Method to increase the quantity of a product
        increaseQuantity(product) {
        if (product.quantity < product.stock) {
            product.quantity++;
        } 
    },

    // Method to decrease the quantity of a product (ensure quantity is at least 1)
    decreaseQuantity(product) {
        if (product.quantity > 1) {
            product.quantity--;
        }
    },
        // Method to delete a product from the cart (just removes it from the array for now)
        deleteProduct(index) {
    const product = this.products[index];

    if (!product || !product.product_code) {
        console.warn('Invalid product data for deletion');
        return;
    }

    // Confirm deletion with the user
    const confirmDelete = confirm(`Are you sure you want to remove ${product.product_name} to cart?`);
    if (!confirmDelete) return;

    // Send a DELETE request to the backend
    fetch(`http://localhost:2313/staff/cart/${product.id}`, {
        method: 'GET',
    })
        .then(async (response) => {
            const result = await response.json();

            if (response.ok) {
                // Remove the product from the UI
                this.products.splice(index, 1);
            } else {
                console.error('Error:', result.message);
            }
        })
        .catch((error) => {
            console.error('Error deleting product:', error);
        });
        },

        showCancelConfirmation() {
            this.showModal = true;
        },
        // Hide the confirmation modal
        hideCancelConfirmation() {
            this.showModal = false;
        },
        // Cancel the order
        async cancelOrder() {
            try {
                const session = JSON.parse(sessionStorage.getItem('staffSession'));
                if (!session?.id) {
                    console.error("Staff ID is not available in the session.");
                    return;
                }

                // Send the cancellation request to the backend
                const response = await fetch('http://localhost:2313/staff/cancel-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ staff_id: session.id }),
                });

                const result = await response.json();

                if (response.ok) {
                    this.$router.push('/home');
                } else {
                    console.error('Error:', result.message);
                }
            } catch (error) {
                console.error('Error cancelling order:', error);
                alert('An error occurred while cancelling the order.');
            } finally {
                this.showModal = false;
            }
        },

        submitOrder() {
            const cartData = this.products.map(product => ({
                product_code: product.product_detail_id,
                quantity: product.quantity
            }));

            if (cartData.length === 0 || cartData.every(item => item.quantity === 0)) {
                this.cartWarning = 'Please add items to your cart before proceeding to payment.';
                return; // Stop execution
            }
            console.log('Submitting cart data:', cartData); // Log cart data

            fetch('http://localhost:2313/staff/cart/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cart: cartData }),
            })
                .then(async (response) => {
                    const result = await response.json();
                    console.log('Server response:', response.status, result); // Log server response

                    if (response.ok) {
                        this.$router.push('/payment');
                    } else {
                        alert(result.message || 'Failed to update cart');
                    }
                })
                .catch((error) => {
                    console.error('Error updating cart:', error); // Log the error
                    alert('An error occurred while submitting the order.');
                });
        },
        // Navigate back to home page
        goToHome() {
            this.$router.push('/home');
        },
        ManualEncoding() {
            this.$router.push('/manual-encoding');
        },
    },
    // Fetch the cart data when the component is mounted
    mounted() {
        const session = sessionStorage.getItem('staffSession');
        if (!session) {
            this.$router.push('/login'); // Redirect to login page if session is missing
            return;
        }
    
        
    
        this.fetchCartData();
    }
};
</script>

<style>
.delete-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon .icon {
  width: 24px;
  height: 24px;
  color: #d9534f; /* Default color */
  transition: color 0.3s;
}

.delete-icon:hover .icon {
  color: #c9302c; /* Hover color */
}

.delete-icon:active .icon {
  color: #ac2925; /* Active color */
}

.warning-message {
    color: red;
    font-weight: bold;
    margin-top: 10px;
}

html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
}

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
}

.modal {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 300px;
    
}

.modal-buttons {
    display: flex;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.confirm-button,
.cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    width: 40%;
    padding: 1px;
    margin: 10px;
    height: 50px;

}

.confirm-button {
    background-color: #df2828;
    color: #fff;
}

.cancel-button {
    background-color: #ccc;
    color: #000;
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
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    background-color: white;
    border: 2px solid rgb(233, 161, 29);
    border-radius: 20px;
    box-sizing: border-box;
    padding: 15px 50px;
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
    font-size: 24px;
    margin-top: -20px;
}

.textbox {
    width: 100%;
    padding: 5px;
    border: 1px solid rgb(233, 161, 29);
    border-radius: 5px;
    font-size: 16px;
}

.product-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
    max-height: 40vh; /* Set a maximum height based on viewport */
    overflow-y: auto; /* Add vertical scrolling */
}

.product-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr; /* Columns for product layout */
    align-items: center;
    background-color: #f9f9f9; /* Light background for products */
    padding: 0px 5px;
    border: 1px solid rgb(233, 161, 29);
    border-radius: 10px;
    font-weight: bold;
    color: #474343;
    margin-top: 10px;
}

.product-col {
    padding: 1px;
}

.col1 {
    display: flex;
    flex-direction: column; /* Stack product name and size vertically */
    width: 80px;
}

.product-name {
    font-weight: bold;
}

.product-size {
    font-size: 12px;
    color: #555;
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
    width: 70px !important; /* Increased width for buttons */
    height: 10px !important;
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
.delete-icon {
    cursor: pointer;
    border: none;
    background: none;
    color: rgb(233, 161, 29);
    font-size: 20px;
}

.total-section {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Space between label and input */
    width: 100%; /* Full width */
    margin-top: 40px; /* Space above total section */
}

.total-section label {
    font-weight: bold; /* Bold label text */
}

.total-section .textbox {
    padding: 8px;
    border: 1px solid rgb(233, 161, 29); /* Orange border */
    border-radius: 5px;
    width: 100%; /* Takes up remaining space */
    max-width: 200px; /* Limits input width */
    height: 25px;
    box-sizing: border-box;
}

.submit-container {
    display: flex;
    justify-content: flex-end; /* Aligns the button to the right */
    width: 100%; /* Ensures the container takes full width of its parent */
    margin-top: 10px; /* Adds space above the button */
    margin-left:150px;
}

.submit-button {
    background-color: #ff914d;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 30px;
    font-size: 14px;
    cursor: pointer;
    width: auto; /* Adjusts width to fit content */
}

.submit-button:hover {
    background-color: rgb(241, 180, 12);
}

.combined-button {
    border: 1px solid #ff914d; /* 2px solid border with specified color */
    border-radius: 20px; /* Rounded corners */
    padding: 5px 40px; /* Padding for vertical and horizontal spacing */
    background-color: white; /* Optional: background color */
    color: #ff914d; /* Text color */
    font-weight: bold; /* Bold text */
    cursor: pointer; /* Pointer cursor on hover */
    text-align: center; /* Centered text */
    width: 49%; /* Full width */
    font-size: 14px;
    padding: 0px;
}


.combined-button:hover {
    background-color: #ff914d; /* Change background on hover */
    color: white; /* Change text color on hover */
}
.foot {
  position: fixed;
  bottom: 0px;
  width: 80%;
  padding: 20px 0px; /* Adjust for spacing */
  justify-content: center;
  align-items: center;
}
</style>
