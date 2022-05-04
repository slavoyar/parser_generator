
/**
 * Type description for token definition.
 */
export interface TokenDefinition {
    name: string
    regex: RegExp | string
    skip?: boolean
}

/**
 * Type description for token.
 */
export interface Token {
    token: string
    value: string
}
