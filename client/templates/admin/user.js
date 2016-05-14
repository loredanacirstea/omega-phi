Template.adminUsers.onCreated(function() {
  this.autorun(function() {
    var u = Meteor.user()
    Meteor.call('isAdmin', function(err, res) {
      if(err) console.log(err)
      if(!res)
        FlowRouter.go('/')
    })
  })
  this.subscribe('users')
})

Template.adminUsers.helpers({
  user: function() {
    return Meteor.users.find().fetch()
  },
  hasRole: function(role) {
    if(this.roles)
      return this.roles[role]
  }
})

Template.adminUsers.events({
  'click .addAdmin': function() {
    Meteor.call('setRole', this._id, 'admin', true)
  },
  'click .addEditor': function() {
    Meteor.call('setRole', this._id, 'editor', true)
  },
  'click .removeAdmin': function() {
    Meteor.call('setRole', this._id, 'admin', false)
  },
  'click .removeEditor': function() {
    Meteor.call('setRole', this._id, 'editor', false)
  }
})