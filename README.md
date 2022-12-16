# Graphql API

### 💻 Platforms & Languages

<img src="https://img.shields.io/badge/Nodejs-green?style=flat&logo=Node.js&logoColor=white"/><img src="https://img.shields.io/badge/TypeScript-blue?style=flat&logo=typescript&logoColor=white"/><img src="https://img.shields.io/badge/MongoDB-darkgreen?style=flat&logo=mongodb&logoColor=white"/><img src="https://img.shields.io/badge/Graphql-pink?style=flat&logo=graphql&logoColor=white"/>

If you want to check out types and schema, [click here](https://github.com/BaskBoomy/daangn_job_server_graphql/blob/master/src/graphql/schema/index.ts) 😄

### 📤 Query

- **Auth**

  **me**: User!

  **login**(phoneNumber: String!): AuthData

  **user**(userId: String!): User!

- **Jobs**

  **jobs**: [Job!]!

  **job**(jobId: String!): Job!

  **searchJob**(searchType: SearchCategory):[Job]!

  **applys**: [Apply!]!

- **Location**

  **getNearAddress**(coordinate: Coordinate!):[Location]!

  **searchLocation**(searchText: String!):[Location]!

### 📥 Mutation

- **Auth**

  **createUser**(userInput: UserInput): User

  **updateUser**(userInput: UserUpdateInput): User!

- **Jobs**

  **createJob**(jobInput: JobInput): Job

  **deleteJob**(jobId: String): Job!

  **cancelApply**(applyId: ID!): Job!

  **applyJob**(jobId: ID!): Apply!

  **likeJob**(jobId: ID!): Like!

  **unLikeJob**(jobId: ID!): Job!

  **sendSMSCode**(phoneNumber: String!): Result!

  **verifySMSCode**(phoneNumber: String!, code: String!): Result!
