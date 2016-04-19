# graphql-node
Simple node server that implements graphql, express and sequelize

### setup
if you encounter issues with running;
- Asked by Sequelize to install tedious manually??
  execute ```npm i -S tedious```
- Can't connect to MS SQL Express?
  check Sql Server Configuration Manager, ensure SQL Server Network Configuration protocol is set correctly.
  - Server Configuration Manager -> SQL Server Network Configuration -> TCP/IP -> IPAll -> TCP Dynamic Ports: <blank>
  - Server Configuration Manager -> SQL Server Network Configuration -> TCP/IP -> IPAll -> TCP Port: 1433
  check database accepts SQL Authentication & Windows Auth

### client test
using something like Postman, post the following to bulk add data
```
mutation addPeople {
  addPeople(people: [{clientId: 10, firstname: "Bob1", lastname: "Bob1", email: "bob@bob.com"}, {clientId: 11, firstname: "Bob2", lastname: "Bob2", email: "bob@bob.com"}, {clientId: 12, firstname: "Bob3", lastname: "Bob3", email: "bob@bob.com"}]) {
    people {
      firstname
    }
  }
}
```
Content-Type needs to be **application/graphql**

### test add person with posts
following the client test example, post a person with posts
```
mutation addPerson {
  addPerson
  (
    clientId: 14, firstName: "Bob1", lastName: "Bob1", email: "bob@bob.com", 
    posts: 
    [
        { title: "A title", content: "Sample content" },
        { title: "Another title", content: "More content" }
    ]
  )
  {
    id  
    posts {
        title
    }
  }
}
```

### test add people with posts
this example adds people with with posts
```
mutation addPeople {
  addPeople
  (people: [
      {clientId: 15, firstname: "Bob1", lastname: "Bob1", email: "bob@bob.com", 
        posts: 
        [
            { title: "A title", content: "Sample content" },
            { title: "Another title", content: "More content" }
        ]}, 
      {clientId: 16, firstname: "Bob2", lastname: "Bob2", email: "bob@bob.com"}, 
      {clientId: 17, firstname: "Bob3", lastname: "Bob3", email: "bob@bob.com"},
      {clientId: 18, firstname: "Bob4", lastname: "Bob1", email: "bob@bob.com"}, 
      {clientId: 19, firstname: "Bob5", lastname: "Bob2", email: "bob@bob.com"}, 
      {clientId: 20, firstname: "Bob6", lastname: "Bob3", email: "bob@bob.com"},
      {clientId: 21, firstname: "Bob7", lastname: "Bob1", email: "bob@bob.com"}, 
      {clientId: 22, firstname: "Bob8", lastname: "Bob2", email: "bob@bob.com"}, 
      {clientId: 23, firstname: "Bob9", lastname: "Bob3", email: "bob@bob.com"}
  ]) 
    {
    people {
      id
      email
      posts {
        title
      }
    }
  }
}
```
