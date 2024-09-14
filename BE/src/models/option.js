'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Option.hasMany(models.Orderdish,{ foreignKey: 'option_id'})

    }
  }
  Option.init({
    dish_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Option',
  });
  return Option;
}
