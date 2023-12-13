const User = require("../models/User");
const Note = require("../models/Note");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//@desc Get all users
//@route GET /users
//@access Private

const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find().select("-password").lean();
	if (!users?.length) {
		return res.status(400).json({message: "No user Found"});
	}
	res.json(users);
});
//@desc Create new user
//@route POST /users
//@access Private

const createNewUser = asyncHandler(async (req, res) => {
	const {username, password, roles} = req.body;
	console.log(username, password, roles);
	if (!username || !password) {
		return res.status(400).json({message: "All fields are required"});
	}
	const duplicate = await User.findOne({username})
		.collation({locale: "en", strength: 2})
		.lean()
		.exec();
	if (duplicate) {
		return res.status(409).json({message: "Username already exists"});
	}
	const hashedPwd = await bcrypt.hash(password, 12);
	const userObject =
		!Array.isArray(roles) || !roles.length
			? {username, password: hashedPwd}
			: {username, password: hashedPwd, roles};
	const newUser = await User.create(userObject);
	if (newUser) {
		res.status(201).json({message: `New user created`});
	} else {
		res.status(400).json({message: `Failed to create new user!`});
	}
});

//@desc Update users
//@route PATCH /users
//@access Private

const updateUser = asyncHandler(async (req, res) => {
	const {id, username, roles, active, password} = req.body;
	if (
		!id ||
		!username ||
		!Array.isArray(roles) ||
		!roles.length ||
		typeof active !== "boolean"
	) {
		return res.status(400).json({message: "All fields are required"});
	}
	const foundUser = await User.findById(id).exec();
	if (!foundUser) {
		return res.status(400).json({message: `${username} is not found!`});
	}
	//Check if new username already exists
	const duplicate = await User.findOne({username})
		.collation({locale: "en", strength: 2})
		.lean()
		.exec();
	if (duplicate && duplicate?._id.toString() !== id) {
		return res
			.status(409)
			.json({message: `${username} username is already used.`});
	}
	foundUser.username = username;
	foundUser.active = active;
	foundUser.roles = roles;
	if (password) {
		foundUser.password = await bcrypt.hash(password, 12);
	}
	const userSaved = await foundUser.save();
	res.json({message: `${username} is updated.`});
});

//@desc Delete users
//@route DELETE /users
//@access Private

const deleteUser = asyncHandler(async (req, res) => {
	const {id} = req.body;
	if (!id) {
		return res.status(400).json({message: `User Id is required`});
	}
	const note = await Note.find({user: id}).lean().exec();
	if (note) {
		return res.status(400).json({message: "User has assigned notes"});
	}
	const user = await User.findById(id).exec();
	if (!user) {
		return res.status(400).json({message: "User not found"});
	}
	const result = await user.deleteOne();
	const reply = `Username ${result.username} with ID ${result._id} is deleted`;
	res.json({message: reply});
});

module.exports = {getAllUsers, createNewUser, updateUser, deleteUser};
