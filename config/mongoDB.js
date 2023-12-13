const mongoose = require("mongoose");

const connectDB = async (URI) => {
	try {
		await mongoose.connect(URI);
	} catch (error) {
		console.log(error);
	}
};

module.exports = connectDB;
