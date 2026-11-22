import mongoose , {Schema , Document} from "mongoose";


export interface click extends Document{
    urlId : mongoose.Types.ObjectId;
    browser : string;
    os : string;
    device : string;
    cpu : string;
}


const ClickSchema : Schema<click> = new Schema({
     urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index : true
    },
    browser: String,
    os: String,
    device: String,
    cpu : String,
})


export const clickModel = (mongoose.models.click as mongoose.Model<click>) || (mongoose.model<click>("Click" , ClickSchema));



