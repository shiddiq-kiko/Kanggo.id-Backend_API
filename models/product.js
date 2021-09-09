'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsToMany(models.TrxOrder, {through: models.TrxProduct, foreignKey:"product_id"})
    }
  };
  Product.init({
    product_id:{
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          args : true,
          msg : 'name cannot empty'
        }
      }
    },
    price: {
      type : DataTypes.FLOAT,
      validate : {
        isPositive : (value, next) =>{
          if (value >= 0) next()
          else next('price must positive number')
        }
      }
    },
    stock: {
      type : DataTypes.INTEGER,
      validate : {
        isPositive : (value, next) =>{
          if (value >= 0) next()
          else next('stock must positive number')
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};