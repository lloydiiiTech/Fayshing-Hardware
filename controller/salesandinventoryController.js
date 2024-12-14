const salesModel = require('../models/salesinventoryModel');

const productModel = require('../models/ProductModels');

const cartModel = require('../models/CartModel');

const customerModel = require('../models/customerModel');

exports.submitSales = async (req, res) => {
    try {
        const saleData = req.body;

        // Validate required fields
        if (
            !saleData.customer_name ||
            !saleData.staff_name ||
            !saleData.amount_paid ||
            !saleData.total_price ||
            saleData.amount_paid < saleData.total_price
        ) {
            return res.status(400).json({ message: 'Invalid sale data.' });
        }

        // Log sale data for debugging
        console.log('Received sale data:', saleData);

        // Insert sale into the database and retrieve the sale ID
        const saleId = await salesModel.createSale(saleData);

        // await salesModel.clearReciept(saleData.staff_id);


        if (!saleId) {
            return res.status(500).json({ message: 'Failed to create sale. Please try again.' });
        }

        // Process each product in the sale
        for (const product of saleData.products) {
            // Fetch the current stock
            const stockData = await productModel.selectStock(product.product_id, product.product_detail_id);
            if (!stockData || stockData.stock < product.quantity) {
                throw new Error(`Insufficient stock for product detail ID ${product.product_detail_id}`);
            }
            console.log("Stock: ", stockData);

            const updatedStock = stockData.stock - product.quantity;
            // Update inventory
            await productModel.updateInventory(product.product_id, product.product_detail_id, updatedStock);

            console.log(`Updated stock for Product Detail ID ${product.product_detail_id}: ${stockData.stock - product.quantity}`);

            // Save inventory details
            await salesModel.saveInventory(
                product.product_id,
                product.product_detail_id,
                product.quantity,
                'Sales',
                updatedStock,
                product.subtotal,
                saleId
            );
        }
        // await salesModel.copyCartToReciept(saleData.staff_id);
        await cartModel.deleteCartByStaffId(saleData.staff_id);

        await customerModel.deleteCostumer(saleData.staff_id);

        res.status(201).json({ message: 'Sale submitted successfully!', salesId: saleId });
    } catch (error) {
        console.error('Error in submitSales:', error);
        res.status(500).json({ message: 'An error occurred while submitting the sale.' });
    }
};



exports.getSaleDetails = async (req, res) => {
  const { salesId } = req.params;

  try {
    // Fetch the sale data from the database using the salesId
    const products = await salesModel.getInventoryById(salesId);
    const customer = await salesModel.getSaleById(salesId);


    const saleData = {
      saleId: customer[0].saleId,
      customerName: customer[0].customer_name,
      customerContact: customer[0].customer_contact,
      purchaseType: customer[0].purchase_type,
      totalItems: customer[0].total_items,
      totalQuantity: customer[0].total_quantity,
      totalPrice: customer[0].total_price,
      paymentMethod: customer[0].payment_method,
      amountPaid: customer[0].amount_paid,
      amountChange: customer[0].amount_change,
      staffName: customer[0].staff_name,
      saleDate: customer[0].sale_date,
      products: products.map(product => ({
        inventoryID: product.inventoryID,
        productId: product.product_code, // Add product_id if needed
        product_detail_id: product.product_detail_id,
        productName: product.product_name,
        productPrice: product.price,
        productOption: product.productOption,
        quantity: product.quantity,
        subtotal: product.sub_total
      }))
    };

    console.log(saleData);
    // Send the sale data as a JSON response
    res.json(saleData);
  } catch (error) {
    console.error('Error fetching sale data:', error);
    res.status(500).json({ message: 'An error occurred while fetching the sale data' });
  }
}
