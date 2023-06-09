const joi = require("@hapi/joi");
const { MongoIDPattern } = require("../../utils/constans");

const addCategorySchema = joi.object({
    title: joi.string().min(3).max(30).error(new Error("عنوان دسته بندی صحیح نمیباشد")),
    parent: joi.string().allow("").pattern(MongoIDPattern).allow("").error(new Error("شناسه وارد شده صحیح نمیباشد"))
})
const updateCategoryTitleSchema = joi.object({
    title: joi.string().min(3).max(30).error(new Error("عنوان دسته بندی صحیح نمیباشد"))
})
const updateCategoryParentSchema = joi.object({
    parent: joi.string().allow("").pattern(MongoIDPattern).allow("").error(new Error("شناسه وارد شده صحیح نمیباشد"))
})
module.exports = {
    addCategorySchema,
    updateCategoryTitleSchema,
    updateCategoryParentSchema
}