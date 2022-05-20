

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

const rules = [
  {
    name : 'S',
    rules: ['MINUS B']
  },
  {
    name : 'B',
    rules: ['T', 'B AND T']
  },
  {
    name : 'T',
    rules: ['J', 'T XOR J']
  },
  {
    name : 'J',
    rules: ['p', 'LEFT_PR B RIGHT_PR']
  }
]

const grammar = {
  tokens: definitions,
  rules: rules
}

const parser = new ParserGenerator(grammar)

parser.test()
