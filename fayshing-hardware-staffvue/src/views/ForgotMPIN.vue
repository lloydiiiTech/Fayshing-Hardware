<template>
  <div class="forgot-mpin">
    <div class="top-half">
      <img src="../assets/logo_white.png" alt="logo" class="logo" />
      <h2>Forgot MPIN</h2>
      <p>Enter your email address to reset your MPIN</p>
      
      <!-- User email dropdown -->
      <div class="user-dropdown-container">
        <select v-model="selectedUser" class="dropdown">
          <option v-for="email in staffEmails" :key="email" :value="email">
            {{ email }}
          </option>
        </select>
      </div>
      
      <div class="action-buttons">
        <button @click="requestReset" class="submit-btn">Submit</button>
      </div>
    </div>
    
    <!-- Bottom section with cancel button -->
    <div class="bottom-half">
      <button class="back-btn" @click="goBack">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedUser: '', // Stores the currently selected email
      staffEmails: [], // To store the fetched emails
    };
  },
  created() {
    this.fetchStaffEmails(); 
  },
  methods: {
    async fetchStaffEmails() {
      try {
        const response = await fetch('http://localhost:2313/staff/emails'); // Fetch staff emails
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Parse the response JSON
        this.staffEmails = data.map(item => item.staffEmail || item.email);
      } catch (error) {
        console.error('Error fetching staff emails:', error);
      }
    },
    async requestReset() {
      if (!this.selectedUser) {
        alert('Please select your email address');
        return;
      }

      try {
        const response = await fetch('http://localhost:2313/staff/forgot-mpin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.selectedUser,
          }),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          alert('OTP sent to your email');
        } else {
          alert(result.message || 'Error occurred');
        }
      } catch (error) {
        console.error('Error requesting MPIN reset:', error);
        alert('An error occurred. Please try again.');
      }
    },
    goBack() {
      this.$router.push('/'); // Navigate back to the login page
    },
  },
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'Arial', sans-serif;
  overflow: hidden;
}

.forgot-mpin {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-half {
  display: flex;
  flex-direction: column;
  background: url('../assets/bg.png') no-repeat center;
  background-size: cover;
  position: relative;
  padding: 50px 20px;
  text-align: center;
  color: white;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}

.logo {
  width: 60%;
  margin-bottom: 20px;
}

h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

p {
  font-size: 18px;
  margin-bottom: 25px;
}

.user-dropdown-container {
  width: 100%;
  max-width: 380px;
  margin-bottom: 30px;
}

.dropdown {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #fff;
  background-color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  color: #333;
  box-sizing: border-box;
  outline: none;
  transition: all 0.3s ease;
}

.dropdown:focus {
  border-color: #ff914d;
}

.submit-btn {
  width: 100%;
  max-width: 380px;
  padding: 14px;
  background-color: #ff914d;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #e6863d;
}

.bottom-half {
  flex: 0.2;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-top: 1px solid #f0f0f0;
}

.back-btn {
  background-color: transparent;
  color: #ff914d;
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
  border: none;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: #e6863d;
}
</style>
