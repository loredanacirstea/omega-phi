Template.langChooser.onRendered(function() {
  $('#langChooser').val(sysLang.get())
})

Template.langChooser.events({
  'change #langChooser': function(e, templ) {
    sysLang.set($('#langChooser').val())
  }
})

Template.titleBar.helpers({
  uuid: function() {
    return physicsUuid
  }
})

Template.formulaDetails.onCreated(function() {
  var self = this
  this.autorun(function() {
    var uuid = routeUuid.get()
    var lang = sysLang.get()
    if(!uuid || !lang)
      return
    self.conceptSub = ConceptSubs.subscribe('concept', {uuid: uuid})
    self.pathSub = PathSubs.subscribe('path', uuid, lang)
    self.kidsSub = KidsSubs.subscribe('kids', uuid, ['msy', 'mfr', lang], {limit: 50})
    self.varsSub = VarsSubs.subscribe('vars', uuid, ['msy', 'mfr', lang])
  })
})

Template.formulaDetails.helpers({
  formula: function() {
    var uuid = routeUuid.get()
    if(!uuid)
      return
    var subs = Subject.find({uuid: uuid}).fetch()
    var rels = Relation.find({uuid1: uuid}).fetch()
    var obj = {uuid: uuid}
    subs.forEach(function(s) {
      obj[s.lang] = s.subject
      obj['id_'+s.lang] = s._id
      if(s.lang == 'mfr')
        Template.instance().mfr = s.subject
    })
    rels = rels.map(function(r) {
      var lg = r.relation == 13 ? 'unit' : 'en'
      r.subject = Subject.findOne({uuid: r.uuid2, lang: lg})
      if(r.subject && r.subject.lang == 'unit')
        obj.unit = r.subject.subject
      return r
    })
    var rels = _.groupBy(rels,
      function(r) { return r.relation })
    obj.relations = rels
    return obj
  },
  mathjax: function() {
    var self = this
    if(this.msy)
      Meteor.setTimeout(function() {
        if(typeof MathJax != 'undefined')
          var inner = self.msy + (self.mfr ? (' = ' + self.mfr) : '')
          $('.formulaSubject').html("`" + inner + "`")
          MathJax.Hub.Typeset($('.formulaSubject')[0]);
      }, 1000)
    return this.msy ? (this.msy + (this.mfr ? (' = ' + this.mfr) : '')) : null;
  },
  description: function() {
    var d = this[sysLang.get()]
    if(d)
      return firstUpper(d)
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
      var mfr = Subject.findOne({uuid: r.uuid1, lang: 'mfr'})
      var msy = Subject.findOne({uuid: r.uuid1, lang: 'msy'})
      var kids = Relation.findOne({uuid2: r.uuid1, relation: 1})
      if((!msy && kids) || (msy && mfr)) {
        obj = Subject.findOne({uuid: r.uuid1, lang: lang}) || {}
        obj.vars = Relation.findOne({uuid1: r.uuid1, relation: 15})
        obj.msy = msy
        obj.mfr = mfr
        fs.push(obj)
      }
    })
    return fs
  },
  variables: function() {
    return Relation.findOne({uuid1: routeUuid.get(), relation: 15})
  },
  variable: function() {
    var uuid = routeUuid.get()
    if(!uuid) return
    var lang = sysLang.get()
    if(!lang) return
    if(!Template.instance().varsSub.ready())
      return
    Template.instance().vars = []
    var den = [], vars = []
    Relation.find({uuid1: uuid, relation: 15}).forEach(function(r) {
      var sub = Subject.findOne({uuid: r.uuid2, lang: lang})
      if(!sub || den.indexOf(sub.subject) != -1)
        return
      den.push(sub.subject)
      sub.msy = Subject.findOne({uuid: r.uuid2, lang: 'msy'})
      sub.mfr = Subject.findOne({uuid: r.uuid2, lang: 'mfr'})
      var unit = Relation.findOne({uuid1: r.uuid2, relation: 13})
      if(unit)
        sub.unit = Subject.findOne({uuid: unit.uuid2, lang: 'unit'})

      if(sub.msy)
        Template.instance().vars.push(sub.msy.subject)
      vars.push(sub)
    })
    if(vars.length)
      Meteor.setTimeout(function() {
        if(typeof MathJax != 'undefined')
          $('.variableSubjects').map(function() {
            MathJax.Hub.Typeset(this);
          })
          MathJax.Hub.Typeset($('.variableSubjectsSame')[0]);
      }, 1000)
    return vars
  }
})

Template.formulaDetails.events({
  'keyup .variableInput': function(e, templ) {
    var inputs = {}
    $('.variableInput').map(function(i) {
      var val = $(this).val()
      var msy = $(this).data('var')
      if(val && msy && val != '')
        inputs[msy] = val
    })
    if(Object.keys(inputs).length == templ.vars.length)
      templ.$('.formulaResult').val(parseFormula(templ.mfr, inputs))
  }
})

Template.searchFormula.onCreated(function() {
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

Template.searchFormula.helpers({
  result: function() {
    return Template.instance().result.get()
  }
})

Template.searchFormula.events({
  'keyup .searchFormula': function(e, templ) {
    var t = templ.$(e.currentTarget)
    templ.letters.set(t.val())
  }
})

Template.settings.helpers({
  en: function() {
    return sysLang.get() == 'en'
  }
})

Template.settings.events({
  'click #GoogleLogin': function(e,templ) {
    Meteor.loginWithGoogle({
      requestPermissions: [
        'email'
      ],
      requestOfflineToken: false,
      loginStyle:  "redirect"//,
      //redirectUrl: '/browse'
    }, function(err) {
      if(err) console.log(err)
    })
  },
  'click #logout': function(e, templ) {
    Meteor.logout()
  }
})

Template.info.helpers({
  en: function() {
    return sysLang.get() == 'en'
  },
  version: function() {
    return OPversion
  }
})