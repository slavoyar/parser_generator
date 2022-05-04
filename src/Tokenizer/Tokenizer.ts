import { TokenDefinition, Token } from "./TokenTypes"

/**
 * Class for handling lexical analysis 
 */
export class Tokenizer {
  private cursor = 0
  /**
   * Create an instance of this class.
   * 
   * @param file File to parse.
   * @param tokensDefinitions Defenitions for tokens.
   */
  constructor(
    private file: string,
    private tokensDefinitions: TokenDefinition[]
  ) { }

  /**
   * Going through all input file and find tokens.
   * 
   * @returns Table of tokens in same order as in file.
   */
  public generateTable(): Token[] {
    const tokensTable: Token[] = []
    while (this.file.length) {
      let token: Token | undefined
      let ifSkip: boolean | undefined
      for (const definition of this.tokensDefinitions) {
        if (definition.regex == null) {
          throw new Error(`This is not valid definition for '${definition.name}' token`)
        }
        const tokenValue = this.checkRegex(definition.regex)
        if (tokenValue != '') {
          token = { token: definition.name, value: tokenValue }
          ifSkip = definition.skip
          break
        }
      }
      if (token === undefined) {
        throw new Error(`There is no definition for token at ${this.cursor}`)
      }
      if (!ifSkip) tokensTable.push(token)
    }
    return tokensTable
  }

  /**
   * Check file for given regular expression.
   * 
   * @param regexp Regular expression to match.
   * @returns Value of found token.
   */
  private checkRegex(regexp: string | RegExp): string {
    let tokenValue: string = ''
    const template = new RegExp(regexp)
    const result = this.file.match(template)
    if (result?.index == 0) {
      this.file = this.file.slice(result[0].length)
      this.cursor += result[0].length
      tokenValue = result[0]
    }
    return tokenValue
  }
}