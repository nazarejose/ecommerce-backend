const { Router } = require("express");
const UserController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = new Router();

router.post("/", UserController.create);
router.post("/token", UserController.login);

router.put("/:id", authMiddleware, UserController.update);

router.delete('/:id', authMiddleware, UserController.delete);

module.exports = router;
