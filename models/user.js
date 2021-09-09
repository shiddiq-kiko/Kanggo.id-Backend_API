'use strict';
const {hashPassword} = require('../helpers/bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.TrxOrder, {foreignKey:"user_id"})
    }
  };
  User.init({
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name Cannot Empty'
        }
      }
    },
    email: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          args : true,
          msg : 'email cannot empty'
        },
        isEmail : {
          args : true,
          msg : 'format email is wrong'
        },
        isUnique : (value, next) => {
          sequelize.models.User.findOne({
                where : {
                  email : value
                }
              })
              .then(user => {
                if(user){
                  next('email is already used')
                }
                else{
                  next()
                }
              })
              .catch(next)
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          args : true,
          msg : 'password cannot empty'
        },
        len : {
          args : [5],
          msg : 'password must more than 5 characters'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks : {
      beforeCreate : (user, options) =>{
        console.log(user)
        user.password = hashPassword(user.password)
      }
    }
  });
  return User;
};