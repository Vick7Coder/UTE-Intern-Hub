import mongoose,{Schema} from "mongoose";

let recruiterSchema = new mongoose.Schema({
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
        default:"recruiter"
    },
    contact:{type:String},
    location:{type:String},
    about:{type:String},
    profileUrl:{type:String},

    jobPosts:[{type:Schema.Types.ObjectId, ref:"Jobs" }] , //data comes from the job model
    applicants: [
        {
          type: Schema.Types.ObjectId,
          ref: "Seekers",
          required: true,
        }],
        
    
},
    {timestamps:true} 
)

const Recruiters = mongoose.model("Recruiters", recruiterSchema)

export default Recruiters;

