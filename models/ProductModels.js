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
  exports.selectStock = (productId, productDetailId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT stock
            FROM product_details
            WHERE product_code = ? AND detail_id = ?
        `;
        const params = [productId, productDetailId];

        // Execute the query
        db.execute(query, params, (err, rows) => {
            if (err) {
                console.error('Error in selectStock:', err.message);
                reject(new Error('Failed to retrieve stock.'));
            } else {
                if (rows.length > 0) {
                    resolve(rows[0]); // Return the stock data directly if found
                } else {
                    reject(new Error(`Product detail not found for product_code ${productId} and detail_id ${productDetailId}`));
                }
            }
        });
    });
};
exports.updateInventory = (productId, productDetailId, quantity) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE product_details
            SET stock = ?
            WHERE product_code = ? AND detail_id = ?
        `;
        const params = [quantity, productId, productDetailId];

        // Execute the update query
        db.execute(query, params, (err, result) => {
            if (err) {
                console.error('Error in updateInventory:', err.message);
                reject(new Error('Failed to update inventory.'));
            } else {
                if (result.affectedRows === 0) {
                    reject(new Error(`No product detail found for product_code ${productId} and detail_id ${productDetailId}`));
                } else {
                    console.log(`Inventory updated: Product ID ${productId}, Detail ID ${productDetailId}, Quantity ${quantity}`);
                    resolve(); // Resolve the promise on successful update
                }
            }
        });
    });
};


exports.restock = (productId, price, quantity) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE product_details
        SET stock = stock + ?, price = ?
        WHERE detail_id = ?
      `;
      const params = [
        quantity || 0,    // Default quantity to 0 if undefined
        price || null,    // Default price to null if undefined
        productId,
      ];
  
  
      db.execute(query, params, (err, result) => {
        if (err) {
          console.error('Error in restock:', err.message);
          return reject(new Error('Failed to update inventory.'));
        }
  
        if (result.affectedRows === 0) {
          return reject(new Error(`No product found with detail_id ${productId}.`));
        }
  
        resolve(); // Resolve on success
      });
    });
  };

  
exports.deduct = (productId, price, quantity) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE product_details
        SET stock = stock - ?, price = ?
        WHERE detail_id = ?
      `;
      const params = [
        quantity || 0,    // Default quantity to 0 if undefined
        price || null,    // Default price to null if undefined
        productId,
      ];
  
      console.log('Executing query:', { query, params }); // Log SQL query and parameters
  
      // Execute the query
      db.execute(query, params, (err, result) => {
        if (err) {
          console.error('Error in restock:', err.message);
          return reject(new Error('Failed to update inventory.'));
        }
  
        if (result.affectedRows === 0) {
          return reject(new Error(`No product found with detail_id ${productId}.`));
        }
  
        resolve(); // Resolve on success
      });
    });
  };
  

  
  exports.productDetail = (productId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT *
        FROM product_details
        WHERE detail_id = ?
      `;
      const params = [productId];
  
      // Execute the query
      db.execute(query, params, (err, rows) => {
        if (err) {
          console.error('Error in selectStock:', err.message);
          reject(new Error('Failed to retrieve stock.'));
        } else {
          // Log the retrieved rows before resolving
          console.log('Retrieved rows:', rows);
  
          if (rows.length > 0) {
            // Log the first row (which will be resolved)
            console.log('First product detail:', rows[0]);
  
            resolve(rows[0]); // Return the first row directly if found
          } else {
            reject(new Error(`Product detail not found for product_code ${productId}`));
          }
        }
      });
    });
  };
  

  exports.saveInventory = (productId, productDetailId, quantity, changes, updatedStock, subtotal) => {
    console.log(productId, productDetailId, quantity, changes, updatedStock, subtotal);
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO inventory (product_code, product_detail_id, quantity, changes_type, updated_stock, sub_total, date)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;
      const params = [productId, productDetailId, quantity, changes, updatedStock, subtotal];
  
      // Execute the insert query
      db.execute(query, params, (err, result) => {
        if (err) {
          console.error('Error in saveInventory:', err.message);
          reject(new Error('Failed to save inventory.'));
        } else {
          console.log(`Inventory saved: Product ID: ${productId}, Detail ID: ${productDetailId}, Quantity: ${quantity}`);
          resolve(result.insertId); // Resolve with the generated inventory ID if needed
        }
      });
    });
  };
  