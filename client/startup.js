Meteor.startup(() => {
  AutoForm.setDefaultTemplate("semanticUI");

  // Handle click events for all external URLs on mobile
  if(!Meteor.isCordova)
    return
  // Make sure you install 
  // Meteor add cordova:org.apache.cordova.inappbrowser@1.4.0

  document.addEventListener("deviceready", () => {
    $(document).on('click', (e) => {
      var link = $(e.target).closest('a[href]')
      if(link.length > 0) {
        url = link.attr('href')
        console.log(url)
        if(!(typeof url == 'string' && url.indexOf('://') >= 0))
          return
        cordova.InAppBrowser.open(url, '_system')
        e.preventDefault()
      }
    })
  })
});

sysLang = new ReactiveVar("en")
routeUuid = new ReactiveVar()

Tracker.autorun(function() {
  var uuid = FlowRouter.getParam('uuid')
  if(!uuid) {
    var p = FlowRouter.current()
    if(p && p.params)
      uuid = p.params.uuid
  }
  routeUuid.set(uuid)
})

// Subscriptions
var subsOpt = {
    cacheLimit: 500,
    expireIn: 20000 //minutes
}
ConceptSubs = new SubsManager(subsOpt);
PathSubs = new SubsManager(subsOpt);
KidsSubs = new SubsManager(subsOpt);
VarsSubs = new SubsManager(subsOpt);
allSubsReady = new ReactiveVar()
Tracker.autorun(function() {
  if(ConceptSubs.ready() && PathSubs.ready() && KidsSubs.ready() && VarsSubs.ready())
    allSubsReady.set(true)
  else
    allSubsReady.set()
})

var userSub
Tracker.autorun(function() {
  var userId = Meteor.userId()
  if(userId)
    userSub = Meteor.subscribe('user')
  else if(userSub)
    userSub.stop()
})

// User Roles
userRoles = new ReactiveVar({})

Tracker.autorun(function() {
  var user = Meteor.user()
  if(user)
    Meteor.call('getRoles', function(err, res) {
      if(err)
        console.log(err)
      if(res)
        userRoles.set(res)
    })
  else
    userRoles.set({})
})
    
