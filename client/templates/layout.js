Template.layout1.onCreated(function() {
  $('head').append('<link rel="stylesheet" type="text/css" href="/ratchet-v2.0.2/css/ratchet.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" href="/ratchet-v2.0.2/css/ratchet-theme-ios.min.css">')
  $('head').append('<script src="/ratchet-v2.0.2/js/ratchet.min.js"></script>');
  $('head').append('<script src="/ASCIIMathML.js"></script>');
  $('head').append('<script src="/MathJax/MathJax.js?config=TeX-MML-AM_SVG"></script>');
  $('head').append("<script type='text/x-mathjax-config'>MathJax.Hub.Config({asciimath2jax: {delimiters: [['`','`']]}});</script>");
})