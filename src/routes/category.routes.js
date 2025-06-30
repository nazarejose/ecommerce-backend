const { Router } = require('express');
const CategoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/auth.middleware');


const router = new Router();

router.get('/search', CategoryController.search);
router.get('/:id', CategoryController.findById);

router.post('/', authMiddleware, CategoryController.create);
router.put('/:id', authMiddleware, CategoryController.update);

router.delete('/:id', authMiddleware, CategoryController.delete);

module.exports = router;