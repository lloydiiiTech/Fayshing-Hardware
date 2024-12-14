<template>
  <div class="container-fluid">
    <div class="row mt-4">
      <!-- Key Metrics Section -->
      <div class="col-12 col-md-3 p-3">
        <div class="card metrics-card">
          <div class="card-header text-center">
            <h4>Key Metrics</h4>
          </div>
          <div class="card-body">
            <ul class="list-unstyled">
              <li v-if="highestSalesProduct" class="metric-item">
                <strong>Highest Sales Product:</strong> {{ highestSalesProduct }}
              </li>
              <li v-if="latestSale" class="metric-item">
                <strong>Latest Sale:</strong> {{ latestSale }}
              </li>
              <li v-if="lowStockProduct" class="metric-item">
                <strong>Low Stock Product:</strong> {{ lowStockProduct }}
              </li>
              <li v-if="totalItemsOnHand" class="metric-item">
                <strong>Total Items on Hand:</strong> {{ totalItemsOnHand }}
              </li>
              <li v-if="monthlySales" class="metric-item">
                <strong>Sales This Month:</strong> {{ monthlySales }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-3 p-3">
  <div class="card metrics-card">
    <div class="card-header text-center">
      <h4>
        <i class="bi bi-exclamation-circle text-warning" style="font-size: 1.5em;"></i>
        Low Stock Products
      </h4>
    </div>
    <div class="card-body" style="background-color: #f9f9f9;">
      <div v-if="lowStockProducts.length > 0" class="mt-4">
        <ul class="list-unstyled">
          <li v-for="(product, index) in lowStockProducts" :key="index" class="product-item">
            {{ product.product_name }} ({{ product.all }}) - <strong>Stock: {{ product.stock }}</strong>
          </li>
        </ul>
      </div>
      <div v-else class="text-center text-muted mt-3">
        No low stock products available.
      </div>
    </div>
  </div>
</div>

<div class="col-12 col-md-3 p-3">
  <div class="card metrics-card">
    <div class="card-header text-center">
      <h4>
        <i class="bi bi-x-circle text-danger" style="font-size: 1.5em;"></i>
        Out of Stock Products
      </h4>
    </div>
    <div class="card-body" style="background-color: #f9f9f9;">
      <div v-if="outOfStockProducts.length > 0" class="mt-4">
        <ul class="list-unstyled">
          <li v-for="(product, index) in outOfStockProducts" :key="index" class="product-item">
            {{ product.product_name }} ({{ product.all }})
          </li>
        </ul>
      </div>
      <div v-else class="text-center text-muted mt-3">
        No out of stock products available.
      </div>
    </div>
  </div>
</div>
      <!-- Sales Graph Section -->
      <div class="col-12 col-md-9 p-3">
        <div class="card">
          <div class="card-header text-center">Sales Overview</div>
          <div class="card-body">
            <div class="mb-3">
              <label for="periodFilter" class="form-label">Select Period</label>
              <select id="periodFilter" v-model="selectedPeriod" class="form-select" @change="fetchSalesGraph">
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month" selected>Month</option>
                <option value="year">Year</option>
              </select>
            </div>
            <canvas id="salesChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Stock Pie Chart Section -->
    <div class="row mt-4">
      <div class="col-12 col-md-6 p-3">
        <div class="card">
          <div class="card-header text-center">Product Stock Distribution</div>
          <div class="card-body">
            <canvas id="stockPieChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Product Sales Line Graph Section -->
      <div class="col -12 col-md-6 p-3">
        <div class="card">
          <div class="card-header text-center">Product Sales Over Time</div>
          <div class="card-body">
            <canvas id="salesLineChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details Section -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header text-center">Product Details</div>
          <div class="card-body">
            <div class="table-responsive">
              <table id="productTable" class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Product Code</th>
                    <th>Product Name</th>
                    <th>Product Type</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(product, index) in filteredProductDetails"
                    :key="index"
                    :class="getStockClass(product.stock)"
                  >
                    <td>{{ product.product_code }}</td>
                    <td>{{ product.product_name }}</td>
                    <td>{{ product.product_type }}</td>
                    <td>{{ product.category }}</td>
                    <td>{{ product.price }}</td>
                    <td>{{ product.stock }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header text-center">Inventory Changes</div>
          <div class="card-body">
            <div class="table-responsive">
              <table id="inventTable" class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Inventory ID</th>
                    <th>Product Code</th>
                    <th>Product Name</th>
                    <th>Changes Type</th>
                    <th>Updated Stock</th>
                    <th>Quantity</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(inventory, index) in filteredInventoryChanges"
                    :key="index"
                  >
                    <td>{{ inventory.inventoryID }}</td>
                    <td>{{ inventory.product_code }}</td>
                    <td>{{ inventory.product_name }} {{ inventory.detail }}</td>
                    <td>{{ inventory.changes_type }}</td>
                    <td>{{ inventory.updated_stock }}</td>
                    <td>{{ inventory.quantity }}</td>
                    <td>{{ inventory.date }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header text-center">Sales Transactions</div>
          <div class="card-body">
            <div class="table-responsive">
              <table id="salesTable" class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Sale ID</th>
                    <th>Customer Name</th>
                    <th>Total Items</th>
                    <th>Total Price</th>
                    <th>Payment Method</th>
                    <th>Staff Name</th>
                    <th>Sale Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(sale, index) in filteredSalesTransactions"
                    :key="index"
                  >
                    <td>{{ sale.sale_id }}</td>
                    <td>{{ sale.customer_name }}</td>
                    <td>{{ sale.total_items }}</td>
                    <td>{{ sale.total_price }}</td>
                    <td>{{ sale.payment_method }}</td>
                    <td>{{ sale.staff_name }}</td>
                    <td>{{ sale.sale_date }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import 'datatables.net';
import { Chart, registerables } from "chart.js";

export default {
  name: "SalesAndInventoryHome",
  data() {
    return {
      highestSalesProduct: "",
      latestSale: "",
      lowStockProduct: "",
      totalItemsOnHand: 0,
      monthlySales: 0, 
      productDetails: [],
      inventoryChanges: [],
      salesTransactions: [],
      productFilter: "",
      inventoryFilter: "",
      salesFilter: "",
      lowStockProducts: [],
      outOfStockProducts: [],
      selectedPeriod: 'month', // Default to month
      salesData: null,
    };
  },
  computed: {
    filteredProductDetails() {
      return this.productDetails.filter(product => {
        return (
          product.product_name.toLowerCase().includes(this.productFilter.toLowerCase()) ||
          product.product_code.toLowerCase().includes(this.productFilter.toLowerCase())
        );
      });
    },
    filteredInventoryChanges() {
      return this.inventoryChanges.filter(inventory => {
        return (
          inventory.product_code.toLowerCase().includes(this.inventoryFilter.toLowerCase()) ||
          inventory.changes_type.toLowerCase().includes(this.inventoryFilter.toLowerCase())
        );
      });
    },
    filteredSalesTransactions() {
      return this.salesTransactions.filter(sale => {
        return (
          sale.customer_name.toLowerCase().includes(this.salesFilter.toLowerCase()) ||
          sale.sale_id.toString().includes(this.salesFilter)
        );
      });
    },
  },
  mounted() {
    Chart.register(...registerables);
    this.fetchMetrics();
    this.fetchProductDetails();
    this.fetchInventoryChanges();
    this.fetchSalesTransactions();
    this.fetchSalesGraph();
    this.renderStockPieChart();
    this.renderSalesLineChart();
    const session = sessionStorage.getItem('user_id');
    console.log(session);
    if (!session) {
      this.$router.push('/'); // Redirect to login page
    }

    sessionStorage.removeItem('productCode');
        sessionStorage.removeItem('productName');
  },
  watch: {
    productDetails: function () {
      this.$nextTick(() => {
        $('#productTable').DataTable();
      });
    },
  },
  methods: {
    async fetchMetrics() {
      try {
        const response = await axios.get("http://localhost:2313/admin/metrics");
        const data = response.data;
        this.highestSalesProduct = data.highestSalesProduct;
        this.latestSale = data.latestSale;
        this.lowStockProduct = data.lowStockProduct;
        this.totalItemsOnHand = data.totalItemsOnHand;
        this.monthlySales = data.monthlySales;
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    },
    async fetchProductDetails() {
      try {
        const response = await axios.get("http://localhost:2313/admin/products");
        this.productDetails = response.data;

        this.lowStockProducts = this.productDetails.filter(product => product.stock < 10 && product.stock > 0);
        this.outOfStockProducts = this.productDetails.filter(product => product.stock === 0);

        this.$nextTick(() => {
          if ($.fn.dataTable.isDataTable("#productTable")) {
            $('#productTable').DataTable().destroy();
          }
          $('#productTable').DataTable();
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    },

    getStockClass(stock) {
      if (stock === 0) {
        return "table-danger"; // Red for out of stock
      } else if (stock <= 10) {
        return "table-warning"; // Yellow for low stock
      }
      return ""; // Default class
    },

    async fetchInventoryChanges() {
      try {
        const response = await axios.get("http://localhost:2313/admin/inventory");
        this.inventoryChanges = response.data;
        this.$nextTick(() => {
          if ($.fn.dataTable.isDataTable("#inventTable")) {
            $('#inventTable').DataTable().destroy();
          }
          $('#inventTable').DataTable();
        });
      } catch (error) {
        console.error("Error fetching inventory changes:", error);
      }
    },
    async fetchSalesTransactions() {
      try {
        const response = await axios.get("http://localhost:2313/admin/sales");
        this.salesTransactions = response.data;
        this.$nextTick(() => {
          if ($.fn.dataTable.isDataTable("#salesTable")) {
            $('#salesTable').DataTable().destroy();
          }
          $('#salesTable').DataTable();
        });
      } catch (error) {
        console.error("Error fetching sales transactions:", error);
      }
    },
    async fetchSalesGraph() {
      try {
        const response = await axios.get("http://localhost:2313/admin/salesGraph", {
          params: {
            period: this.selectedPeriod,
          },
        });

        const { labels, salesData } = response.data;

        const salesDataNumeric = salesData.map(item => parseFloat(item));

        this.renderChart(labels, salesDataNumeric);
      } catch (error) {
        console.error("Error fetching sales graph:", error);
      }
    },

    renderChart(labels, salesData) {
      const ctx = document.getElementById("salesChart");
      if (this.salesChart) {
        this.salesChart.destroy();
 }

      this.salesChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Sales",
              data: salesData,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return value.toLocaleString(); // Format numbers with commas
                },
              },
            },
          },
        },
      });
    },

    async renderStockPieChart() {
      try {
        const response = await axios.get("http://localhost:2313/admin/productStock");
        const { labels, stockData } = response.data;
        new Chart(document.getElementById("stockPieChart"), {
          type: "pie",
          data: {
            labels,
            datasets: [
              {
                data: stockData,
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                ],
              },
            ],
          },
          options: {
            responsive: true,
          },
        });
      } catch (error) {
        console.error("Error rendering stock pie chart:", error);
      }
    },

    async renderSalesLineChart() {
      try {
        const response = await axios.get("http://localhost:2313/admin/productSales");
        const { labels, datasets } = response.data;

        new Chart(document.getElementById("salesLineChart"), {
          type: "line",
          data: {
            labels,
            datasets: datasets,
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Sales",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
            },
          },
        });
      } catch (error) {
        console.error("Error rendering sales line chart:", error);
      }
    }
  }};
</script>

<style scoped>
.product-item {
  padding: 10px;
  border-bottom: 1px solid #e9ecef; /* Light border for separation */
  transition: background-color 0.2s;
}

.product-item:hover {
  background-color: #f1f1f1; /* Light background on hover */
}

.card-header h4 {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0; /* Remove default margin */
}

.card-body {
  padding: 15px; /* Ensure consistent padding */
}
.container-fluid {
  padding: 20px;
}

h4 {
  text-align: center;
  margin-bottom: 20px;
}

.metrics-card {
  border: 2px solid #ff914c;
  border-radius: 5px;
  padding: 15px;
  transition: transform 0.2s;
}

.metrics-card:hover {
  transform: scale(1.05);
}

.card-title {
  font-weight: bold;
}

.card-text {
  font-size: 1.2em;
}

.table {
  margin-top: 20px;
}

.table-responsive {
  overflow-x: auto;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.table-bordered th, .table-bordered td {
  border: 1px solid #dee2e6;
}

.card {
  margin-bottom: 20px;
}

.card-header {
  background-color: #ff914c;
  color: white;
  font-weight: bold;
}

.card-body {
  padding: 15px;
}

i {
  font-size: 2em;
  color: #ff914c;
  margin-bottom: 10px;
}
</style>