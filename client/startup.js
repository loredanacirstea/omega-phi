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