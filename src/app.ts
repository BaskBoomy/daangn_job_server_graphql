import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {graphqlHTTP } from 'express-graphql';
import mongoose from "mongoose";
import session from "express-session";
import connectRedis from "connect-redis";

import graphQLSchema from './graphql/schema/index.js';
import graphQLResolvers from "./graphql/resolvers/index.js";
import {isAuth} from './middleware/auth.js';
import { config } from "./config.js";
import { createClient } from "redis";

let RedisStore = connectRedis(session);
export const redisClient = createClient({
    url:`redis://${config.redis.host}:${config.redis.port}`,
    password:config.redis.password,
    // legacyMode: true,
});
redisClient.connect()
.then(()=>{
    console.log("Redis Connected");
});
const app = express();

app.use(session({
    secret:'secret',
    store:new RedisStore({
        client:redisClient
    }),
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:config.redis.maxAge,
    },
    resave:false,
    saveUninitialized:false,
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(isAuth);
app.use('/daangn-job', graphqlHTTP({
    schema:graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

mongoose.set('strictQuery', true);
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

