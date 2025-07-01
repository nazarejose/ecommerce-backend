"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Product, {
        through: models.ProductCategory,
        foreignKey: "category_id",
        as: "products",
      });
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      use_in_menu: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "Categories",
      underscored: true,
    }
  );
  return Category;
};
