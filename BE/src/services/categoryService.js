import db from '../models';
const Category = db.Category;

const  createCategory = async(req) => {
    try {
        const {name} = req.body
        const existCategory = await Category.findOne({where:{name}})
        if(existCategory){
            throw new Error("Loai Da Ton Tai")
        }
        const category =  await Category.create(req.body)
        return category
    } catch (error) {
        throw error.message
    }
}
const getCategorys  = async(req) => {
    try {
        const category = await Category.findAll()
        return category;

    } catch (error) {
        throw error.message
    }
}
const updatedCategory = async (req) => {
    try{
        const{id} = req.params;
        const updatedRows = await Category.update(req.body, {
            where: {id}
        });


        if(updatedRows[0] === 0){
            throw new Error('category not found');
        }
        return {message: 'Category updated successfull'};

    }catch(error){
        throw error.message
    }
}
export{createCategory,getCategorys,updatedCategory};