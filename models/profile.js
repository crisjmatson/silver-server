module.exports = (sequelize, DataTypes) => {
	const Profile = sequelize.define("profile", {
		avatar: {
			type: DataTypes.STRING /* ????? */,
			allowNull: true,
			defaultValue:
				"https://static01.nyt.com/images/2018/08/12/arts/the-good-place-watching-recommendations/the-good-place-watching-recommendations-smallSquare252-v5.jpg",
		},
		grad_status: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		date_graduated: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		challenges_completed: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0,
		},
	});
	return Profile;
};
