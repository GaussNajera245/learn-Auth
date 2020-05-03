const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const schema = require("./graphql/schema");
const resolvers = require("./graphql/resolver");

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: schema,
    rootValue: {...resolvers},
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