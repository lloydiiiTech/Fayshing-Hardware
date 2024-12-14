
const cartModel = require('../models/CartModel');
const costumerModel = require('../models/customerModel');

exports.addProductCart = async (req, res) => {
    try {
        const {
            product_code, product_name, product_price, quantity, staffID,
            color, liter, size, length, weight, dimension, wattage, type, product_detail_id
        } = req.body;
  
        console.log(product_code, product_name, product_price, quantity, staffID, color, liter, size, length, weight, dimension, wattage, type, product_detail_id);
  
        // Filter out null or empty values for category1 and category2
        const potentialCategories = [color, liter, size, length, weight, dimension, wattage, type];
        const nonEmptyCategories = potentialCategories.filter(value => value != null && value !== "");
        const category1 = nonEmptyCategories[0] || null;
        const category2 = nonEmptyCategories[1] || null;
  
        const productData = {
            product_code,
            product_name,
            product_price,
            quantity,
            category1,
            category2,
            staffID,
            product_detail_id
        };
  
        // Check if the product exists in the cart
        const existingProduct = await cartModel.getCartProduct(product_code, product_detail_id, staffID);
  
        
        if (existingProduct) {
            const newQuantity = existingProduct.quantity + quantity; // Add the new quantity
            const updateResult = await cartModel.updateCartQuantity(existingProduct.id, newQuantity); // Use cart_id for updating
            console.log(updateResult + " " + newQuantity);
            if (updateResult && updateResult.affectedRows > 0) {
                console.log("Product quantity updated");
                res.json({ exists: true, cartId: existingProduct.cart_id });
            } else {
                res.status(500).json({ message: "Failed to update product quantity" });
            }
        } else {
            // Add the product if it doesn't exist
            const result = await cartModel.addProductToCart(productData);
  
            if (result && result.affectedRows > 0) {
                console.log("Product added to cart");
                res.json({ exists: true, cartId: result.insertId });
            } else {
                res.status(500).json({ message: "Failed to add product to cart" });
            }
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ message: "Server error" });
    }
  };
  
  
  
  
  exports.getCart = (req, res) => {
    const { staff_id } = req.body; // Extract staff_id from the request body
    console.log(staff_id);
      if (!staff_id) {
          return res.status(400).json({ message: 'Staff ID is required' });
      }
  
    cartModel.getCartItems(staff_id, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        res.json({ products: data });
    });
  };
  
  exports.deleteProduct = (req, res) => {
    const productCode = req.params.productCode;
    console.log(productCode);
  
    if (!productCode) {
        return res.status(400).json({ message: 'Product code is required' });
    }
  
    cartModel.deleteProduct(productCode, (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ message: 'Failed to delete product' });
        }
  
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    });
  };
  
  
  exports.updateCart = async (req, res) => {
    console.log('Request body:', req.body); // Log request body
  
    const cart = req.body.cart;
  
    console.log(cart);
    if (!Array.isArray(cart)) {
        console.log('Invalid cart data received:', req.body); // Log invalid data
        return res.status(400).json({ message: 'Invalid cart data' });
    }
  
    try {
        console.log('Updating cart with data:', cart); // Log cart data
        await cartModel.updateCartItems(cart);
        console.log('Cart updated successfully'); // Log success
        res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Error updating cart:', error); // Log error
        res.status(500).json({ message: 'Failed to update cart' });
    }
  };
  
  
  
  exports.cancelOrder = async (req, res) => {
    const { staff_id } = req.body;

    if (!staff_id) {
        return res.status(400).json({ message: 'Staff ID is required.' });
    }

    try {
        // Call the model to perform the cancellation
        await cartModel.deleteCartByStaffId(staff_id);
        await costumerModel.deleteCostumer(staff_id);
        res.status(200).json({ message: 'Order cancelled successfully.' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'An error occurred while cancelling the order.' });
    }
};