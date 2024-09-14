import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Orderdish extends Model {
    static associate(models) {
      Orderdish.belongsTo(models.Order, { foreignKey: 'order_id',as:'dishes' })
      Orderdish.belongsTo(models.Dish, { foreignKey: 'dish_id',as:'orders' })
      Orderdish.belongsTo(models.Option, { foreignKey: 'option_id' });

    }
  }
  Orderdish.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    dish_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Dishes',
        key: 'id'
      }
    },
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    option_id: {
      type:DataTypes.INTEGER,
      references: {
        model: 'Options',
        key: 'id'
      }

    }

  }, {
    sequelize,
    modelName: 'Orderdish',
  });
  return Orderdish;
};