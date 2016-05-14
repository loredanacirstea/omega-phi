import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


Template.upload.onRendered(function() {
	$('head').append('<script type="text/javascript" src="papaparse.min.js"></script>')

})

Template.upload.events({
  'click #upload': function() {
    var data = '/formulae1.csv';
    console.log('uncomment')
    /*var results = Papa.parse(data, {
        download: true,
        header: true,
        delimiter: ',',
        complete: function(results, file) {
          console.log("Parsing complete:", results, file);
          results.data.forEach(function(row) {
            Om.C.Formula.insert(row);
          })
        }
    });*/
  }
})

Template.viewer.onCreated(function() {
  this.autorun(function() {
    var options = {limit: 50}
    var skip = FlowRouter.getParam('page')
    if(skip)
      options.skip = parseInt(skip)
    Meteor.subscribe('formula', {}, options)
  })
})
Template.viewer.onRendered(function() {
  $('head').append('<script src="/ASCIIMathML.js"></script>');
  $('head').append('<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_SVG"></script>');
  $('head').append("<script type='text/x-mathjax-config'>MathJax.Hub.Config({asciimath2jax: {delimiters: [['`','`']]}});</script>");

})
Template.viewer.helpers({
  header: function() {
    var row = Om.C.Formula.findOne()
    if(row) {
      var keys = Object.keys(row)
      keys.splice(keys.indexOf('id'),1)
      keys.splice(keys.indexOf('Automated translation'), 1)
      keys.splice(keys.indexOf('Possible wiki link'),1)
      return keys
    }
  },
  formula: function() {
    return Om.C.Formula.find({})
  },
  attribute: function() {
    return Object.keys(this)
  },
  value: function(obj, a) {
    return obj[a]
  },
  mathjax: function() {
    return this.math_symbol + ' = ' + this.math_formula;
  },
  small: function(a) {
    return ['_id', 'en_symbol', 'part_of', 'math_symbol', 'unit'].indexOf(a) != -1
  }
})

Template.viewer.events({
  'change input': function(e, templ) {
    var t = $(e.currentTarget)
    var id = t.attr('id')
    var val = t.val()
    var h = this.valueOf()
    if(h != '_id') {
      var d = Blaze.getData($('#tr_' + id)[0])
      console.log(val)
      var row = Om.C.Formula.findOne(id)
      if(row[h] != val) {
        var obj = {}
        obj[h] = val
        Om.C.Formula.upsert({_id: id}, {$set: obj}, function(err, res) {
          if(err)
            console.log(err)
          else
            console.log(res);
        })
      }
    }
  }
})







