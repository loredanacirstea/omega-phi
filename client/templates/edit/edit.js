Template.editFormula.onCreated(function() {
  Meteor.call('isEditor', function(err, res) {
    if(err) console.log(err)
    if(!res)
      FlowRouter.go('/')
  })
  var self = this
  this.formulaEditor = new ReactiveVar()

  this.poUuids = new ReactiveVar([])
  this.uUuid = new ReactiveVar()
  this.vUuids = new ReactiveVar([])

  this.autorun(function() {
    var uuid = routeUuid.get()
    var lang = sysLang.get()
    if(!uuid || !lang)
      return
    self.conceptSub = ConceptSubs.subscribe('concept', {uuid: uuid})
    self.varsSub = VarsSubs.subscribe('vars', uuid, ['msy', 'mfr', lang])
    self.pathSub = PathSubs.subscribe('path', uuid, lang)
    self.kidsSub = KidsSubs.subscribe('kids', uuid, [lang], {limit: 50})
  })
})

Template.editFormula.onRendered(function() {

  this.autorun(function() {
    var msys = Subject.findOne({uuid: routeUuid.get(), lang: 'msy'}) || {}
    var mfrs = Subject.findOne({uuid: routeUuid.get(), lang: 'mfr'}) || {}

    var f = Template.instance().$('.formulaSubjectSpan'),
      msy = f.data('msy'), mfr = f.data('mfr')

    if(!msy || !mfr) {
      msy = msys.subject
      mfr = mfrs.subject
    }

    if(!msy && !mfr) return
    var inner = msy ? (msy + (mfr ? (' = ' + mfr) : '')) : null
    if(inner)
      inner = "`" + inner + "`"

    Template.instance().$('.formulaSubjectSpan').html(inner)
    MathJax.Hub.Typeset($('.formulaSubjectSpan')[0]);

  })
})

Template.editFormula.helpers({
  fuuid: function() {
    return routeUuid.get()
  },
  templinst: function() {
    return Template.instance()
  },
  partof: function() {
    return Relation.find({uuid1: routeUuid.get(), relation: 1}).map(function(r) {
      return Subject.findOne({uuid: r.uuid2, lang: sysLang.get()})
    })
  },
  poResult: function() {

  },
  formulaSubject: function() {
    var msy = Subject.findOne({uuid: routeUuid.get(), lang: 'msy'}) || {}
    var mfr = Subject.findOne({uuid: routeUuid.get(), lang: 'mfr'}) || {}
    return {
      msy: msy,
      mfr: mfr//,
      //formula: msy.subject ? (msy.subject + (mfr.subject ? (' = ' + mfr.subject) : '')) : null
    }
  },
  formulaEditor: function() {
    return Template.instance().formulaEditor.get()
  },
  unit: function() {
    var r = Relation.findOne({uuid1: routeUuid.get(), relation: 13})
    var s
    if(r)
      s = Subject.findOne({uuid: r.uuid2, lang: 'unit'})
    return s
  },
  variables: function() {
    return Relation.find({uuid1: routeUuid.get(), relation: 15}).map(function(r) {
      return Subject.findOne({uuid: r.uuid2, lang: sysLang.get()})
    })
  },
  enSubject: function() {
    return Subject.findOne({uuid: routeUuid.get(), lang: 'en'}) || {}
  },
  roSubject: function() {
    return Subject.findOne({uuid: routeUuid.get(), lang: 'ro'}) || {}
  },
  wikiSubject: function() {
    return Subject.findOne({uuid: routeUuid.get(), lang: 'wiki'}) || {}
  },
  path: function() {
    var uuid = routeUuid.get()
    if(!uuid) return
    var lang = sysLang.get()
    if(!lang) return
    var rels = Relation.findOne({relation: 1, uuid2: {$ne: uuid}})
    if(Template.instance().pathSub.ready()) {
      //console.log('redo path')
      var uuids = getPath(uuid)
      uuids.reverse()
      //console.log('path uuids: ' + JSON.stringify(uuids))
      return uuids.map(function(id) {
        return Subject.findOne({uuid: id, lang: lang})
      })
    }
  },
  description: function() {
    var s = Subject.findOne({uuid: routeUuid.get(), lang: sysLang.get()})
    if(s)
      return firstUpper(s.subject)
  },
  formulas: function() {
    var uuid = routeUuid.get()
    if(!uuid) return
    var lang = sysLang.get()
    if(!lang) return
    var fs = [], ids =[], obj
    Relation.find({uuid2: uuid, relation: 1}).forEach(function(r) {
      if(ids.indexOf(r._id) != -1)
        return
      if(r.uuid1 == unitsUuid)
        return
      ids.push(r._id)
      var kids = Relation.findOne({uuid2: r.uuid1, relation: 1})
      obj = Subject.findOne({uuid: r.uuid1, lang: lang}) || {}
      fs.push(obj)
    })
    return fs
  }
})

