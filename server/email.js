sendEmail = function (to, subject, text) {
  //check([to, from, subject, text], [String]);

  Email.send({
    to: to,
    from: adminEmail,
    subject: subject,
    text: text
  });
}