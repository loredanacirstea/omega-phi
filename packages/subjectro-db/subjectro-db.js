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
    label: 'Ontology UUID'
  },
  upd: {
    type: Date,
    label: 'Updated At'
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
    label: "Ordering"
  },
  ontology: {
    type: String,
    label: 'Ontology UUID'
  },
  upd: {
    type: Date,
    label: 'Updated At'
  }
})

subjectro.coll.subject.attachSchema(subjectro.ss.subject)
subjectro.coll.relation.attachSchema(subjectro.ss.relation)