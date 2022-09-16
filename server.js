const express = require('express')
const app = express()
const db = require('./models')

// finish putting all plants in database; copy & paste data from postman to keep as seed data?
// adding a patch request to update any errors?
// where/how to host online?
// build a front end w/svelte
// progressive web app/make an app?
// remove force: true before moving to production
// remove/require authorization for any methods other than get?
// add images to display; how? store as assets in db, something else?

// need to fix amaryllis; add a patch request?
// how to do in the controller?

db.sequelize.sync()
  .then(() => console.log('synced database'))
  .catch((error) => console.log('failed to sync', error))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./app/routes/plant.routes')(app);
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))