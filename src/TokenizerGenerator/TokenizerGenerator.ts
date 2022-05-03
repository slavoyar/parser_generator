import { TokenDefenition } from "./TokenDefenition"

/**
 * Generate Tokenizer from defenitions in json
 */

export class TokenizerGenerator {
    /**
     * Create instance of TokenizerGenerator
     * 
     * @param defenitions 
     */
    constructor(private defenitions: TokenDefenition[]) { }

    public showTokenTypes() {
        for (const defenition of this.defenitions) {
            console.log(defenition)
        }
    }
}