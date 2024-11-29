// models/sessionModel.js
const db = require('../config/db'); // Assuming you have a database connection set up

// Function to insert session data into the sessions table
const createSession = async (sessionId, userId, browser, ip, sessionData, role) => {
    const query = `
        INSERT INTO sessions (session_id, user_id, browser, ip, session_data, created_at, role)
        VALUES (?, ?, ?, ?, ?, NOW(), ?)
    `;
    
    return new Promise((resolve, reject) => {
        db.query(query, [sessionId, userId, browser, ip, sessionData, role], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Function to update session data in the sessions table
const updateSession = async (sessionId, browser, ip, userId, sessionData, role) => {
    const sql = `
        UPDATE sessions
        SET user_id = ?, browser = ?, ip = ?, session_data = ?, updated_at = NOW(), role = ?
        WHERE session_id = ?
    `;
    return db.execute(sql, [userId, browser, ip, sessionData || null, role || null, sessionId || null]);
};
// Function to fetch session data by session ID
const getSessionById = async (sessionId) => {
    const query = `SELECT * FROM sessions WHERE session_id = ?`;
    
    return new Promise((resolve, reject) => {
        db.query(query, [sessionId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0]);
        });
    });
};

// In sessionModel.js
const getSessionData = async (sessionId) => {
    try {
        const session = await getSessionById(sessionId);
        return session ? session.session_data : null;
    } catch (err) {
        console.error('Error fetching session data:', err);
        return null;
    }
};

module.exports = {
    createSession,
    updateSession,
    getSessionById,
    getSessionData, // Add this to fetch session data
};
