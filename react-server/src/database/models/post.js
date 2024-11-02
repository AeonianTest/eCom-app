module.exports = (db, DataTypes) =>
  db.sequelize.define("post", {
    userID: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      references: {
        model: db.user,
        key: "userID"
      }
    },
    product_id: {
      type: DataTypes.INTEGER, //int column
      primaryKey: true, //PK of the table.
      references: {
        model: db.products,
        key: "product_id"
      }
    },
    text: { //text box hanger on
      type: DataTypes.TEXT,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
