import { Meteor } from 'meteor/meteor';

//var ontouuid = uuid.v1();

Meteor.startup(() => {
  if(!Subject.findOne()) {
    //mapToSubjectRo()
  }
  //separateCats()
})


mapToSubjectRo = function() {
  var uid;
  Om.C.Formula.find().forEach(function(obj) {
    mapToSubject(obj);
  })
  Om.C.Formula.find().forEach(function(obj) {
    mapToRelation(obj);
  })
}
mapToSubject = function(obj) {
  var uid
  if(obj.en_symbol == 'physics')
    uid = physicsUuid
  else if(obj.en_symbol == 'units')
    uid = unitsUuid
  else
    uid = uuid.v1()

  var newobj, msy, mfr,
    conceptd = {uuid: uid, upd: new Date()}

  // Update formula with uuid
  Om.C.Formula.update({_id: obj._id}, {$set: {uuid: uid}})

  // Set subjects - same uuid
  if(obj.math_symbol && obj.math_symbol != '') {
    insertSubject(uid, 'msy', obj.math_symbol);
    msy = true
  }
  if(obj.math_formula && obj.math_formula != '') {
    insertSubject(uid, 'mfr', obj.math_formula);
    mfr = true
  }
  if(obj.tex_formula && obj.tex_formula != '')
    insertSubject(uid, 'tex', obj.tex_formula);
  if(obj.ro_description && obj.ro_description != '')
    insertSubject(uid, 'ro', obj.ro_description);
  if(obj.en_description && obj.en_description != '')
    insertSubject(uid, 'en', obj.en_description);
  if(obj.wiki && obj.wiki != '')
    insertSubject(uid, 'wiki', obj.wiki);

  // concept metadata - category or leaf
  if(!msy)
    conceptd.type = 1 //category
  else if(msy && mfr)
    conceptd.type = 2 // leaf

  // Set unit
  if(obj.unit && obj.unit != '') {
    var units = obj.unit.split(',')
    units.forEach(function(unit) {
      unit = unit.trim()
      var u = Subject.findOne({subject: unit});
      if(u) {
        if(u.lang == 'unit')
          insertRelation(uid, u.uuid, 13)
        else {
          Subject.remove({_id: u._id})
          u = null
        }
      }

      if(!u) {
        var uidU = uuid.v1()
        insertSubject(uidU, 'unit', unit)
        Concept.insert({uuid: uidU, upd: new Date(), type: 3})
        insertRelation(uid, uidU, 13)
        var unitsParent = Om.C.Formula.findOne({en_symbol: 'units'})
        if(unitsParent)
          insertRelation(uidU, unitsParent.uuid, 1)
      }
    })
  }

  // Part of - insert structural relation
  if(obj.part_of && obj.part_of != '') {
    var partof = obj.part_of.split(',')
    partof.forEach(function(p) {
      if(catAbv[p])
        p = catAbv[p]

      var partUuid
      var part = Om.C.Formula.findOne({en_symbol: p})
      if(part)
        partUuid = part.uuid
      else {
        partUuid = uuid.v1()
        insertSubject(partUuid, 'en', p);
        Concept.insert({uuid: partUuid, upd: new Date(), type: 1})
      }
      insertRelation(uid, partUuid, 1)
    })
  }

  Concept.insert(conceptd)
}

mapToRelation = function(obj) {
  // Set variables relation
  if(obj.vars && obj.vars != '') {
    var vars = obj.vars.split(',')
    var varS
    for(v in vars) {
      vars[v] = vars[v].trim()
      // Find all instances of the variable and insert relations with them
      /*varS = Om.C.Formula.find({en_symbol: vars[v]}).fetch()
      varS.forEach(function(v) {
        insertRelation(obj.uuid, v.uuid, 15)
      })*/
      varS = Om.C.Formula.findOne({en_symbol: vars[v]})
      if(varS)
        insertRelation(obj.uuid, varS.uuid, 15)
    }
    // concept metadata - solver
    Concept.update({uuid: obj.uuid}, {$set: {solver: true}})
  }
}

insertSubject = function(uid, lang, subject) {
  Subject.insert({
    uuid: uid,
    lang: lang,
    subject: subject,
    ontology: ontouuid,
    upd: new Date()
  });
}

insertRelation = function(uuid1, uuid2, relation) {
  Relation.insert({
    uuid1: uuid1,
    uuid2: uuid2,
    relation: relation,
    ordering: 1,
    ontology: ontouuid,
    upd: new Date()
  });
}

var recurs = 0
separateCats = function() {
  var subcats = Relation.find({uuid2: physicsUuid, relation: 1}).fetch()
  subcats.forEach(function(c) {
    var no = 1;
    var formulaUuids = Relation.find({uuid2: c.uuid1, relation: 1}).map(function(r) { return r.uuid1 })
    console.log('subcat: ' + c.uuid1)
    var formulaCount = formulaUuids.length
    console.log('formulaCount: ' + formulaCount)
    if(formulaCount > maxFormCount) {
      recurs = 0
      while(formulaCount > 0 && recurs < 1000) {
        recurs ++
        // insert new subcategory
        var cat = Subject.find({uuid: c.uuid1}).fetch()
        var uid = uuid.v1()
        console.log('newcat: ' + uid)
        cat.forEach(function(cs) {
          cs.subject += ' ' + no
          delete cs._id
          cs.uuid = uid
          Subject.insert(cs)
        })
        Concept.insert({uuid: uid, upd: new Date(), type: 1})
        // create structural connection with main category
        insertRelation(uid, c.uuid1, 1)

        // populate subcateogry with formulas  
        var ccc = []      
        Concept.find({
          uuid: {$in: formulaUuids}
        }, {sort: {type: -1}, limit: maxFormCount}
        ).forEach(function(con) {
          ccc.push(con.uuid)
          Relation.update({uuid1: con.uuid, uuid2: c.uuid1, relation: 1}, {$set: {uuid2: uid}})
          formulaUuids.splice(formulaUuids.indexOf(con.uuid),1)
        })
        console.log('modified: ' + ccc.length)

        formulaCount = formulaUuids.length
        console.log('formulaCount: ' + formulaCount)
        no ++
      }
    }
  })
}

var cats = ['mechanics', 'thermodynamics', 'electricity', 'magnetism', 'optics', 'electromagnetism', 'quantum', 'atomic', 'nuclear', 'mathematics']

var catAbv = {
  m: 'mechanics',
  t: 'thermodynamics',
  e: 'electricity',
  mg:  'magnetism',
  o: 'optics',
  r: 'electromagnetism',
  c: 'quantum',
  a: 'atomic',
  n: 'nuclear',
  math:  'mathematics'
}

var cat = {}