module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define("user", {
		role: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "general",
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
	return User;
};
