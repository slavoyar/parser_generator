import { Node } from "./Grammar"

export class TreeGenerator {
  private _parentNode: Node = new Node('E')
  /**
   * Construct instance of treeGenerator class.
   */
  constructor(
    private _rules: number[],
    private _ruleDefenitions: string[][]
  ) {}
  
  public createTree(): Node {
    let currentRule = this._rules.pop()
    for(const el of this._rules.reverse()){
      console.log(this._ruleDefenitions[el])
    }
    while(currentRule !== undefined) {
      for(const element of this._ruleDefenitions[currentRule]){
        console.log(element)
      }
      currentRule = this._rules.pop()
    }

    return this._parentNode
  }

}