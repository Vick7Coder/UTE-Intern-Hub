import mongoose,{Schema} from "mongoose";

let LectureSchema = new mongoose.Schema({
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
        default:"lecture"
    },
    contact:{type:String},
    location:{type:String},
    about:{type:String},
    profileUrl:{type:String},
    studentLists:[{type:Schema.Types.ObjectId, ref:"Seekers" }] , 
    
},
    {timestamps:true} 
)

const Lecturers = mongoose.model("Lecturers", LectureSchema)

export default Lecturers;

