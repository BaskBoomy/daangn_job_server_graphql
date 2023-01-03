import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import session from "express-session";
import connectRedis from "connect-redis";
import typeDefs from './graphql/schema/index.js';
import resolvers from "./graphql/resolvers/index.js";
import { config } from "./config.js";
import { createClient } from "redis";
let RedisStore = connectRedis(session);
export const redisClient = createClient({
    url: `redis://${config.redis.host}:${config.redis.port}`,
    // password:config.redis.password,
    legacyMode: true,
});
redisClient.connect()
    .then(() => {
    console.log("Redis Connected");
});
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
await server.start();
app.use('/daangn-job', express.urlencoded({ extended: true }), session({
    secret: 'secret',
    store: new RedisStore({
        client: redisClient
    }),
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: config.redis.maxAge,
    },
    resave: false,
    saveUninitialized: false,
}), bodyParser.json(), cookieParser(), expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
}));
mongoose.set('strictQuery', true);
mongoose
    .connect(config.db.host)
    .then(() => {
    app.listen(config.host.port, () => {
        console.log(`Listening on port ${config.host.port}`);
    });
})
    .catch((err) => {
    console.log(err);
});
