import mongoose from 'mongoose'

mongoose.connect(process.env.DBURL).then(()=>{
  console.log("connected to database successfully")
}).catch(()=>{
  console.log("Error with data base connection")
})