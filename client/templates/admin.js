var limit = 10
var totalConcepts = new ReactiveVar(100)

Template.admin.onRendered(function() {
  $('head').append('<script src="/ASCIIMathML.js"></script>');
  $('head').append('<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_SVG"></script>');
  $('head').append("<script type='text/x-mathjax-config'>MathJax.Hub.Config({asciimath2jax: {delimiters: [['`','`']]}});</script>");

  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/dropdown.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/modal.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/button.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/transition.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/dimmer.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/image.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/icon.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/container.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/input.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/menu.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/components/item.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/components/label.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/components/list.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" class="ui" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/components/reset.min.css">')

  $('head').append('<script type="text/javascript"  src="https://cdn.jsdelivr.net/semantic-ui/2.1.8/semantic.min.js" ></script>')
  $('head').append('<script type="text/javascript"  src="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/transition.min.js" ></script>')
  $('head').append('<script type="text/javascript"  src="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/dropdown.min.js" ></script>')
  $('head').append('<script type="text/javascript"  src="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/modal.min.js" ></script>')
  $('head').append('<script type="text/javascript"  src="https://cdn.jsdelivr.net/semantic-ui/2.1.8/components/dimmer.min.js" ></script>')
  $('head').append('<script type="text/javascript"  src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/components/visibility.min.js" ></script>')



  Meteor.call('countConcepts', function(err, res) {
    console.log(err)
    console.log(res)
    if(res)
      totalConcepts.set(res)
  })
})

Template.admin.events({
  'click #insertRecord': function(e) {
    Meteor.call('insertSubject', {})
    $('#nnextButton').trigger('click')
  }
})

Template.subjectView.onCreated(function() {
  this.selected = new ReactiveVar()
  this.initial = new ReactiveVar()
  this.type = new ReactiveVar()
  this.options = new ReactiveVar()
  this.modal = new ReactiveVar()
  var self = this

  this.autorun(function() {
    var options = {}
    var lim = FlowRouter.getQueryParam('l')
    var skip = FlowRouter.getQueryParam('s')
    options.skip = skip ? parseInt(skip) : 0
    options.limit = lim ? parseInt(lim) : limit
    self.subscribe('concept', {}, options)
  })

  this.autorun(function() {
    if(Template.instance().subscriptionsReady()) {
      console.log('mathjax Typeset')
      $('head').append("<script type='text/javascript'>(function() {MathJax.Hub.Typeset();}) ();</script>");
    }
  })

  this.autorun(function() {
    var selected = self.selected.get()
    console.log(selected)
  })
})

