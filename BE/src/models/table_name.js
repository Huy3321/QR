import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4, v4 } from 'uuid';

export default (sequelize) => {
  class Table extends Model {
    static associate(models) {
      Table.hasMany(models.Order,{ foreignKey: 'table_id'})
      Table.hasMany(models.Employee,{ foreignKey: 'table_id'})
    }
  }
  Table.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.STRING,
        defaultValue: () => v4(), // Đảm bảo sinh UUID tự động cho trường uuid
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active:{
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull:false,
      }
    },
    {
      sequelize,
      modelName: 'Table_name',
    }
  );
  return Table;
};
