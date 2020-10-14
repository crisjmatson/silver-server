require("dotenv").config();
let router = require("express").Router();
let Profile = require("../db").import("../models/profile");
let validateSession = require("../middleware/validate-session");
let validateAdmin = require("../middleware/validate-admin");

router.post("/", validateSession, function (req, res) {
	Profile.findOne({
		where: { userId: req.user.id },
	})
		.then(function profileCheck(profile) {
			if (profile) {
				res.status(409).send({ message: "Profile already exists for user" });
			} else {
				Profile.create({
					userId: req.user.id,
					avatar: req.body.profile.avatar,
					grad_status: req.body.profile.grad_status,
					date_graduated: req.body.profile.date_graduated,
				}).then(function profileCreate(profile) {
					res.status(200).json({
						profile: profile,
						message: "Profile created.",
					});
				});
			}
		})

		.catch((err) => res.status(500).send({ error: err }));
});

router.get("/view", validateSession, function (req, res) {
	Profile.findOne({
		where: { userId: req.user.id },
	})
		.then(function profileDisplay(profile) {
			if (profile) {
				res.status(200).json({ profile: profile });
			} else {
				Profile.create({
					userId: req.user.id,
				}).then(function profileCreate(profile) {
					res.status(200).json({
						profile: profile,
						message: "Profile created.",
					});
				});
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.put("/update", validateSession, function (req, res) {
	Profile.update(
		{
			avatar: req.body.profile.avatar,
			grad_status: req.body.profile.grad_status,
			date_graduated: req.body.profile.date_graduated,
			challenges_completed: req.body.profile.challenges_completed,
		},
		{ where: { userId: req.user.id } }
	)
		.then((users) => res.status(200).json(users))
		.catch((err) => res.status(500).send({ error: err }));
});

router.delete("/delete", validateSession, function (req, res) {
	Profile.destroy({ where: { userId: req.user.id } })
		.then(() => res.status(200).json({ message: "user profile deleted" }))
		.catch((err) => res.status(500).send({ error: err }));
});

/* ---------------- ADMIN ROUTES ---------------- */

router.get("/admin_view", validateAdmin, function (req, res) {
	// ADMIN GET ALL PROFILES
	Profile.findAll()
		.then(function profileDisplayAll(profiles) {
			if (profiles) {
				res.status(200).json({ profiles: profiles });
			} else {
				res.status(500).json({ error: "No profiles found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.delete("/admin_delete", validateAdmin, function (req, res) {
	// DELETE PROFILE OF USER
	Profile.destroy({ where: { id: req.body.user.id } })
		.then(() => res.status(200).json({ message: "user profile deleted" }))
		.catch((err) => res.status(500).send({ error: err }));
});

module.exports = router;
