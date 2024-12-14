const db = require('../config/db'); // Database connection setup

const getSalesReport = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        sale_id, customer_name, customer_contact, purchase_type, 
        total_items, total_quantity, total_price, payment_method, 
        amount_paid, amount_change, staff_id, staff_name, sale_date 
      FROM sales
      WHERE sale_date BETWEEN ? AND ?
    `;

    db.query(query, [startDate, endDate], (err, results) => {
      if (err) {
        reject(err);  // Reject if there is an error in the query
      } else {
        resolve(results);  // Resolve with the results if successful
      }
    });
  });
};
// Fetch metrics: highest sales product, latest sale, low stock product, total items on hand, monthly sales
const fetchMetrics = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        (SELECT product_name 
         FROM products p
         JOIN product_details pd ON p.product_code = pd.product_code
         JOIN inventory i ON pd.detail_id = i.product_detail_id
         GROUP BY p.product_name
         ORDER BY SUM(i.updated_stock) DESC LIMIT 1) AS highestSalesProduct,

        (SELECT MAX(s.sale_date) FROM sales s) AS latestSale,

        (SELECT product_name 
         FROM products p
         JOIN product_details pd ON p.product_code = pd.product_code
         WHERE pd.stock < 10 LIMIT 1) AS lowStockProduct,

        (SELECT SUM(pd.stock) FROM product_details pd) AS totalItemsOnHand,

        (SELECT SUM(s.total_price) FROM sales s
         WHERE MONTH(s.sale_date) = MONTH(CURRENT_DATE()) 
         AND YEAR(s.sale_date) = YEAR(CURRENT_DATE())) AS monthlySales
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error in fetchMetrics:', err);
        reject(err); // Reject if there's a database error
      } else {
        resolve(results.length > 0 ? results[0] : null); // Resolve with results or null if no data
      }
    });
  });
};
const fetchSalesGraph = (period) => {
  return new Promise((resolve, reject) => {
    let query;
    let column;

    switch (period) {
      case 'day':
        column = 'day';
        query = `
          SELECT 
            DATE_FORMAT(s.sale_date, '%Y-%m-%d') AS day,
            SUM(s.total_price) AS totalSales
          FROM sales s
          GROUP BY day
          ORDER BY day ASC
        `;
        break;

      case 'week':
        column = 'week';
        query = `
          SELECT 
            YEAR(s.sale_date) AS year,
            WEEK(s.sale_date) AS week,
            SUM(s.total_price) AS totalSales
          FROM sales s
          GROUP BY year, week
          ORDER BY year ASC, week ASC
        `;
        break;

      case 'month':
        column = 'month';
        query = `
          SELECT 
            DATE_FORMAT(s.sale_date, '%Y-%m') AS month,
            SUM(s.total_price) AS totalSales
          FROM sales s
          GROUP BY month
          ORDER BY month ASC
        `;
        break;

      case 'year':
        column = 'year';
        query = `
          SELECT 
            YEAR(s.sale_date) AS year,
            SUM(s.total_price) AS totalSales
          FROM sales s
          GROUP BY year
          ORDER BY year ASC
        `;
        break;

      default:
        column = 'month';
        query = `
          SELECT 
            DATE_FORMAT(s.sale_date, '%Y-%m') AS month,
            SUM(s.total_price) AS totalSales
          FROM sales s
          GROUP BY month
          ORDER BY month ASC
        `;
        break;
    }

    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error in fetchSalesGraph:', err);
        reject(err);
      } else {
        const labels = results.map(row => row[column]); // Dynamically use the column name
        const salesData = results.map(row => row.totalSales);
        resolve({ labels, salesData });
      }
    });
  });
};



// Get product details
const getProductDetails = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT
    p.product_code, 
    p.product_name, 
    p.category, 
    p.qrcode, 
    p.Created_at, 
    pd.detail_id, 
    pd.stock, 
    pd.price, 
    pd.color, 
    pd.liter, 
    pd.size, 
    pd.length, 
    pd.dimension, 
    pd.type, 
    pd.weight, 
    pd.wattage
FROM 
    products p
JOIN 
    product_details pd 
ON 
    p.product_code = pd.product_code`; // Example query for product details
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error in getProductDetails:', err);
        reject(err); // Reject if there's a database error
      } else {
        resolve(results); // Resolve with the product details
      }
    });
  });
};

// Get inventory changes
const getInventoryChanges = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT 
    i.inventoryID, 
    i.product_code, 
    i.product_detail_id, 
    i.quantity, 
    i.changes_type, 
    i.updated_stock, 
    i.sub_total, 
    i.sales_id, 
    i.date, 
    p.product_name, 
    p.category, 
    p.qrcode, 
    p.Created_at AS product_created_at, 
    pd.stock AS product_stock, 
    pd.price AS product_price, 
    pd.color, 
    pd.liter, 
    pd.size, 
    pd.length, 
    pd.dimension, 
    pd.type, 
    pd.weight, 
    pd.wattage, 
    pd.Created_at AS product_detail_created_at
FROM 
    inventory i
JOIN 
    products p ON i.product_code = p.product_code
JOIN 
    product_details pd ON i.product_detail_id = pd.detail_id
WHERE 1;`; // Example query for inventory changes
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error in getInventoryChanges:', err);
        reject(err); // Reject if there's a database error
      } else {
        resolve(results); // Resolve with the inventory changes
      }
    });
  });
};

// Get sales transactions
const getSalesTransactions = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM sales'; // Example query for sales transactions
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error in getSalesTransactions:', err);
        reject(err); // Reject if there's a database error
      } else {
        resolve(results); // Resolve with the sales transactions
      }
    });
  });
};

const getStockData = () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.product_name, SUM(pd.stock) AS total_stock
        FROM products p
        JOIN product_details pd ON p.product_code = pd.product_code
        GROUP BY p.product_name;
      `;
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };
  
  // Function to get sales data
  const getSalesData = () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          s.sale_date, 
          p.product_name, 
          SUM(i.sub_total) AS total_sales
        FROM sales s
        JOIN inventory i ON s.sale_id = i.sales_id
        JOIN products p ON i.product_code = p.product_code
        GROUP BY s.sale_date, p.product_name
        ORDER BY s.sale_date;
      `;
      
      db.query(query, (err, results) => {
        if (err) {
          console.error("SQL Error: ", err);  // Log the SQL error
          reject(err);
        } else {
          console.log("Query Results:", results);  // Log the query results
          resolve(results);
        }
      });
    });
  };
  
  
  

  const getDetails = (productCode) => {
    return new Promise((resolve, reject) => {
        const query = `
          SELECT 
        detail_id, product_code, stock, price, color, liter, size, 
        length, dimension, type, weight, wattage, Created_at 
      FROM 
        product_details 
      WHERE 
        product_code = ?;
        `;
        db.query(query, [productCode],(err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    
  };
  
  
module.exports = { fetchMetrics, fetchSalesGraph, getProductDetails, getInventoryChanges, getSalesTransactions, getStockData, getSalesData, getDetails, getSalesReport};
