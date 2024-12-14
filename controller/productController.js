const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const ProductModel = require('../models/ProductModels');
const { console } = require('inspector');

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
        qrCode: `product/qrcode/${productCode}.png`  // Store the relative path
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
  const { code } = req.body; // Extract QR code from the request body
  console.log(code); // Log the QR code for debugging

  try {
    // Fetch product data based on the QR code
    const product = await ProductModel.getProductByQRCode(code);

    // If a product was found
    if (product && product.length > 0) {
      console.log(product);
      res.json({
        exists: true,
        product_data: product[0], // Extract product_code from the first element
      });
    } else {
      // If no product found, return `exists: false`
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


exports.RestockProduct = async (req, res) => {
  const { productId, price, quantity, changes } = req.body;

  console.log('Request body:', req.body); // Log incoming request data

  // Validate input
  if (!productId || price === undefined || quantity === undefined) {
    console.error('Invalid request data:', req.body);
    return res.status(400).json({
      message: 'Invalid request data: Missing or undefined parameter(s).',
    });
  }

  try {
    // Restock or deduct based on the 'changes' type
    if (changes === 'restock') {
      await ProductModel.restock(productId, price, quantity);
    } else {
      await ProductModel.deduct(productId, price, quantity);
    }

    // Retrieve the product details after update
    const product = await ProductModel.productDetail(productId);

    // Save inventory changes
    await ProductModel.saveInventory(
      product.product_code,
      product.detail_id,
      quantity,
      changes,
      product.stock,  // Using updated stock value
      product.price,
    );

    res.status(200).json({
      message: 'Product restocked successfully!',
    });
  } catch (error) {
    console.error('Error in RestockProduct:', error.message);
    res.status(500).json({ message: 'Failed to restock product.' });
  }
};