import mongoose from 'mongoose'

const namesSchema=new mongoose.Schema({
    name:String,
    number:Number,
    
},{timestamps:true})
namesSchema.index({createdAt:1},{expireAfterSeconds:1296000})
const ownerSchema=new mongoose.Schema({
    ownerName:String,
    animals:[{type:mongoose.Types.ObjectId,ref:'names'}],
    solPatrols:[{type:mongoose.Types.ObjectId,ref:'names'}],
    multiplier:Number
},{
    timestamps:true
})
ownerSchema.index({createdAt:1},{expireAfterSeconds:1296000})

const mainSchema=new mongoose.Schema({
    owners:[{
        type:mongoose.Types.ObjectId,
        ref:'owners'
    }]
},{
    timestamps:true
})
mainSchema.index({createdAt:1},{expireAfterSeconds:1296000})





const names=new mongoose.model('names',namesSchema)
const owners=new mongoose.model('owners',ownerSchema)
const main=new mongoose.model('nfts',mainSchema)

export {names,owners,main}