Template.adminProposals.onCreated(function() {
  this.subscribe('conceptCol', {}, {sort: {upd: -1}, limit: 1})
  this.subscribe('proposals', sysLang.get(), {}, {limit: 100})
})

Template.adminProposals.helpers({
  lastTimestamp: function() {
    var c = Concept.findOne({}, {sort: {upd: -1}})
    if(c)
      return c.upd
  },
  proposal1: function() {
    var c = Concept.findOne({}, {sort: {upd: -1}})
    if(c)
      return Subject2.find({createdAt: {$gt: c.upd}}, {sort: {upd: -1}}).fetch()
  },
  proposal2: function() {
    var c = Concept.findOne({}, {sort: {upd: -1}})
    if(c)
      return Subject2.find({$or: [
        {createdAt: c.upd},
        {createdAt: {$lt: c.upd}}
        ]}, {sort: {upd: -1}}).fetch()
  },
  original: function() {
    var s = Subject.findOne({uuid: this.uuid, lang: this.lang})
    if(s)
      return s.subject
  },
  status: function() {
    if(this.accepted)
      return 'accepted'
    if(typeof this.accepted == 'boolean')
      return 'denied'
    return ''
  }
})



Template.adminProposal.onCreated(function() {
  Meteor.call('isAdmin', function(err, res) {
    if(err) console.log(err)
    if(!res)
      FlowRouter.go('/')
  })
  var self = this
  self.proposal = new ReactiveVar()

  this.autorun(function() {
    var uuid = routeUuid.get()
    var lang = sysLang.get()
    var id = FlowRouter.getQueryParam('id')
    if(!uuid || !lang)
      return
    self.conceptSub = ConceptSubs.subscribe('concept', {uuid: uuid})
    self.varsSub = VarsSubs.subscribe('vars', uuid, [lang])
    self.pathSub = PathSubs.subscribe('path', uuid, lang)
    self.kidsSub = KidsSubs.subscribe('kids', uuid, [lang], {limit: 50})
    self.subscribe('proposal', id)
  })

  this.autorun(function() {
    self.proposal.set(Subject2.findOne(FlowRouter.getQueryParam('id')))
  })
})


Template.adminProposal.helpers({
  fuuid: function() {
    return routeUuid.get()
  },
  proposal: function() {
    return Template.instance().proposal.get()
  },
  version: function() {
    var p = Template.instance().proposal.get()
    if(p)
      return ['o', 'p']
    return ['o']
  },
  partof: function() {
    return Relation.find({uuid1: routeUuid.get(), relation: 1}).map(function(r) {
      return Subject.findOne({uuid: r.uuid2, lang: sysLang.get()})
    })
  },
  formulaSubject: function() {
    var uuid = routeUuid.get(), 
      proposal = Template.instance().proposal.get(),
      msy, mfr, prop = ''
    if(this.valueOf() == 'p' && proposal) {
      if(proposal.lang == 'msy')
        msy = proposal
      if(proposal.lang == 'mfr')
        mfr = proposal
      if(msy || mfr) prop = 'prop'
    }
    if(!msy)
      msy = Subject.findOne({uuid: uuid, lang: 'msy'}) || {}
    if(!mfr)
      mfr = Subject.findOne({uuid: uuid, lang: 'mfr'}) || {}

    return {
      msy: msy,
      mfr: mfr,
      prop: prop
    }
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
    var s, prop = '', proposal = Template.instance().proposal.get()
    if(this.valueOf() == 'p' && proposal)
      if(proposal.lang == 'en') {
        s = proposal
        s.prop = 'prop'
      }
    if(!s)
      s = Subject.findOne({uuid: routeUuid.get(), lang: 'en'}) || {}
    return s
  },
  roSubject: function() {
    var s, prop = '', proposal = Template.instance().proposal.get()
    if(this.valueOf() == 'p' && proposal)
      if(proposal.lang == 'ro') {
        s = proposal
        s.prop = 'prop'
      }
    if(!s)
      s = Subject.findOne({uuid: routeUuid.get(), lang: 'ro'}) || {}
    return s
  },
  wikiSubject: function() {
    var s, prop = '', proposal = Template.instance().proposal.get()
    if(this.valueOf() == 'p' && proposal)
      if(proposal.lang == 'wiki') {
        s = proposal
        s.prop = 'prop'
      }
    if(!s)
      s = Subject.findOne({uuid: routeUuid.get(), lang: 'wiki'}) || {}
    return s
  },
  path: function() {
    var uuid = routeUuid.get()
    if(!uuid) return
    var lang = sysLang.get()
    if(!lang) return
    var rels = Relation.findOne({relation: 1, uuid2: {$ne: uuid}})
    if(Template.instance().pathSub.ready()) {
      var uuids = getPath(uuid)
      uuids.reverse()
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

Template.adminProposal.events({
  'click .saveProposal': function(e, templ) {
    Meteor.call('saveProposal', FlowRouter.getQueryParam('id'))
  },
  'click .declineProposal': function(e, templ) {
    Meteor.call('declineProposal', FlowRouter.getQueryParam('id'))
  }
})