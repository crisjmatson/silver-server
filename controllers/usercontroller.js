require("dotenv").config();
let router = require("express").Router();
let User = require("../db").import("../models/user");
let Post = require("../db").import("../models/post");
let Comment = require("../db").import("../models/comment");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
let validateSession = require("../middleware/validate-session");
let validateAdmin = require("../middleware/validate-admin");

router.post("/start", function (req, res) {
	User.create({
		username: req.body.user.name,
		email: req.body.user.mail,
		password: bcrypt.hashSync(req.body.user.pass, 14),
		role: req.body.user.role,
	})
		.then(function userStart(user) {
			let token = jwt.sign(
				{ id: user.id, role: user.role },
				process.env.SIGNATURE,
				{
					expiresIn: 60 * 60 * 24,
				}
			);
			res.status(200).json({
				user: user,
				message: "User created.",
				sessionToken: token,
			});
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.post("/enter", function (req, res) {
	User.findOne({
		where: { username: req.body.user.name },
	})
		.then(function userLogin(user) {
			if (user) {
				bcrypt.compare(req.body.user.pass, user.password, function (
					err,
					matches
				) {
					if (matches) {
						let token = jwt.sign(
							{ id: user.id, role: user.role },
							process.env.SIGNATURE,
							{
								expiresIn: 60 * 60 * 24,
							}
						);
						res.status(200).json({
							user: user,
							message: "User logged in.",
							sessionToken: token,
						});
					}
				});
			} else {
				res.status(502).json({ error: "Login Failed." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.get("/view", validateSession, function (req, res) {
	let currentuser = req.user.id;
	console.log("fetch called");
	User.findOne({
		where: { id: currentuser },
	})
		.then(function userDisplay(user) {
			if (user) {
				res.status(200).json({ user: user });
			} else {
				res.status(500).json({ error: "user profile not available." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.put("/update", validateSession, function (req, res) {
	const updateUser = {
		username: req.body.user.name,
		email: req.body.user.mail,
	};
	const query = { where: { id: req.user.id } };
	User.update(updateUser, query)
		.then((users) => res.status(200).json(users))
		.catch((err) => res.status(500).send({ error: err }));
});

router.delete("/delete", validateSession, function (req, res) {
	const query = { where: { id: req.user.id } };
	User.destroy(query)
		.then(() => res.status(200).json({ message: "user deleted" }))
		.catch((err) => res.status(500).send({ error: err }));
});

/* ---------------- ADMIN ROUTES ---------------- */

router.get("/admin_view", validateAdmin, function (req, res) {
	// ADMIN GET ALL USERS
	User.findAll()
		.then(function userDisplayAll(users) {
			if (users) {
				res.status(200).json({ users: users });
			} else {
				res.status(500).json({ error: "No users found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.delete("/admin_delete", validateAdmin, function (req, res) {
	// DELETE USER AND ALL POSTS BY USER
	Comment.destroy({ where: { userId: req.body.user.id } });
	Post.destroy({ where: { userId: req.body.user.id } });
	User.destroy({ where: { id: req.body.user.id } })
		.then(() => res.status(200).json({ message: "user information deleted" }))
		.catch((err) => res.status(500).send({ error: err }));
});

module.exports = router;
