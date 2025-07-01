"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.ProductImage, {
        foreignKey: "product_id",
        as: "images",
      });
      Product.hasMany(models.ProductOption, {
        foreignKey: "product_id",
        as: "options",
      });
      Product.belongsToMany(models.Category, {
        through: models.ProductCategory,
        foreignKey: "product_id",
        as: "categories",
      });
    }
  }
  Product.init(
    {
      enabled: DataTypes.BOOLEAN,
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      use_in_menu: DataTypes.BOOLEAN,
      stock: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      price: DataTypes.FLOAT,
      price_with_discount: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
      underscored: true,
    }
  );
  return Product;
};
