import mongoose , {Schema , Document} from "mongoose";


export interface User extends Document{
    name : string,
    email : string,
    password : string,
    authProvider: "credentials" | "google";
    googleId?: string;
}

const UserSchema : Schema<User> = new Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        match : [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ , 'please use a valid email'],
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : false,
        trim : true
    },

     authProvider: {
      type: String,
      enum: ["credentials", "google"],
      required: true,
    },

    googleId: {
      type: String,
      sparse: true,
    },

},
{
    timestamps : true
}
)


const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User" , UserSchema))

export default UserModel;