Om = {}
Om.C = {}
Om.C.Formula = new Mongo.Collection('formula')
Concept = new Mongo.Collection('concepts')

ConceptsS = new SimpleSchema({
  uuid: {
    type: String,
    label: "UUID"
  },
  upd: {
    type: Date,
    label: 'Updated At'
  },
  type: {
    type: Number, // 1 = category, 2 = leaf, 3=unit
    label: 'Type',
    optional: true
  },
  solver: {
    type: Boolean,
    label: 'Solver',
    optional: true
  }
})

Concept.attachSchema(ConceptsS)