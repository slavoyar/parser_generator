

import { Tokenizer } from "./Tokenizer"

const definitions = [
    {
        name: 'NUMBER',
        regex: /[0-9]+/
    },
    {
        name: 'TRUE',
        regex: 'true'
    },
    {
        name: 'FALSE',
        regex: 'false'
    },
    {
        name: 'DIVIDERS',
        regex: /\s+|\t+|\n+/,
        skip: true
    }
]

const file = 'false 41 true\n512 false'

const tokenizer = new Tokenizer(file, definitions)

try {
    console.log(tokenizer.generateTable())
} catch (error) {
    console.error(error)
}
finally{
    console.log(`input file:\n------------------------\n ${file}\n------------------------`)
}
