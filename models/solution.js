module.exports = (sequelize, DataTypes) => {
	const Solution = sequelize.define("solution", {
        challengeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
		author: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		body: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		rating: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		body: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		private: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		link: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		tags: {
			type: DataTypes.ARRAY,
			allowNull: true, // if no tags added- give default
		},
	});
	return Solution;
};
