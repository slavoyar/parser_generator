import { ParserGenerator } from "./ParserGenerator"
import path from 'path'

const definitions = {
  'a': /[a-zA-Z]+/,
  '+': /\+/,
  '*': /\*/,
  '/': /\//,
  '-': /\-/,
  '(': /\(/,
  ')': /\)/,
  '=': /\=/,
  '_': /\s+|\t+|\n+/
}

const rules = {
  'S': ['a = F'],
  'F': ['F + T', 'T'],
  'T': ['T * E', 'T / E', 'E'],
  'E': ['- ( F )', '( F )', 'a']
}

const grammarObject = {
  tokens: definitions,
  rules: rules
}

const generator = new ParserGenerator()
const grammar = generator.validator.checkGrammar(grammarObject)
//const grammar = generator.validator.loadGrammarFromFile(path.resolve(__dirname, '../src/templates/grammar2.json'))
generator.generate(grammar)
