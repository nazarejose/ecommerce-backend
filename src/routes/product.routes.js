const { Router } = require('express');
const ProductController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = new Router();

router.get('/search', ProductController.search);
router.get('/:id', ProductController.findById);

router.post('/', authMiddleware, ProductController.create);
router.put('/:id', authMiddleware, ProductController.update);

router.delete('/:id', authMiddleware, ProductController.delete);

module.exports = router;