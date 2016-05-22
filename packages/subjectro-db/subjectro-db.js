export const name = 'subjectro';

subjectro.coll = {}
subjectro.coll.subject = new Mongo.Collection('subject')
subjectro.coll.relation = new Mongo.Collection('relation')
subjectro.coll.ontology = new Mongo.Collection('ontology')

subjectro.ss = {}
subjectro.ss.subject = new SimpleSchema({
  uuid: {
    type: String,
    label: "UUID"
  },
  lang: {
    type: String,
    label: 'Language'
  },
  subject: {
    type: String,
    label: 'Subject'
  },
  ontology: {
    type: String,
    label: 'Ontology UUID',
    autoValue: function() {
      if(ontouuid)
        return ontouuid
    }
  },
  upd: {
    type: Date,
    label: 'Updated At',
    autoValue: function() {
      if(this.value)
        return this.value
      return new Date()
    }
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    autoValue: function() {
      if (this.isInsert)
        return new Date();
      if (this.isUpsert)
        return {$setOnInsert: new Date()};

      this.unset();  // Prevent user from supplying their own value
    }
  },
  author: {
    type: String,
    label: 'Author Email',
    optional: true,
    autoValue: function() {
      var u = Meteor.user()
      var em
      if(u && u.emails && u.emails[0])
        em = u.emails[0].address
      if(this.isInsert)
        return em
        
      if(this.isUpdate && this.value && u.roles && u.roles.admin)
        return this.value

      this.unset()
    }
  }
})

subjectro.ss.relation = new SimpleSchema({
  uuid1: {
    type: String,
    label: "UUID1",
    /*autoform: {
      options: [

      ]
    }*/
  },
  uuid2: {
    type: String,
    label: "UUID2"
  },
  relation: {
    type: Number,
    label: "Relation",
    //allowedValues: [1, 13, 15],
    /*autoform: {
      options: [
        {label: 'structural - 1', value: 1},
        {label: 'has unit - 13', value: 13},
        {label: 'has variable - 15', value: 15}
      ]
    }*/
  },
  ordering: {
    type: Number,
    label: "Ordering",
    optional: true
  },
  ontology: {
    type: String,
    label: 'Ontology UUID',
    autoValue: function() {
      if(ontouuid)
        return ontouuid
    }
  },
  upd: {
    type: Date,
    label: 'Updated At',
    autoValue: function() {
      if(this.value)
        return this.value
      return new Date()
    }
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    autoValue: function() {
      if (this.isInsert)
        return new Date();
      if (this.isUpsert)
        return {$setOnInsert: new Date()};

      this.unset();  // Prevent user from supplying their own value
    }
  },
  author: {
    type: String,
    label: 'Author Email',
    optional: true,
    autoValue: function() {
      var u = Meteor.user()
      var em
      if(u && u.emails && u.emails[0])
        em = u.emails[0].address
      if(this.isInsert)
        return em
        
      if(this.isUpdate && this.value && u.roles && u.roles.admin)
        return this.value

      this.unset()
    }
  }
})

subjectro.coll.subject.attachSchema(subjectro.ss.subject)
subjectro.coll.relation.attachSchema(subjectro.ss.relation)