Template.editFormula.events({
  'click .saveConcept': function(e, templ) {
    var uuid = routeUuid.get()

    //var pofs = 
    var f = templ.$('.formulaSubjectSpan'),
      msy = f.data('msy'),
      mfr = f.data('mfr'),
      msys = Subject.findOne({uuid: uuid, lang: 'msy'}) || {},
      mfrs = Subject.findOne({uuid: uuid, lang: 'mfr'}) || {}
    var unit = templ.$('.unitSubject').data('uuid')
    //var vars = 
    var en = templ.$('.enSubject').val(),
      enid = templ.$('.enSubject').data('id'),
      ens = Subject.findOne({uuid: uuid, lang: 'en'})
    var ro = templ.$('.roSubject').val(),
      roid = templ.$('.roSubject').data('id'),
      ros = Subject.findOne({uuid: uuid, lang: 'ro'})
    var wiki = templ.$('.wikiSubject').val(),
      wikid = templ.$('.wikiSubject').data('id'),
      wikis = Subject.findOne({uuid: uuid, lang: 'wiki'})

    console.log(en)
    console.log(ro)
    console.log(wiki)
    console.log(msy)
    console.log(mfr)

    if(msy && msy != '' && (!msys || msys.subject != msy))
      Meteor.call('updateSubject', {uuid: uuid, lang: 'msy', subject: msy}, msys._id, function(err, res) {
        if(err) console.log(err)
      })
    if(mfr && mfr != '' && (!mfrs || mfrs.subject != mfr))
      Meteor.call('updateSubject', {uuid: uuid, lang: 'mfr', subject: mfr}, mfrs._id, function(err, res) {
        if(err) console.log(err)
      })
    if(en && en != '' && (!ens || ens.subject != en))
      Meteor.call('updateSubject', {uuid: uuid, lang: 'en', subject: en}, enid, function(err, res) {
        if(err) console.log(err)
      })
    if(ro && ro != '' && (!ros || ros.subject != ro))
      Meteor.call('updateSubject', {uuid: uuid, lang: 'ro', subject: ro}, roid, function(err, res) {
        if(err) console.log(err)
      })
    if(wiki && wiki != '' && (!wikis || wikis.subject != wiki))
      Meteor.call('updateSubject', {uuid: uuid, lang: 'wiki', subject: wiki}, wikid, function(err, res) {
        if(err) console.log(err)
      })

    FlowRouter.go('/proposalsent?uuid='+uuid)
  },
  'click .resetConcept': function(e, templ) {
    location.reload()
  },
  'click .openFEditor': function(e, templ) {
    templ.formulaEditor.set(true)
  },
  'click .closeFEditor': function(e, templ) {
    templ.formulaEditor.set()
  }
})

Template.searchFormula2.onCreated(function() {
  this.result = new ReactiveVar([])
  this.letters = new ReactiveVar('')
  var url = serverUrl + '/api/subject/search?'

  var self = this
  this.autorun(function() {
    var text = self.letters.get()
    var lang = sysLang.get()
    if(lang && text && text.length > 2)
      $.getJSON(url + 'limit=' + maxFormCount*2 + '&lang=' + lang + '&text=' + text, function(data){
        self.result.set(data)
      })
    else
      self.result.set([])
  })
})

Template.searchFormula2.helpers({
  result: function() {
    return Template.instance().result.get()
  }
})

Template.searchFormula2.events({
  'keyup .searchFormula': function(e, templ) {
    var t = templ.$(e.currentTarget)
    templ.letters.set(t.val())
  }
})

Template.formulaEditorTempl.onRendered(function() {
  var templ = Template.currentData().templ

  var f = templ.$('.formulaSubjectSpan'),
      ed = $('#mathjaxEditorHidden')

    ed.on('change', function(e) {
      var msy = ed.data('msy')
      var mfr = ed.data('mfr')
      f.data('msy', msy)
      f.data('mfr', mfr)
      f.html("`" + msy + " = " + mfr + "`")
      MathJax.Hub.Typeset(f[0]);
    })
})

Template.proposalsent.helpers({
  uuid: function() {
    return FlowRouter.getQueryParam('uuid')
  }
})