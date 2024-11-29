const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController');

const productController = require('../controller/productController');
const staffController = require('../controller/staffController');


router.post('/addproducts', productController.addProduct);


router.post('/addstaff', staffController.addStaff);

module.exports = router;