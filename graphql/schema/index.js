const {buildSchema} = require("graphql");

module.exports = buildSchema(`
        type Apply{
            _id: ID!
            job: Job!
            user: User!
            createdAt: String!
            updatedAt: String!
        }
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

        type AuthData{
            userId: String!
            token: String!
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
            applys: [Apply!]!
            login(phoneNumber: String!): AuthData
        }

        type RootMutation {
            createJob(jobInput: JobInput): Job
            deleteJob(jobId: String): Job!
            createUser(userInput: UserInput): User
            applyJob(jobId: ID!): Apply!
            cancelApply(applyId: ID!): Job!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)