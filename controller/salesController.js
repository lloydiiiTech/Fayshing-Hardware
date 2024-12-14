const salesModel = require('../models/salesModel');


exports.getMetrics = async (req, res) => {
  try {
    const metrics = await salesModel.fetchMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Failed to fetch metrics' });
  }
};

exports.getSalesGraph = async (req, res) => {
  const { period } = req.query; // Period could be 'day', 'week', 'month', or 'year'

  try {
    const graphData = await salesModel.fetchSalesGraph(period); // Pass the selected period to fetchSalesGraph
    res.status(200).json(graphData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales graph data' });
  }
};


exports.getProductDetails = async (req, res) => {
    try {
      // Get product details from the model
      const products = await salesModel.getProductDetails();
  

      // Loop through each product in the products array
      products.forEach(product => {
        let all = ""; // Initialize the string to accumulate conditions for each product
  
        // Check if attributes exist and append them to `all`
        if (product.color !== null) {
          all += ` ${product.color} `;
        }
        if (product.liter) {
          all += ` ${product.liter} `;
        }
        if (product.size) {
          all += `${product.size} `;
        }
        if (product.length) {
          all += ` ${product.length} `;
        }
        if (product.dimension) {
          all += ` ${product.dimension} `;
        }
        if (product.type) {
          all += ` ${product.type} `;
        }
        if (product.weight) {
          all += ` ${product.weight} `;
        }
        if (product.wattage) {
          all += ` ${product.wattage} `;
        }
  
        // Insert the `all` string into the product object (you can add it as a new property or use it as needed)
        product.all = all.trim(); // Add the `all` string to each product object
      });
  
      res.status(200).json(products); // Send the products with the `all` property
  
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ message: 'Failed to fetch product details' });
    }
  };
  

exports.getInventoryChanges = async (req, res) => {
  try {
    const products = await salesModel.getInventoryChanges();
    products.forEach(product => {
        let all = ""; // Initialize the string to accumulate conditions for each product
  
        // Check if attributes exist and append them to `all`
        if (product.color) {
          all += ` ${product.color} `;
        }
        if (product.liter) {
          all += ` ${product.liter} `;
        }
        if (product.size) {
          all += `${product.size} `;
        }
        if (product.length) {
          all += ` ${product.length} `;
        }
        if (product.dimension) {
          all += ` ${product.dimension} `;
        }
        if (product.type) {
          all += ` ${product.type} `;
        }
        if (product.weight) {
          all += ` ${product.weight} `;
        }
        if (product.wattage) {
          all += ` ${product.wattage} `;
        }
  
        // Insert the `all` string into the product object (you can add it as a new property or use it as needed)
        product.detail = all.trim(); // Add the `all` string to each product object
      });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching inventory changes:', error);
    res.status(500).json({ message: 'Failed to fetch inventory changes' });
  }
};

exports.getSalesTransactions = async (req, res) => {
  try {
    const sales = await salesModel.getSalesTransactions();
    res.status(200).json(sales);
  } catch (error) {
    console.error('Error fetching sales transactions:', error);
    res.status(500).json({ message: 'Failed to fetch sales transactions' });
  }
};

exports.getProductStock = async (req, res) => {
    try {
      const results = await salesModel.getStockData();
      const labels = results.map(row => row.product_name);
      const stockData = results.map(row => row.total_stock);
  
      res.json({ labels, stockData });
    } catch (error) {
      console.error('Error fetching product stock data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Controller to get sales data for the line chart
  exports.getProductSales = async (req, res) => {
    try {
      const results = await salesModel.getSalesData();
      
      // Group sales data by product_name and organize it into datasets
      const productSales = {};
  
      // Process results to organize data by product
      results.forEach(row => {
        const productName = row.product_name;
        const date = row.sale_date.toISOString().split('T')[0]; // Use sale_date here instead of inventory_date
        const sales = row.total_sales;  // Use total_sales instead of sub_total if needed
  
        if (!productSales[productName]) {
          productSales[productName] = { labels: [], data: [] };
        }
  
        if (!productSales[productName].labels.includes(date)) {
          productSales[productName].labels.push(date);
        }
  
        // Fill data array, ensuring it aligns with dates
        const index = productSales[productName].labels.indexOf(date);
        productSales[productName].data[index] = sales;
      });
  
      // Prepare datasets for Chart.js
      const datasets = Object.keys(productSales).map((productName, index) => {
        return {
          label: productName,
          data: productSales[productName].data,
          fill: false,
          borderColor: `hsl(${(index * 60) % 360}, 100%, 50%)`, // Dynamic color
          tension: 0.1,
        };
      });
  
      // Send labels (dates) and datasets (product sales)
      res.json({
        labels: Object.values(productSales)[0]?.labels || [], // Use the labels from any product (they should be the same)
        datasets: datasets,
      });
    } catch (error) {
      console.error('Error fetching product sales data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  

  exports.getDetail = async (req, res) => {
    const { productCode } = req.params;
  
    try {
      // Call the model function to get product details
      const [details] = await salesModel.getDetails(productCode);
  
      if (details.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.json(details); // Send the details as response
    } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).json({ error: "Failed to fetch product details." });
    }
  };
  