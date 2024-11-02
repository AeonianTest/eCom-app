module.exports = (sequelize, DataTypes) =>
  sequelize.define("user", {
    userID: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(32),
    },
    password_hash: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    user_bio: {
      type: DataTypes.STRING(100),
      allowNull: true, // user_bio should be able to be null.
    },
    date_joined: {
      type: DataTypes.STRING(40),
      allowNull: true,
      defaultValue: "testing"
    },
    user_email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "testing"
    },
    user_address: {
      type: DataTypes.STRING(100), 
      allowNull: true //userAddress should not be not null because of how the logic is already set up in frontend - dan
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
