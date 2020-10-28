require("dotenv").config();
let router = require("express").Router();
let Comment = require("../db").import("../models/comment");
let validateSession = require("../middleware/validate-session");
let validateAdmin = require("../middleware/validate-admin");

router.post("/", validateSession, function (req, res) {
	// GENERAL COMMENT FOR ALL USERS
	Comment.create({
		author: req.user.username,
		userId: req.user.id,
		postId: req.body.comment.postId,
		body: req.body.comment.body,
		private: req.body.comment.private,
	})
		.then(function commentCreate(comment) {
			res.status(200).json({
				comment: comment,
				message: "Comment created.",
			});
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.get("/yours", validateSession, function (req, res) {
	// USER SPECIFIC COMMENT ACCESS
	Comment.findAll({
		where: { userId: req.user.id },
	})
		.then(function commentDisplayYours(comments) {
			if (comments) {
				res.status(200).json({ comments: comments });
			} else {
				res.status(500).json({ error: "No comments found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.get("/public", function (req, res) {
	// NON-USER ACCESS TO ALL PUBLIC COMMENTS
	Comment.findAll({ where: { private: false } })
		.then(function commentDisplayPublic(comments) {
			if (comments) {
				res.status(200).json({ comments: comments });
			} else {
				res.status(500).json({ error: "No public comments found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.get("/all", validateSession, function (req, res) {
	// USER ACCESS TO ALL COMMENTS
	Comment.findAll()
		.then(function commentDisplayAll(comments) {
			if (comments) {
				res.status(200).json({ comments: comments });
			} else {
				res.status(500).json({ error: "No comments found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.put("/update/:id", validateSession, function (req, res) {
	// USER ACCESS TO UPDATE OWN COMMENTS
	const updateComment = {
		body: req.body.comment.body,
		private: req.body.comment.private,
		edited: true,
	};
	const query = { where: { id: req.params.id, userId: req.user.id } };
	Comment.update(updateComment, query)
		.then(function updatedComments(comments) {
			if (comments[0] === 0) {
				res.status(500).json({ error: "Comment access not allowed." });
			} else {
				res.status(200).json({ message: "Comment update successful" });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.delete("/delete/:id", validateSession, function (req, res) {
	const query = { where: { id: req.params.id, userId: req.user.id } };
	Comment.destroy(query)
		.then(function deletedComments(deleted) {
			if (deleted[0] === 0) {
				res.status(500).json({ error: "Delete comment not allowed." });
			} else {
				res.status(200).json({ message: "Delete comment successful" });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

/* ---------------- ADMIN ROUTES ---------------- */

router.get("/admin_view", validateAdmin, function (req, res) {
	// ADMIN GET ALL COMMENTS
	Comment.findAll()
		.then(function commentDisplayAll(comments) {
			if (comments) {
				res.status(200).json({ comments: comments });
			} else {
				res.status(500).json({ error: "No comments found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.put("/adminupdate/:id", validateAdmin, function (req, res) {
	// ADMIN ACCESS TO UPDATE ALL COMMENTS
	const updateComment = {
		//adding comment ID in commentman for testing- add in client selection\
		body: req.body.comment.body,
		edited: true,
	};
	const query = { where: { id: req.params.id } };
	Comment.update(updateComment, query)
		.then(function updatedComments(comments) {
			if (comments[0] === 0) {
				res.status(500).json({ error: "Comment access not allowed." });
			} else {
				res.status(200).json({ message: "Comment update successful" });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.delete("/admin_delete/:id", validateAdmin, function (req, res) {
	// ADMIN DELETE COMMENT
	Comment.destroy({ where: { id: req.params.id } })
		.then(() =>
			res.status(200).json({ message: "comment information deleted" })
		)
		.catch((err) => res.status(500).send({ error: err }));
});

module.exports = router;
