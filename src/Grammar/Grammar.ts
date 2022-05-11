import { Rule } from "./Rule";
import { TokenDefinition } from "./TokenDefenition";

/**
 * Defenition of grammar type. 
 * Consists of tokens defenitons and set of rules.
 * 
 */
export interface Grammar {
  tokens: TokenDefinition[]
  rules: Rule[]
}