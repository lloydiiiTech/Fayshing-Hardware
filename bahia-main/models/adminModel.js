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






module.exports = {
  registerAdmin,
  verifyEmail,
  getAdminByToken,
  findByEmail,
};



