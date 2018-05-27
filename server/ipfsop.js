const ipfsAPI = require('ipfs-api');

const ipfsHost = process.env.IPFS_HOST || 'localhost';

const ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});

//function ListIPFS(CID){
//  return new Promise(function(resolve, reject){
//    ipfs.files.ls(CID, function(err,files){
//      if(err){
//        reject(err);
//      }else{
//        resolve(files);
//      }
//      console.log(err, files);
//      return files;
//    })
//  })
//}

function getIPFS(CID){
  return new Promise(function(resolve,reject){
    ipfs.files.get(CID, function(err,res){
      if(err){
        reject(err);
      }else{
        resolve(res);
        return res;
      }
    })
  })
}


async function uploadAndPin(buffer) {

  const resp = await ipfs.files.add(buffer);

  const hash = resp[0].hash;

  await ipfs.pin.add(hash);

  return hash;
};

module.exports = {
  uploadAndPin:uploadAndPin, 
  getIPFS:getIPFS,
  //ListIPFS:ListIPFS
};
