<template>
  <div>
    <header class="header">
      <div class="logo">
        <img src="@/assets/logo_white.png" alt="Logo" />
      </div>
      <nav class="nav" id="nav">
        <ul>
          <li>
            <router-link to="/home" exact-active-class="active-link">Home</router-link>
          </li>
          <li>
            <a href="javascript:void(0);" @click="toggleDropdown('products')">Products</a>
            <div v-show="dropdowns.products" class="dropdown-menu">
              <router-link to="/products" exact-active-class="active-link" @click="closeDropdown('products')">View Products</router-link>
              <router-link to="/addProducts" exact-active-class="active-link" @click="closeDropdown('products')">Add Products</router-link>
            </div>
          </li>
          <li>
            <a href="javascript:void(0);" @click="toggleDropdown('reports')">Reports</a>
            <div v-show="dropdowns.reports" class="dropdown-menu">
              <router-link to="/inventory" exact-active-class="active-link" @click="closeDropdown('reports')">Inventory</router-link>
              <router-link to="/sales" exact-active-class="active-link" @click="closeDropdown('reports')">Sales Report</router-link>
            </div>
          </li>
          <li>
            <a href="javascript:void(0);" @click="toggleDropdown('users')">User</a>
            <div v-show="dropdowns.users" class="dropdown-menu">
              <router-link to="/users" exact-active-class="active-link" @click="closeDropdown('users')">Users</router-link>
              <router-link to="/addUsers" exact-active-class="active-link" @click="closeDropdown('users')">Add Users</router-link>
            </div>
          </li>
        </ul>
      </nav>
      <div class="profile">
        <router-link to="/adminProfile" style="display: block; width: 50px; height: 50px; border-radius: 50%; overflow: hidden; position: relative; margin: 10px;">
          <img src="@/assets/profile.png" alt="Profile Picture" style="width: 100%; height: 100%; object-fit: cover;">
        </router-link>
        <div v-show="showProfileDropdown" class="dropdown" style="position: absolute; top: 65px; right: 0; background-color: white; border-radius: 15px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); z-index: 100; border: 2px solid rgb(221, 141, 37)">
          <a href="/" @click="logout" style="display: block; font-weight: 900; padding: 10px; text-decoration: none; color: #e9a956; -webkit-text-stroke: 1px rgb(156, 63, 1);">Logout</a>
        </div>
      </div>
      <div class="hamburger" @click="toggleMenu">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </header>

    <div style="text-align: left; margin: 20px;">
      <h2>{{ $route.meta.msg }}</h2>
      <router-view /> <!-- This is where child components will be rendered -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showProfileDropdown: false,
      dropdowns: {
        products: false,
        reports: false,
        users: false,
      },
    };
  },
  methods: {
    toggleMenu() {
      const nav = document.getElementById('nav');
      nav.classList.toggle('show');
    },
    toggleDropdown(dropdown) {
      this.dropdowns[dropdown] = !this.dropdowns[dropdown];
      for (const key in this.dropdowns) {
        if (key !== dropdown) {
          this.dropdowns[key] = false;
        }
      }
    },
    closeDropdown(dropdown) {
      this.dropdowns[dropdown] = false; // Close the specific dropdown
    },
    logout() {
      alert('You have logged out.');
      // Add actual logout logic here, if needed
    }
  },
  mounted() {
    const profile = this.$el.querySelector('.profile a');
    profile.addEventListener('mouseover', () => {
      this.showProfileDropdown = true;
    });

    profile.parentElement.addEventListener('mouseleave', () => {
      this.showProfileDropdown = false;
    });
  }
};
</script>

<style scoped>
/* Existing styles... */

.active-link {
  font-weight: bold; /* Make active link bold */
  color: #ee762c; /* Change color for active link */
}

/* Add your existing styles below... */
</style>

  
  <style scoped>
  #app {
    margin: 0;
    font-family: Arial, sans-serif;
    overflow-x: hidden;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ff914c;
    padding: 10px 20px;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    position: relative;
  }
  
  h2 {
    color: #ff914d;
    font-size: 45px;
    margin-left: 120px;
    margin-top: 50px;
    font-weight: 700;
  }
  
  .logo img {
    height: 50px;
    max-width: 25%;
    height: auto;
    margin-left: 110px;
  }
  
  .nav {
    display: none; 
  }
  
  .nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
  }
  
  .nav li {
    margin: 0 30px;
    position: relative;
  }
  
  .nav a {
    text-decoration: none;
    color: white;
    font-weight: bold;
    font-size: 23px;
  }
  
  .dropdown-menu {
    display: block; 
    position: absolute;
    top: 40px;
    left: 0;
    background-color: white;
    border-radius: 10px;
    border: 3px solid #ee762c;
    box-shadow: 0 4px 8px rgba(250, 139, 13, 0.308);
    padding: 3px;
    text-align: center;
    z-index: 1;
    width: 200px;
  }
  
  .dropdown-menu a {
    text-decoration: none;
    display: block;
    color: #eea273;
    -webkit-text-stroke: 1px rgb(156, 63, 1);
    padding: 5px 5px;
    font-weight: 900;
    font-size: 20px;
  }
  
  .dropdown-menu a:hover {
    background-color: #ff914c;
    color: white;
    border-radius: 10px;
  }
  
  .hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
  }
  
  .bar {
    height: 4px;
    width: 30px;
    background-color: white;
    margin: 4px 0;
    transition: 0.4s;
  }
  
  .profile {
    display: flex;
    justify-content: flex-end;
    position: relative;
    margin-right: 90px;
  }
  
  @media (max-width: 768px) {
    .nav {
      flex-direction: column;
      position: absolute;
      right: 0;
      top: 95px;
      background-color: #ff914c;
      width: 30%;
      z-index: 1000;
      text-align: center;
      border-radius: 20px;
    }
  
    .nav ul {
      display: block;
      padding: 2;
      margin: 0;
    }
  
    .nav li {
      margin: 3px 0;
    }
  
    .nav a {
      font-size: 16px;
    }
  
    .hamburger {
      display: flex;
    }
  
    .show {
      display: flex; 
    }
  
    .logo img {
      margin-left: 10px;
      max-width: 70%;
    }
  
    h2 {
      font-size: 24px; 
      margin-left: 0px;  
      margin-top: 0px;
      font-weight: 700;
    } 
  
    .profile {
      margin-right: 10px;
    }
  }
  
  @media (min-width: 769px) {
    .nav {
      display: flex;
      margin-left: auto;
    }
  }
  </style>
  