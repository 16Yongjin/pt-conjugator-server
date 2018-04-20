const fs = require('fs')
const { promisify } = require('util')
const _ = require('partial-js')

const type = {
	'infinitive/impersonal': '부정사 / 비개인적인',
	'infinitive/personal': '부정사 / 개인',
	gerund: '동명사',
	'pastparticiple/masculine': '과거분사 / 남성',
	'pastparticiple/feminine': '과거분사 / 여성',
	'indicative/present': '직설법 / 현재',
	'indicative/imperfect': '직설법 / 불완전한',
	'indicative/preterite': '직설법 / 중고형',
	'indicative/pluperfect': '직설법 / 완전',
	'indicative/future': '직설법 / 미래',
	conditional: '가정어구',
	'subjunctive/present': '가정법 / 현재',
	'subjunctive/imperfect': '가정법 / 불완전한',
	'subjunctive/preterite': '가정법 / 초자연',
	'imperative/affirmative': '명령형 / 긍정 형',
	'imperative/negative': '명령형 / 부정형'
}

const a = {
	0: 'infinitive/impersonal',
	1: 'infinitive/personal',
	2: 'gerund',
	3: 'pastparticiple/masculine',
	4: 'pastparticiple/feminine',
	5: 'indicative/present',
	6: 'indicative/imperfect',
	7: 'indicative/preterite',
	8: 'indicative/pluperfect',
	9: 'indicative/future',
	10: 'conditional',
	11: 'subjunctive/present',
	12: 'subjunctive/imperfect',
	13: 'subjunctive/preterite',
	14: 'imperative/affirmative',
	15: 'imperative/negative'
}

// group_sort = 타입 인덱스
// sort = 1단 2단 3단 1복 2복 3복
const readFile = promisify(fs.readFile)
const trim = s => s.trim()
const verbPath = verb => `content/${verb[0]}/${verb}.json`
const getConj = _.pipe(trim, verbPath, readFile, JSON.parse, v => v.conjugations, _.reject(c => c.sort == 1 || c.sort == 4), _.groupBy('group'))

const categoryPath = c => `categories/${c}.json`
const verbCategories = {}
const cachedCategory = c => verbCategories[c]

const memoize = k => v => (verbCategories[k] = v, v)
const searchVerb = async verb => {
	const category = verb[0]
	const verbs = cachedCategory(category) ? cachedCategory(category) :
		_.go(category, categoryPath, readFile, JSON.parse, memoize(category))

	return _.go(
		verbs,
		verbs => verb.length < 2 ? verbs : verbs.filter(v => v.startsWith(verb)), _.first(5)
	)
}

// getConj('passar').then(console.log)
// main()

// searchVerb('pasaria').then(console.log)

module.exports = { getConj, searchVerb }
