const {logEvents} = require("./logger");

const errorHandler = (err, req, res, next) => {
	logEvents(
		`${err.name}:${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
		"errLog.txt"
	);
	console.log(err.stack);
	const status = res.statusCode ? res.statusCode : 500; //server code
	res.status(status);
	res.json({message: err.message, isError: true});
};

module.exports = errorHandler;
