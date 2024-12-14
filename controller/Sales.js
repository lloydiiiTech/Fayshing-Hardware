

const salesModel = require('../models/salesModel');

const getSalesReport = (req, res) => {
    const { startDate, endDate } = req.query;  // Extract start and end dates from query parameters
  
    // Validate that both dates are provided
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Both startDate and endDate are required' });
    }
  
    // Call the model to get the filtered sales data
    salesModel.getSalesReport(startDate, endDate)
      .then((salesData) => {
        res.json(salesData);  // Return the sales data to the frontend
      })
      .catch((err) => {
        console.error('Error fetching sales report:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  };

    
module.exports = {
  getSalesReport
};
