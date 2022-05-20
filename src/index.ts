

import { ParserGenerator } from "./ParserGenerator"

const definitions = [
  {
    name: 'p',
    regex: /[a-zA-Z]+/
  },
  {
    name: 'AND',
    regex: /\&/
  },
  {
    name: 'XOR',
    regex: /\^/
  },
  {
    name: 'MINUS',
    regex: /\-/
  },
  {
    name: 'LEFT_PR',
    regex: /\(/
  },
  {
    name: 'RIGHT_PR',
    regex: /\)/
  },
  {
    name: '_',
    regex: /\s+|\t+|\n+/,
    skip: true
  }
]

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

const parser = new ParserGenerator(grammar)

parser.test()
