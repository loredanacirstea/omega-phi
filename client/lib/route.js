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

FlowRouter.route('/edit/:uuid?', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "editFormula", bottom:"menuBar"});
    }
});

FlowRouter.route('/proposalsent', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "proposalsent", bottom:"menuBar"});
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

FlowRouter.route('/admin/users', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "adminUsers", bottom:"menuBar"});
    }
});

FlowRouter.route('/admin/props', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "adminProposals", bottom:"menuBar"});
    }
});

FlowRouter.route('/admin/props/:uuid', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "adminProposal", bottom:"menuBar"});
    }
});