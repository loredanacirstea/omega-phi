Meteor.methods({
  countConcepts: function() {
    return Concepts.find().count()
  },
  updateSubject: function(obj, id) {
    if(id)
      Subject.update({_id: id}, {$set: obj})
    else {
      obj.ontology = ontouuid
      obj.upd = new Date()
      Subject.insert(obj)
    }
  },
  insertSubject: function(obj) {
    obj.uuid = uuid.v1()
    obj.ontology = ontouuid
    obj.upd = new Date()
    obj.lang = 'en'
    obj.subject = "new"
    console.log('inserted: ' + JSON.stringify(obj))
    Subject.insert(obj)
    Concepts.insert({uuid: obj.uuid, upd: new Date()})
  },
  insertTerm: function(uid, obj) {
    obj.uuid = uid
    obj.ontology = ontouuid
    obj.upd = new Date()
    Subject.insert(obj)
  },
  updateRelation: function(obj, id) {
    Relation.update({_id: id}, {$set: obj})
  },
  insertRelation: function(obj) {
    Relation.insert(obj)
  },
  removeSubject: function(id) {
    Subject.remove(id)
  },
  removeRelation: function(id) {
    Relation.remove(id)
  },
  addRelations: function(uuid1, rels) {
    rels.forEach(function(obj) {
      var r = Relation.findOne({uuid1: uuid1, uuid2: obj.uuid2, relation: obj.relation})
      if(!r) {
        obj.uuid1 = uuid1
        obj.ontology = ontouuid
        obj.upd = new Date()
        obj.ordering = 1
        Relation.insert(obj)
      }
    })
  },
  setRelations: function(uuid1, rels) {
    console.log('uuid1: ' + uuid1)
    var uu = []
    var rel = rels[0].relation
    rels.forEach(function(obj) {
      var r = Relation.findOne({uuid1: uuid1, uuid2: obj.uuid2, relation: obj.relation})
      uu.push(obj.uuid2)
      if(!r) {
        obj.uuid1 = uuid1
        obj.ontology = ontouuid
        obj.upd = new Date()
        obj.ordering = 1
        Relation.insert(obj)
      }
    })
    console.log('uuids: ' + JSON.stringify(uu))
    console.log('remove: ' + JSON.stringify(Relation.find({uuid1: uuid1, uuid2: {$nin: uu}, relation: rel}).fetch()))
    Relation.remove({uuid1: uuid1, uuid2: {$nin: uu}, relation: rel})
  }
})