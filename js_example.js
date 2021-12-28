import dotenv from 'dotenv'
dotenv.config()
import('./dbconnection.js')
import('./myscript.js')
import path from 'path'
import bodyParser from 'body-parser';
import {main, owners} from './models/DatabaseSchemas.js';
import express from 'express'
const app=express()
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.set('views',path.join('views'))
app.set('view engine','ejs')
app.use(express.static('public'))
app.post('/prison',async(req,res)=>{
  const address=req.body.address
  var multiplier=null;
  var solPatrols=[]
  var animals=[]
  try{
  const nftOwner=await owners.findOne({ownerName:address}).populate('animals').populate('solPatrols')
  if(nftOwner!=null){
  animals=nftOwner.animals;
  solPatrols=nftOwner.solPatrols;
  multiplier=nftOwner.multiplier;
  for(let i=0;i<animals.length;i++){
  animals[i].name=encodeURI("images/Animals/"+animals[i].name+".jpg")
  animals[i].name=animals[i].name.replace("#","")  
}
  for(let i=0;i<solPatrols.length;i++){
  
  solPatrols[i].name=encodeURI("images/solPatrols/"+solPatrols[i].name+".png")
  solPatrols[i].name=solPatrols[i].name.replace("#","")  

}
  }

const nft=await main.findOne().populate({path:'owners',populate:'animals',populate:'solPatrols'}).sort({_id:-1})
var ownersData=[];
if(nft!=null){
ownersData=nft.owners
  ownersData.sort(function(a,b){
    return b.multiplier-a.multiplier
  })
  for(let i=0;i<ownersData.length;i++){
    let first=ownersData[i].ownerName.substring(0,3)
    let last=ownersData[i].ownerName.substring(ownersData[i].ownerName.length-3)
    ownersData[i].ownerName=first+'...'+last
  }
}
res.render('prison.ejs',{data:{multiplier,animals,solPatrols,flag:true,tableData:ownersData}})
  }
  catch(e){
    res.render('prison.ejs',{data:{flag:false,multiplier:null,animals:[],solPatrols:[],tableData:ownersData}})

  }
})

app.get('/prison',async(req,res)=>{
var ownersData=[]
try{
const nft=await main.findOne().populate({path:'owners',populate:'animals',populate:'solPatrols'}).sort({_id:-1})
if(nft!=null){
ownersData=nft.owners
  ownersData.sort(function(a,b){
    return b.multiplier-a.multiplier
  })
  for(let i=0;i<ownersData.length;i++){
    let first=ownersData[i].ownerName.substring(0,3)
    let last=ownersData[i].ownerName.substring(ownersData[i].ownerName.length-3)
    ownersData[i].ownerName=first+'...'+last
  }
}
res.render('prison.ejs',{data:{flag:false,multiplier:null,animals:[],solPatrols:[],tableData:ownersData}})

}
catch(e){
  res.render('prison.ejs',{data:{flag:false,multiplier:null,animals:[],solPatrols:[],tableData:ownersData}})

}
})


app.get('/',(req,res)=>{
  res.render('index.ejs')
})

    

app.get('/admin',async(req,res)=>{
  try{
     const latestOwners=await owners.find().populate('animals').populate('solPatrols').sort({_id:-1}).limit(3)
     for(let i=0;i<latestOwners.length;i++){
      const date=new Date(latestOwners[i].updatedAt)
   
     }
  
     res.render('private.ejs',{latestOwners})
  }
  catch(e){
    res.send("something went wrong....")
  }
})
//ignore for now


app.listen(3000,()=>{
  console.log("server started")
})