const _ = require('partial-js')
const fs = require('mz/fs')
const alphabets = 'qwertuiopasdfghjklzxcvbnm'
const listVerbs = __(c => `./content/${c}`, fs.readdir)
const readVerbs = _.map(__(v => v !== '.DS_Store' ? `./content/${v[0]}/${v}` : './empty.json', fs.readFile, JSON.parse, c => c.conjugations && c.conjugations.map(cj => (cj.root = c.word, cj))))
const saveJson = category => _.pipe(JSON.stringify, _(fs.writeFile, `./${category}.json`, _))

_.go(
  alphabets,
  _.map(__(listVerbs, readVerbs, _.flatten)),
  _.flatten,
  _.groupBy('value'),
  saveJson('verbs')
)
