const express = require('express')
const app = express()
const db = require('./models')
const browserInstance = require('./browser');

// adding a patch request to update any errors?
// remove force: true before moving to production
// remove/require authorization for any methods other than get?

db.sequelize.sync()
  .then(() => console.log('synced database'))
  .catch((error) => console.log('failed to sync', error))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
browserInstance.startBrowser()

require('./app/routes/plant.routes')(app);
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
