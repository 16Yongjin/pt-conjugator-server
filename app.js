const fs = require('mz/fs')
const _ = require('partial-js')

// group_sort = 타입 인덱스
// sort = 1단 2단 3단 1복 2복 3복
const trim = s => s.trim()
const verbPath = verb => `content/${verb[0]}/${verb}.json`
const getJson = _.pipe(fs.readFile, JSON.parse)
const remove2ndPerson = _.reject(c => ![0, 2, 3, 4].includes(c.group_sort) && c.sort == 1 || c.sort == 4)

const getConj = _.pipe(trim, verbPath, getJson, v => v.conjugations, remove2ndPerson, _.groupBy('group'))

const categoryPath = verb => `categories/${verb[0]}.json`
const verbCategories = {}
const cachedCategory = verb => verbCategories[verb[0]]
const memoize = k => v => (verbCategories[k] = v, v)
const startsWith = w => str => str.startsWith(w)
const getCategory = _.pipe(trim, _.first)
const getVerbIndex = category => cachedCategory(category) || _.go(category, categoryPath, getJson, memoize(category))
const takeFive = verb => _.pipe(L.filter(startsWith(verb)), L.take(5))

const searchVerb = verb => _.go(verb, getCategory, getVerbIndex, takeFive(verb))

const rootIndex = {}
_.go(getJson('roots/roots.json'), _(Object.assign, rootIndex, _))
const getRoots = verbs => rootIndex[verbs]

// getConj('passar').then(console.log).catch(console.warn)
// searchVerb('pas').then(console.log).catch(console.warn)
// getRoots('passaria').then(console.log).catch(console.warn)

module.exports = { getConj, searchVerb, getRoots }
