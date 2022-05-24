import { GrammarTable, Relation } from "../Grammar";
import { Tokenizer } from "../Tokenizer";

export class Parser {
  private _tokenizer: Tokenizer
  private _grammarTable: GrammarTable
  private _tokenDefenition: Object = {
    'p': /[a-zA-Z]+/,
    'AND': /\&/,
    'XOR': /\^/,
    'MINUS': /\-/,
    'LEFT_PR': /\(/,
    'RIGHT_PR': /\)/,
    '_': /\s+|\t+|\n+/
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
   * @param file File that will be analised
   */
  constructor(private file: string) {
    this._tokenizer = new Tokenizer(this._tokenDefenition)
    this._grammarTable = this.objToTable()
    console.log(this._grammarTable)
  }

  private objToTable(): GrammarTable {
    let result: GrammarTable = new Map<string, Map<string, Relation>>()
    const rows = new Map<string, Object>(Object.entries(this._table))
    for (const [name, val] of rows) {
      result.set(name, new Map(Object.entries(val)))
    }
    return result
  }
  
}