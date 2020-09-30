require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: "postgres",
});
/* const sequelize = new Sequelize(
	process.env.NAME,
	"postgres",
	process.env.PG_PASS,
	{
		host: "localhost",
		dialect: "postgres",
	}
); */

sequelize.authenticate().then(
	function () {
		console.log(`connected to ${process.env.NAME} postgres database`);
	},
	function (err) {
		console.log("-----ERROR----- : ", err);
	}
);

User = sequelize.import("./models/user");
Profile = sequelize.import("./models/profile");
Post = sequelize.import("./models/post");
Comment = sequelize.import("./models/comment");

User.hasOne(Profile);
Profile.belongsTo(User);

Post.belongsTo(User);
User.hasMany(Post);

Comment.belongsTo(User);
User.hasMany(Comment);
Comment.belongsTo(Post);
Post.hasMany(Comment);

module.exports = sequelize;
