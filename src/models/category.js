'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Product, {
        through: 'ProductCategories', 
        foreignKey: 'category_id',     
        as: 'products'                
      });
    }
  }
  Category.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    use_in_menu: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Category',
    underscored: true,
  });
  return Category;
};