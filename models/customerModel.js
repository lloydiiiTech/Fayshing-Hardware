const db = require('../config/db'); // Assuming you have a config file to set up your database connection

exports.isTableEmpty = async (staffID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNT(*) AS count FROM customers WHERE staffID = ?`;

    db.query(sql, [staffID], (err, results) => {
      if (err) {
        console.error('Error checking table status:', err);
        return reject(err);
      }

      // Ensure results have the expected structure
      if (results.length > 0 && results[0].count !== undefined) {
        resolve(results[0].count === 0); // Resolve true if count is 0
      } else {
        reject(new Error('Unexpected results structure'));
      }
    });
  });
};


// Insert customer data
exports.insertCustomer = async (name, contactNumber, staffID) => {
    const sql = `INSERT INTO customers (name, contact_number, staffID, created_at)
                 VALUES (?, ?, ?, NOW())`;
  
    return new Promise((resolve, reject) => {
      db.query(sql, [name, contactNumber, staffID], (err, results) => {
        if (err) {
          console.error('Error inserting customer:', err);
          return reject(err); // Reject with error
        }
        resolve(results); // Resolve with results
      });
    });
  };
  

  exports.getCostumerInfo = (staff_id, callback) => {
    const query = 'SELECT * FROM customers WHERE staffID = ?';  // Replace with your actual query
    db.query(query, staff_id, (err, results) => {
        if (err) {
            console.error('Error fetching cart items:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};
  


exports.deleteCostumer = async (staffId) => {
  const query = 'DELETE FROM customers WHERE staffID = ?';
  return new Promise((resolve, reject) => {
      db.query(query, [staffId], (error, results) => {
          if (error) {
              return reject(error);
          }
          resolve(results);
      });
  });
};