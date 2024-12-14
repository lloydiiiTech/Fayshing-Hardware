const db = require('../config/db');

const findByEmail = (email) => {
  const query = 'SELECT user_id, username, user_role, password, status FROM admin WHERE email = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [email], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]); // Return the first matching admin
    });
  });
};


const getAdminByToken = (token) => {
    return db.execute(
      'SELECT * FROM admin WHERE token = ?', [token]);
  };
  
  
  const verifyEmail = (token) => {
    return db.execute(
        'UPDATE admin SET status = 1 WHERE token = ?', [token]);
  };
  

const registerAdmin = (userData) => {
    return new Promise((resolve, reject) => {
      const { username, email, location, password, token, contact, userRole, userImage } = userData;

      const sql = `
        INSERT INTO admin (username, email, location, contact, password, token, user_role, user_image, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      
      const values = [username, email, location, contact, password, token, userRole || 'admin', userImage, 'not verified'];

      db.query(sql, values, (error, results) => {
        if (error) {
          console.error("Database error:", error);
          return reject(new Error("Failed to register user."));
        }
        resolve(results);
      });
    });
};



const findById = (adminId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM admin WHERE admin_id = ?`;
    db.query(sql, [adminId], (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return reject(new Error("Failed to find admin."));
      }
      if (results.length === 0) {
        return reject(new Error("Admin not found."));
      }
      resolve(results[0]); // Return the first matching admin record
    });
  });
};

const updateAdmin = (adminId, updatedData) => {
  return new Promise((resolve, reject) => {
    // Ensure user_role is set to 'admin' when updating
    const { username, email, location, contact, userImage } = updatedData;
    const userRole = 'admin'; // Set the role to 'admin'

    const sql = `
    UPDATE admin 
    SET username = ?, email = ?, location = ?, contact = ?, user_role = ?, updated_at = NOW() 
    ${userImage ? ", user_image = ?" : ""} 
    WHERE admin_id = ?
  `;
  
  const values = userImage ? [username, email, location, contact, userRole, userImage, adminId] 
                            : [username, email, location, contact, userRole, adminId];
  
  db.query(sql, values, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return reject(new Error("Failed to update admin details."));
    }
    if (results.affectedRows === 0) {
      return reject(new Error("Admin not found."));
    }
    resolve({ message: "Admin updated successfully.", results });
  });
  
  });
};

module.exports = {
  findByEmail,
  registerAdmin,
  getAdminByToken,
  verifyEmail,
  findById,
  updateAdmin
};
