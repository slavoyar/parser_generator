import { Node, NodeValue } from "./Grammar"

export class TreeGenerator {
  private _parentNode: Node = new Node('', NodeValue.Node)
  /**
   * Construct instance of treeGenerator class.
   */
  constructor(
    private _ruleDefenitions: string[][]
  ) { }

  public createTree(rules: number[]): Node {
    this._parentNode = new Node('', NodeValue.Node)
    let currentRule = rules.pop()
    let currentNode: Node | undefined = this._parentNode
    while (currentRule !== undefined) {
      for (const element of this._ruleDefenitions[currentRule]) {
        let value: string | Node
        if (element === 'E') {
          value = new Node('', NodeValue.Node)
        } else {
          value = new Node(element, NodeValue.Value)
        }
        if (value === undefined) {
          throw new Error('Tree cannnot be constructed. Value Should be either string or node.')
        }
        currentNode.nodes.push(value)
      }
      currentNode = this.findMostRightNode()
      if (currentNode === undefined) break
      currentRule = rules.pop()
    }
    return this._parentNode
  }

  private findMostRightNode(): Node | undefined {
    let result: Node = this._parentNode
    let stack: Node[] = [this._parentNode]
    let visited: Node[] = []
    if (this._parentNode.nodes.length === 0) {
      return this._parentNode
    }
    while (true) {
      let currentNode = stack[stack.length - 1]
      if (currentNode.nodes.length === 0 && currentNode.type === NodeValue.Node) {
        return currentNode
      } else if (currentNode.nodes.length === 1) {
        if (currentNode.nodes[0].type === NodeValue.Value) {
          visited.push(currentNode)
          stack = stack.slice(0, -1)
        }
      } else {
        let flag = true
        currentNode.nodes.forEach(node => {
          if (!visited.includes(node) && node.type === NodeValue.Node) {
            flag = false
          }
        })
        if (flag === true) {
          visited.push(currentNode)
          stack = stack.slice(0, -1)
        }
      }
      for (const node of currentNode.nodes) {
        if (node.type === NodeValue.Node && !visited.includes(node)) {
          stack.push(node)
        }
      }
      if (stack.length === 1) {
        break
      }
    }
    return result
  }
}