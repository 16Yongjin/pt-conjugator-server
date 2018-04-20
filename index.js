const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { getConj, searchVerb } = require('./app')
const app = express()
const PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())

app.get('/ac/:query', async (req, res) => {
  const { query } = req.params
  if (!query) res.status(404).send('Error')
  try { res.send(await searchVerb(query)) }
  catch (e) { res.send([]) }
})

app.get('/conj/:query', async (req, res) => {
  const { query } = req.params
  if (!query) res.status(404).send('No query!')
  try { res.send(await getConj(query)) } 
  catch (e) { res.status(404).send(e.message) }
})

app.listen(PORT, () => console.log(`Listening on port`, PORT))
