import * as fs from 'fs'
import { Grammar } from './Grammar/'

/**
 * Class for validation input data. Check JSON file for expected format.
 * 
 */
export class GrammarValidator {

  /**
   * Loads grammar from specified file.
   * 
   * @param path Path to the file.
   * @returns Grammar object.
   */
  public loadGrammarFromFile(path: string): Grammar {
    const file = fs.readFileSync(path).toString()
    if (!file) {
      throw new Error('File is not defined or empty.')
    }
    const obj = JSON.parse(file)
    if (obj === undefined) {
      throw new Error('No object in file.')
    }
    if (!this.isValidGrammar(obj as Grammar)) {
      throw new Error('Grammar is not valid.')
    }

    return obj as Grammar
  }

  /**
   * Loads and checks grammar object.
   * 
   * @param grammar Grammar as object.
   * @returns Sae grammar if its valid.
   */
  public checkGrammar(grammar: Object): Grammar {
    if (grammar === undefined) {
      throw new Error('Grammar is not defined.')
    }
    if (!this.isValidGrammar(grammar as Grammar)) {
      throw new Error('Grammar is not valid.')
    }
    return grammar as Grammar
  }

  /**
   * Checks grammar for validity.
   * 
   * @param grammar Grammar to check.
   * @returns Boolean if its valid or not.
   */
  private isValidGrammar(grammar: Grammar): boolean {
    if (grammar.rules === undefined || grammar.tokens === undefined) {
      return false
    }
    const tokenNames = Object.keys(grammar.tokens).filter(item => item !== '_')
    const ruleNames = Object.keys(grammar.rules)
    const rules = new Map(Object.entries(grammar.rules))
    for (const rule of ruleNames) {
      for (const element of rules.get(rule)) {
        const temp = element.split(' ')
        const result = temp.forEach((el: string): boolean => {
          if (!ruleNames.includes(el) && !tokenNames.includes(el)) {
            return false
          }
          return true
        })
        if (result === false) return false
      }
    }
    return true
  }
}