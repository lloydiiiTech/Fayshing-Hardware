
<template>
    <div>
      <!-- Staff Data Table -->
      <h1>Staff Data</h1>
      <div class="table-container">
        <input
          v-model="staffSearchQuery"
          type="text"
          placeholder="Search staff..."
          class="search-bar"
        />
        <table v-if="filteredStaffData.length">
          <thead>
            <tr>
              <th hidden>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Contact Number</th>
              <th>Created At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="staff in getStaffDataForPage()"
              :key="staff.id"
            >
              <td hidden>{{ staff.id }}</td>
              <td>{{ staff.staffuserName }}</td>
              <td>{{ staff.staffName }}</td>
              <td>{{ staff.staffEmail }}</td>
              <td>{{ staff.staffAddress }}</td>
              <td>{{ staff.contactNumber }}</td>
              <td>{{ formatDate(staff.created_at) }}</td>
              <td>
                <button @click="removeStaff(staff.id)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No staff data available</p>
  
        <!-- Pagination -->
        <div class="pagination">
          <button
            :disabled="staffCurrentPage === 1"
            @click="onStaffPageChanged(staffCurrentPage - 1)"
          >
            Previous
          </button>
          <span>Page {{ staffCurrentPage }} of {{ totalStaffPages }}</span>
          <button
            :disabled="staffCurrentPage === totalStaffPages"
            @click="onStaffPageChanged(staffCurrentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
  
      <!-- Admin Data Table -->
      <h1>Admin Data</h1>
      <div class="table-container">
        <input
          v-model="adminSearchQuery"
          type="text"
          placeholder="Search admin..."
          class="search-bar"
        />
        <table v-if="filteredAdminData.length">
          <thead>
            <tr>
              <th hidden>Admin ID</th>
              <th>Username</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Location</th>
              <th>Position</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="admin in getAdminDataForPage()"
              :key="admin.admin_id"
            >
              <td hidden>{{ admin.admin_id }}</td>
              <td>{{ admin.username }}</td>
              <td>{{ admin.contact }}</td>
              <td>{{ admin.email }}</td>
              <td>{{ admin.location }}</td>
              <td>{{ admin.position }}</td>
              <td>{{ formatDate(admin.created_at) }}</td>
              <td>{{ formatDate(admin.updated_at) }}</td>
              <td>
                <button @click="removeAdmin(admin.admin_id)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No admin data available</p>
  
        <!-- Pagination -->
        <div class="pagination">
          <button
            :disabled="adminCurrentPage === 1"
            @click="onAdminPageChanged(adminCurrentPage - 1)"
          >
            Previous
          </button>
          <span>Page {{ adminCurrentPage }} of {{ totalAdminPages }}</span>
          <button
            :disabled="adminCurrentPage === totalAdminPages"
            @click="onAdminPageChanged(adminCurrentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        staffData: [],
        adminData: [],
        staffSearchQuery: '',
        adminSearchQuery: '',
        staffCurrentPage: 1,
        adminCurrentPage: 1,
        staffItemsPerPage: 3,
        adminItemsPerPage: 3,
      };
    },
    methods: {
      removeStaff(staffId) {
        fetch(`http://localhost:2313/admin/remove/${staffId}`, {
          method: 'PUT',
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              this.staffData = this.staffData.filter((staff) => staff.id !== staffId);
              alert('Staff removed successfully');
            } else {
              alert('Failed to remove staff');
            }
          })
          .catch((error) => {
            console.error('Error removing staff:', error);
          });
      },
      removeAdmin(adminId) {
        fetch(`http://localhost:2313/admin/adminremove/${adminId}`, {
          method: 'PUT',
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              this.adminData = this.adminData.filter((admin) => admin.admin_id !== adminId);
              alert('Admin removed successfully');
            } else {
              alert(data.message || 'Failed to remove admin');
            }
          })
          .catch((error) => {
            console.error('Error removing admin:', error);
          });
      },
      fetchStaffData() {
        fetch('http://localhost:2313/admin/staff')
          .then((response) => response.json())
          .then((data) => {
            if (data.staffData) {
              this.staffData = data.staffData;
            }
          })
          .catch((error) => {
            console.error('Error fetching staff data:', error);
          });
      },
      fetchAdminData() {
        fetch('http://localhost:2313/admin/admin')
          .then((response) => response.json())
          .then((data) => {
            if (data.adminData) {
              this.adminData = data.adminData;
            }
          })
          .catch((error) => {
            console.error('Error fetching admin data:', error);
          });
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
      },
      getStaffDataForPage() {
        const startIndex = (this.staffCurrentPage - 1) * this.staffItemsPerPage;
        const endIndex = startIndex + this.staffItemsPerPage;
        return this.filteredStaffData.slice(startIndex, endIndex);
      },
      getAdminDataForPage() {
        const startIndex = (this.adminCurrentPage - 1) * this.adminItemsPerPage;
        const endIndex = startIndex + this.adminItemsPerPage;
        return this.filteredAdminData.slice(startIndex, endIndex);
      },
      onStaffPageChanged(page) {
        this.staffCurrentPage = page;
      },
      onAdminPageChanged(page) {
        this.adminCurrentPage = page;
      },
    },
    computed: {
      filteredStaffData() {
        return this.staffData.filter(
          (staff) =>
            staff.status !== 0 &&
            (staff.staffuserName.toLowerCase().includes(this.staffSearchQuery.toLowerCase()) ||
              staff.staffName.toLowerCase().includes(this.staffSearchQuery.toLowerCase()) ||
              staff.staffEmail.toLowerCase().includes(this.staffSearchQuery.toLowerCase()))
        );
      },
      filteredAdminData() {
        return this.adminData.filter(
          (admin) =>
            admin.position === 1 &&
            (admin.username.toLowerCase().includes(this.adminSearchQuery.toLowerCase()) ||
              admin.contact.toLowerCase().includes(this.adminSearchQuery.toLowerCase()) ||
              admin.email.toLowerCase().includes(this.adminSearchQuery.toLowerCase()))
        );
      },
      totalStaffPages() {
        return Math.ceil(this.filteredStaffData.length / this.staffItemsPerPage);
      },
      totalAdminPages() {
        return Math.ceil(this.filteredAdminData.length / this.adminItemsPerPage);
      },
    },
    mounted() {
      this.fetchStaffData();
      this.fetchAdminData();
    },
  };
  </script>
  

  
  <style scoped>
  table {
    width: 90%;
    margin-left: 5%;
    border-collapse: collapse;
  }
  
  th,
  td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  td {
    background-color: #fafafa;
  }
  
  .table-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Aligns search bar to the left */
    margin-bottom: 30px;
    margin-left: 100px;
  }
  
  .search-bar {
    width: 20%;
    padding: 8px 8px 8px 20px; /* Adds padding to the left inside the search bar */
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .pagination button {
    padding: 5px 10px;
    margin: 0 5px;
    border: 1px solid #ddd;
    cursor: pointer;
  }
  
  .pagination button:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
  
  .pagination button.active {
    background-color: #007bff;
    color: white;
  }
  </style>