Template.subjectView.helpers({
  formulaHead: function() {
    return ['msy', 'mfr']
  },
  langHead: function() {
    return ['ro', 'en', 'wiki']
  },
  concept: function() {
    return Concepts.find({}, {sort: {upd: 1}}).fetch()
  },
  agregg: function() {
    var subs = Subject.find({uuid: this.uuid}).fetch()
    var rels = Relation.find({uuid1: this.uuid}).fetch()
    var obj = JSON.parse(JSON.stringify(this))
    subs.forEach(function(s) {
      obj[s.lang] = s.subject
      obj['id_'+s.lang] = s._id
    })
    rels = rels.map(function(r) {
      var lg = r.relation == 13 ? 'unit' : 'en'
      r.subject = Subject.findOne({uuid: r.uuid2, lang: lg})
      return r
    })
    var rels = _.groupBy(rels,
      function(r) { return r.relation })
    obj.relations = rels
    return obj
  },
  getid: function(obj, a) {
    return obj['id_'+a]
  },
  value: function(obj, a) {
    // if the subject is a unit:
    if(a == 'mfr' && obj.lang == 'unit')
      return obj.subject
    return obj[a]
  },
  mathjax: function() {
    return this.msy ? (this.msy + (this.mfr ? (' = ' + this.mfr) : '')) : null;
  },
  small: function(a) {
    return ['_id', 'uuid', 'part of', 'msy', 'unit'].indexOf(a) != -1
  },
  output: function(a) {
    var lang, type
    if(a == 'part of') {
      type = 1
      lang = 'en'
    }
    else if(a == 'unit') {
      type = 13
      lang = 'unit'
    }
    else {
      type = 15
      lang = 'en'
    }
    if(this.relations[type])
      return this.relations[type].map(function(r) {
        if(r.subject)
          return r.subject.subject
      }).join(',')

    return ''
  },
  valuee: function(a) {
    var lang, type
    if(a == 'part of') {
      type = 1
      lang = 'en'
    }
    else if(a == 'unit') {
      type = 13
      lang = 'unit'
    }
    else {
      type = 15
      lang = 'en'
    }
    if(this.relations[type])
      return this.relations[type].map(function(r) {
        if(r.subject)
          return r.subject.uuid
      }).join(',')

    return ''
  },
  search: function() {
    var ui = subjectro.ui.search('modal')
    console.log(ui)
    console.log(ui.instance)
    Template.instance().modal = ui.instance
    return ui.template
  },
  conceptData: function() {
    return {
      initial: Template.instance().initial,
      selected: Template.instance().selected,
      type: Template.instance().type,
      options: Template.instance().options
    }
  }
})
Template.subjectView.events({
  'click #pprevButton': function(e, templ) {
    console.log('pprevButton')
    var l = parseInt(FlowRouter.getQueryParam('l') || limit)
    FlowRouter.setQueryParams({s: 0, l: l})
  },
  'click #prevButton': function(e, templ) {
    console.log('prevButton')
    var l = parseInt(FlowRouter.getQueryParam('l') || limit)
    var s = parseInt(FlowRouter.getQueryParam('s') || 0)
    FlowRouter.setQueryParams({s: s-l, l: l})
  },
  'click #nextButton': function(e, templ) {
    console.log('nextButton')
    var l = parseInt(FlowRouter.getQueryParam('l') || limit)
    var s = parseInt(FlowRouter.getQueryParam('s') || 0)
    FlowRouter.setQueryParams({s: s+l, l: l})
  },
  'click #nnextButton': function(e, templ) {
    console.log('nnextButton')
    var l = parseInt(FlowRouter.getQueryParam('l') || limit)
    FlowRouter.setQueryParams({s: totalConcepts.get()-l+1, l: l})
  },
  'click .removeSubject': function(e, templ) {
    Meteor.call('removeSubject', this._id)
  },
  'change .subjectLang': function(e, templ) {
    var h = this.valueOf()
    if(['ro', 'en', 'wiki'].indexOf(h) != -1) {
      var t = $(e.currentTarget)
      var id = t.attr('id')
      var val = t.val()
      var obj = {subject: val}
      if(!id) {
        obj.uuid = t.attr('uuid')
        obj.lang = h
      }
      Meteor.call('updateSubject', obj, id, function(err, res) {
        if(err) console.log(err)
      })
    }

  },
  'click .subjectFormula': function(e, templ) {
    console.log('change msy')
    $('#mathjaxEditorHiddenIni').data('msy', this.msy)
    $('#mathjaxEditorHiddenIni').data('mfr', this.mfr)
    $('#mathjaxEditorHidden').data('idmfr', this.id_mfr)
    $('#mathjaxEditorHidden').data('idmsy', this.id_msy)
    $('#mathjaxEditorHidden').data('uuid', this.uuid)

    $('#mathjaxEditorHiddenIni').trigger('change')
    $('.subjectroMathjaxEditorModal').modal('show')

    $('#mathjaxEditorHidden').on('change', function(e) {

      var msy = $('#mathjaxEditorHidden').data('msy')
      var mfr = $('#mathjaxEditorHidden').data('mfr')
      var idmsy = $('#mathjaxEditorHidden').data('idmsy')
      var idmfr = $('#mathjaxEditorHidden').data('idmfr')
      var uuid = $('#mathjaxEditorHidden').data('uuid')

      if(idmsy)
        Meteor.call('updateSubject', {subject: msy}, idmsy)
      else
        Meteor.call('updateSubject', {subject: msy, uuid: uuid, lang: 'msy'})
      if(idmfr)
        Meteor.call('updateSubject', {subject: mfr}, idmfr)
      else
        Meteor.call('updateSubject', {subject: mfr, uuid: uuid, lang: 'mfr'})

      $('.subjectroMathjaxEditorModal').modal('hide')
    })
    // ! unit lang -> subject is in mfr
  },
  'change .hid': function(e) {
    var t = $(e.currentTarget)
    var val = t.val().split(',')
    if(t.hasClass('partof')) {
      Meteor.call('setRelations', this.uuid, val.map(function(s) {
        return {uuid2: s, relation: 1}
      }))
    }
    else if(t.hasClass('unit')) {
      Meteor.call('setRelations', this.uuid, val.map(function(s) {
        return {uuid2: s, relation: 13}
      }))
    }
    else if(t.hasClass('vars')) {
      Meteor.call('setRelations', this.uuid, val.map(function(s) {
        return {uuid2: s, relation: 15}
      }))
    }
  }
})
