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

var PersonInput = new graphql.GraphQLInputObjectType({
    name: 'PersonInput',
    description: 'This represents a Person Input',
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
        }
    }
});

var AddPeopleEvent = new graphql.GraphQLObjectType({
    name: 'AddPeopleEvent',
    description: 'Add People Event',
    fields: {
        people: {
            type: new graphql.GraphQLList(Person)
        }  
    }
});

var Mutation = new graphql.GraphQLObjectType({
    name: 'Mutation',
    description: 'Functions to create stuff...',
    fields: {
        addPerson: {
            type: Person,
            args: {
                firstName: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                lastName: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                email: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve(_, args) {
                return Db.models.person.create({
                    firstname: args.firstName,
                    lastname: args.lastName,
                    email: args.email.toLowerCase()
                });
            }
        },
        addPeople: {
            type: AddPeopleEvent,
            args: {
                people: {
                    type: new graphql.GraphQLList(PersonInput)
                }
            },
            resolve(_, args) {
                return Db.models.person.bulkCreate(args.people, {returning: true});
                /*
                return new Promise(function() {
                    var people = [];
                
                    Db.models.person.bulkCreate(args.people).then(function(models) {
                        //console.log(models);
                        models.forEach(function(element) {
                            //console.log(element.dataValues);
                            people.push({
                                id: 1,
                                firstname: element.dataValues.firstname,
                                lastname: element.dataValues.lastname,
                                email: element.dataValues.email
                            });
                        }, this);
                        //console.log(people);
                    });
                    
                    return people;
                });
                */
            }
        }
    }
})

var Schema = new graphql.GraphQLSchema({
    query: Query,
    mutation: Mutation
});

//export default Schema;
module.exports = Schema;