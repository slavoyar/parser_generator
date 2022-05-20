import { Grammar } from "../Grammar";
import { Tokenizer } from "../Tokenizer";

/**
 * Side defenition for defining set of symbols for rule.
 */
enum Side { Left, Right }

/**
 * Class for generating parsing for given rules.
 */
export class ParserGenerator {
  private _ruleDefenition: Map<string, string[]>
  /**
   * Create instance of a Parser Generator class.
   */
  constructor(private readonly _grammar: Grammar) {
    if(_grammar == undefined) {
      throw new Error('Grammar is not defined')
    }

    if(_grammar.rules == undefined) {
      throw new Error('Grammar rules are not defined')
    }

    if(_grammar.tokens == undefined) {
      throw new Error('Tokens are not defined')
    }

    this._ruleDefenition = new Map(Object.entries(_grammar.rules))
  }

  /**
   * Temporary function for debuging purpuse.
   */
  public test(): void {
    const leftSymbols = this.getSideSymbols(Side.Left)
    const rightSymbols = this.getSideSymbols(Side.Right)
    console.log(leftSymbols, rightSymbols)

    this.completeSideSymbols(leftSymbols)
    this.completeSideSymbols(rightSymbols)
    console.log(leftSymbols, rightSymbols)

    const leftTerminals = this.getTerminalSymbols(Side.Left)
    const rightTerminals = this.getTerminalSymbols(Side.Right)
    console.log(leftTerminals, rightTerminals)
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
      result.set(ruleName , sideSymbols)
    }
    return result
  }

  /**
   * Find all left and right symbols for each rule.
   * 
   * @param sideSymbols Most left or right symbols.
   */
  private completeSideSymbols(sideSymbols: Map<string, Set<string>>): void {
    for (const key of sideSymbols.keys()) {
      let ruleSymbols = sideSymbols.get(key)
      if (ruleSymbols === undefined) {
        throw new Error('There is no symbols for this rule')
      }
      for (const symbol of ruleSymbols) {
        if (Array.from(sideSymbols.keys()).includes(symbol)) {
          let newSet = new Set([...sideSymbols.get(symbol) as Set<string>, ...sideSymbols.get(key) as Set<string>])
          newSet.forEach(element => {
            sideSymbols.get(key)?.add(element)
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
          for(const symbol of rule.split(' ')) {
            if(!ruleNames.includes(symbol)) {
              sideSymbols.add(symbol)
              break
            }
          }
        } else {
          for(const symbol of rule.split(' ').reverse()) {
            if(!ruleNames.includes(symbol)) {
              sideSymbols.add(symbol)
              break
            }
          }
        }
      }
      result.set(ruleName , sideSymbols)
    }
    return result
  }

  

}
