// models/StaffModel.js
const db = require('../config/db');

const addStaff = (staffData, callback) => {
    const { staffuserName, staffName, staffEmail, staffAddress, contactNumber, mpin, token } = staffData;

    // SQL query to insert staff data
    const sql = `INSERT INTO staff (staffuserName, staffName, staffEmail, staffAddress, contactNumber, mpin, token)
                 VALUES ( ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [staffuserName, staffName, staffEmail, staffAddress, contactNumber, mpin, token], (err, results) => {
      if (err) {
        console.error('Error inserting staff:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  };
  const getAllEmails = (callback) => {
    const sql = `SELECT staffEmail FROM staff`;  // Your SQL query
    db.query(sql, (err, rows) => {
      if (err) {
        console.error('Error fetching staff emails:', err);
        return callback(err, null);  // Make sure to pass `callback` as expected
      }
      
      callback(null, rows);  // Pass the data to the callback function
    });
  };

  const findStaffByEmailAndMpin = async (email, mpin) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, staffuserName, staffName, staffEmail, staffAddress, contactNumber, token, status, AdminID, created_at FROM staff WHERE staffEmail = ? AND mpin = ?';
      db.query(query, [email, mpin], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  };
  




module.exports = {
    addStaff,
    getAllEmails,
    findStaffByEmailAndMpin
};
