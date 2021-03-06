require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../db").import("../models/user");

const validateAdmin = (req, res, next) => {
	const token = req.headers.authorization;
	jwt.verify(token, process.env.SIGNATURE, (err, decoded) => {
		if (!err && decoded) {
			User.findOne({ where: { id: decoded.id } })
				.then((user) => {
					console.log(user.role);
					if (!user) throw "err";
					if (user.role !== "admin") throw "err";
					req.user = user;
					return next();
				})
				.catch((err) => next(err));
		} else {
			req.errors = err;
			return res.status(500).send("Not Authorized");
		}
	});
};

module.exports = validateAdmin;
