templateInst = new ReactiveVar()

subjectro.ui.search = function(type) {
  if(type && type == 'modal')
    return {template: 'subjectroSearchModal2', instance: templateInst}

  return {template: 'subjectroSearch', instance: templateInst}
}

S = subjectro.coll.subject
R = subjectro.coll.relation

subjectro.utils.search = function(text, query, options) {
  if(!query)
    query = {}
  if(!options)
    options = {}

  // We first look at exact matches
  query.subject = text
  var subs1 = S.find(query, options).fetch()
  var ids = subs1.map(function(s) { return s._id })
  var len = ids.length

  // Recalculate limit
  options = getLimit(options, len)
  if(!options)
    return subs1

  // Recalculate skip
  options = getSkip(options, S.find(query).count())
  // Then subjects that start with that text
  query.subject = {$regex: '^'+text+'$', $options: '<i>'}
  query._id = {$nin: ids}
  var subs2 = S.find(query, options).fetch()
  subs2.forEach(function(s) {
    if(ids.indexOf(s._id) == -1) {
      subs1.push(s)
      ids.push(s._id)
    }
  })
  len = ids.length

  // Recalculate limit
  options = getLimit(options, len)
  if(!options)
    return subs1

  // Recalculate skip
  options = getSkip(options, len + S.find(query).count())
  query.subject = {$regex: text, $options: '<i>'}
  query._id = {$nin: ids}
  subs2 = S.find(query, options).fetch()
  subs2.forEach(function(s) {
    if(ids.indexOf(s._id) == -1) {
      subs1.push(s)
      ids.push(s._id)
    }
  })
  return subs1
}


getLimit = function(options, len) {
  if(options.limit) {
    if(options.limit > len) {
      options.limit -= len
      return options
    }
  }
  else return options

  return null
}

getSkip = function(options, len) {
  if(options.skip) { 
    options.skip -= len
    if(options.skip < 0)
      options.skip = 0
  }
  return options
}