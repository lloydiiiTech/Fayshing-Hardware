const salesModel = require('../models/salesinventoryModel');



exports.submitSales = async (req, res) => {
    try {
        const saleData = req.body;

        console.log(saleData);
    
        // Validate required fields
        // if (
        //   !saleData.customer_name ||
        //   !saleData.staff_name ||
        //   saleData.amount_paid < saleData.total_price
        // ) {
        //   return res.status(400).json({ message: 'Invalid sale data.' });
        // }
    
        // // Save sale data to the sales table
        // const saleId = await salesModel.createSale(saleData);
    
        // // Update inventory for each product
        // for (const product of saleData.products) {
        //   await salesModel.updateInventory(product.product_id, product.quantity);
        // }
    
        // res.status(201).json({ message: 'Sale submitted successfully!', saleId });
      } catch (error) {
        console.error('Error in submitSale:', error);
        res.status(500).json({ message: 'An error occurred while submitting the sale.' });
      }
};

