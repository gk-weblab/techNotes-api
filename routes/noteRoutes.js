const express = require("express");
const router = express.Router();
const {
	getAllNotes,
	createNewNote,
	updateNote,
	deleteNote,
} = require("../controllers/noteControllers");
const verifyJWT = require("../middlewares/verifyJWT");
router.use(verifyJWT);
router
	.route("/")
	.get(getAllNotes)
	.post(createNewNote)
	.patch(updateNote)
	.delete(deleteNote);

module.exports = router;
