import mongoose , {Schema , Document} from "mongoose";

export interface url extends Document{
    userId : mongoose.Types.ObjectId;
    originalUrl : string;
    shortID : string;
    isActiveQr : boolean;
    Qrcode : string;
    isActive : boolean;
    totalClicks : number;
}

const urlSchema : Schema<url> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      originalUrl: {
        type: String,
        required: true,
      },

      shortID: {
        type: String,
        required: true,
        unique: true,
      },

      isActiveQr : {
        type : Boolean,
        default : false,
      },

      Qrcode : {
        type : String,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      totalClicks: {
        type: Number,
        default: 0,
      },

      
},
{
    timestamps : true
}
)

const urlModel = (mongoose.models.url as mongoose.Model<url>) || (mongoose.model<url>("Url" , urlSchema));


export default urlModel;

