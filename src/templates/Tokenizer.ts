
/**
 * Class for handling lexical analysis 
 */
export class Tokenizer {
  private cursor = 0
  private _tokens: Map<string, RegExp>
  /**
   * Create an instance of this class.
   * 
   * @param tokensDefinitions Defenitions for tokens.
   */
  constructor(tokensDefinitions: Object) {
    this._tokens = new Map<string, RegExp>(Object.entries(tokensDefinitions))
  }

  /**
   * Going through all input file and find tokens.
   * 
   * @returns Generator with pair of token name and value.
   */
  public *tokenGenerator(file: string): Generator<[string, string]> {
    this.cursor = 0
    while (file.length) {
      let tokenValue: string = ''
      for (const [name, regexp] of this._tokens) {
        const template = new RegExp(regexp)
        const result = file.match(template)
        if (result?.index == 0) {
          file = file.slice(result[0].length)
          this.cursor += result[0].length
          tokenValue = result[0]
        }
        if (tokenValue !== '') {
          if (name === '_') break
          yield [name, tokenValue]
          break
        }
      }
      if ( tokenValue === '') {
        throw new Error(`There is no token defenition in ${this.cursor} position. (${file[0]})`)
      }
    }

  }
}
