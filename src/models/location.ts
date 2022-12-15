import { Schema, model } from "mongoose";
import { DocumentResult } from "../types/mongoose.js";

export interface ILocation extends DocumentResult<ILocation> {
    SERIAL: string;
    ADMCD: string;
    ADMNM: string;
    X: string;
    Y: string;
}
const LocationSchema = new Schema<ILocation>({
    SERIAL:{
        type:String,
    },
    ADMCD:{
        type:String,
    },
    ADMNM:{
        type:String,
    },
    X:{
        type:String,
    },
    Y:{
        type:String,
    }
})

export default model("Location", LocationSchema, "location");