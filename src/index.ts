
import { TokenizerGenerator, TokenDefenition } from './TokenizerGenerator';

const defenitions = [
    {
        name: 'NUMBER',
        value: null,
        regex: '[0-9]+'

    },
    {
        name: 'LOGIC_VALUES',
        value: ['true', 'false'],
        regex: null
    }
]

const tGenerator = new TokenizerGenerator(defenitions as TokenDefenition[])

tGenerator.showTokenTypes()