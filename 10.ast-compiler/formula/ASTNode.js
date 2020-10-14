class ASTNode {
    constructor(type,value) {
        this.type = type ;//节点类型
        this.value = value; //节点的值
        this.children = []; //节点是否有孩子节点
    }
    appendChildren(childNode){
        this.children.push(childNode);
    }
}
exports.ASTNode = module.exports = ASTNode;