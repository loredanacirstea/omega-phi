Package.describe({
  name: 'loredanacirstea:subjectro-db',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.1');
  api.use([
    'ecmascript',
    'loredanacirstea:subjectro-core',
    'aldeed:collection2'
  ]);
  api.mainModule('subjectro-db.js');
  api.export("subjectro");
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('loredanacirstea:subjectro-db');
  api.mainModule('subjectro-db-tests.js');
});
