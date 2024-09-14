import db from '../models';
const Employee = db.Employee;

const  createEmployee = async(req) => {
    try {
        const employee =  await Employee.create(req.body)
        return employee
    } catch (error) {
        throw error.message
    }
}
export{createEmployee}