var https = require('https');
var querystring = require('querystring');

var NuageFile = require("./nuageFile");
var NuageUsage = require("./nuageUsage");
var NuageAccount = require("./nuageAccount");

var client_id = '739612828231-qu956bv1d3f2i17d4rnmsgf002cqc7e7.apps.googleusercontent.com';
var scope = 'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata.readonly';
var redirect_uri = 'http://localhost:8080/authGoogleDrive';
var client_secret = 'rdlvoJUZMBBj3RuI_Wyb-39a';

var rest_api_url = 'https://www.googleapis.com/drive/v3';

class GoogleDriveConnector {
  constructor() {
    this.bearer = '';
  }

  static getConnexionURL(){
  return 'https://accounts.google.com/o/oauth2/v2/auth?scope=' + scope + '&state=state_parameter_passthrough_value&redirect_uri=' + redirect_uri + '&access_type=online&response_type=code&client_id=' + client_id;
 }

 getToken(code, res) {
  var data = querystring.stringify({
    client_secret: client_secret,
    grant_type: 'authorization_code',
    client_id: client_id,
    code: code,
    redirect_uri: redirect_uri
  });
  var options = {
    host: 'www.googleapis.com',
    path: '/oauth2/v4/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    },
    method: 'POST',
    port: 443
  };
  console.log('data',data);
  this.httpRequest(data, options, this.setBearer.bind(this), res);
 }

 setBearer(b, res){
  let json = JSON.parse(b);
  this.bearer = json.access_token;
  console.log('bearer',this.bearer);
  res.end('Bearer OK')
 }

/*** FUN LIST ***/

space_usage(res, mainCallback){
  //fields : storageQuota
  let data;
  var options = {
    host: 'www.googleapis.com',
    path: '/drive/v3/about?fields=storageQuota&access_token=' + this.bearer,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    port: 443
  };
  this.httpRequest(data, options, this.extractSpaceUsage, res, mainCallback);
}

extractSpaceUsage(data, res, mainCallback){
  var json = JSON.parse(data);
  let o = {}
  console.log(json);
  let u = new NuageUsage(json.storageQuota.usage, json.storageQuota.limit);
  o['GoogleDrive'] = u;
  mainCallback(res,o);
  //res.end(JSON.stringify(o));
}

files(res, mainCallback){
  var options = {
    host: 'www.googleapis.com',
    path: '/drive/v2/files?orderBy=folder&maxResults=2000&access_token=' + this.bearer,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    port: 443
  };
  let data;
  this.httpRequest(data, options, this.extractFiles, res, mainCallback);
}

extractFiles(data, res, mainCallback){
  let json = JSON.parse(data);
  var fileList = [];
  var fileList2 = [];
  for (var i = 0; i < json.items.length; i++){
    let obj = json.items[i];
    let n = new NuageFile(obj.id,obj.title,obj.kind);
    n.sources.push('GoogleDrive');
    let parent = fileList;
    for (var j = 0; j < obj.parents.length; j++){
     if(obj.parents[j].isRoot){
      parent = fileList2;
     }
    }
    /*
    TODO
    */
    parent.push(n);
  }
  mainCallback(res,fileList);
}


account_infos(res, mainCallback){
  let data;
  var options = {
    host: 'www.googleapis.com',
    path: '/drive/v3/about?fields=user&access_token=' + this.bearer,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    port: 443
  };
  this.httpRequest(data, options, this.extractAccountInfos, res, mainCallback);
}

extractAccountInfos(data, res, mainCallback){
  var json = JSON.parse(data);
  let o = {}
  console.log(json);
  let u = new NuageAccount(json.user.displayName, json.user.emailAddress, json.user.photoLink);
  o['GoogleDrive'] = u;
  mainCallback(res,o);
  //res.end(JSON.stringify(o));
}

/****** UTIL ******/

httpRequest(data, options, callback, response, mainCallback) {
  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var content = '';
    res.on('data', function(chunk) {
      content += chunk;
    });
    res.on('end', function() {
      if (res.statusCode === 200) {
        if (typeof callback === 'undefined')
          console.log(content);
        else
          callback(content, response, mainCallback);
      } else {
        console.log('Status:', res.statusCode);
        console.log(content);
      }
    });
  }).on('error', function(err) {
    console.log('Error:', err);
  });;

  if (typeof data === 'undefined'){

  }else{
    req.write(data);
  }
  req.end()
 }
}

//GoogleDriveConnector.prototype.setBearer.bind(this);

module.exports = GoogleDriveConnector;
