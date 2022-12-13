const {buildSchema}  = require("graphql");

module.exports = buildSchema(`
        type Job {
            _id: ID!
            title: String!
            place: String!
            updatedFromUser: Boolean!
            salary: String!
            pay: String!
            date: String!
            time: String!
            images: [String!]!
            detailcontent: String!
            workCategory: [String!]!
            isShortJob: Boolean!
            jobOfferer: User!
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
            createdJobs: [Job!]!
        }


        input JobInput {
            title: String!
            place: String!
            updatedFromUser: Boolean!
            salary: String!
            pay: String!
            date: String!
            time: String!
            images: [String!]!
            detailcontent: String!
            workCategory: [String!]!
            isShortJob: Boolean!
        }

        input UserInput {
            phoneNumber: String!
            nickname: String!
        }

        type RootQuery {
            jobs: [Job!]!
        }

        type RootMutation {
            createJob(jobInput: JobInput): Job
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)