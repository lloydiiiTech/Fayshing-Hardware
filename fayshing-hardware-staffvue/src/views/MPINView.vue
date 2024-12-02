<template>
  <div class="mpin">
    <div class="top-half">
      <img src="../assets/logo_white.png" alt="logo Image" class="logo" />
      <div class="user-dropdown-container">
        <select v-model="selectedUser" class="dropdown">
          <option v-for="email in staffEmails" :key="email" :value="email">
            {{ email }}
          </option>
        </select>
      </div>
      <div class="mpin-circles">
        <div 
          v-for="i in 6" 
          :key="i" 
          class="circle" 
          :class="{ filled: i <= mpin.length }">
        </div>
      </div>
      <p class="note">Enter your MPIN provided by Admin</p>
    </div>
    <div class="bottom-half">
      <div class="number-pad">
        <button 
          v-for="number in numbers.slice(0, 9)" 
          :key="number" 
          @click="appendNumber(number)">
          {{ number }}
        </button>
        <button class="forgot-password" @click="goToForgotPassword">
          Forgot MPIN
        </button>
        <button class="zero-button" @click="appendNumber(0)">0</button>
        <button 
          v-if="mpin.length > 0" 
          class="delete-icon" 
          @click="deleteLastNumber">
          🠔
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedUser: '', // Stores the currently selected email
      staffEmails: [], // To store the fetched emails
      mpin: '', // To track MPIN input
      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], // Number pad values
    };
  },
  created() {
    this.fetchStaffEmails(); 
    const session = sessionStorage.getItem('staffSession');
    if (session) {
      this.$router.push('/customername'); // Redirect to login page
    }
  },
  methods: {
    async fetchStaffEmails() {
      try {
        const response = await fetch('http://localhost:2313/staff/emails'); // Fetch staff emails
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Parse the response JSON
        console.log('Raw email data:', data); // Debugging: Log the raw response
        // Extract only email values from the response
        this.staffEmails = data.map(item => item.staffEmail || item.email);
        console.log('Extracted emails:', this.staffEmails); // Debugging: Log the extracted emails
      } catch (error) {
        console.error('Error fetching staff emails:', error); // Log any errors
      }
    },
    
  
  appendNumber(number) {
    if (this.mpin.length < 6) {
      this.mpin += number;
      if (this.mpin.length === 6) {
        this.validateLogin(); // Call login validation method
      }
    }
  },
  deleteLastNumber() {
    this.mpin = this.mpin.slice(0, -1); // Remove the last number from the MPIN
  },
  async validateLogin() {
  if (!this.selectedUser) {
    alert('Please select a user email');
    return;
  }

  try {
    const response = await fetch('http://localhost:2313/staff/validate-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.selectedUser,
        mpin: this.mpin,
      }),
    });

    const result = await response.json();
    if (response.ok && result.success) {
      // Store session data
      sessionStorage.setItem('staffSession', JSON.stringify(result.data)); // Assuming `result.data` contains the staff information

      this.$router.push('/customername'); // Navigate to the home page
    } else {
      alert(result.message || 'Login failed');
      this.mpin = ''; // Clear MPIN field
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred. Please try again.');
  }
},

  goToForgotPassword() {
    this.$router.push('/forgot-MPIN'); // Navigate to the forgot MPIN page
  },
  
},

};
</script>


<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden; 
}

.mpin {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.top-half {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: url('../assets/bg.png') no-repeat center;
  background-size: cover;
  position: relative;
  padding: 20px 0;
}

.logo {
  width: 60%;
  margin-bottom: 10px;
  margin-top: 50px;
}

.user-dropdown-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.dropdown {
  border: 2px solid white;
  border-radius: 20px;
  background-color: #ff914d;
  color: white;
  padding: 2px 10px;
  width: 250px;
  font-size: 16px;
  font-weight: 800;
}

.mpin-circles {
  display: flex;
  gap: 30px;
  margin-top: 15px;
}

.circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgb(245, 241, 241);
  background-color: transparent;
}

.filled {
  background-color: rgb(252, 252, 252);
}

.note {
  margin-top: auto;
  text-align: center;
  font-size: 75%;
  font-weight: 700;
  color: azure;
  padding: 10px;  
}

.bottom-half {
  flex: 1;
  background-color: white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -30px;
  position: relative;
  padding-top: 20px;
}

.number-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  justify-items: center;
  align-items: center;
}

button {
  width: 60px;
  height: 60px;
  font-size: 28px;
  background: none;
  border: none;
  cursor: pointer; 
  color: #f38925; 
  font-weight: 900;
}

button:hover {
  background-color: lightgray;
}

.zero-button {
  grid-column: 2;
  width: 60px;
  height: 60px;
  color: #f38925;
  font-size: 28px;
  font-weight: 900;
}

.delete-icon {
  grid-column: 3;
  width: 60px;
  height: 60px;
  color: #f38925;
  font-size: 28px;
  font-weight: 900;
  background: none;
  border: none;
  cursor: pointer;
}

.forgot-password {
  grid-column: 1;
  justify-self: start;
  font-size: 12px;
  font-weight: bold;
  color: #f38925;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  align-self: center;
  margin-left: 0px; /* Adjust alignment next to "0" */
}
</style>
