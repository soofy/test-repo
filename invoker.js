var lambdafunction = require('./handler');
var handler = 's3uploadTriggered';
var event =  {"Records":[ {"s3": {"object": { "key":"d41d8cd98f00b204e9800998ecf8427e"} }} ]}
var context = {};



function callback(err, data){
console.log("asdad");

}

lambdafunction[handler](event, context, callback);