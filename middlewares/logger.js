const {format} = require("date-fns");
const {v4: uuid} = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;

const path = require("path");

const logEvents = async (message, logFileName) => {
	const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
	const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
	const logPath = path.join(__dirname, "..", "logs");
	try {
		if (!fs.existsSync(logPath)) {
			await fsPromises.mkdir(logPath);
		}
		await fsPromises.appendFile(path.join(logPath, logFileName), logItem);
	} catch (err) {
		console.log(err);
	}
};

const logger = async (req, res, next) => {
	logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.txt");
	console.log(`${req.method} ${req.path}`);
	next();
};
module.exports = {logEvents, logger};
