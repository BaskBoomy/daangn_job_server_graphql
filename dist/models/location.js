import { Schema, model } from "mongoose";
const LocationSchema = new Schema({
    SERIAL: {
        type: String,
    },
    ADMCD: {
        type: String,
    },
    ADMNM: {
        type: String,
    },
    X: {
        type: String,
    },
    Y: {
        type: String,
    }
});
export default model("Location", LocationSchema, "location");
