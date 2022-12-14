import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {graphqlHTTP } from 'express-graphql';
import mongoose from "mongoose";

import graphQLSchema from './graphql/schema/index.js';
import graphQLResolvers from "./graphql/resolvers/index.js";
import {isAuth} from './middleware/auth.js';
import { config } from "./config.js";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(isAuth);
app.use('/daangn-job', graphqlHTTP({
    schema:graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

mongoose
    .connect(config.db.host)
    .then(()=>{
        app.listen(config.host.port, ()=>{
            console.log(`Listening on port ${config.host.port}`)
        })
    })
    .catch((err:any)=>{
        console.log(err);
    });

