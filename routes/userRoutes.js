const express = require("express");
const router = express.Router();
const {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
} = require("../controllers/userControllers");
const verifyJWT = require("../middlewares/verifyJWT");
router.use(verifyJWT);
router
	.route("/")
	.get(getAllUsers)
	.post(createNewUser)
	.patch(updateUser)
	.delete(deleteUser);

module.exports = router;
