const db = require('../config/db');

exports.getCartProduct = (product_code, product_detail_id, staffID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * 
            FROM CART 
            WHERE product_code = ? AND product_detail_id = ? AND staffID = ?
        `;

        db.query(sql, [product_code, product_detail_id, staffID], (err, result) => {
            if (err) {
                console.error("Database Query Error:", err);
                return reject(err);
            }
            resolve(result[0] || null); // Return the first result or null if not found
        });
    });
};

exports.updateCartQuantity = (cart_id, newQuantity) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE CART 
            SET quantity = ? 
            WHERE id = ?
        `;

        db.query(sql, [newQuantity, cart_id], (err, result) => {
            if (err) {
                console.error("Database Update Error:", err);
                return reject(err);
            }
            resolve(result);
        });
    });
};


  exports.addProductToCart = (productData) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO CART (product_code, product_name, product_price, quantity, category1, category2, staffID, product_detail_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                productData.product_code,
                productData.product_name,
                productData.product_price,
                productData.quantity,
                productData.category1,
                productData.category2,
                productData.staffID,
                productData.product_detail_id
            ],
            (err, result) => {
                if (err) {
                    console.error("Database Insertion Error:", err); // Log detailed error information
                    return reject(err); // Reject the promise with the error
                }
                resolve(result); // Resolve the promise with the result
            }
        );
    });
};

exports.getCartItems = (staffId, callback) => {
    const query = `
        SELECT 
            c.*, 
            pd.stock 
        FROM 
            cart c
        JOIN 
            product_details pd 
        ON 
            c.product_detail_id = pd.detail_id
        WHERE 
            c.staffID = ?;
    `;
    db.query(query, [staffId], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};



exports.deleteProduct = (productCode, callback) => {
    const query = 'DELETE FROM cart WHERE id = ?';
    db.query(query, [productCode], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

exports.updateCartItems = (cart) => {
    return Promise.all(
        cart.map((product) => {
            console.log('Updating product:', product); // Log product data
            return new Promise((resolve, reject) => {
                const query = 'UPDATE cart SET quantity = ? WHERE product_detail_id = ?';
            console.log(product.quantity, product.product_detail_id);
                db.query(query, [product.quantity, product.product_code], (err, result) => {
                    if (err) {
                        console.error('Error in database query:', err); // Log query error
                        reject(err);
                    } else {
                        console.log('Update result for product_code', product.product_code, result); // Log success
                        resolve(result);
                    }
                });
            });
        })
    );
    
};



exports.deleteCartByStaffId = async (staffId) => {
    const query = 'DELETE FROM cart WHERE staffID = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [staffId], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};


