import { Document } from "mongoose";

export interface DocumentResult<T> extends Document {
    _doc : T;
}
