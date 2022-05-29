export interface TokenDefenitions {
  [key: string]: string
}


/**
 * Defenition of grammar type. 
 * Consists of tokens defenitons and set of rules.
 * 
 */
export interface Grammar {
  tokens: TokenDefenitions
  rules: Object
}

/**
 * Possible relations in the grammar precedence table.
 */
export enum Relation {
  Left,
  Base,
  Right,
  Empty
}

/**
 * Type defennition for grammar table.
 */
export type GrammarTable = Map<string, Map<string, Relation>>
