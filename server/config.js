import { smtp, CREDENTIALS } from './credentials.js';

process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;


ServiceConfiguration.configurations.upsert(
  { service: "google" },
  {
    $set: {
      clientId: CREDENTIALS.web.client_id,
      loginStyle: "popup",
      secret: CREDENTIALS.web.client_secret
    }
  }
);

