const router = require('express').Router();
const path = require('path');
require('dotenv').config();
const jsforce = require('jsforce');
var request = require('request');
var opportunities=[];
var contacts=[];
var accounts =[];
var households=[];
var everything=[];
var done=false;
var failCount=0;
var version=0;

router.get('/done', function(req, res){
  if(done){
    console.log(done);
    res.sendStatus(200);
  }
  else if(failCount>15){
    failCount=0;
    res.sendStatus(400);
  }
  else{
    console.log(done);
    failCount++;
    res.redirect('/salesforce/done');
  }
})



router.get('/data', function(request, response){
    done=false;
    everything=[opportunities, contacts, accounts, households];
    response.send(everything);
});

router.get('/oauth2/auth', function(request, response){
  console.log("hellos");
  response.redirect(oauth2.getAuthorizationUrl({}));
});

const oauth2 = new jsforce.OAuth2({
  clientId : process.env.SF_CLIENT_ID,
  clientSecret : process.env.SF_CLIENT_SECRET,
  redirectUri : process.env.SF_CALLBACK_URL
})

console.log({clientId : process.env.SF_CLIENT_ID,
  clientSecret : process.env.SF_CLIENT_SECRET,
  redirectUri : process.env.SF_CALLBACK_URL});

router.get('/oauth2/callback', function(request, response){
  var conn = new jsforce.Connection({oauth2: oauth2});
  var code = request.param('code');
  conn.authorize(code, function(err, userInfo){
    if(err){
      return console.log(err);
    }
    console.log('accessToken: ' + conn.accessToken);
    console.log('connRefreshToken' + conn.refreshToken);
    console.log('Instance url: ' + conn.instanceUrl);
    console.log('user id: ' + userInfo.id);
    console.log('org id: ' + userInfo.organizationId);
    request.session.accessToken = conn.accessToken;
    request.session.instanceUrl = conn.instanceUrl;
    console.log('work please');
    getOpps(request.session.accessToken, request.session.instanceUrl);
    response.redirect('/gettingdata');
  });
});

function getOpps(accessToken, instanceUrl){
   opportunities=[];
   contacts=[];
   accounts =[];
   households=[];
  var requestObj = {
    url: instanceUrl + '/services/data/v37.0/limits',
    // url: instanceUrl + '/services/data/v37.0/composite/tree/Contact/',
    // url: instanceUrl + "/services/data/v37.0/query/?q=SELECT+Id+,Name+,npe01__Is_Opp_From_Individual__c+,Amount+,CloseDate+,Primary_Contact__c+,npe01__Contact_Id_for_Role__c+,AccountId+from+Opportunity+where+Recognition__c+=+'Email'+AND+CreatedDate+>+2016-08-20T21:04:49Z",
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  }
  request(requestObj, function(err, response, body){
    if(err){console.log('err', err);}
    else{

      var stuff = JSON.parse(response.body);
      // console.log(stuff);
      for(var i=0; i<stuff.records.length; i++){
        // if(stuff.records[i].Primary_Contact__c === null && stuff.records[i].npe01__Contact_Id_for_Role__c != null){
        //   stuff.records[i].Primary_Contact__c = stuff.records[i].npe01__Contact_Id_for_Role__c;
        // }
          opportunities.push(stuff.records[i]);
          getContact(accessToken, instanceUrl, stuff.records[i]);
          getAccount(accessToken, instanceUrl, stuff.records[i].AccountId);
      }
      // done=true;
    }
  });
}
function getContact(accessToken, instanceUrl, record){
  var requestObj = {
    url: instanceUrl + "/services/data/v37.0/query/?q=SELECT+Id+,Name+,Phone+,Email+,AccountId+,Greeting__c+,Professional_Suffix__c+,Gender__c+,Salutation+,MailingAddress+,npo02__Household__c+from+Contact+where+Id+=+'"+record.Primary_Contact__c+"'",
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  }
  request(requestObj, function(err, response, body){
    if(err){console.log('err', err);}
    else{
      var stuff = JSON.parse(response.body);
      // console.log(stuff);
      contacts.push(stuff.records[0]);
        getHousehold(accessToken, instanceUrl, stuff.records[0].npo02__Household__c);
    }
  });
}
function getHousehold(accessToken, instanceUrl, household){
  var requestObj = {
    url: instanceUrl + "/services/data/v37.0/query/?q=SELECT+Id+,Name+,npo02__Addressee__c+,npo02__Formula_MailingAddress__c+,npo02__HouseholdEmail__c+,npo02__HouseholdPhone__c+,npo02__Formal_Greeting__c+,npo02__Informal_Greeting__c+from+npo02__Household__c+where+Id+=+'"+household+"'",
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  }
  request(requestObj, function(err, response, body){
    if(err){console.log('err', err);}
    else{
      var stuff = JSON.parse(response.body);
      // console.log(stuff);
      households.push(stuff.records[0]);
    }
  });
}
function getAccount(accessToken, instanceUrl, AccountId){
  var requestObj = {
    url: instanceUrl + "/services/data/v37.0/query/?q=SELECT+Id+,Name+,BillingAddress+,Phone+,npe01__LifetimeDonationHistory_Amount__c+,npe01__LifetimeDonationHistory_Number__c+,npo02__AverageAmount__c+,Formal_Salutation__c+,Informal_Greeting__c+,Main_Contact__c+,Organization_Email__c+from+Account+where+Id+=+'"+AccountId+"'",
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  }
  request(requestObj, function(err, response, body){
    if(err){console.log('err', err);}
    else{
      var stuff = JSON.parse(response.body);
      // console.log(stuff);
      accounts.push(stuff.records[0]);
    }
  });
}

router.get('/overview', function(request, response){
  console.log('access token', request.session.accessToken);
  console.log('request url', request.session.instanceUrl);
  accessToken = request.session.accessToken;
  instanceUrl = request.session.instanceUrl;

  overviewInfo(accessToken, instanceUrl)

});

function overviewInfo(accessToken, instanceUrl){
  var requestObj = {
    url: instanceUrl + '/services/data/v37.0/query/?q=SELECT+Id+,Name+from+Opportunity',
    headers: {
      Authorization: 'Bearer' + accessToken
    }
  }
  request(requestObj, function(err, response, body){
    if(err){
      console.log('err', err);
    }
    else{
      var stuff = JSON.parse(response.body);
      console.log('stuff', stuff);
    }
  });
}


module.exports = router;
