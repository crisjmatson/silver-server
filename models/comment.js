module.exports = (sequelize, DataTypes) => {
	const Comment = sequelize.define("comment", {
		private: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
		body: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		edited: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
	});
	return Comment;
};
