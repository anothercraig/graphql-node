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
        clientId: {
            type: graphql.GraphQLInt,
            resolve(person) {
                return person.clientId;
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

var PostInput = new graphql.GraphQLInputObjectType({
    name: 'PostInput',
    description: 'This represents a Post Input',
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
        clientId: {
            type: graphql.GraphQLInt,
            resolve(person) {
                return person.clientId;
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
            type: new graphql.GraphQLList(PostInput),
            resolve(person) {
                return person.getPosts();
            }
        }
    }
});

var AddPeopleEvent = new graphql.GraphQLObjectType({
    name: 'AddPeopleEvent',
    description: 'Add People Event',
    fields: {
        people: {
            type: new graphql.GraphQLList(Person),
            resolve(root, args) {
                
                var ids = [];
                root.forEach(function(person) {
                    ids.push(person.id);
                }, this);
                
                //console.log(JSON.stringify(root, null, 4));
                //console.log(JSON.stringify(args, null, 4));

                return Db.models.person.findAll({where: { id: {in: ids}}});
            }
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
                clientId: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                firstName: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                lastName: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                email: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                posts: {
                    type: new graphql.GraphQLList(PostInput)
                }
            },
            resolve(_, args) {

                return new Promise(function(resolve, reject) {
                    //
                    Db.models.person.create({
                        clientId: args.clientId,
                        firstname: args.firstName,
                        lastname: args.lastName,
                        email: args.email.toLowerCase()
                    }).then((data) => {
                        
                        if(args.posts && args.posts.length > 0)
                        {
                            args.posts.forEach(function(post){
                                Db.models.post.create({
                                    personId: data.dataValues.id,
                                    title: post.title,
                                    content: post.content
                                });
                            });
                        }
                        console.log(data);
                        resolve(data);
                    }, (err) => reject(err));
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
                
                //return Db.models.person.bulkCreate(args.people, {returning: true});
                
                return new Promise(function(resolve, reject) {
                    
                    var people = [];
                    var posts = [];
                    try
                    {
                        var peopleChunks = lodash.chunk(args.people, 1000);
                        peopleChunks.forEach(function(peopleChunk) {
                            people.push(Db.models.person.bulkCreate(peopleChunk, {returning: true}));
                        }, this);
                        
                        // resolve all promises and flatten the result so our
                        // graph object can understand it
                        Promise.all(people).then((data) => {
                            
                            var listOfPeople = lodash.flatten(data);
                            
                            listOfPeople.forEach(function(person) {
                                var personMatch = lodash.find(args.people, function(personInput){
                                    return person.clientId === personInput.clientId;
                                });
                                
                                if(personMatch.posts) {
                                    var peoplePosts = [];
                                    personMatch.posts.forEach(function(post) {
                                        peoplePosts.push({
                                            personId: person.id,
                                            title: post.title,
                                            content: post.content
                                        })
                                    });
                                    posts.push(Db.models.post.bulkCreate(peoplePosts));
                                }
                            });
                            
                            Promise.all(posts).then(() => {
                                resolve(listOfPeople);
                            });
                        }, (err) => reject(err));
                    }
                    catch(e)
                    {
                        console.log(e);
                        reject(e);
                    }
                });
            }
        }
    }
});

var Schema = new graphql.GraphQLSchema({
    // query is REQUIRED!
    query: Query,
    mutation: Mutation
});

//export default Schema;
module.exports = Schema;