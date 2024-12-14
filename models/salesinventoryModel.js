
const db = require('../config/db'); // Assuming you have a config file to set up your database connection

exports.saveInventory = (productId, productDetailId, quantity, changes, updatedStock, subtotal, saleId) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO inventory (product_code, product_detail_id, quantity, changes_type, updated_stock, sub_total, sales_id, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        const params = [productId, productDetailId, quantity, changes, updatedStock, subtotal, saleId];

        // Execute the insert query
        db.execute(query, params, (err, result) => {
            if (err) {
                console.error('Error in saveInventory:', err.message);
                reject(new Error('Failed to save inventory.'));
            } else {
                if (result.affectedRows === 0) {
                    reject(new Error(`Failed to save inventory for product_code ${productId}, detail_id ${productDetailId}, sale_id ${saleId}.`));
                } else {
                    console.log(`Inventory saved: Product ID: ${productId}, Detail ID: ${productDetailId}, Quantity: ${quantity}, Sale ID: ${saleId}`);
                    resolve(result.insertId); // Resolve with the generated inventory ID if needed
                }
            }
        });
    });
};

exports.createSale = (saleData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO sales (
                customer_name,
                customer_contact,
                purchase_type,
                total_items,
                total_quantity,
                total_price,
                payment_method,
                amount_paid,
                amount_change,
                staff_id,
                staff_name,
                sale_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        const params = [
            saleData.customer_name,
            saleData.customer_contact,
            saleData.purchase_type,
            saleData.total_items,
            saleData.total_quantity,
            saleData.total_price,
            saleData.payment_method,
            saleData.amount_paid,
            saleData.change,
            saleData.staff_id,
            saleData.staff_name,
        ];

        // Execute the query
        db.execute(query, params, (err, result) => {
            if (err) {
                console.error('Error in createSale:', err.message);
                reject(new Error('Failed to create sale.'));
            } else {
                if (result.affectedRows === 0) {
                    reject(new Error('Failed to create sale. No rows affected.'));
                } else {
                    const saleId = result.insertId; // Access sale_id from the result
                    console.log(`Sale created successfully: Sale ID: ${saleId}`);
                    resolve(saleId); // Resolve with the generated sale ID
                }
            }
        });
    });
};


exports.getInventoryById = (sales_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
    i.inventoryID,
    i.product_code,
    p.product_name,
    pd.detail_id AS product_detail_id,
    pd.price,
    CONCAT(
        IFNULL(pd.color, '') , " ",
        IFNULL(pd.liter, '') , " ",
        IFNULL(pd.size, '') , " ",
        IFNULL(pd.length, '') , " ",
        IFNULL(pd.dimension, '') , " ",
        IFNULL(pd.type, '') , " ",
        IFNULL(pd.weight, '') , " ",
        IFNULL(pd.wattage, '')
    ) AS productOption,
    i.quantity,
    i.changes_type,
    i.updated_stock,
    i.sub_total
FROM 
    inventory i
JOIN 
    products p ON i.product_code = p.product_code
JOIN 
    product_details pd ON i.product_detail_id = pd.detail_id
WHERE
    i.sales_id = ?;
        `;

        
        // Execute the query with the sales_id parameter
        db.execute(query, [sales_id], (err, result) => {
            if (err) {
                console.error('Error in fetching data:', err.message);
                reject(new Error('Failed to fetch sales_inventory.'));
            } else {
                resolve(result); // Resolve with the query result
            }
        });
    });
};
exports.getSaleById = (sales_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
               *
            FROM 
                sales
            WHERE
                sale_id = ?;
        `;

        
        // Execute the query with the sales_id parameter
        db.execute(query, [sales_id], (err, result) => {
            if (err) {
                console.error('Error in fetching data:', err.message);
                reject(new Error('Failed to fetch sales_inventory.'));
            } else {
                resolve(result); // Resolve with the query result
            }
        });
    });
};


// exports.clearReciept = (staffId) => {
//     return new Promise((resolve, reject) => {
//         const query = `
//             DELETE FROM reciept WHERE staff_id = ?
//         `;
        
//         // Execute the query with the staff_id parameter
//         db.execute(query, [staffId], (err, result) => {
//             if (err) {
//                 console.error('Error in copying cart data:', err.message);
//                 reject(new Error('Failed to copy data to sales_inventory.'));
//             } else {
//                 console.log(`Successfully copied data to sales_inventory for staff_id ${staffId}`);
//                 resolve(result.affectedRows); // Resolve with the number of affected rows
//             }
//         });
//     });
// };


// exports.copyCartToReciept = (staffId) => {
//     return new Promise((resolve, reject) => {
//         const query = `
//             INSERT INTO reciept (product_code, product_name, product_price, quantity, category1, category2, created_at, staff_id, product_detail_id)
//             SELECT product_code, product_name, product_price, quantity, category1, category2, created_at, staffID, product_detail_id
//             FROM cart
//             WHERE staffID = ?
//         `;
        
//         // Execute the query with the staff_id parameter
//         db.execute(query, [staffId], (err, result) => {
//             if (err) {
//                 console.error('Error in copying cart data:', err.message);
//                 reject(new Error('Failed to copy data to sales_inventory.'));
//             } else {
//                 console.log(`Successfully copied data to sales_inventory for staff_id ${staffId}`);
//                 resolve(result.affectedRows); // Resolve with the number of affected rows
//             }
//         });
//     });
// };
