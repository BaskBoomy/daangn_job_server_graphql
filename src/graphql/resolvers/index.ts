import authResolver from "./auth.js";
import jobResolver from "./job.js";
import applyResolver from "./apply.js";
import likeResolvers from "./like.js";

const rootResolver = {
    ...authResolver,
    ...jobResolver,
    ...applyResolver,
    ...likeResolvers
}
export default rootResolver;