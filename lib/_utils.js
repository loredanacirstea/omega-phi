_ = lodash
console.log(Meteor.settings)

OPversion = '0.2.3';

let app = Meteor.settings.public.app;
//ontouuid = 'da724950-02e8-11e6-8c36-816075fb9b55' // old, no concept?
ontouuid = '4dbf1d00-12e5-11e6-8bc7-8b8616e222ac' // knowledge
unitsUuid = '720de7b0-12c5-11e6-9465-eb41388485fb'
serverUrl = Meteor.absoluteUrl();
maxFormCount = 25
sro = subjectro
Subject = subjectro.coll.subject
Relation = subjectro.coll.relation
console.log('app', app)
switch(app) {
  case 'neurals':
    physicsUuid = '84641a60-e81c-11e6-b8d5-ab6472b5c95d'; //machine learning
    break;
  case 'omegaphi':
    physicsUuid = '71fbe650-12c5-11e6-9465-eb41388485fb';
    break;
  case 'math':
    physicsUuid = '4dc02e70-12e5-11e6-8bc7-8b8616e222ac';
    break;
  default:
    physicsUuid = ontouuid;
}

console.log('physicsUuid', physicsUuid)
