import theblockchainapi from 'theblockchainapi';
import fs from 'fs'
import('./dbconnection.js')
import {names,owners,main} from './models/DatabaseSchemas.js';



var file = fs.createWriteStream('array.txt')
const createNested = function(ownerId,type, name) {
  try{
  return names.create(name).then(docName => {
    
    if(type=='Animal'){
    return owners.findByIdAndUpdate(
      ownerId,
      { $push: { animals: docName._id } },
      { new: true, useFindAndModify: false }
    );
    }
    else{
      return owners.findByIdAndUpdate(ownerId,{
        $push:{ solPatrols:docName._id}},
        {new:true,useFindAndModify:false}
        )
    }
})
  
  }catch(e){
    console.log('something went wrong...')
  }
  
}

do{
let defaultClient = theblockchainapi.ApiClient.instance;

// Get a free API Key Pair here: https://dashboard.theblockchainapi.com/api-keys
//same
let APIKeyID = defaultClient.authentications['APIKeyID'];
APIKeyID.apiKey = process.env.APIKEYID;

let APISecretKey = defaultClient.authentications['APISecretKey'];
APISecretKey.apiKey = process.env.APISECRETKEY;
//api
let apiInstance = new theblockchainapi.SolanaCandyMachineApi();

let request = new theblockchainapi.GetMintedNFTsRequest(); // GetMintedNFTsRequest | 
request.candy_machine_id = process.env.CANDYMACHINEID;
request.network = "mainnet-beta";



let opts = {
  'getMintedNFTsRequest': request
};
var resultFlag=0
const result = await apiInstance.solanaGetNFTsMintedFromCandyMachine(opts).then((data) => {
  console.log('API called successfully.');
  return data;
}, (error) => {
  console.log("something went wrong");
  resultFlag=1
});
if(resultFlag==1)
continue;
let nft_metadata = new Array();
try{
for (let i = 0; i < result.length; i++) {
  nft_metadata.push(result[i]['nft_metadata']['mint'])
}
}
catch(e){
  console.log("something went wrong")
}

//main-for-loop

let nft_owner_list = new Array();
let apiInstance2 = new theblockchainapi.SolanaNFTApi();
let network = 'mainnet-beta';
var myMain={
  owners:[]
}
for (let i = 0; i < nft_metadata.length; i++) {        //old syntax used for length: nft_metadata.length
  let mintAddress = nft_metadata[i];
  var animalsCount=0
  var solPatrolCount=0
  var result2
  if(typeof mintAddress=='undefined'||mintAddress==null)
  continue;
  var result2Flag=0
 try{
   result2 = await apiInstance2.solanaGetNFTOwner(network, mintAddress)
   console.log("API called successfully")
}
catch(e){
  console.log("something went wrong.")
  result2Flag=1
}
if(result2Flag==1)
continue;
if(result2==null)
continue;
 if(typeof result2==='undefined')
 continue;
 if(result2['nft_owner']==null)
 continue;
var nft_owner = result2['nft_owner'];

if (nft_owner==='GUfCR9mK6azb9vcpsxgXyj7XRPAKJd4KMHTTVvtncGgp' || nft_owner==='4pUQS4Jo2dsfWzt3VgHXy3H6RYnEDd11oWPiaM2rdAPw' || nft_owner==='4miEbpemqvepzH9Yq4J4N56G3uZV3tRLeyMqR6ocVpLh' || nft_owner==='8RM5zah9umtd68e8hhR8EDMbz1p84M3bYiNTQei4RgiE')
   { 
    console.log("EXCHANGE WALLET")
    continue;
  }
  
  if (nft_owner_list.indexOf(nft_owner) == -1){
    nft_owner_list.push(nft_owner);
  } else {
    console.log("REPEAT OWNER");
    continue;
  }
  
  //loop-through-nft-names

  let apiInstance3 = new theblockchainapi.SolanaWalletApi();
  let network2 = 'mainnet-beta';
  var flag=0
  const result3 = await apiInstance3.solanaGetNFTsBelongingToWallet(network2, nft_owner).then((data) => {
    console.log('API called successfully.');
    return data;
  }, (error) => {
    console.log("something went wrong.")
    flag=1
  });
  if(flag==1)
  continue;
  if (result3===null)
  {
    continue;
  }

  

  console.log("Mint ID: " + mintAddress)
  console.log("NFT Owner: " + nft_owner)
  //file.write('mint-id-' + (i + 1) + ': ' + mintAddress + '\n')
  file.write('nft-owner-' + (i + 1) + ': ' + nft_owner + '\n')
  console.log(result3.nfts_owned.length)    //length of ntfs_owned
   var Owner=new owners({
     ownerName:nft_owner
   })
   Owner.save()
  myMain.owners.push(Owner._id)

  if(typeof result3.nfts_owned==undefined)
  continue
  if(typeof result3.nfts_owned.length==undefined)
  continue
 
  for (let j = 0; j < result3.nfts_owned.length; j++) {
  
      
    console.log(result3.nfts_owned[j])
    let apiInstance4 = new theblockchainapi.SolanaNFTApi();

    let network = 'mainnet-beta'; // String | The network ID (mainnet-beta, mainnet-beta)
    let mintAddress = result3.nfts_owned[j]; // String | The mint address of the NFT
    var result4Flag=0
    const result4 = await apiInstance4.solanaGetNFT(network, mintAddress).then((data) => {
      console.log('API called successfully.');
      return data;
    }, (error) => {
      console.log("something went wrong")
      result4Flag=1
    });
     if(result4Flag==1)
     continue;
    if (result4===null)
    {
      continue;
    }
    
    //file.write('nft-' + (j + 1) + ': ' + mintAddress + '\n')
    file.write('name-' + (j + 1) + ': ' + result4.data.name + '\n')
    const run=async()=>{
      if(result4.data.name.includes('Sol Patrol')){
        solPatrolCount++;
    await createNested(Owner._id,'Sol Patrol',{
      name:result4.data.name,
    })
    
  }
  else{
    animalsCount++
    await createNested(Owner._id,'Animal',{
      name:result4.data.name
    })

  }
    }
    if(result4.data.name.includes('Sol Patrol')||result4.data.name.includes('Animal'))
    run()
    else
    continue


    console.log(result4.data.name);
  }


  file.write('\n')
  var multiplier=0
  if(animalsCount==0 &&solPatrolCount>0){
  multiplier=solPatrolCount;
  
  }
  else if(solPatrolCount==0 && animalsCount>0){
    multiplier=animalsCount
  }
  else if(solPatrolCount>0 && animalsCount>0){
    var catMultiplier=1366+((animalsCount-1)*366)
    var animalMultiplier=catMultiplier+((solPatrolCount-1)*1237)
    multiplier=animalMultiplier/1000
    multiplier=multiplier.toFixed(2)
  }
  else{
    multiplier=0
  }
  try{
    await owners.findByIdAndUpdate(Owner._id,{
      multiplier:multiplier}
      )
    }
    catch(e){
      console.log("something went wrong...")
    }
}
const newMain=new main({
  owners:myMain.owners
})
newMain.save()
file.end()
}while(1)

