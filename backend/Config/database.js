const mongoose = require("mongoose")

exports.databaseConnection = ()=>{
    mongoose.connect(process.env.DB_URL)
    .then(()=>console.log("DB Connected Successfully"))
    .catch((error)=>{
        console.log("DB Connection Failed : ",error)
        process.exit(1)
    })
}