

import { Parser } from "./Parser"
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


const grammar = {
  tokens: definitions,
  rules: rules
}

const file = '-p&p^p'
const parserGen = new ParserGenerator(grammar)
parserGen.generate()

const parser = new Parser()

