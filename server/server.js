const express = require("express");
const compression = require("compression");

// https://docs.sentry.io/error-reporting/quickstart/?platform=node
const Sentry = require("@sentry/node");

try {
  Sentry.init({
    dsn: 'https://4f1a68242b6944738df12eecc34d377c@sentry.io/1246508',
    environment: process.env.NODE_ENV || 'dev',
    beforeSend(event) {
      const json = JSON.stringify(event);
      const scrubbedJSON = json.replace(/"persistentToken":"[^"]+"/g, `"persistentToken":"****"`);
      return JSON.parse(scrubbedJSON);
    },
  });
  Sentry.configureScope(scope => {
    scope.setTag("PROJECT_DOMAIN", process.env.PROJECT_DOMAIN);
  });
} catch (error) {
  console.error('Failed to initialize Sentry!', error);
}

const app = express();

// Accept JSON as req.body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

const redirects = require('./redirects');
redirects(app);

const proxy = require('./proxy');
const proxied = proxy(app);

const router = require('./routes');
app.use('/', router(['/edit', ...proxied]));

// Add an explicit no-cache to 404 responses
// Since this is the last handler it will only be hit when all other handlers miss
app.use(function(req, res, next) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  return next();
});

// Listen on App port
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}.`);
});
  throw new Error('help me i am but a test');
