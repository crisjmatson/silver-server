require("dotenv").config();
let router = require("express").Router();
let Post = require("../db").import("../models/post");
let Comment = require("../db").import("../models/comment");
let validateSession = require("../middleware/validate-session");
let validateAdmin = require("../middleware/validate-admin");
//const { contains } = require("sequelize/types/lib/operators");

router.post("/", validateSession, function (req, res) {
	// GENERAL POST CREATION FOR ALL USERS
	Post.create({
		author: req.user.username,
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

router.get("/full/:id", validateSession, function (req, res) {
	// USER ACCESS TO SINGLE POST AND ALL COMMENTS
	Post.findOne({ where: { id: req.params.id } })
		.then(function postDisplay(post) {
			if (post) {
				Comment.findAll({ where: { postId: req.params.id } }).then(
					function commentDisplay(comments) {
						if (comments) {
							res.status(200).json({ post: post, comments: comments });
						} else {
							res.status(200).json({ comments: "No comments found." });
						}
					}
				);
			} else {
				res.status(404).json({ error: "Post not found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.get("/public_full/:id", function (req, res) {
	// GUEST ACCESS TO SINGLE POST AND ALL COMMENTS
	Post.findOne({ where: { id: req.params.id, private: false } })
		.then(function postDisplay(post) {
			if (post) {
				Comment.findAll({
					where: { postId: req.params.id, private: false },
				}).then(function commentDisplay(comments) {
					if (comments) {
						res.status(200).json({ post: post, comments: comments });
					} else {
						res.status(500).json({ comments: "No comments found." });
					}
				});
			} else {
				res.status(500).json({ error: "Post not found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});
router.get("/full", validateSession, function (req, res) {
	// USER ACCESS TO SINGLE POST AND ALL COMMENTS
	Post.findOne({ where: { id: req.body.post.id } })
		.then(function postDisplay(post) {
			//res.send({ post: post });
			if (post) {
				Comment.findAll({ where: { postId: req.body.post.id } }).then(
					function commentDisplay(comments) {
						if (comments) {
							res.status(200).json({ post: post, comments: comments });
						} else {
							res.status(500).json({ comments: "No comments found." });
						}
					}
				);
			} else {
				res.status(500).json({ error: "Post not found." });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.get("/tagged/:tag", validateSession, function (req, res) {
	// USER ACCESS TO ALL POST BY TAG
	Post.findAll({ tags: [`${req.params.tag}`] })
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
	const query = { where: { id: req.body.post.id, userId: req.user.id } };
	Post.update(updatePost, query)
		.then(function updatedPosts(posts) {
			if (posts[0] === 1) {
				res.status(200).json({ message: "Update successful", posts });
			} else {
				res.status(500).json({ error: "Update not allowed.", posts });
			}
		})
		.catch((err) => res.status(500).send({ error: err }));
});

router.delete("/delete/:id", validateSession, function (req, res) {
	const query = { where: { id: req.params.id, userId: req.user.id } };
	Post.destroy(query)
		.then((deleted) => {
			if (deleted) {
				res.status(200).json({ message: "Delete successful", json });
			} else {
				res.status(500).json({ error: "Delete not allowed.", json });
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

router.delete("/admin_delete/:id", validateAdmin, function (req, res) {
	// DELETE POST AND ALL COMMENTS ON POST
	Comment.destroy({ where: { postId: req.params.id } });
	Post.destroy({ where: { id: req.params.id } })
		.then(() => res.status(200).json({ message: "post information deleted" }))
		.catch((err) => res.status(500).send({ error: err }));
});

module.exports = router;
