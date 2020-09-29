require("dotenv").config();
let router = require("express").Router();
let Post = require("../db").import("../models/post");
let validateSession = require("../middleware/validate-session");
let validateAdmin = require("../middleware/validate-admin");

router.post("/", validateSession, function (req, res) {
	// GENERAL POST CREATION FOR ALL USERS
	Post.create({
		userId: req.user.id,
		title: req.body.post.title,
		body: req.body.post.body,
		tags: req.body.post.tags,
		private: req.body.post.private,
	})
		.then(function postCreate(post) {
			res.status(200).json({
				post: post,
				message: "Post created.",
			});
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.get("/yours", validateSession, function (req, res) {
	// USER SPECIFIC POST ACCESS
	Post.findAll({
		where: { userId: req.user.id },
	})
		.then(function postDisplayYours(posts) {
			if (posts) {
				res.status(200).json({ posts: posts });
			} else {
				res.status(500).json({ error: "No posts found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.get("/public", function (req, res) {
	// NON-USER ACCESS TO ALL PUBLIC POSTS
	Post.findAll({ where: { private: false } })
		.then(function postDisplayPublic(posts) {
			if (posts) {
				res.status(200).json({ posts: posts });
			} else {
				res.status(500).json({ error: "No public posts found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.get("/all", validateSession, function (req, res) {
	// USER ACCESS TO ALL POSTS
	Post.findAll()
		.then(function postDisplayAll(posts) {
			if (posts) {
				res.status(200).json({ posts: posts });
			} else {
				res.status(500).json({ error: "No posts found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.put("/update", validateSession, function (req, res) {
	// USER ACCESS TO UPDATE OWN POSTS
	const updatePost = {
		//adding post ID in postman for testing- add in client selection
		title: req.body.post.title,
		body: req.body.post.body,
		tags: req.body.post.tags,
		private: req.body.post.private,
		edited: true,
	};
	const query = { where: { postId: req.body.post.id, userId: req.user.id } };
	Post.update(updatePost, query)
		.then(function updatedPosts(posts) {
			if (posts === 1) {
				res.status(200).json({ message: "Update successful" });
			} else {
				res.status(500).json({ error: "Update not allowed." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.delete("/delete", validateSession, function (req, res) {
	const query = { where: { postId: req.body.post.id, userId: req.user.id } };
	Post.destroy(query)
		.then(function deletedPosts(deleted) {
			if (deleted === 0) {
				res.status(500).json({ error: "Delete not allowed." });
			} else {
				res.status(200).json({ message: "Delete successful" });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

/* ---------------- ADMIN ROUTES ---------------- */

router.get("/admin_view", validateAdmin, function (req, res) {
	// ADMIN GET ALL POSTS
	Post.findAll()
		.then(function postDisplayAll(posts) {
			if (posts) {
				res.status(200).json({ posts: posts });
			} else {
				res.status(500).json({ error: "No posts found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.delete("/admin_delete", validateAdmin, function (req, res) {
	// DELETE POST AND ALL COMMENTS ON POST
	Comment.destroy({ where: { postId: req.body.post.id } });
	Post.destroy({ where: { id: req.body.post.id } })
		.then(() => res.status(200).json({ message: "post information deleted" }))
		.catch((err) => res.status(500).send({ error: err }));
});

module.exports = router;
