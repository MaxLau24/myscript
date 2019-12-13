/*
^https://article-api.smzdm.com/article/index_home_page url script-response-body smzdm.js
host: article-api.smzdm.com
*/


var body = $response.body;
var obj = JSON.parse($response.body);
obj.data.rows.forEach((element, index)=> {
    if(element["model_type"]=="ads"){ 
          obj.data.rows.splice(index,1);
     } 
 })
$done({body: JSON.stringify(obj)});