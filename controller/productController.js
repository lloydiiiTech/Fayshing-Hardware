const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const ProductModel = require('../models/ProductModels');

function generateRandomProductCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

function generateUniqueProductCode(callback) {
  const productCode = generateRandomProductCode();

  ProductModel.checkProductCodeExists(productCode, (err, exists) => {
    if (err) {
      return callback(err, null);
    }

    if (exists) {
      generateUniqueProductCode(callback);
    } else {
      callback(null, productCode);
    }
  });
}

exports.addProduct = (req, res) => {
  const { productName, selectedCategory, options } = req.body;

  generateUniqueProductCode((err, productCode) => {
    if (err) {
      return res.status(500).json({ message: 'Error generating product code', error: err });
    }

    // Define the URL for the QR code
    const qrCodeURL = `${productCode}`;

    // Define the file path
    const qrCodeDir = path.join(__dirname, '..', 'appdev-AdminSide-View' , 'src' , 'assets', 'product', 'qrcode');
    const qrCodeFilePath = path.join(qrCodeDir, `${productCode}.png`);

    // Ensure the directory exists
    if (!fs.existsSync(qrCodeDir)) {
      fs.mkdirSync(qrCodeDir, { recursive: true });
    }

    // Generate and save the QR code to a file
    QRCode.toFile(qrCodeFilePath, qrCodeURL, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error generating QR code', error: err });
      }

      const productData = {
        productCode,
        productName,
        selectedCategory,
        qrCode: `/appdev-AdminSide-View/src/assets/product/qrcode/${productCode}.png`  // Store the relative path
      };

      ProductModel.addProduct(productData, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error saving product', error: err });
        }

        const saveProductDetails = options.map((option) => {
          return new Promise((resolve, reject) => {
            const productDetailsData = {
              productCode,
              stock: option.stock || null,
              price: option.price || null,
              color: option.color || null,
              liter: option.liter || null,
              size: option.size || null,
              length: option.length || null,
              dimension: option.dimension || null,
              type: option.type || null,
              weight: option.weight || null,
              wattage: option.wattage || null
            };

            ProductModel.addProductDetails(productDetailsData, (err, detailsResult) => {
              if (err) {
                reject(err);
              } else {
                resolve(detailsResult);
              }
            });
          });
        });

        Promise.all(saveProductDetails)
          .then(() => {
            res.status(200).json({
              success: true,  // Add this field to indicate success
              message: 'Product and details saved successfully',
              productId: result.insertId,
              qrCode: `${productCode}`
            });         
          })
          .catch((error) => {
            console.error("Error details:", error);
            res.status(500).json({ message: 'Error saving product details', error });
          });
      });
    });
  });
};

exports.checkProduct = async (req, res) => {
  const { code } = req.body;
console.log(code);
  try {
    // Fetch product data based on QR code
    const product = await ProductModel.getProductByQRCode(code);

    if (product.length > 0) {
      // If product exists, return the product details
      res.json({
        exists: true,
        product: product[0]  // Returning the first matching product
      });
    } else {
      // If product does not exist, send a response indicating this
      res.json({ exists: false });
    }
  } catch (error) {
    // Handle any errors during the process
    console.error("Error checking product:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.fetchAllProducts = async (req, res) => {
  
  try {
    const products = await ProductModel.getAllProducts();
    res.json(products); // Send products as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getProductDetails = async (req, res) => {
  const { productCode } = req.params;

  try {
    const product = await ProductModel.getProductDetails(productCode);
    console.log(product);
    if (product) {
      res.status(200).json(product); // Send the product details in the response
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving product details' });
  }
};

exports.getProductPrice = async (req, res) => {
  try {
    const { product_code, color, liter, size, length, weight, dimension, wattage, type } = req.body;

    console.log(product_code, color, liter, size, length, weight, dimension, wattage, type);

    const productData = await ProductModel.fetchProductDetails(product_code, {
      color,
      liter,
      size,
      length,
      weight,
      dimension,
      wattage,
      type,
    });
console.log(productData);
    if (!productData) {
      console.log(productData + "none");
      return res.status(200).json({ message: 'Product Out of Stock' });
      
    }

    // Check stock availability
    if (productData.stock === 0) {
      console.log(productData);
      return res.status(200).json({ message: 'Product Out of Stock' });
    }

    if (productData.stock < 10) {
      console.log(productData);
      return res.status(200).json({
        message: `Low Stock: Only ${productData.stock} left`,
        productData,
      });
    }

    // Return product data with sufficient stock
    res.status(200).json({
      message: 'Product Available',
      productData,
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




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
      const existingProduct = await ProductModel.getCartProduct(product_code, product_detail_id, staffID);

      
      if (existingProduct) {
          const newQuantity = existingProduct.quantity + quantity; // Add the new quantity
          const updateResult = await ProductModel.updateCartQuantity(existingProduct.id, newQuantity); // Use cart_id for updating
          console.log(updateResult + " " + newQuantity);
          if (updateResult && updateResult.affectedRows > 0) {
              console.log("Product quantity updated");
              res.json({ exists: true, cartId: existingProduct.cart_id });
          } else {
              res.status(500).json({ message: "Failed to update product quantity" });
          }
      } else {
          // Add the product if it doesn't exist
          const result = await ProductModel.addProductToCart(productData);

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

  ProductModel.getCartItems(staff_id, (err, data) => {
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

  ProductModel.deleteProduct(productCode, (err, result) => {
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

  if (!Array.isArray(cart)) {
      console.log('Invalid cart data received:', req.body); // Log invalid data
      return res.status(400).json({ message: 'Invalid cart data' });
  }

  try {
      console.log('Updating cart with data:', cart); // Log cart data
      await ProductModel.updateCartItems(cart);
      console.log('Cart updated successfully'); // Log success
      res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
      console.error('Error updating cart:', error); // Log error
      res.status(500).json({ message: 'Failed to update cart' });
  }
};



