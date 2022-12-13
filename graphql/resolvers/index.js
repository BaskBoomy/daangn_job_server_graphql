const authResolver = require("./auth.js");
const jobResolver = require("./job.js");
const applyResolver = require("./apply.js");

const rootResolver = {
    ...authResolver,
    ...jobResolver,
    ...applyResolver
}
module.exports = rootResolver