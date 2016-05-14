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
      }
    ]
  }
})

// we should have a single collection for proposals
Meteor.publish('proposal', function(id) {
  return Subject2.find({_id: id})
})