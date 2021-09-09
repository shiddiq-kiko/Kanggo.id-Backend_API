'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TrxProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TrxProduct.belongsTo(models.Product, {foreignKey:"product_id"})
      TrxProduct.belongsTo(models.TrxOrder, {foreignKey:"order_id"})
    }
  };
  TrxProduct.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    amount: {
      type : DataTypes.INTEGER,
      validate : {
        isPositive : (value, next) =>{
          if (value >= 0) next()
          else next('Quantity must greater than 0')
        }
      }
    }
  }, {
    sequelize,
    modelName: 'TrxProduct',
  });
  return TrxProduct;
};