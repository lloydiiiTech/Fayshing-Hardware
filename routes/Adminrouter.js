const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController');

const adminController = require('../controller/adminController');

router.post('/login', adminController.loginAdmin);

router.post('/register', adminController.upload.single('userImage'), adminController.register);
router.get('/verifyAccount', adminController.verifyEmailController);





const productController = require('../controller/productController');
const staffController = require('../controller/staffController');


router.post('/addproducts', productController.addProduct);
router.post('/restock-product', productController.RestockProduct);

router.post('/addstaff', staffController.addStaff);



const salesController = require('../controller/salesController.js');


// Metrics Route
router.get('/metrics', salesController.getMetrics);

// Sales Graph Route
router.get('/salesGraph', salesController.getSalesGraph);

// Product Details Route
router.get('/products', salesController.getProductDetails);

// Inventory Changes Route
router.get('/inventory', salesController.getInventoryChanges);

// Sales Transactions Route
router.get('/sales', salesController.getSalesTransactions);
router.get('/productStock', salesController.getProductStock);
router.get('/productSales', salesController.getProductSales);
router.get("/productDetails/:productCode", salesController.getDetail);

const SalesController = require('../controller/Sales.js');

// API route to fetch sales report
router.get('/sales-report', SalesController.getSalesReport);




const staffControllers = require('../controller/staffControllers');
router.put('/remove/:id', staffControllers.removeStaff);
router.post('/addstaff', staffControllers.addStaff);
router.get('/staff', staffControllers.getAllStaff);
router.get('/admin', staffControllers.getAllAdmin);

router.put('/adminremove/:id', staffControllers.removeAdmin);



router.put('/update-admin/:id', adminController.updateAdmin);
router.get('/get-admin/:adminID', adminController.getAdminData);


module.exports = router;