const {buildSchema}  = require("graphql");

module.exports = buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
        }

        type User {
            _id : ID! 
            phoneNumber: String!
            nickname: String!
            borndate: String
            gender: String
            name: String
            selfIntroduction: String
            careers: [String]
            createdEvents: [Event!]!
        }


        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            phoneNumber: String!
            nickname: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)