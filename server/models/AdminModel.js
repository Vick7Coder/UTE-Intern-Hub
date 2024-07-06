import mongoose,{Schema} from "mongoose";

let AdminSchema = new mongoose.Schema({
    name:{
        type:String,
        
    },
    email:{
        type:String,
        unique:true,
    },
    password:({
        type : String,

    }),
    accountType :{
        type:String,
        default:"admin"
    },
    contact:{type:String},
    location:{type:String},
    about:{type:String},
    profileUrl:{type:String},
    
},
    {timestamps:true} 
)

const Admins = mongoose.model("Admins", AdminSchema)

export default Admins;

