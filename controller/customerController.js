const customerModel = require('../models/customerModel'); // Import customer model

exports.checkTableEmpty = async (req, res) => {
  try {
    const staffID = req.headers.staffid; // Get staffID from request headers
    if (!staffID) {
      return res.status(400).json({ isEmpty: null, message: 'Staff ID is missing' });
    }
    console.log(staffID);

    // Pass staffID to the model or use it for additional checks
    const isEmpty = await customerModel.isTableEmpty(staffID);

    res.status(200).json({ isEmpty, message: isEmpty ? true : false });
  } catch (error) {
    console.error("Error checking table status: ", error);
    res.status(500).json({ isEmpty: null, message: 'Server error' });
  }
};


exports.saveCustomer = async (req, res) => {
  const { customerName, contactNumber, staffID } = req.body;
console.log(staffID);
  try {
    await customerModel.insertCustomer(customerName, contactNumber, staffID);
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving customer: ", error);
    res.status(500).json({ message: 'Server error' });
  }
};
    

exports.getCostumerInfo = (req, res) => {

  const { staff_id } = req.body; // Extract staff_id from the request body
  console.log(staff_id);
    if (!staff_id) {
        return res.status(400).json({ message: 'Staff ID is required' });
    }
  customerModel.getCostumerInfo(staff_id,(err, data) => {
      if (err) {
          return res.status(500).json({ message: 'Server error' });
      }
      if (data && data.length > 0) {

          console.log(data);
          res.json({costumer: data});
      } else {
          res.status(404).json({ message: 'No customer data found' });
      }
  });
};