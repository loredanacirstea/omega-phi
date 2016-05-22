Meteor.publish('general', function(collection, query, options) {
  console.log('publish general')
  query = query || {}
  options = options || {}
  return Om.C[collection].find(query, options)
})

Meteor.publish('formula', function(query, options) {
  console.log('publish formula')
	query = query || {}
	options = options || {}
	return Om.C.Formula.find(query, options)
})

Meteor.publish('subject', function(query, options) {
  console.log('publish subject')
  query = query || {}
  options = options || {}
  return Subject.find(query, options)
})

Meteor.publish('users', function() {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1, roles: 1}})
})

Meteor.publish('user', function() {
  return Meteor.users.find({_id: this.userId}, {fields: {emails: 1, profile: 1, roles: 1}})
})

Meteor.publish('conceptall', function() {
  return [
    Subject.find(),
    Relation.find()
  ]
})

Meteor.publish('conceptCol', function(query, options) {
  query = query || {}
  options = options || {}
  return Concept.find(query, options)
})

Meteor.publish('term', function(uuid, langs) {
  if(!(langs instanceof Array))
    langs = [langs]
  return Subject.find({uuid: uuid, lang: {$in: langs}})
})

Meteor.publishComposite('concept', function(query, options) {
  query = query || {}
  options = options || {}
  options.sort = {upd: 1}
  //console.log('publish concept; query: ' + JSON.stringify(query) + '; options: ' + JSON.stringify(options))

  return {
    find: function() {
      //console.log('publish concepts: ' + Concept.find(query, options).fetch().length)
      return Concept.find(query, options)
    },
    children: [
      {
        find: function(c) {
          //console.log('publish concept subs: ' + Subject.find({uuid: c.uuid}).fetch().length)
          return Subject.find({uuid: c.uuid})
        },
        children: [
          // All relations
          {
            find: function(s) {
              //console.log('publish concept rels: ' + Relation.find({uuid1: s.uuid}).fetch().length)
              return Relation.find({uuid1: s.uuid})
            },
            // And Subjects with which relations exist
            children: [
              {
                find: function(r, s) {
                  var uuid = r.uuid1 == s.uuid ? r.uuid2 : r.uuid1
                  //console.log('publish concept rels kids: ' + Subject.find({uuid: uuid}).fetch().length)
                  return Subject.find({uuid: uuid})
                }
              }
            ]
          }
        ]
      }
    ]
  }
})

Meteor.publishComposite('kids', function(uuid, langs, options) {
  if(typeof langs == 'string')
    langs = [langs]
  options = options || {}

  //console.log('publish kids; uuid: ' + uuid + '; options: ' + JSON.stringify(options))

  return {
    find: function() {
      return Relation.find({uuid2: uuid, relation: 1}, options)
    },
    children: [
      {
        find: function(r) {
          var obj = {uuid: r.uuid1}
          if(langs)
            obj.lang = {$in: langs}
          return Subject.find(obj)
        }
      },
      // see if it has variables
      {
        find: function(r) {
          return Relation.find({uuid1: r.uuid1, relation: 15}, {limit: 1})
        }
      },
      // for categories, see if they have kids
      {
        find: function(r) {
          var ids = Relation.find({uuid2: r.uuid1, relation: 1}).map(function(rr) {
            return rr.uuid1
          })
          if(Concept.findOne({ 
            uuid: {$in: ids}, 
            type: {$exists: 1}
          }))
            return Relation.find({uuid2: r.uuid1, relation: 1}, {limit: 1})
          else
            return
        }
      }
    ]
  }
})

Meteor.publish('path', function(uuid, lang) {
  var uuids = getPath(uuid)
  var obj = {uuid: {$in: uuids.path}}
  if(lang)
    obj.lang = lang
  return [
    Subject.find(obj),
    Relation.find({_id: {$in: uuids.rels}})
  ]
})

Meteor.publishComposite('vars', function(uuid, langs) {
  if(typeof langs == 'string')
    langs = [langs]

  return {
    find: function() {
      return Relation.find({uuid1: uuid, relation: 15})
    },
    children: [
      {
        find: function(r) {
          var obj = {uuid: r.uuid2}
          if(langs)
            obj.lang = {$in: langs}
          return Subject.find(obj)
        }
      },
      // units for vars
      {
        find: function(r) {
          return Relation.find({uuid1: r.uuid2, relation: 13})
        },
        children: [
          {
            find: function(r2) {
              return Subject.find({uuid: r2.uuid2, lang: 'unit'})
            }
          }
        ]
      }
    ]
  }
})



var recurs = 0
getPath = function(uuid){
  var uuids = {path: [], rels: []}, rel, id = uuid;
  while(id != physicsUuid && recurs < 100){
    recurs ++
    rel = Relation.findOne({uuid1:id, relation: 1})
    if(rel) {
      id = rel.uuid2
      uuids.path.push(id);
      uuids.rels.push(rel._id)
    }
    else
      break;
  }
  recurs = 0
  return uuids;
}

