const AWS = require("aws-sdk");
const S3 = new AWS.S3();
const fs = require('fs');

const dirPath = '/mnt/efs/nuxt';
// const dirPath = '.';
exports.lambdaHandler = async (event, context,callback) => {

  const list_up_files = (dir,files) => {

    let list = files ? files : [];
  
    fs.readdirSync(dir,{ withFileTypes:true })
      .forEach( f => {
        switch(true){
          case f.isFile():
            list.push(`${dir}/${f.name}`)
            break;
          case f.isDirectory():
            list = [...list_up_files(`${dir}/${f.name}`,list)];
            break;
          default:
            break;
        }
      })
  
    return list;
  }
  
  const files = list_up_files(dirPath);
  files.forEach(f => {
    const f__key = f.replace('/mnt/efs/nuxt/','');
    // const f__key = f.replace(/^\.\//,'');
    const f__body = fs.readFileSync(f);
    S3.putObject({
      Bucket: 'data-sync-1230',
      Key: f__key,
      Body: f__body
    }, function(err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  });

  callback(null,{
    'statusCode': 200,
    'body': JSON.stringify(files)
  });
};
