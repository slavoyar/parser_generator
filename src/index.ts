

import { GrammarValidator } from "./GrammarValidator"
import { Parser } from "./result/Parser"
import { ParserGenerator } from "./ParserGenerator"
import { Tokenizer } from "./Tokenizer"

const definitions = {
  'p': /[a-zA-Z]+/,
  'AND': /\&/,
  'XOR': /\^/,
  'MINUS': /\-/,
  'LEFT_PR': /\(/,
  'RIGHT_PR': /\)/,
  '_': /\s+|\t+|\n+/
}

const rules = {
  'S': ['MINUS B'],
  'B': ['T', 'B AND T'],
  'T': ['J', 'T XOR J'],
  'J': ['p', 'LEFT_PR B RIGHT_PR']
}


// const validator = new GrammarValidator()
// const grammar = validator.loadGrammarFromFile("D:/projects/parser/parser_generator/templates/grammar.json")
// const generator = new ParserGenerator()
// generator.generate(grammar)

//-p&p^(p), -p^p(p), -p^p&p
const file = '-p^p(p)'
const parser = new Parser()

try {
  const ruleSet = parser.checkChain(file)  
  console.log(ruleSet)
} catch (error) {
  console.log(error)
}


