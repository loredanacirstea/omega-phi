Template.subjectroSearchModal.onCreated(function() {
  this.selected = new ReactiveVar([])
  this.saved = new ReactiveVar()
})

Template.subjectroSearchModal.helpers({
  search: function() {
    return 'subjectroSearch'
  },
  searchdata: function() {
    return {
      selected: Template.instance().selected,
      initial: Template.currentData().initial,
      type: Template.currentData().type,
      options: Template.currentData().options
    }
  }
})

Template.subjectroSearchModal.onRendered(function() {
  var self = this
  templateInst.set($(this.find('.subjectroSearchModal')))

  this.autorun(function() {
    var res = Template.currentData().selected.get()
    if(res)
      $('#subjectroSearchModalRes').html(res.map(function(s) {
        return s.uuid
      }).join(','))
  })

  $('#saveSearchButton').on('click', function(e) {
    self.data.selected.set(self.selected.get())
    $(self.find('.subjectroSearchModal')).modal('hide')
  })
})


