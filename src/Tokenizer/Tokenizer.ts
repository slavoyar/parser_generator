import { TokenDefinition, Token } from "../Grammar/"

/**
 * Class for handling lexical analysis 
 */
export class Tokenizer {
  private cursor = 0
  /**
   * Create an instance of this class.
   * 
   * @param tokensDefinitions Defenitions for tokens.
   */
  constructor(
    private tokensDefinitions: TokenDefinition[]
  ) { }

  /**
   * Going through all input file and find tokens.
   * 
   * @returns Table of tokens in same order as in file.
   */
  public generateTable(file: string): Token[] {
    const tokensTable: Token[] = []
    while (file.length) {
      let token: Token | undefined
      let ifSkip: boolean | undefined
      for (const definition of this.tokensDefinitions) {
        if (definition.regex == null) {
          throw new Error(`This is not valid definition for '${definition.name}' token`)
        }
        let tokenValue: string = ''
        const template = new RegExp(definition.regex)
        const result = file.match(template)
        if (result?.index == 0) {
          file = file.slice(result[0].length)
          this.cursor += result[0].length
          tokenValue = result[0]
        }
        if (tokenValue != '') {
          token = { name: definition.name, value: tokenValue }
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
}
