const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController');


router.post('/validate-login', loginController.validateStaffLogin); // Ensure this matches the controller method
router.get('/emails', loginController.getAllEmails);


const customerController = require('../controller/customerController'); // Import customer router
router.get('/checkTableEmpty', customerController.checkTableEmpty);
router.post('/saveCustomer', customerController.saveCustomer);

const productController = require('../controller/productController'); // Import customer router
router.post('/checkProduct', productController.checkProduct);
router.get('/products', productController.fetchAllProducts);
router.get('/product-details/:productCode', productController.getProductDetails);

router.post('/get-product-price', productController.getProductPrice);
router.post('/add-cart', productController.addProductCart);
router.post('/cart', productController.getCart);
router.put('/costumer', customerController.getCostumerInfo);

router.get('/cart/:productCode', productController.deleteProduct);
router.post('/cart/update', productController.updateCart);



module.exports = router;