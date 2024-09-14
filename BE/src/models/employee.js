import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Table_name, { foreignKey: 'table_id' });
    }
  }
  Employee.init({
    note:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    status:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    table_id:{
      type: DataTypes.INTEGER,
      references:{
        model: 'Table_names', 
        key:'id'
      }
    }  
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};