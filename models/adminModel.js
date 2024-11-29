const db = require('../config/db');

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

const getAdminByToken = (token) => {
  return db.execute(
    'SELECT * FROM admin WHERE token = ?', [token]);
};


const verifyEmail = (token) => {
  return db.execute(
      'UPDATE admin SET status = 1 WHERE token = ?', [token]);
};


const getUserImageFromDb = async (adminId) => {
  const query = `SELECT user_image FROM admin WHERE admin_id = ?`; // Adjust table/column names as per your DB
  const [rows] = await db.execute(query, [adminId]);

  if (rows.length > 0) {
    return rows[0].user_image;  // The BLOB data
  } else {
    return null;
  }
};

const findByEmail = (email) => {
  const query = 'SELECT * FROM admin WHERE email = ?'; // Query without `status` restriction
  return new Promise((resolve, reject) => {
    db.execute(query, [email], (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return reject(error);
      }
      resolve(results.length > 0 ? results[0] : null); // Return admin or null
    });
  });
};



const saveResetToken = (userId, token) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE admin SET reset_token = ?, token_expiry = NOW() + INTERVAL 1 HOUR WHERE Admin_id = ?";
    db.query(query, [token, userId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

const savePasswordReset = (adminId, resetToken, tokenExpiry) => {
  const query =
    "INSERT INTO password_resets (admin_id, reset_token, token_expiry, created_at) VALUES (?, ?, ?, NOW())";
  return new Promise((resolve, reject) => {
    db.execute(query, [adminId, resetToken, tokenExpiry], (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};


const updateAdminDetails = (adminId, updatedData) => {
  return new Promise((resolve, reject) => {
    const { username, email, location, contact, token, userRole, userImage } = updatedData;

    const sql = `
      UPDATE admin 
      SET username = ?, email = ?, location = ?, contact = ?, token = ?, user_role = ?, user_image = ?, updated_at = NOW() 
      WHERE id = ?
    `;

    const values = [username, email, location, contact, token, userRole, userImage, adminId];

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

const updatePassword = (adminId, newPassword, callback) => {
  const sql = 'UPDATE admins SET password = ? WHERE admin_id = ?';
  db.query(sql, [newPassword, adminId], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    console.log(result); // Log the result
    callback(null, result);
  });
};


module.exports = {
  registerAdmin,
  verifyEmail,
  getUserImageFromDb,
  getAdminByToken,
  findByEmail,
  saveResetToken,
  updateAdminDetails, // Added the new method
  savePasswordReset,
  updatePassword
};



