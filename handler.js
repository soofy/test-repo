'use strict';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfullyaa!',
      input: event,
    }),
  };

   callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};


var AWS = require("aws-sdk");
var IM = require('imagemagick');
var FS = require('fs');
var compressedJpegFileQuality = 0.80;
var compressedPngFileQuality = 0.95;
 
module.exports.s3uploadTriggered = (event, context, callback) => {
    var s3 = new AWS.S3();
    var sourceBucket = "am-source-bucket";
    var destinationBucket = "am-dest-bucket";
    var objectKey = event.Records[0].s3.object.key;
    var getObjectParams = {
        Bucket: sourceBucket,
        Key: objectKey
    };

    console.log("getObjectParams:" , getObjectParams);
    
    s3.getObject(getObjectParams, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log("S3 object retrieval get successful!!!.");
            var resizedFileName = "/tmp/" + objectKey;
            var quality;
            if (resizedFileName.toLowerCase().includes("png")){
                quality = compressedPngFileQuality;
            }
            else {
                quality = compressedJpegFileQuality;
            }
            var resize_req = { width:"100%", height:"100%", srcData:data.Body, dstPath: resizedFileName, quality: quality, progressive: true, strip: true };
            IM.resize(resize_req, function(err, stdout) {
                if (err) {
                    throw err;
                }
                console.log('stdout:', stdout);
                var content = new Buffer(FS.readFileSync(resizedFileName));
                var uploadParams = { Bucket: destinationBucket, Key: objectKey, Body: content, ContentType: data.ContentType, StorageClass: "STANDARD" };
                s3.upload(uploadParams, function(err, data) {
                    if (err) {
                        console.log(err, err.stack);
                    } else{
                        console.log("S3 compressed object upload successful.");
                    }
                });
            });
        }
    });
};  



module.exports.dynamoDBStreamTriggered = (event, context, callback) => {

  console.log("dynamoDBStreamTriggered:", event);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! dynamoDBStreamTriggered function executed successfullyaa!',
      input: event,
    }),
  };


   callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

  
 
