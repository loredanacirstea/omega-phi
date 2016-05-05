FlowRouter.route('/upload', {
    action: function(params, queryParams) {
      BlazeLayout.render('upload');
    }
});

FlowRouter.route('/formulas/:page?', {
    action: function(params, queryParams) {
      BlazeLayout.render('viewer');
    }
});

FlowRouter.route('/admin', {
    action: function(params, queryParams) {
      BlazeLayout.render('admin');
    }
});

FlowRouter.route('/', {
  triggersEnter: [function(context, redirect) {
    redirect('/browse/'+physicsUuid);
  }]
})

FlowRouter.route('/browse/:uuid', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "formulaDetails", bottom:"menuBar"});
    }
});

FlowRouter.route('/search', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "searchFormula", bottom:"menuBar"});
    }
});

FlowRouter.route('/settings', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "settings", bottom:"menuBar"});
    }
});

FlowRouter.route('/info', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "info", bottom:"menuBar"});
    }
});