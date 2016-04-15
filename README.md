# graphql-node
Simple node server that implements graphql, express and sequelize

### setup
if you encounter issues with running;
- Asked by Sequelize to install tedious manually??
  execute ```npm i -S tedious```

### client test
using something like Postman, post the following to bulk add data
```
mutation addPeople {
  addPeople(people: [{firstname: "Bob1", lastname: "Bob1", email: "bob@bob.com"}, {firstname: "Bob2", lastname: "Bob2", email: "bob@bob.com"}, {firstname: "Bob3", lastname: "Bob3", email: "bob@bob.com"}]) {
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
    firstName: "Bob1", lastName: "Bob1", email: "bob@bob.com", 
    posts: 
    [
        { title: "A title", content: "Sample content" },
        { title: "Another title", content: "More content" }
    ]
  )
  {
    id  
  }
}
```
