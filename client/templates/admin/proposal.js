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
    if(c) {
      var props = Subject2.find({createdAt: {$gt: c.upd}}).fetch().concat(
        Relation2.find({createdAt: {$gt: c.upd}}).map(function(r) {
          r.sub1 = Subject.findOne({uuid: r.uuid1, lang: sysLang.get()}) || {}
          r.sub2 = Subject.findOne({uuid: r.uuid2, lang: sysLang.get()}) || {}
          return r
        })
      )
      props.sort(function(a,b) {
        return new Date(a.upd).getTime() < new Date(b.upd).getTime()
      })
      return props
    }
  },
  proposal2: function() {
    var c = Concept.findOne({}, {sort: {upd: -1}})
    if(c) {
      var props = Subject2.find({$or: [
        {createdAt: c.upd},
        {createdAt: {$lt: c.upd}}
        ]}, {sort: {upd: -1}}).fetch().concat(
        Relation2.find({$or: [
        {createdAt: c.upd},
        {createdAt: {$lt: c.upd}}
        ]}, {sort: {upd: -1}}).map(function(r) {
          r.sub1 = Subject.findOne({uuid: r.uuid1, lang: sysLang.get()})
          r.sub2 = Subject.findOne({uuid: r.uuid2, lang: sysLang.get()})
          return r
        })
      )
      props.sort(function(a,b) {
        return new Date(a.upd).getTime() < new Date(b.upd).getTime()
      })
      return props
    }
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
  },
  relationtype: function(rel) {
    if(rel == 1)
      return 'is part of:'
    if(rel == 13)
      return 'has unit:'
    if(rel == 15)
      return 'has variable:'
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
    self.subscribe('proposal', id, lang)
    if(FlowRouter.getQueryParam('insert'))
      self.subscribe('concept2', id)
  })

  this.autorun(function() {
    self.proposal.set(
      Subject2.findOne(FlowRouter.getQueryParam('id')) || 
      Relation2.findOne(FlowRouter.getQueryParam('id'))
    )
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
    var proposal = Template.instance().proposal.get()
    if(this.valueOf() == 'p' && proposal && proposal.relation == 1) {
      var objs = Relation.find({uuid1: routeUuid.get(), relation: 1}).map(function(r) {
        var s = Subject.findOne({uuid: r.uuid2, lang: sysLang.get()})
        if(proposal.uuid2 == r.uuid2) {
          s.prop = 'prop'
          if(proposal.remove)
            s.remove = 'remove'
        }
        return s
      })
      if(!proposal.remove) {
        var s = Subject.findOne({uuid: proposal.uuid2, lang: sysLang.get()})
        if(s) {
          s.prop = 'prop'
          objs.push(s)
        }
      }
      return objs
    }
    return Relation.find({uuid1: routeUuid.get(), relation: 1}).map(function(r) {
      return Subject.findOne({uuid: r.uuid2, lang: sysLang.get()})
    })
  },
  formulaSubject: function() {
    var uuid = routeUuid.get(), 
      proposal = Template.instance().proposal.get(),
      msy, mfr, q,
      self = this

    Meteor.setTimeout(function() {
      q = $('.formulaProposal_'+self.valueOf())
      if(self.valueOf() == 'p' && proposal) {
        if(proposal.lang == 'msy' || proposal.lang == 'unit')
          msy = proposal
        if(proposal.lang == 'mfr')
          mfr = proposal
        if(msy || mfr)
          q.addClass('prop')
      }
      if(!msy)
        msy = Subject.findOne({uuid: uuid, lang: 'msy'}) || 
          Subject.findOne({uuid: uuid, lang: 'unit'}) || {}
      if(!mfr)
        mfr = Subject.findOne({uuid: uuid, lang: 'mfr'}) || {}

      if(msy.subject || mfr.subject) {
        var inner = "`" + (msy.subject || '') + '=' + (mfr.subject || '') + "`"
        q.html(inner)
        MathJax.Hub.Typeset(q[0])
      }
    }, 1000)
  },
  unit: function() {
    var r, 
      proposal = Template.instance().proposal.get(),
      q = $('.unitProposal_'+this.valueOf())

    if(this.valueOf() == 'p' && proposal)
      if(proposal.relation == 13) {
        r = proposal
        q.addClass('prop')
      }
    if(!r)
      r = Relation.findOne({uuid1: routeUuid.get(), relation: 13})
    if(r)
      var s = Subject.findOne({uuid: r.uuid2, lang: 'unit'})
    if(s) {
      var inner = "`" + s.subject + "`"
      q.html(inner)
      MathJax.Hub.Typeset(q[0])
    }
  },
  variables: function() {
    var proposal = Template.instance().proposal.get()
    if(this.valueOf() == 'p' && proposal && proposal.relation == 15) {
      var objs = Relation.find({uuid1: routeUuid.get(), relation: 15}).map(function(r) {
        var s = Subject.findOne({uuid: r.uuid2, lang: sysLang.get()})
        if(proposal.uuid2 == r.uuid2) {
          s.prop = 'prop'
          if(proposal.remove)
            s.remove = 'remove'
        }
        return s
      })
      if(!proposal.remove) {
        var s = Subject.findOne({uuid: proposal.uuid2, lang: sysLang.get()})
        if(s) {
          s.prop = 'prop'
          objs.push(s)
        }
      }
      return objs
    }
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