<template>
    <div>
      <h1>Sales Report</h1>
  
      <!-- Download Buttons -->
      <div v-if="sales.length > 0">
        <button @click="downloadPDF">Download PDF</button>
        <button @click="downloadCSV">Download CSV</button>
      </div>
  
      <!-- Date Picker Section -->
      <div>
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" v-model="startDate" />
  
        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" v-model="endDate" />
  
        <button @click="fetchSalesReport">Generate Report</button>
      </div>
  
      <!-- Sales Report Table -->
      <table v-if="sales.length > 0">
        <thead>
          <tr>
            <th>Sale ID</th>
            <th>Customer Name</th>
            <th>Customer Contact</th>
            <th>Purchase Type</th>
            <th>Total Items</th>
            <th>Total Quantity</th>
            <th>Total Price</th>
            <th>Payment Method</th>
            <th>Amount Paid</th>
            <th>Amount Change</th>
            <th>Staff ID</th>
            <th>Staff Name</th>
            <th>Sale Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in paginatedSales" :key="sale.sale_id">
            <td>{{ sale.sale_id }}</td>
            <td>{{ sale.customer_name }}</td>
            <td>{{ sale.customer_contact }}</td>
            <td>{{ sale.purchase_type }}</td>
            <td>{{ sale.total_items }}</td>
            <td>{{ sale.total_quantity }}</td>
            <td>{{ formatPrice(sale.total_price) }}</td>
            <td>{{ sale.payment_method }}</td>
            <td>{{ formatPrice(sale.amount_paid) }}</td>
            <td>{{ formatPrice(sale.amount_change) }}</td>
            <td>{{ sale.staff_id }}</td>
            <td>{{ sale.staff_name }}</td>
            <td>{{ new Date(sale.sale_date).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
  
      <p v-else>No sales data available for the selected date range.</p>
  
      <!-- Pagination Controls -->
      <div v-if="sales.length > 0">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Next</button>
      </div>
  
      <!-- Bar Graph for Sales per Day -->
      <div v-if="sales.length > 0">
        <canvas id="salesChart"></canvas>
      </div>
    </div>
  </template>
  <script>
  import axios from 'axios';
  import Papa from 'papaparse';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import { Chart } from 'chart.js';
  
  export default {
    data() {
      return {
        startDate: this.getDefaultStartDate(),
    endDate: this.getDefaultEndDate(),
        sales: [],
        currentPage: 1, // Current page number
        itemsPerPage: 10, // Number of items per page
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.sales.length / this.itemsPerPage);
      },
      paginatedSales() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.sales.slice(start, end);
      },
    },
    methods: {
        getDefaultStartDate() {
    const today = new Date();
    today.setDate(today.getDate() - 30); // Default to 30 days ago
    return today.toISOString().split('T')[0]; // Format to YYYY-MM-DD
  },
  getDefaultEndDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Today's date
  },
      async fetchSalesReport() {
        if (!this.startDate || !this.endDate) {
          alert("Please select both start and end dates.");
          return;
        }
  
        try {
          const response = await axios.get('http://localhost:2313/admin/sales-report', {
            params: {
              startDate: this.startDate,
              endDate: this.endDate,
            },
          });
          this.sales = response.data;
          this.currentPage = 1; // Reset to first page when new data is fetched
          this.generateSalesGraph(); // Generate the graph after fetching the data
        } catch (error) {
          console.error("Error fetching sales report:", error);
        }
      },
  
      formatPrice(price) {
        const formattedPrice = parseFloat(price);
        return isNaN(formattedPrice) ? '0.00' : formattedPrice.toFixed(2);
      },
  
      downloadPDF() {
        const doc = new jsPDF();
        doc.text('Sales Report', 14, 20);
        doc.autoTable({
          head: [
            ['Sale ID', 'Customer Name', 'Customer Contact', 'Purchase Type', 'Total Items', 'Total Quantity', 'Total Price', 'Payment Method', 'Amount Paid', 'Amount Change', 'Staff ID', 'Staff Name', 'Sale Date']
          ],
          body: this.sales.map(sale => [
            sale.sale_id,
            sale.customer_name,
            sale.customer_contact,
            sale.purchase_type,
            sale.total_items,
            sale.total_quantity,
            this.formatPrice(sale.total_price),
            sale.payment_method,
            this.formatPrice(sale.amount_paid),
            this.formatPrice(sale.amount_change),
            sale.staff_id,
            sale.staff_name,
            new Date(sale.sale_date).toLocaleString(),
          ]),
        });
        doc.save('sales_report.pdf');
      },
  
      downloadCSV() {
        const csvData = Papa.unparse(this.sales.map(sale => ({
          "Sale ID": sale.sale_id,
          "Customer Name": sale.customer_name,
          "Customer Contact": sale.customer_contact,
          "Purchase Type": sale.purchase_type,
          "Total Items": sale.total_items,
          "Total Quantity": sale.total_quantity,
          "Total Price": this.formatPrice(sale.total_price),
          "Payment Method": sale.payment_method,
          "Amount Paid": this.formatPrice(sale.amount_paid),
          "Amount Change": this.formatPrice(sale.amount_change),
          "Staff ID": sale.staff_id,
          "Staff Name": sale.staff_name,
          "Sale Date": new Date(sale.sale_date).toLocaleString(),
        })));
  
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'sales_report.csv');
        link.click();
      },
  
      generateSalesGraph() {
        if (this.sales.length === 0) {
          this.createEmptyChart();
          return;
        }
  
        const groupedSales = this.groupSalesByDate(this.sales);
        const labels = Object.keys(groupedSales);
        const data = Object.values(groupedSales).map(sales => sales.length);
  
        if (document.getElementById('salesChart')) {
          new Chart(document.getElementById('salesChart'), {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Sales per Day',
                data: data,
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
                borderWidth: 1,
              }],
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Number of Sales',
                  },
                  beginAtZero: true,
                },
              },
            },
          });
        }
      },
  
      createEmptyChart() {
        new Chart(document.getElementById('salesChart'), {
          type: 'bar',
          data: {
            labels: ['No Sales Data Available'],
            datasets: [{
              label: 'Sales per Day',
              data: [0],
              backgroundColor: '#FFEB3B',
              borderColor: '#FF9800',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Number of Sales',
                },
                beginAtZero: true,
              },
            },
          },
        });
      },
  
      groupSalesByDate(sales) {
        const salesGrouped = {};
        sales.forEach(sale => {
          const saleDate = new Date(sale.sale_date).toLocaleDateString();
          if (!salesGrouped[saleDate]) {
            salesGrouped[saleDate] = [];
          }
          salesGrouped[saleDate].push(sale);
        });
        return salesGrouped;
      },
  
      changePage(page) {
        this.currentPage = page;
      },
    },
    mounted() {
        this.fetchSalesReport();
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
  th, td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  canvas {
    width: 100%;
    height: 400px;
    margin-top: 20px;
  }
  
  button[disabled] {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
  </style>
  