import { Grammar, Relation } from "../Grammar"
import * as fs from 'fs'
import path from 'path'

/**
 * Side defenition for defining set of symbols for rule.
 */
enum Side { Left, Right }


/**
 * Class for generating parsing for given rules.
 */
export class ParserGenerator {
  private _ruleDefenition: Map<string, string[]>
  private _tokens: string[]
  /**
   * Create instance of a Parser Generator class.
   */
  constructor(private readonly _grammar: Grammar) {
    if (_grammar == undefined) {
      throw new Error('Grammar is not defined')
    }

    if (_grammar.rules == undefined) {
      throw new Error('Grammar rules are not defined')
    }

    if (_grammar.tokens == undefined) {
      throw new Error('Tokens are not defined')
    }

    this._ruleDefenition = new Map(Object.entries(_grammar.rules))
    this._tokens = Object.keys(this._grammar.tokens).filter(item => item !== '_')
  }

  public generate() {
    const leftSymbols = this.getSideSymbols(Side.Left)
    const rightSymbols = this.getSideSymbols(Side.Right)
    this.completeSideSymbols(leftSymbols)
    this.completeSideSymbols(rightSymbols)

    const leftTerminals = this.getTerminalSymbols(Side.Left)
    const rightTerminals = this.getTerminalSymbols(Side.Right)
    this.completeTerminals(leftTerminals, leftSymbols)
    this.completeTerminals(rightTerminals, rightSymbols)
    let table: Relation[][] = []
    try {
      table = this.generateTable(leftTerminals, rightTerminals)
      let file = fs.readFileSync(path.resolve(__dirname, '../../templates/template.txt')).toString()

      const tableSerialized = this.precedenceTableSerialize(table)
      const tokenSerialized = this.tokenDefenitionsSerialize()
      const rulesSerialized = JSON.stringify(this._grammar.rules)

      file = file.replace('$[tokens]', tokenSerialized)
      file = file.replace('$[rules]', rulesSerialized)
      file = file.replace('$[precedenceTable]', tableSerialized)
      
      var dir = 'src/result/';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFile('src/result/Parser.ts', file, err => {
        if (err) return console.error(err)
      })
      fs.copyFile('src/Tokenizer/Tokenizer.ts', 'src/result/Tokenizer.ts', err => {
        if (err) return console.error(err)
      })
      fs.copyFile('src/Grammar/Grammar.ts', 'src/result/Grammar.ts', err => {
        if (err) return console.error(err)
      })
    } catch (error) {
      console.log(error)
    }
  }


  /**
   * Get most left or right symbols for each rule.
   * 
   * @param side What side to get.
   * @returns Most left or right symbols.
   */
  private getSideSymbols(side: Side): Map<string, Set<string>> {
    let result = new Map<string, Set<string>>()
    for (const ruleName of this._ruleDefenition.keys()) {
      let sideSymbols = new Set<string>()
      const rules = this._ruleDefenition.get(ruleName) as string[]
      for (const rule of rules) {
        if (side === Side.Left) {
          sideSymbols.add(rule.split(' ')[0])
        } else {
          const temp = rule.split(' ')
          sideSymbols.add(temp[temp.length - 1])
        }
      }
      result.set(ruleName, sideSymbols)
    }
    return result
  }

  /**
   * Find all left and right symbols for each rule.
   * 
   * @param sideSymbols Most left or right symbols.
   */
  private completeSideSymbols(sideSymbols: Map<string, Set<string>>): void {
    const ruleNames = Array.from(this._ruleDefenition.keys())
    for (const ruleName of ruleNames) {
      let ruleSymbols = sideSymbols.get(ruleName) as Set<string>
      for (const symbol of ruleSymbols) {
        if (ruleNames.includes(symbol)) {
          sideSymbols.get(symbol)?.forEach(element => {
            sideSymbols.get(ruleName)?.add(element)
          })
        }
      }
    }
  }

  /**
   * Get most left or right terminal symbols for each rule.
   * 
   * @param side What side to get.
   * @returns Most left or right terminal symbols.
   */
  private getTerminalSymbols(side: Side): Map<string, Set<string>> {
    let result = new Map<string, Set<string>>()
    const ruleNames = Array.from(this._ruleDefenition.keys())
    for (const ruleName of ruleNames) {
      let sideSymbols = new Set<string>()
      const rules = this._ruleDefenition.get(ruleName) as string[]
      for (const rule of rules) {
        if (side === Side.Left) {
          for (const symbol of rule.split(' ')) {
            if (!ruleNames.includes(symbol)) {
              sideSymbols.add(symbol)
              break
            }
          }
        } else {
          for (const symbol of rule.split(' ').reverse()) {
            if (!ruleNames.includes(symbol)) {
              sideSymbols.add(symbol)
              break
            }
          }
        }
      }
      result.set(ruleName, sideSymbols)
    }
    return result
  }

