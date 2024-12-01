// models/ProductModel.js
const db = require('../config/db');

// Import your database connection

// Add a new product to the `products` table
exports.addProduct = (productData, callback) => {
    const sql = 'INSERT INTO products (product_code, product_name, category, qrcode, Created_at) VALUES (?, ?, ?, ?, ?)';
    const createdAt = new Date();  // You can adjust the date format if needed
    db.query(sql, [productData.productCode, productData.productName, productData.selectedCategory, productData.qrCode, createdAt], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Check if a product code already exists in the `products` table
exports.checkProductCodeExists = (productCode, callback) => {
    const sql = 'SELECT COUNT(*) AS count FROM products WHERE product_code = ?';
    db.query(sql, [productCode], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        const exists = result[0].count > 0;
        callback(null, exists);
    });
};

exports.addProductDetails = (detailsData, callback) => {
    const sql = `INSERT INTO product_details (product_code, stock, price, color, liter, size, length, dimension, type, weight, wattage, Created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const createdAt = new Date().toISOString();
    db.query(sql, [
        detailsData.productCode, 
        detailsData.stock, 
        detailsData.price, 
        detailsData.color, 
        detailsData.liter, 
        detailsData.size, 
        detailsData.length, 
        detailsData.dimension, 
        detailsData.type, 
        detailsData.weight, 
        detailsData.wattage, 
        createdAt
    ], (err, result) => {
        if (err) {
            console.error("Database Insertion Error:", err); // Log detailed error information
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Fetch all products from the `products` table
exports.getAllProducts = () => {
    const sql = 'SELECT product_code, product_name, category, qrcode, Created_at FROM products';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) {
                return reject(err); // Reject the promise with the error
            }
            resolve(results); // Resolve the promise with the results
        });
    });
};

exports.getProductDetails = (productCode) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT detail_id, product_code,stock, price, color, liter, size, length, dimension, type, weight, wattage FROM product_details
        WHERE product_code = ?
      `;
      db.query(query, [productCode], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results); // Return the first result since product_code should be unique
        }
      });
    });
  };
  

// Get a single product by product code
exports.getProductByCode = (productCode, callback) => {
    const sql = 'SELECT * FROM products WHERE product_code = ?';
    db.query(sql, [productCode], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results[0]);  // Returning only the first result
    });
};

// Get product details by product code from the `product_details` table
exports.getProductDetailsByCode = (productCode, callback) => {
    const sql = 'SELECT * FROM product_details WHERE product_code = ?';
    db.query(sql, [productCode], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results[0]);  // Returning only the first result
    });
};


exports.getProductByQRCode = async (qrCode) => {
    const sql = 'SELECT * FROM products WHERE product_code = ?';  // SQL query to search the product by QR code
  
    try {
      const results = await db.promise().query(sql, [qrCode]);  // Execute query with promise-based interface
      return results[0] || null;  // Return the first result (product) or null if no product found
    } catch (err) {
      console.error("Database error:", err);
      throw err;  // Re-throw error so the controller can handle it
    }
  };
  

exports.fetchProductDetails = (productCode, productDetails) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT detail_id, stock, price
        FROM product_details 
        WHERE product_code = ?
          AND (
            (color = ? AND liter = ?)
            OR (size = ? AND length = ?)
            OR (length = ? AND weight = ?)
            OR (dimension = ?)
            OR (type = ? AND weight = ?)
            OR (weight = ?)
            OR (wattage = ?)
            OR (length = ?)
            OR (type = ?)
          )
        LIMIT 1;
      `;
      db.query(
        sql,
        [
          productCode,
          productDetails.color || null,
          productDetails.liter || null,
          productDetails.size || null,
          productDetails.length || null,
          productDetails.length || null,
          productDetails.weight || null,
          productDetails.dimension || null,
          productDetails.type || null,
          productDetails.weight || null,
          productDetails.weight || null,
          productDetails.wattage || null,
          productDetails.length || null,
          productDetails.type || null,
        ],
        (err, results) => {
          if (err) {
            return reject(err); // Reject the promise with the error
          }
          resolve(results[0]); // Resolve with the first result
        }
      );
    });
  };
  
  