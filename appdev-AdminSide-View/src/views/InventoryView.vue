<template>
    <div>
      <h1>Inventory Report</h1>
      
      <!-- Export Buttons -->
      <div>
        <button @click="exportPDF">Export as PDF</button>
        <button @click="exportCSV">Export as CSV</button>
      </div>
    
      <!-- Inventory Table -->
      <table v-if="inventory.length > 0">
        <thead>
          <tr>
            <th>Product Code</th>
            <th>Product Detail ID</th>
            <th>Quantity</th>
            <th>Changes Type</th>
            <th>Updated Stock</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedInventory" :key="item.product_code">
            <td>{{ item.product_code }}</td>
            <td>{{ item.product_detail_id }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.changes_type }}</td>
            <td>{{ item.updated_stock }}</td>
            <td>{{ formatDate(item.date) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>No inventory data available.</p>
  
      <!-- Pagination Controls -->
      <div>
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from "vue";
  import axios from "axios";
  import { jsPDF } from "jspdf";
  import Papa from "papaparse";
  
  export default {
    name: "InventoryReport",
    setup() {
      // Reactive state
      const inventory = ref([]);
      const currentPage = ref(1);
      const itemsPerPage = 5;
  
      // Fetch inventory data
      const fetchInventory = async () => {
        try {
          const response = await axios.get("http://localhost:2313/admin/inventory");
          inventory.value = response.data;
        } catch (error) {
          console.error("Error fetching inventory data:", error);
        }
      };
  
      // Utility: Format price
      const formatPrice = (price) => {
        return parseFloat(price).toFixed(2);
      };
  
      // Utility: Format date
      const formatDate = (date) => {
        return new Date(date).toLocaleString();
      };
  
      // Computed property to get the paginated inventory
      const paginatedInventory = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return inventory.value.slice(start, end);
      });
  
      // Total number of pages
      const totalPages = computed(() => {
        return Math.ceil(inventory.value.length / itemsPerPage);
      });
  
      // Navigate to the previous page
      const previousPage = () => {
        if (currentPage.value > 1) {
          currentPage.value--;
        }
      };
  
      // Navigate to the next page
      const nextPage = () => {
        if (currentPage.value < totalPages.value) {
          currentPage.value++;
        }
      };
  
      // Export inventory data to PDF
      const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
  
        // Add title
        doc.text("Inventory Report", 10, 10);
  
        // Prepare table data excluding Inventory ID
        const headers = [
          "Product Code",
          "Product Detail ID",
          "Quantity",
          "Changes Type",
          "Updated Stock",
          "Date",
        ];
  
        const data = inventory.value.map((item) => [
          item.product_code,
          item.product_detail_id,
          item.quantity,
          item.changes_type,
          item.updated_stock,
          formatDate(item.date),
        ]);
  
        // Create table in PDF
        doc.autoTable({
          head: [headers],
          body: data,
          startY: 20,
        });
  
        // Save PDF
        doc.save("inventory-report.pdf");
      };
  
      // Export inventory data to CSV
      const exportCSV = () => {
        const csvData = Papa.unparse(inventory.value.map((item) => ({
          'Product Code': item.product_code,
          'Product Detail ID': item.product_detail_id,
          'Quantity': item.quantity,
          'Changes Type': item.changes_type,
          'Updated Stock': item.updated_stock,
          'Date': formatDate(item.date),
        })));
  
        // Create CSV file and trigger download
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "inventory-report.csv");
          link.click();
        }
      };
  
      // Fetch data on component mount
      onMounted(() => {
        fetchInventory();
      });
  
      // Return state and methods to the template
      return {
        inventory,
        fetchInventory,
        formatPrice,
        formatDate,
        exportPDF,
        exportCSV,
        paginatedInventory,
        currentPage,
        totalPages,
        previousPage,
        nextPage,
      };
    },
    mounted() {
        sessionStorage.removeItem('productCode');
        sessionStorage.removeItem('productName');

    const session = sessionStorage.getItem('user_id');
    console.log(session);
    if (!session) {
      this.$router.push('/'); // Redirect to login page
    }
  
  }, 
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  th,
  td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
  button {
    margin-top: 10px;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    margin-right: 10px;
  }
  button:hover {
    background-color: #45a049;
  }
  </style>
  