
export default `
    type Like{
        _id: ID!
        job: Job!
        user: User!
        createdAt: String!
        updatedAt: String!
    }
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
        workTime: String
        images: [String!]!
        detailcontent: String!
        workCategory: [String!]!
        isShortJob: Boolean!
        jobOfferer: User!
        isUserLike: Boolean
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
        appliedJobs: [Job!]!
        likedJobs: [Job!]!
    }
    type AuthData{
        userId: String!
        token: String!
    }
    type Result{
        message: String!
        code: Int!
    }

    input JobInput {
        title: String!
        place: String!
        updatedFromUser: Boolean!
        salary: String!
        pay: String!
        date: String!
        workTime: String!
        images: [String!]!
        detailcontent: String!
        workCategory: [String!]!
        isShortJob: Boolean!
    }

    input UserInput {
        phoneNumber: String!
        nickname: String!
    }

    input UserUpdateInput{
        phoneNumber: String
        nickname: String
        borndate: String
        gender: String
        name: String
        selfIntroduction: String
        careers: [String]
    }

    input TimeSpan{
        startTime: String
        endTime: String
    }
    
    input SearchCategory{
        isShortJob: Boolean
        place: [String]
        workCategory: [String]
        dates: [String]
        time: TimeSpan
        text: String
    }
    
    input Coordinate {
        x: String!
        y: String!
    }
    type Location {
        address: String
        directDistance: Float
        X: String
        Y: String
        currentX: Float
        currentY: Float
    }
    type Query {
        me: User!
        login(phoneNumber: String!): AuthData
        user(userId: String!): User!
        jobs: [Job!]!
        job(jobId: String!): Job!
        searchJob(searchType: SearchCategory):[Job]!
        applys: [Apply!]!
        getNearAddress(coordinate: Coordinate!):[Location]!
        searchLocation(searchText: String!):[Location]!
        createUser(userInput: UserInput): User
        updateUser(userInput: UserUpdateInput): User!
        createJob(jobInput: JobInput): Job
        deleteJob(jobId: String): Job!
        cancelApply(applyId: ID!): Job!
        applyJob(jobId: ID!): Apply!
        likeJob(jobId: ID!): Like!
        unLikeJob(jobId: ID!): Job!
        sendSMSCode(phoneNumber: String!): Result!
        verifySMSCode(phoneNumber: String!, code: String!): Result!
    }
`