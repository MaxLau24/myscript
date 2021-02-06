/*
surge:
TF DOWN = type=http-request,pattern=^https?:\/\/testflight\.apple\.com\/v2\/accounts\/.*\/apps\/\d*/builds/\d*/install,requires-body=1,max-size=0,script-path=https://gist.githubusercontent.com/NobyDa/9be418b93afc5e9c8a8f4d28ae403cf2/raw/TF_Download.js

Quantumult X:
^https?:\/\/testflight\.apple\.com\/v2\/accounts\/.*\/apps\/\d*/builds/\d*/install url request-body storefrontId" : ".*", request-body storefrontId" : "143441-1,29",

hostname =  testflight.apple.com
*/

$done({ 
body: $request.body
.replace(/storefrontId\" ?: ?\".+?\"/,'storefrontId" : "143441-1,29"')
})
