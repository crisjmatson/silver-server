module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define("post", {
		private: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		body: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		tags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true, // if no tags added- give default
			defaultValue: ["code"],
		},
		edited: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
	});
	return Post;
};
