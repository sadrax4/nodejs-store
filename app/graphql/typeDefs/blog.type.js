const { GraphQLList, GraphQLObjectType, GraphQLString } = require("graphql");
const { authorType, categoryType } = require("./public.types");
const { commentType } = require("./comment.type");

const blogType = new GraphQLObjectType({
    name: "blogType",
    fields: {
        _id: { type: GraphQLString },
        author: { type: authorType },
        title: { type: GraphQLString },
        short_text: { type: GraphQLString },
        text: { type: GraphQLString },
        imageURL: { type: GraphQLString },
        tags: { type: new GraphQLList(GraphQLString) },
        category: { type: new GraphQLList(categoryType) },
        comments: { type: new GraphQLList(commentType) },
        likes: { type: new GraphQLList(authorType) },
        dislikes: { type: new GraphQLList(authorType) },
        bookmarks: { type: new GraphQLList(authorType) }
    }
})
module.exports = {
    blogType
}