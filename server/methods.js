
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
  updateSubject: function(obj) {
    var u = Meteor.user();
    if(!u || !u.roles || !u.roles.editor || !u.roles.admin || !u.emails || !u.emails[0].address) {
      throw new Meteor.Error('not-editor', 'The user must be an editor to be able to propose changes.');
    }

    if(u.roles.admin) {
      // We save directly in the official dbs
      updateSubject(obj);
      // Also save as an accepted proposal
      obj.accepted = true;
    }

    Subject2.insert(obj);
    Concept2.upsert({uuid: obj.uuid}, {$set: {uuid: obj.uuid}});

    if(!u.roles.admin) {
      this.unblock()
      sendEmail(adminEmail,
        'Omega Phi - New Proposal - ' + u.emails[0].address,
        'User: ' + u.profile.firstName + ' ' + u.profile.lastName + ' - ' + u.emails[0].address + '\n' +
        'Proposal: ' + JSON.stringify(obj)
      )
    }
  },
  updateRelation: function(obj, insert) {
    var u = Meteor.user()
    if(!u || !u.roles || !u.roles.editor || !u.emails || !u.emails[0].address)
      throw new Meteor.Error('not-editor', 'The user must be an editor to be able to propose changes.')

    if(!insert)
      obj.remove = true

    if(u.roles.admin) {
      // We save directly in the official dbs
      if(!obj.remove) {
        updateRelation(obj);
      }
      else {
        removeRelation(obj);
      }
      // Also save as an accepted proposal
      obj.accepted = true;
    }

    Relation2.insert(obj)
    Concept2.upsert({uuid: obj.uuid}, {$set: {uuid: obj.uuid1}})

    if(!u.roles.admin) {
      this.unblock()
      sendEmail(adminEmail,
        'Omega Phi - New Proposal - ' + u.emails[0].address,
        'User: ' + u.profile.firstName + ' ' + u.profile.lastName + ' - ' + u.emails[0].address + '\n' +
        'Proposal: ' + JSON.stringify(obj)
      )
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
    Concept.insert({uuid: obj.uuid, upd: new Date()})
  },
  insertTerm: function(uid, obj) {
    obj.uuid = uid
    obj.ontology = ontouuid
    obj.upd = new Date()
    Subject.insert(obj)
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
    var u = Meteor.user()
    if(!u || !u.roles || !u.roles.admin)
      throw new Meteor.Error('not-admin', 'The user must be an admin to be able to accept proposals.')

    var prop = Subject2.findOne(id)
    if(prop) {
      updateSubject(prop);
      // set proposal as accepted
      Subject2.update({_id: id}, {$set: {accepted: true}})
    }
    else {
      prop = Relation2.findOne(id)
      if(!prop) return

      if(!prop.remove) {
        updateRelation(prop);
      }
      else {
        removeRelation(prop);
      }

      // set proposal as accepted
      Relation2.update({_id: id}, {$set: {accepted: true}})
    }
    // rate user
    Meteor.users.update({'emails.address': prop.author}, {$inc: {'profile.rating': 1}})
  },
  declineProposal: function(id) {
    var u = Meteor.user()
    if(!u || !u.roles || !u.roles.admin)
      throw new Meteor.Error('not-admin', 'The user must be an admin to be able to reject proposals.')


    var prop = Subject2.findOne(id)
    // set proposal as declined
    if(prop)
      Subject2.update({_id: id}, {$set: {accepted: false}})
    else {
      prop = Relation2.findOne(id)
      if(!prop) return
      Relation2.update({_id: id}, {$set: {accepted: false}})
    }
    // rate user
    Meteor.users.update({'emails.address': prop.author}, {$inc: {'profile.rating': -1}})
  }
});

let updateSubject = (obj) => {
  Subject.upsert({uuid: obj.uuid, lang: obj.lang}, {$set: {uuid: obj.uuid, lang: obj.lang, subject: obj.subject, author: obj.author}});

  var setc = {
    uuid: obj.uuid
  };
  if(obj.lang == 'unit')
    setc.type = 3;
  Concept.upsert({uuid: obj.uuid}, {$set: setc});
};

let updateRelation = (obj) => {
  Relation.insert(obj);
  if(obj.relation == 1)
    Concept.update({uuid: obj.uuid2}, {$set: {type: 1}});
  else if(obj.relation == 15)
    Concept.update({uuid: obj.uuid1}, {$set: {solver: true}});

  Concept.upsert({uuid: obj.uuid1}, {$set: {uuid: obj.uuid1}});
};

let removeRelation = (obj) => {
  Relation.remove({uuid1: obj.uuid1, uuid2: obj.uuid2, relation: obj.relation});
  Concept.upsert({uuid: obj.uuid1}, {$set: {uuid: obj.uuid1}});
};
