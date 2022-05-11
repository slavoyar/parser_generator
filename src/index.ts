

import { ParserGenerator } from "./Parser"

const definitions = [
  {
    name: 'id',
    regex: /[a-zA-Z]+/
  },
  {
    name: 'PLUS',
    regex: /\+/
  },
  {
    name: 'MULT',
    regex: /\*/
  },
  {
    name: '_',
    regex: /\s+|\t+|\n+/,
    skip: true
  }
]

const rules = [
  {
    name : 'E',
    rules: ['E PLUS T', 'T']
  },
  {
    name: 'T',
    rules: ['T MULT F', 'F']
  },
  {
    name: 'F',
    rules: ['id']
  }
]

const grammar = {
  tokens: definitions,
  rules: rules
}

const parser = new ParserGenerator(grammar)

const file = 'test*test'
parser.showTokenTable(file)
