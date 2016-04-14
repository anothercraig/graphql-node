var  Sequelize = require('sequelize');
var  _ = require('lodash');
var  Faker = require('faker');

var Conn = new Sequelize(
    'relay',    // database name
    'node',     // username
    'node',     // password
    {
        dialect: 'mssql',
        host: '127.0.0.1'
    }
);

var Person = Conn.define('person', {
    firstname:{
        type: Sequelize.STRING,
        allowNull: false
    },
    lastname:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
});

var Post = Conn.define('post', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    content:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Relationships
Person.hasMany(Post);
Post.belongsTo(Person);

Conn.sync({force: true}).then(() => {
    _.times(10, ()=>{
        return Person.create({
            firstname: Faker.name.firstName(),
            lastname: Faker.name.lastName(),
            email: Faker.internet.email()
        }).then(person =>{
            return person.createPost({
                title: 'Sample title by ' + person.firstname,
                content: 'This is a sample article'
            });
        });
    });
});

//export default Conn;
module.exports = Conn;