const fs = require('fs');

const dirPath = '/mnt/efs';
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
    console.log(f);
  })

  callback(null,{
    'statusCode': 200,
    'body': JSON.stringify(files)
  });
};
