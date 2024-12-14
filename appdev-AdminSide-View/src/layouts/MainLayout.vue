<template>
  <div class="app-container">
    <aside class="sidebar">
      <div class="logo">
        <img src="@/assets/logo_white.png" alt="Logo" />
      </div>

      <div class="profile">
        <router-link to="/adminProfile" class="profile-link">
          <img :src="profileImageUrl" alt="Profile Picture" />
        </router-link>
        <span class="profile-name">Profile</span>
      </div>

      <nav class="nav">
        <ul>
          <li>
            <router-link to="/home" exact-active-class="active-link">
              <i class="fas fa-home"></i> <span>Home</span>
            </router-link>
          </li>
          <li>
            <router-link to="/products" exact-active-class="active-link">
              <i class="fas fa-box"></i> <span>View Products</span>
            </router-link>
            <router-link to="/addProducts" exact-active-class="active-link">
              <i class="fas fa-plus-circle"></i> <span>Add Products</span>
            </router-link>
          </li>
          <li>
            <router-link to="/inventory" exact-active-class="active-link">
              <i class="fas fa-chart-line"></i> <span>Inventory</span>
            </router-link>
            <router-link to="/sales" exact-active-class="active-link">
              <i class="fas fa-file-invoice-dollar"></i> <span>Sales Report</span>
            </router-link>
          </li>
          <li>
            <router-link to="/users" exact-active-class="active-link">
              <i class="fas fa-users"></i> <span>Users</span>
            </router-link>
            <router-link to="/addUsers" exact-active-class="active-link">
              <i class="fas fa-user-plus"></i> <span>Add Users</span>
            </router-link>
            <router-link to="/addAdmin" exact-active-class="active-link">
              <i class="fas fa-user-plus"></i> <span>Add Admin</span>
            </router-link>
          </li>
          <li>
            <router-link to="/" @click="logout" exact-active-class="active-link">
              <i class="fas fa-sign-out-alt"></i> <span>Logout</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="content">
      <h2>{{ $route.meta.msg }}</h2>
      <router-view /> <!-- This is where child components will be rendered -->
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      profileImageUrl: require('@/assets/profile.png'), // Default profile image
    };
  },
  methods: {
    logout() {
      sessionStorage.clear();
      this.$router.push('/'); // Redirect to home after logout
    },
    async fetchAdminImage() {
      const adminId = sessionStorage.getItem('user_id');
      if (adminId) {
        try {
          const response = await axios.get(`http://localhost:2313/admin/adminpics/${adminId}/image`);
          this.profileImageUrl = response.data?.user_image
            ? `http://localhost:2313/${response.data.user_image}`
            : require('@/assets/profile.png'); // Fallback
        } catch (error) {
          console.error('Error fetching admin image:', error);
          this.profileImageUrl = require('@/assets/profile.png'); // Fallback in case of error
        }
      }
    },
  },
  mounted() {
    this.fetchAdminImage();
  },
};
</script>

<style scoped>
.app-container {
  display: flex;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #e64a19; /* Orange color */
  color: white;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  overflow-y: auto; /* Allow scrolling if content overflows */
}

.logo {
  text-align: center;
  margin-bottom: 20px;
}

.logo img {
  width: 100px;
  height: auto;
}

.profile {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-link {
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.profile-link img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.nav ul {
  list-style: none;
  padding: 0;
}

.nav li {
  margin: 15px 0;
}

.nav a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 18px;
  display: flex;
  align-items: center;
  transition: background 0.3s;
  padding: 10px; /* Added padding for better click area */
  border-radius: 5px; /* Rounded corners for links */
}

.nav a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav a i {
  margin-right: 10px;
}

.content {
  margin-left: 250px; /* Adjusted for fixed sidebar */
  padding: 20px;
  flex-grow: 1; /* Allow content to grow and fill available space */
}
</style>