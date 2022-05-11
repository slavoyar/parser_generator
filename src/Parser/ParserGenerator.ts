import { Grammar } from "../Grammar";
import { Tokenizer } from "../Tokenizer";

/**
 * Class for generating parsing for given rules.
 */
export class ParserGenerator {
  private _tokenizer: Tokenizer
  /**
   * Create instance of a Parser Generator class.
   */
  constructor(private readonly grammar: Grammar) {
    this._tokenizer = new Tokenizer(grammar.tokens)
  }

  /**
   * Temporary function for debuging purpuse.
   * 
   * @param file File to parse.
   */
  public showTokenTable (file: string) : void {
    console.log(`input file:\n------------------------\n ${file}\n------------------------`)
    try {
      console.log(this._tokenizer.generateTable(file))
    } catch (error) {
      console.error(error)
    }
  }
}