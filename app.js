const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {graphqlHTTP } = require('express-graphql');
const mongoose = require("mongoose");

const graphQLSchema = require('./graphql/schema/index.js');
const graphQLResolvers = require("./graphql/resolvers/index.js");
const isAuth = require('./middleware/auth.js');
const { config } = require("./config.js");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(isAuth);
app.use('/daangn-job', graphqlHTTP({
    schema:graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

mongoose.connect(
    config.db.host)
    .then(()=>{
        app.listen(config.host.port, ()=>{
            console.log(`Listening on port ${config.host.port}`)
        })
    })
    .catch(err=>{
        console.log(err);
    });

