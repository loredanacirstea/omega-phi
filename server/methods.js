
Meteor.methods({
  isAdmin: function() {
    var user = Meteor.user()
    if(!user)
      return false
    if(user.roles && user.roles.admin)
      return true
    return false
  },
  isEditor: function() {
    var user = Meteor.user()
    if(!user)
      return false
    if(user.roles && user.roles.editor)
      return true
    return false
  },
  getRoles: function() {
    var user = Meteor.user()
    if(user)
      return user.roles
    return {}
  },
  setRole: function(userId, role, state) {
    var u = Meteor.user()
    if(!u || !u.roles || !u.roles.admin)
      return
    var user = Meteor.users.findOne(userId)
    if(!user || !user.emails)
      return
    var set = {}
    set['roles.'+role] = state
    Meteor.users.update({_id: userId}, {$set: set})

    this.unblock()
    sendEmail(user.emails[0].address, 
      'Omega Phi - ' + (state ? 'Added as ' : 'No longer ') + role, 
      'Dear ' + user.profile.firstName + ' ' + user.profile.lastName + ',' + '\n\n' +
      'We have ' + (state ? 'added you as a new ' : 'removed your role as ') + role + '.'
    )
  },
  countConcepts: function() {
    return Concept.find().count()
  },
  updateSubject: function(obj, id) {
    var u = Meteor.user()
    if(!u || !u.roles || !u.roles.editor || !u.emails || !u.emails[0].address)
      return

    Subject2.insert(obj)
    Concept2.insert({uuid: obj.uuid})


    this.unblock()
    sendEmail(adminEmail, 
      'Omega Phi - New Proposal - ' + u.emails[0].address, 
      'User: ' + u.profile.firstName + ' ' + u.profile.lastName + ' - ' + u.emails[0].address + '\n' +
      'Proposal: ' + JSON.stringify(obj)
    )
  },
  insertSubject: function(obj) {
    obj.uuid = uuid.v1()
    obj.ontology = ontouuid
    obj.upd = new Date()
    obj.lang = 'en'
    obj.subject = "new"
    console.log('inserted: ' + JSON.stringify(obj))
    Subject.insert(obj)
    Concept.insert({uuid: obj.uuid, upd: new Date()})
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
  },
  saveProposal: function(id) {
    var prop = Subject2.findOne(id)
    if(!prop)
      return
    // replace in original db with new author
    Subject.update({uuid: prop.uuid, lang: prop.lang}, {$set: {subject: prop.subject, upd: prop.createdAt, author: prop.author}})
    Concept.update({uuid: prop.uuid}, {$set: {upd: prop.createdAt}})
    // set proposal as accepted
    Subject2.update({_id: id}, {$set: {accepted: true}})
    // rate user
    Meteor.users.update({'emails.address': prop.author}, {$inc: {'profile.rating': 1}})
  },
  declineProposal: function(id) {
    var prop = Subject2.findOne(id)
    if(!prop)
      return
    // set proposal as declined
    Subject2.update({_id: id}, {$set: {accepted: false}})
    // rate user
    Meteor.users.update({'emails.address': prop.author}, {$inc: {'profile.rating': -1}})
  }
})