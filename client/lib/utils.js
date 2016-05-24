Template.registerHelper('equals', function(a, b) {
  return a == b;
})

Template.registerHelper('or', function(a,b) {
  return a || b
})

Template.registerHelper('log', function(a) {
  return console.log(a)
})

Template.registerHelper('firstUpper', function(a) {
  if(a)
    return firstUpper(a)
})

Template.registerHelper('isRole', function(role) {
  return userRoles.get()[role]
})

Template.registerHelper('encodeURI', function(a) {
  return encodeURIComponent(a)
})

Template.registerHelper('sysLang', function(l) {
  if(sysLang.get())
    return sysLang.get() == l
  return false
})

firstUpper = function(a) {
  return a[0].toUpperCase() + a.substring(1)
}

// vars are in order
parseFormula = function(formula, values) {
  //console.log('parseFormula formula: ' + formula)
  //console.log(values)
  var recurs
  var vars = Object.keys(values)
  // phi_m should be replaced before phi, so we sort on length
  vars.sort(function(a,b) {
    return b.length - a.length
  })
  vars.forEach(function(v, ind) {
    var val = values[v]
    recurs = 0
    while(formula.indexOf(v) != -1 && recurs < 50) {
      formula = formula.replace(v, val)
      recurs ++
    }
    console.log(formula)
  })
  recurs = 0
  while(formula.indexOf('{') != -1 && recurs < 50) {
    formula = formula.replace('{', '(')
    recurs ++
  }
  recurs = 0
  while(formula.indexOf('}') != -1 && recurs < 50) {
    formula = formula.replace('}', ')')
    recurs ++
  }
  return math.eval(formula)
}

var recurs = 0
getPath = function(uuid){
  //console.log('getPath uuid: ' + uuid)
  var path = [], rel, id = uuid;
  while(id != physicsUuid && recurs < 100){
    recurs ++
    //console.log('id: ' + id)
    rel = Relation.findOne({uuid1:id, relation: 1})
    //console.log(rel)
    if(rel) {
      id = rel.uuid2
      path.push(id);
    }
    else
      break;
  }
  //console.log('final path: ' + JSON.stringify(path))
  recurs = 0
  return path;
}