import authResolver from "./auth.js";
import jobResolver from "./job.js";
import applyResolver from "./apply.js";
import likeResolvers from "./like.js";
import locationResolvers from "./location.js";

const rootResolver = {
    ...authResolver,
    ...jobResolver,
    ...applyResolver,
    ...likeResolvers,
    ...locationResolvers
}
export default rootResolver;