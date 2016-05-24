Om = {}
Om.C = {}
Om.C.Formula = new Mongo.Collection('formula')
Concept = new Mongo.Collection('concepts')

Subject2 = new Mongo.Collection('subjectEditable')
Relation2 = new Mongo.Collection('relationEditable')

var ss2 = {}, rs2 = {}
Object.assign(ss2, subjectro.ss.subject._schema)
Object.assign(rs2, subjectro.ss.relation._schema)
ss2.accepted = rs2.accepted = {
  type: Boolean,
  optional: true
}
rs2.remove = {
  type: Boolean,
  optional: true
}

Subject2.attachSchema(ss2)
Relation2.attachSchema(rs2)
Concept2 = new Mongo.Collection('conceptsEditable')



ConceptsS = new SimpleSchema({
  uuid: {
    type: String,
    label: "UUID"
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
  type: {
    type: Number, // 1 = category, 2 = leaf, 3=unit
    label: 'Type',
    optional: true,
    autoValue: function() {
      if(this.value)
        return this.value
      if(this.isInsert)
        return 2
      return
    }
  },
  solver: {
    type: Boolean,
    label: 'Solver',
    optional: true
  }
})

Concept.attachSchema(ConceptsS)
Concept2.attachSchema(ConceptsS)

UserS = new SimpleSchema({
    emails: {
      type: [Object],
      optional: true
    },
    "emails.$.address": {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
      type: Boolean
    },
    createdAt: {
      type: Date
    },
    profile: {
      type: Object,
      optional: true
    },
    'profile.firstName': {
        type: String,
        optional: true
    },
    'profile.lastName': {
        type: String,
        optional: true
    },
    'profile.avatar': {
      type: String,
        optional: true
    },
    'profile.rating': {
      type: Number,
      autoValue: function() {
        if(this.isInsert)
          return 0;
        if(this.value || this.value == 0)
          return;
      }
    },
    services: {
      type: Object,
      optional: true,
      blackbox: true
    },
    roles: { // {admin:bool, editor:bool, blacklisted: no}
      type: Object,
      optional: true,
      blackbox: true
    }
});
Meteor.users.attachSchema(UserS);