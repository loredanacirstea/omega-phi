Package.describe({
  name: 'loredanacirstea:subjectro-search',
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
    'templating',
    'blaze',
    'reactive-var',
    'loredanacirstea:subjectro-db',
    'kadira:flow-router',
    'kadira:blaze-layout',
    'meteorhacks:picker'
  ]);
  api.mainModule('server/subjectro-search.js', 'server');
  //api.mainModule('subjectro-search-ui.js', 'client');
  api.addFiles([
    'subjectro-searchutils.js'
  ])
  api.addFiles([
    'route.js',
    'client/subjectro-search-ui.css',
    'client/subjectro-search-ui-simple.html',
    'client/subjectro-search-ui-simple.js',
    'client/subjectro-search-ui-modal.html',
    'client/subjectro-search-ui-modal.js',
    'client/subjectro-search-ui-modal2.html',
    'client/subjectro-search-ui-modal2.js'
  ], 'client')
  api.export("subjectro");
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('loredanacirstea:subjectro-search');
  api.mainModule('subjectro-search-tests.js');
});
