const express = require("express");
const bodyParser = require("body-parser");
const {graphqlHTTP } = require('express-graphql');
const mongoose = require("mongoose");

const graphQLSchema = require('./graphql/schema/index.js');
const graphQLResolvers = require("./graphql/resolvers/index.js");

const app = express();

app.use(bodyParser.json());

app.use('/daangn-job', graphqlHTTP({
    schema:graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.kwnp9ow.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(()=>{
        app.listen(3000, ()=>{
            console.log(`Listening on port ${3000}`)
        })
    })
    .catch(err=>{
        console.log(err);
    });

