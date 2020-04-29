const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { buildSchema } = require('graphql');

const Event = require('./models/event');
const User = require('./models/users');

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type User {
            _id: ID!
            email: String!
            password: String
        }

        input UserInput {
            email: String!
            password: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type RootQuery {
            events:[Event]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find({})
                .then( result => {
                    return result.map( e => {
                        return {...e._doc, _id: e.id}
                    })
                })
                .catch( err => {throw(err)})
        },
        createEvent: args => {
            const event = new Event({
                title: args.eventInput.title,
                price: +args.eventInput.price,
                description: args.eventInput.description,
                date: new Date(args.eventInput.date), 
                creator: "5ea8b1ce3a8d122e44d65ee7"
            });

            let returnEventLater; 

            return event.save() //async
                .then( result => {
                    returnEventLater = {...result._doc, _id: result.id};
                    return User.findById("5ea8b1ce3a8d122e44d65ee7")
                })
                .then( user => {
                    if(!user) {
                        throw new Error("user not found")
                    }
                    user.createdEvents.push(event); //K
                    return user.save();
                })
                .then((result) => {
                    return returnEventLater;
                })
                .catch( err => {
                    throw err
                });
        },
        createUser: args => {
          return User.findOne({email: args.userInput.email})
                .then( user => {
                    if (user) {
                        throw new Error('User exist already')
                    }
                    return bcrypt
                    .hash(args.userInput.password, 12)
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                       password: hashedPassword
                    })
                    return user.save()
                })
                .then( res => {
                    console.log(res._doc)
                    return {...res._doc, _id: res.id, password: null}
                })
                .catch( err => {
                    throw(err)
                })
        }
    },
    graphiql:true
}));

// const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@nemo-rkcm5.mongodb.net/test?retryWrites=true&w=majority`
const URI = "mongodb+srv://onceonceonce11:onceonceonce11@nemo-rkcm5.mongodb.net/max-auth?retryWrites=true&w=majority"
mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true } )
    .then(()=>{
        app.listen(8002, () => {
            console.log("listening in port 8002")
        });
    })
    .catch((err)=>{
        console.log(err);
    })