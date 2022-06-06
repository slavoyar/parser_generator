import { Tokenizer } from "../result/Tokenizer";
import { Node } from "../Grammar"

export class TreeGenerator {
  private _parentNode: Node = new Node('E', null, null)
  /**
   * Construct instance of treeGenerator class.
   */
  constructor(
    private _rules: number[],
    private _ruleDefenitions: string[][],
    private _file: string,
    private _tokenizer: Tokenizer
  ) {}
  
  public createTree(): Node {
    let currentRule = this._rules.pop()
    for(const el of this._rules.reverse()){
      console.log(this._ruleDefenitions[el])
    }

    return this._parentNode
  }

}