  /**
   * Find all left and right terminal symbols for each rule.
   * 
   * @param terminals Most left or right terminal symbols.
   * @param sideSymbols All left and right symbols for each rule.
   */
  private completeTerminals(
    terminals: Map<string, Set<string>>,
    sideSymbols: Map<string, Set<string>>
  ): void {
    const ruleNames = Array.from(this._ruleDefenition.keys())
    for (const terminal of terminals) {
      const ruleName = terminal[0]
      const symbols = sideSymbols.get(ruleName) as Set<string>
      for (const symbol of symbols) {
        if (ruleNames.includes(symbol) && symbol !== ruleName) {
          terminals.get(symbol)?.forEach(element => {
            terminal[1].add(element)
          })
        }
      }
    }
  }

  /**
   * Genarate grammar precedence table.
   * 
   * @param leftTerminals Every left terminal symbol for each rule.
   * @param rightTerminals Every right terminal symbol for each rule.
   * @returns Table that consists of relations of every terminal symbol.
   */
  private generateTable(
    leftTerminals: Map<string, Set<string>>,
    rightTerminals: Map<string, Set<string>>
  ): Relation[][] {
    let result: Relation[][] = new Array(this._tokens.length)
      .fill(Relation.Empty)
      .map(() => new Array(this._tokens.length).fill(Relation.Empty))
    for (let terminal of this._tokens) {
      let leftTuple: Set<string> = new Set<string>()
      let rightTuple: Set<string> = new Set<string>()
      let baseTuple: Set<string> = new Set<string>()
      for (let [_, rules] of this._ruleDefenition.entries()) {
        for (let rule of rules) {
          const tempArray = rule.split(' ')
          if (tempArray.includes(terminal)) {
            const currentIndex = tempArray.indexOf(terminal)
            if (currentIndex + 1 < tempArray.length) {
              if (!this._tokens.includes(tempArray[currentIndex + 1])) {
                leftTuple.add(tempArray[currentIndex + 1])
              } else {
                baseTuple.add(tempArray[currentIndex + 1])
              }
            }
            if (currentIndex > 0) {
              if (!this._tokens.includes(tempArray[currentIndex - 1])) {
                rightTuple.add(tempArray[currentIndex - 1])
              }
            }
            if (currentIndex + 2 < tempArray.length) {
              if (this._tokens.includes(tempArray[currentIndex + 2])) {
                baseTuple.add(tempArray[currentIndex + 2])
              }
            }
          }
        }
      }
      this.fillTableTuple(result, leftTuple, leftTerminals, terminal, Relation.Left)
      this.fillTableTuple(result, rightTuple, rightTerminals, terminal, Relation.Right)

      for (let element of baseTuple) {
        const row = this._tokens.indexOf(terminal)
        const col = this._tokens.indexOf(element)
        if (result[row][col] !== Relation.Empty) {
          throw new Error('Can not generate table for this grammar')
        }
        result[row][col] = Relation.Base
      }

    }
    return result
  }

  /**
   * Fill row or column of the table for specidied terminal symbol.
   * 
   * @param table Grammar precedence table.
   * @param tuple Set of nonterminal symbols next to specidied symbol.
   * @param terminals Table of all terminals for each rule.
   * @param terminal Specified terminal symbol.
   * @param relation Specified relation
   */
  private fillTableTuple(
    table: Relation[][],
    tuple: Set<string>,
    terminals: Map<string, Set<string>>,
    terminal: string,
    relation: Relation
  ): void {
    if (tuple.size > 0) {
      const row = this._tokens.indexOf(terminal)
      for (let element of tuple) {
        terminals.get(element)?.forEach(el => {
          const col = this._tokens.indexOf(el)
          switch (relation) {
            case Relation.Left:
              if (table[row][col] !== Relation.Empty) {
                throw new Error('Can not generate table for this grammar')
              }
              table[row][col] = Relation.Left
              break
            case Relation.Right:
              if (table[col][row] !== Relation.Empty) {
                throw new Error('Can not generate table for this grammar')
              }
              table[col][row] = Relation.Right
              break
            default:
              throw new Error(`${relation} is not valid relation. Should be ${Relation.Left} or ${Relation.Right}}`)
          }
        })
      }
    }
  }

  /**
   * Transform table from 2d array to 2d map.
   * 
   * @param table Array of relations.
   * @returns table in GrammarTable type.
   */
  private precedenceTableSerialize(table: Relation[][]): string {
    let result: string = '{'
    for (let i = 0; i < this._tokens.length; i++) {
      let row: string = '{'
      for (let j = 0; j < this._tokens.length; j++) {
        row += `"${this._tokens[j]}":${table[i][j]},`
      }
      row = row.slice(0, -1) + '}'
      result += `"${this._tokens[i]}":${row},`
    }
    result = result.slice(0, -1) + '}'
    return result
  }

  private tokenDefenitionsSerialize(): string {
    let result: string = '{'
    for (const [key, value] of Object.entries(this._grammar.tokens)) {
      let row = `${key}: ${value},`
      result += row
    }
    result = result.slice(0, -1) + '}'
    return result
  }
}
