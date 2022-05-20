import { Grammar } from "../Grammar";
import { Tokenizer } from "../Tokenizer";

enum Side{
  Left,
  Right
}

/**
 * Class for generating parsing for given rules.
 */
export class ParserGenerator {
  private _tokenizer: Tokenizer
  /**
   * Create instance of a Parser Generator class.
   */
  constructor(private readonly _grammar: Grammar) {
    this._tokenizer = new Tokenizer(_grammar.tokens)
  }

  /**
   * Temporary function for debuging purpuse.
   */
  public test(): void {
    const leftSymbols = this.getSideSymbols(Side.Left)
    const rightSymbols = this.getSideSymbols(Side.Right)

    this.completeSideSymbols(leftSymbols)
    this.completeSideSymbols(rightSymbols)

    console.log(leftSymbols)
    console.log(rightSymbols)
  }

  /**
   * Get most left or right symbols for each rule.
   * 
   * @param side What side to get.
   * @returns Most left or right symbols.
   */
  private getSideSymbols(side: Side): Map<string, Set<string>> {
    let result = new Map<string, Set<string>>()
    for (let rules of this._grammar.rules) {
      let sideSymbols = new Set<string>()
      for (let rule of rules.rules) {
        if (side === Side.Left) {
          sideSymbols.add(rule.split(' ')[0])
        } else {
          const temp = rule.split(' ')
          sideSymbols.add(temp[temp.length - 1])
        }
      }
      result.set(rules.name, sideSymbols)
    }
    return result
  }

  /**
   * Find all left and right symbols for each rule.
   * 
   * @param sideSymbols Most left or right symbols.
   */
  private completeSideSymbols(sideSymbols: Map<string, Set<string>>): void {
    for (let key of sideSymbols.keys()) {
      let ruleSymbols = sideSymbols.get(key)
      if (ruleSymbols === undefined) {
        throw new Error('There is no symbols for this rule')
      }
      for (let symbol of ruleSymbols) {
        if (Array.from(sideSymbols.keys()).includes(symbol)){
          let newSet = new Set([...sideSymbols.get(symbol) as Set<string>, ...sideSymbols.get(key) as Set<string>])
          newSet.forEach(element => {
            sideSymbols.get(key)?.add(element)
          })
        }
      }
    }
  }

}
