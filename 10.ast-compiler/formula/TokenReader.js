/**
tokens = [
  { type: 'NUMBER', value: '2' },
  { type: 'PLUS', value: '+' },
  { type: 'NUMBER', value: '3' },
  { type: 'MULTIPLY', value: '*' },
  { type: 'NUMBER', value: '4' }
]
 */
class TokenReader {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0; //索引
        this.emptyObj = { type: null, value: null };
    }
    read() {
        if (this.pos < this.tokens.length) {
            return this.tokens[this.pos++];
        }
        return this.emptyObj;
    }
    peek() {
        if (this.pos < this.tokens.length) {
            return this.tokens[this.pos]; //只读，但索引不往下走
        }
    }
    rollback() {
        if (this.pos > 0) {
            this.pos -= 1;
        }
    }
}

exports.TokenReader = module.exports = TokenReader;