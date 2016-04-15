var lodash = require('lodash');
var graphql = require('graphql');
var Db = require('./db');

var Post = new graphql.GraphQLObjectType({
    name: 'Post',
    description: 'This represents a Post',
    fields: {
        id: {
            type: graphql.GraphQLInt,
            resolve(post) {
                return post.id;
            }
        },
        title: {
            type: graphql.GraphQLString,
            resolve(post) {
                return post.title;
            }
        },
        content: {
            type: graphql.GraphQLString,
            resolve(post) {
                return post.content;
            }
        }
    }
});

var Person = new graphql.GraphQLObjectType({
    name: 'Person',
    description: 'This represents a Person',
    fields: {
        id: {
            type: graphql.GraphQLInt,
            resolve(person) {
                return person.id;
            }
        },
        firstname: {
            type: graphql.GraphQLString,
            resolve(person) {
                return person.firstname;
            }
        },
        lastname: {
            type: graphql.GraphQLString,
            resolve(person) {
                return person.lastname;
            }
        },
        email: {
            type: graphql.GraphQLString,
            resolve(person) {
                return person.email;
            }
        },
        posts: {
            type: new graphql.GraphQLList(Post),
            resolve(person) {
                return person.getPosts();
            }
        }
    }
});

var Query = new graphql.GraphQLObjectType({
    name: 'Query',
    description: 'This is a root query',
    fields: {
        people: {
            type: new graphql.GraphQLList(Person),
            // define args - our root query will now ONLY accept these params, anything else will be disregarded
            args: {
                id: {
                    type: graphql.GraphQLInt
                },
                email: {
                    type: graphql.GraphQLString
                }
            },
            resolve(root, args) {
                //console.log('Inside query object');
                return Db.models.person.findAll({where: args});
            }
        },
        posts: {
            type: new graphql.GraphQLList(Post),
            resolve(root, args) {
                return Db.models.post.findAll({where: args});
            }
            
        }
    }
});

var Schema = new graphql.GraphQLSchema({
    query: Query
});

//export default Schema;
module.exports = Schema;