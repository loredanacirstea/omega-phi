Meteor.publishComposite('proposals', function(lang, query, options) {
  query = query || {}
  options = options || {}
  options.sort = {upd: -1}

  return {
    find: function() {
      return Concept2.find(query, options)
    },
    children: [
      {
        find: function(c) {
          return Subject2.find({uuid: c.uuid})
        },
        children: [
          {
            find: function(s) {
              return Subject.find({uuid: s.uuid, lang: s.lang})
            }
          }
        ]
      },
      {
        find: function(c) {
          return Relation2.find({uuid1: c.uuid})
        },
        children: [
          {
            find: function(r) {
              return Subject.find({uuid: r.uuid1, lang: lang})
            }
          },
          {
            find: function(r) {
              return Subject.find({uuid: r.uuid2, lang: lang})
            }
          }
        ]
      }
    ]
  }
})

Meteor.publishComposite('proposal', function(id, lang) {
  return {
    find: function() {
      if(Subject2.findOne({_id: id}))
        return Subject2.find({_id: id})
      else
        return Relation2.find({_id: id})
    },
    children: [
      {
        find: function(r) {
          if(r.uuid2 && !r.remove)
            return Subject.find({uuid: r.uuid2, lang: lang})
          return
        }
      }
    ]
  }
})