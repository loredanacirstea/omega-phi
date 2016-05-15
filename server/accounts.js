//functions for updating user profile from Google/Facebook info
updateProfileFromService = function(user) {
  if(user.services.google) {
    var set = {}, addTo
    var gdata = user.services.google

    var user = Meteor.users.findOne({_id: user._id})
    if(!user)
      user = {}

    //populate profile with data
    set = {
      'profile.firstName': gdata.given_name, 
      'profile.lastName': gdata.family_name,
      'profile.avatar': gdata.picture
    }
    
    // add the email
    if(!user.emails)
      set.emails = [{address: gdata.email, verified: gdata.verified_email}]
    else {
      included = user.emails.some(function(e) {
        if(e.address == gdata.email)
          return true
        return false
      })
      if(!included)
        addTo = {emails: {address: gdata.email, verified: gdata.verified_email}}
    }

    var upd = {$set: set}
    if(addTo)
      upd['$addToSet'] = addTo
    //console.log(JSON.stringify(upd))

    Meteor.users.update({_id: user._id}, upd)
  }
  /*if(user.services.facebook) {
    console.log('facebook')
    var set = {}
    var gdata = user.services.facebook

    var user = Meteor.users.findOne({_id: user._id})
    if(!user)
      user = {}

    //if it has email, we put it as a username
    //cannot have it in the email field if there is another user with the same email.
    if(gdata.email && !user.username)
        set.username = 'f_'+gdata.email

    //populate profile with data
    if(!user.profile)
      user.profile = {}

    if(!user.profile.firstName && gdata.first_name)
      set['profile.firstName'] = gdata.first_name

    if(!user.profile.lastName && gdata.last_name)
      set['profile.lastName'] = gdata.last_name

    set['profile.avatar'] = 'https://graph.facebook.com/'+ gdata.id + '/picture?type=large'

    console.log(set)

    if(Object.keys(set).length > 0)
      Meteor.users.update({_id: user._id}, {$set: set}, {validate: false})
  }*/

}


Accounts.onCreateUser(function(options, user) {
  sendEmail(adminEmail, 
    'Omega Phi - New Editor', 
    'User: ' + options.profile.name + ' ' + '\n' +
    'Email: ' + user.services.google.email
  )

  return user;
})

Accounts.onLogin(function(obj) {
  updateProfileFromService(obj.user)
})




