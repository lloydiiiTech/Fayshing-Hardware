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
    const sql = `SELECT id, staffEmail FROM staff `;  // Your SQL query
    db.query(sql, (err, rows) => {
      if (err) {
        console.error('Error fetching staff emails:', err);
        return callback(err, null);  // Make sure to pass `callback` as expected
      }
      
      callback(null, rows);  // Pass the data to the callback function
    });
  };

  const findStaffByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id, staffuserName, staffName, staffEmail, staffAddress, contactNumber, mpin, token, status, AdminID, created_at FROM staff WHERE staffEmail = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                reject(err);
            } else {
                resolve(results.length > 0 ? results[0] : null);
            }
        });
    });
};



  const getStaffInfo = (staffId) => {
    return new Promise((resolve, reject) => {
      const query =
        'SELECT staffName, staffuserName, staffEmail, staffAddress, contactNumber, status FROM staff WHERE token = ?';
      db.query(query, [staffId], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  };
  const updateStaffProfile = async (staffID, { username, name, address, contact }) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE staff SET staffuserName = ?, staffName = ?, staffAddress = ?, contactNumber = ? WHERE token= ?`;
      
      db.query(query, [username, name, address, contact, staffID], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve(results); // Return the entire results object
        }
      });
    });
  };
  
  const updateMPIN = async (staffID, newMPIN) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE staff SET mpin = ? WHERE token = ?`;
      
      db.query(query, [newMPIN, staffID], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve(results); // Return the entire results object
        }
      });
    });
  };
  

  
const addStaffs = (staffData, callback) => {
  const { staffuserName, staffName, staffEmail, staffAddress, contactNumber, mpin, token, userImage } = staffData;

  const query = `INSERT INTO staff (staffuserName, staffName, staffEmail, staffAddress, contactNumber, mpin, token, userImage) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [staffuserName, staffName, staffEmail, staffAddress, contactNumber, mpin, token, userImage], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};
const getAllEmail = (callback) => {
  const sql = "SELECT id, staffEmail FROM staff";
  db.query(sql, (err, rows) => {
      if (err) {
          console.error('Error fetching staff emails:', err);
          return callback(err, null);
      }
      callback(null, rows);
  });
};

const getAllStaffs = (callback) => {
  const sql = `SELECT id, staffuserName, staffName, staffEmail, staffAddress, contactNumber, mpin, token, status, AdminID, created_at FROM staff WHERE status = 1`;
  db.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching staff data:', err);
          return callback(err, null);
      }
      callback(null, results);
  });
};

const getAllAdmin = (callback) => {
  const sql = `SELECT user_id, contact, created_at, email, location, password, reset_token, status, token, token_expiry, updated_at, username, user_image, user_role,position FROM admin where position = 1`;
  db.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching admin data:', err);
          return callback(err, null);
      }
      callback(null, results);
  });
};

const updateStaffStatus = (staffId) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE staff SET status = 0 WHERE id = ?';

    db.query(query, [staffId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

  const updateAdminStatus = (adminId) => {
      return new Promise((resolve, reject) => {
      const query = 'UPDATE admin SET position = 0 WHERE user_id = ?';
  
      db.query(query, [adminId], (err, results) => {
          if (err) {
          reject(err);
          } else {
          resolve(results);
          }
      });
      });
  };


  
module.exports = {
    addStaff,
    getAllEmails,
    findStaffByEmail,
    getStaffInfo,
    updateStaffProfile,
    updateMPIN,
    addStaffs,
    getAllEmail,
    getAllStaffs,
    getAllAdmin,
    updateStaffStatus,
    updateAdminStatus

};
