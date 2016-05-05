Template.subjectroSearch.onCreated(function(){
  templateInst.set(this)
  this.url = new ReactiveVar()
  this.text = new ReactiveVar()
  this.subjects = new ReactiveVar()
  var self = this

  this.autorun(function() {
    var data = Template.currentData()
    // Text to search for
    var text = self.text.get()
    // Construct url for ajax
    var url = '/api/subject/search?'
    if(data.lang)
       url += 'lang=' + data.lang + '&'
     url += 'text=' + (text || '')
     self.url.set(url)
   })

  if(!Template.currentData().options) {
    // Populate subjects with ajax data
    this.autorun(function() {
      var url = self.url.get()
      var t = self.text.get()
      Tracker.nonreactive(function() {
        var t = self.text.get()
        var subs = Template.currentData().selected.get() || []
        console.log('selected:')
        console.log(subs)
        if(t && t != '')
          $.getJSON( url, function(data){
            self.subjects.set(subs.concat(data))
          })
        else
          self.subjects.set(subs)
      })
    })
  }
  else
    this.autorun(function() {
      self.subjects.set(Template.currentData().options.get())
    })
})

Template.subjectroSearch.onRendered(function() {
  var self = this

  this.autorun(function() {
    var sub= Template.currentData().initial.get()
    if(sub) {
      console.log('initial:')
      console.log(sub)
      Template.instance().subjects.set(sub)
      var vals = sub.map(function(s) { return s._id })
      console.log(vals)
      $('.subjectroSearchDrop').dropdown('clear')
      Meteor.setTimeout(function() {
        $('.subjectroSearchDrop').dropdown('set exactly', vals)
      }, 800)
    }
  })


  var templ = Template.currentData()

  // Initialize dropdown
  $('.subjectroSearchDrop').dropdown({
    onChange: function(value, text, selectedItem) {
      if(value) {
        if(!(value instanceof Array))
          value = [value]
        var output = value.map(function(v) {
          var elem = $('#subjectroSearchOption_' + v)[0]
          if(elem)
            return Blaze.getData(elem)
        })
        // Set ReactiveVar from client with the chosen id
        if(output[0])
          templ.selected.set(output)
      }
    }
  })
})

Template.subjectroSearch.helpers({
  search: function() {
    console.log('search: ' + (!Template.currentData().options.get()))
    return !Template.currentData().options.get()
  },
  multiple: function() {
    var type = Template.currentData().type.get() == 'multiple'
    return type
  },
  subjects: function() {
    return Template.instance().subjects.get()
  }
})

Template.subjectroSearch.events({
  'keyup .subjectroSearchInput': function(e, templ) {
    var t = templ.$(e.target)
    var val = t.val()
    if(val.length >= 3) {
      templ.text.set(val)
      $('.subjectroSearchDrop').dropdown('show')
    }
    else
      templ.text.set('')
  }
})