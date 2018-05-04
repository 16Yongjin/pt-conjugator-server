const _ = require('partial-js')
const fs = require('mz/fs')

const saveJson = category => _.pipe(JSON.stringify, _(fs.writeFile, `./${category}.json`, _))

_.filterObject = pred => obj =>
  Object.entries(obj).reduce((acc, [key, val], idx) => 
    pred(val, key, idx) ? (acc[key] = val, acc) : acc, {})

_.go(
  fs.readFile('./verbs.json'),
  JSON.parse,
  _.mapObject(v => _.uniq(v.reduce((acc, val) => val ? (acc.push(val.root), acc) : acc, []))),
  _.filterObject(v => v.length),
  saveJson('roots')
)
