"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    static associate(models) {
     
    }
  }
  ProductCategory.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "ProductCategory",
      tableName: "ProductCategories",
      timestamps: false,
    }
  );
  return ProductCategory;
};
