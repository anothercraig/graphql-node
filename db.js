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
    clientId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
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
}/*, {
    hooks: {
        beforeBulkCreate: function(persons, options) {
            //person.clientId = 1; //person.getClietnId();
            persons.forEach(function (person) {
                person.clientId = person.getClientId();
                //var test = person.posts;
            });
        },
        afterBulkCreate: function(persons, options) {
            //person.clientId = person.clientId;
            persons.forEach(function (person) {
                var id = person.clientId();
                //var test = person.posts;
            });
        }
  },
    instanceMethods: {
        getClientId: function() {
            //this.curClientId = this.curClientId ? this.curClientId + 1 : 0;
            //return this.curClientId;
            var id = 0;
            return function() { return id++; }; 
            }
        }
}*/);

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

var count = 0;

Conn.sync({force: true}).then(() => {
    _.times(10, ()=>{
        return Person.create({
            clientId: count++,
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