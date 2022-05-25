import { GrammarTable, Relation } from "../Grammar";
import { Tokenizer } from "../Tokenizer";


/**
 * Class for parsing input file.
 */
export class Parser {
  private _tokenizer: Tokenizer
  private _stack: string[] = []
  private _tokenNames: string[]
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
  constructor() {
    this._tokenizer = new Tokenizer(this._grammarTokens)
    this._precedenceTable = this.objToTable()
    this._namelessRules = this.generateNamelessRules()
    this._tokenNames = Array.from(Object.keys(this._grammarTokens))
    console.log(this._namelessRules)
  }

  public checkChain(file: string): number[] {
    let result: number[] = []
    const token = this._tokenizer.tokenGenerator(file)
    let currentTerminal = token.next()
    let nextTerminal = token.next()
    if (currentTerminal === undefined || nextTerminal === undefined) {
      throw new Error('There is no terminal symbols.')
    }
    return result
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

  /**
   * Pack values that are in the stack.
   * 
   * @returns Rule number from array of nameless rules.
   */
  private pack(): number | undefined {
    let result: number | undefined
    const stackSize = this._stack.length
    for (const rule of this._namelessRules) {
      if (stackSize < rule.length) continue
      let flag = true
      for (let i = 0; i < rule.length; i++) {
        if (this._stack[stackSize - 1 - i] !== rule[rule.length - 1 - i]) {
          flag = false
          break
        }
      }
      if (flag) {
        result = this._namelessRules.indexOf(rule)
        this._stack = this._stack.slice(0, stackSize - rule.length)
        this._stack.push('E')
        break
      }
    }
    return result
  }

  private getCurrentTerminal(): string | undefined {
    let result: string | undefined
    for (let i = this._stack.length - 1; i >= 0; i--) {
      if (this._tokenNames.includes(this._stack[i])) {
        result = this._stack[i]
        break
      }
    }
    return result
  }
}