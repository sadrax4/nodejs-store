const { GraphQLString } = require("graphql");
const { BlogModel } = require("../../models/blogs");
const { ProductModel } = require("../../models/products");
const { CoursesModel } = require("../../models/course");
const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { responseType } = require("../typeDefs/public.types");
const { verifyTokenInGraphQl } = require("../../middlewares/verifyToken");
const { default: mongoose } = require("mongoose");
const { checkExistBlog, checkExistProduct, checkExistCourse, getComment } = require("../utils");

const DATABASEFIELDS = {
    BlogModel,
    ProductModel,
    CoursesModel
}
const createCommentForBlogResolver = {
    type: responseType,
    args: {
        comment: { type: GraphQLString },
        blogID: { type: GraphQLString },
        parent: { type: GraphQLString },
    },
    resolve: async (_, args, context) => {
        const { req } = context;
        const user = await verifyTokenInGraphQl(req)
        const { comment, blogID, parent } = args
        if (!mongoose.isValidObjectId(blogID)) {
            throw createHttpError.BadGateway("شناسه بلاگ ارسال شده صحیح نمیباشد")
        }
        await checkExistBlog(blogID)
        if (parent && mongoose.isValidObjectId(parent)) {
            const commentDocument = await getComment(DATABASEFIELDS.BlogModel, parent)
            if (commentDocument && !commentDocument?.openToComment) {
                throw createHttpError.BadRequest("ثبت پاسخ مجاز نیست")
            }
            const createAnswerResult = await BlogModel.updateOne({
                "comments._id": parent
            }, {
                $push: {
                    "comments.$.answers": {
                        comment,
                        user: user._id,
                        show: false,
                        openToComment: false
                    }
                }
            });
            if (!createAnswerResult.modifiedCount) {
                throw createHttpError.InternalServerError("ثبت پاسخ انجام نشد")
            }
            return {
                statusCode: StatusCodes.CREATED,
                data: {
                    message: "پاسخ شما با موفقیت ثبت شد"
                }
            }
        } else {
            await BlogModel.updateOne({ _id: blogID }, {
                $push: {
                    comments: {
                        comment,
                        user: user._id,
                        show: false,
                        openToComment: true
                    }
                }
            })
        }
        return {
            statusCode: StatusCodes.CREATED,
            data: {
                message: "ثبت نظر با موفقیت انجام شد پس از تایید در وبسایت قرار میگیرد"
            }
        }
    }
}
const createCommentForProductResolver = {
    type: responseType,
    args: {
        comment: { type: GraphQLString },
        productID: { type: GraphQLString },
        parent: { type: GraphQLString },
    },
    resolve: async (_, args, context) => {
        const { req } = context;
        const user = await verifyTokenInGraphQl(req)
        const { comment, productID, parent } = args
        if (!mongoose.isValidObjectId(productID)) {
            throw createHttpError.BadGateway("شناسه محصول ارسال شده صحیح نمیباشد");
        }
        await checkExistProduct(productID)
        if (parent && mongoose.isValidObjectId(parent)) {
            const commentDocument = await getComment(ProductModel, parent)
            if (commentDocument && !commentDocument?.openToComment) {
                throw createHttpError.BadRequest("ثبت پاسخ مجاز نیست")
            }

            const createAnswerResult = await ProductModel.updateOne({
                "comments._id": parent
            }, {
                $push: {
                    "comments.$.answers": {
                        comment,
                        user: user._id,
                        show: false,
                        openToComment: false
                    }
                }
            });
            if (!createAnswerResult.modifiedCount) {
                throw createHttpError.InternalServerError("ثبت پاسخ انجام نشد")
            }
            return {
                statusCode: StatusCodes.CREATED,
                data: {
                    message: "پاسخ شما با موفقیت ثبت شد"
                }
            }
        } else {
            await ProductModel.updateOne({ _id: productID }, {
                $push: {
                    comments: {
                        comment,
                        user: user._id,
                        show: false,
                        openToComment: true
                    }
                }
            })
        }
        return {
            statusCode: StatusCodes.CREATED,
            data: {
                message: "ثبت نظر با موفقیت انجام شد پس از تایید در وبسایت قرار میگیرد"
            }
        }
    }
}
const createCommentForCourseResolver = {
    type: responseType,
    args: {
        comment: { type: GraphQLString },
        courseID: { type: GraphQLString },
        parent: { type: GraphQLString },
    },
    resolve: async (_, args, context) => {
        const { req } = context;
        const user = await verifyTokenInGraphQl(req)
        const { comment, courseID, parent } = args
        if (!mongoose.isValidObjectId(courseID)) {
            throw createHttpError.BadGateway("شناسه دوره ارسال شده صحیح نمیباشد")
        }
        await checkExistCourse(courseID)
        if (parent && mongoose.isValidObjectId(parent)) {
            const commentDocument = await getComment(DATABASEFIELDS.CoursesModel, parent)
            if (commentDocument && !commentDocument?.openToComment) {
                throw createHttpError.BadRequest("ثبت پاسخ مجاز نیست")
            }
            const createAnswerResult = await DATABASEFIELDS.CoursesModel.updateOne({
                "comments._id": parent
            }, {
                $push: {
                    "comments.$.answers": {
                        comment,
                        user: user._id,
                        show: false,
                        openToComment: false
                    }
                }
            });
            if (!createAnswerResult.modifiedCount) {
                throw createHttpError.InternalServerError("ثبت پاسخ انجام نشد")
            }
            return {
                statusCode: StatusCodes.CREATED,
                data: {
                    message: "پاسخ شما با موفقیت ثبت شد"
                }
            }
        } else {
            await CoursesModel.updateOne({ _id: courseID }, {
                $push: {
                    comments: {
                        comment,
                        user: user._id,
                        show: false,
                        openToComment: true
                    }
                }
            })
        }
        return {
            statusCode: StatusCodes.CREATED,
            data: {
                message: "ثبت نظر با موفقیت انجام شد پس از تایید در وبسایت قرار میگیرد"
            }
        }
    }
}
module.exports = {
    createCommentForBlogResolver,
    createCommentForCourseResolver,
    createCommentForProductResolver
}