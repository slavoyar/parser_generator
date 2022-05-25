import { GrammarTable, Relation } from "../Grammar";
import { Tokenizer } from "../Tokenizer";

/**
 * Class for parsing input file.
 */
export class Parser {
  private _tokenizer: Tokenizer
  private _namelessRules: string[][]
  private _precedenceTable: GrammarTable
  private _grammarTokens: Object = {
    'p': /[a-zA-Z]+/,
    'AND': /\&/,
    'XOR': /\^/,
    'MINUS': /\-/,
    'LEFT_PR': /\(/,
    'RIGHT_PR': /\)/,
    '_': /\s+|\t+|\n+/
  }
  private _grammarRules = {
    'S': ['MINUS B'],
    'B': ['T', 'B AND T'],
    'T': ['J', 'T XOR J'],
    'J': ['p', 'LEFT_PR B RIGHT_PR']
  }

  private _table: Object = {
    p: { p: 3, AND: 2, XOR: 2, MINUS: 3, LEFT_PR: 3, RIGHT_PR: 2 },
    AND: { p: 0, AND: 2, XOR: 0, MINUS: 3, LEFT_PR: 0, RIGHT_PR: 2 },
    XOR: { p: 0, AND: 2, XOR: 2, MINUS: 3, LEFT_PR: 0, RIGHT_PR: 2 },
    MINUS: { p: 0, AND: 0, XOR: 0, MINUS: 3, LEFT_PR: 0, RIGHT_PR: 3 },
    LEFT_PR: { p: 0, AND: 0, XOR: 0, MINUS: 3, LEFT_PR: 0, RIGHT_PR: 1 },
    RIGHT_PR: { p: 3, AND: 2, XOR: 2, MINUS: 3, LEFT_PR: 3, RIGHT_PR: 2 }
  }

  /**
   * Construct instance of parser class.
   * 
   * @param file File that will be analysed.
   */
  constructor(private file: string) {
    this._tokenizer = new Tokenizer(this._grammarTokens)
    this._precedenceTable = this.objToTable()
    this._namelessRules = this.generateNamelessRules()
    console.log(this._namelessRules)
  }

  /**
   * Create object of GrammarType from js object.
   * 
   * @returns Grammar precedence table.
   */
  private objToTable(): GrammarTable {
    let result: GrammarTable = new Map<string, Map<string, Relation>>()
    const rows = new Map<string, Object>(Object.entries(this._table))
    for (const [name, val] of rows) {
      result.set(name, new Map(Object.entries(val)))
    }
    return result
  }

  /**
   * Generates nameless rules array from input grammar rules.
   * 
   * @returns Rules without names specified for them.
   */
  private generateNamelessRules(): string[][] {
    let result: string[][] = []
    const rules = new Map<string, string[]>(Object.entries(this._grammarRules))
    const ruleNames = Array.from(rules.keys())
    for (const [_, value] of rules) {
      value.forEach(el => {
        let tempArr = el.split(' ')
        let rule: string[] = []
        tempArr.forEach(symbol => {
          symbol = ruleNames.includes(symbol) ? 'E' : symbol
          rule.push(symbol)
        })
        result.push(rule)
      })
    }
    return result
  }

}