// Variables exported by this module can be imported by other packages and
// applications. See subject-search-tests.js for an example of importing.
//export const name = 'subjectro-search';
//sro = subjectro

Picker.route('/api/subject/search', function (params, req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*')
console.log('search api')
  if(!res.method == 'GET') {
    res.statusCode = 400
    res.statusMessage = 'Bad request. Only GET accepted';
    res.end('Bad request. Only GET accepted');
    return
  }
console.log(JSON.stringify(params))
  var text = params.query.text, query = {}

  if(params.query.lang)
    query.lang = {$in: params.query.lang.split(',')}

  var opt = {}
  if(params.query.skip)
    opt.skip = parseInt(params.query.skip)
  if(params.query.limit)
    opt.limit = parseInt(params.query.limit)

  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  if(text)
    res.end(JSON.stringify(subjectro.utils.search(text, query, opt)))
  else
    res.end(JSON.stringify(S.find(query, opt).fetch()))
})
Subject = subjectro.coll.subject
Relation = subjectro.coll.relation

Picker.route('/api/subject', function (params, req, res, next) {
  var id = params.query.id;
  var uuid = params.query.uuid;
  var lang = params.query.lang;
  var subject = params.query.subject;
  var lang2 = params.query.lang2;
  var result;

  if(id)
    result = Subject.findOne(id)

  if(subject && lang)
    result = Subject.findOne({subject: subject, lang: lang})

  if(uuid && lang)
    result = Subject.findOne({uuid: uuid, lang: lang})

  if(lang2 && lang2 != 'all')
    if(result)
      result = Subject.findOne({uuid: result.uuid, lang: lang2})
    else
      result = Subject.findOne({uuid: uuid, lang: lang2})

  if((lang2 == 'all' && (uuid || result)) || (uuid && !result))
    result = Subject.find({uuid: uuid || result.uuid}).fetch()


  res.setHeader("Access-Control-Allow-Origin", "*");
  if(result)
    res.end(JSON.stringify(result))
  else
    res.end('')
});