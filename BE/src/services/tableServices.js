import { where } from 'sequelize';
import db from '../models';

const Table_name = db.Table_name;

const  createTable = async(req) => {
    try {
        const {name} = req.body
        const existTable = await Table_name.findOne({where:{name}})
        if(existTable){
            throw new Error("Ban Da Ton Tai")
        }

        const table =  await Table_name.create(req.body)
        return table
    } catch (error) {
        throw new Error(error)
    }
}
const getTables  = async(req) => {
    try {
        const tables = await Table_name.findAll(req.body)
        return tables

    } catch (error) {
        throw new Error(error)
    }
}
const getTablesById = async (req) => {
    try{
        const{id} = req.params;
        const tableId = await Table_name.findByPk(id);
        if(!tableId){
            throw new Error('Table not found')
        }
        return tableId;

    }catch(error){
        throw new Error(error);
    }
}
const activeByUuid = async (req) => {
    try{
        console.log(111111);
        const {uuid,status} = req.body;
        const tableUuid = await Table_name.findOne({where:{uuid}})
        if(!tableUuid){
            throw new Error('search Table by uuid not found')
        }
        tableUuid.active = status;
        await tableUuid.save();
        return tableUuid
    }catch(error){
        throw new Error(error);

    }
}
const updatedTablesById = async (req) => {
    try{
        const{id} = req.params;
        const updatedRows = await Table_name.update(req.body, {
            where: {id}
        });


        if(updatedRows[0] === 0){
            throw new Error('Table not found');
        }
        return {message: 'Table updated successfull'};

    }catch(error){
        throw new Error(error);
    }
}
const deleteTablesById = async (req) => {
    try{
        const{id} = req.params;
        const deleteRows = await Table_name.destroy({
            where: {id}
        });


        if(deleteRows[0] === 0){
            throw new Error('Table not found');
        }
        return {message: 'Table delete successfull'};

    }catch(error){
        throw new Error(error);
    }
}

export {createTable,getTables}
export {getTablesById,updatedTablesById,deleteTablesById,activeByUuid}