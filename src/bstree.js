class BSTree {
  // a binary search tree implementation
  // [!] get
  // [!] delete
  // [!] balancing

  //> nested class //
  static Node = class Node {
    // a node in a tree that holds supplied data
    // as well as information about its parent node
    // and left and right branch nodes
    // [!] changing data requires changing tree
      // - (consider it a deletion then insertion)

    //> internal properties //
    _data = null;

    _parent = null;
    _left = null;
    _right = null;

    //> constructor //
    constructor(data = null, parent = null) {
      this._data = data;
      this._parent = parent;
    }

    //> getters/setters //
    get data() { return this._data; }
    get parent() { return this._parent; }
  };

  //> internal properties //
  _root = null;
  
  //> constructor //
	constructor() {
    
  }

  //> public methods //
  add(data, comparatorFn = (a, b) => {
  return(a < b) ? -1 : (a > b) ? 1 : 0; }) {
    // adds 'data' to the tree using the 'comparatorFn'
    // to decide whether to the left or right
    
    // 'comparatorFn' should return < 1 for the left,
    // > 1 for the right, and if duplicates are not
    // allowed then 0 for equality (failure)

    // method returns an object containing a success
    // value and either the new node if insertion
    // was successful, or the existing node if not

    if (this._root === null) {
      this._root = new BSTree.Node(data);
      return { success: true, node: this._root };
    } else {
      let curr = this._root;
      
      while (curr !== null) {
        let comp = comparatorFn(data, curr._data);
        
        if (comp < 0) {
          if (curr._left !== null) {
            curr = curr._left;
          } else {
            curr._left = new BSTree.Node(data, curr);
            return { success: true, node: curr._left };
          }
        } else if (comp > 0) {
          if (curr._right !== null) {
            curr = curr._right;
          } else {
            curr._right = new BSTree.Node(data, curr);
            return { success: true, node: curr._right };
          }
        } else {
          return { success: false, node: curr };
        }
      }
    }
  }

  forEach(callbackFn = (n) => {}) {
    // in-order traversal via recursion

    if (this._root !== null) {
      this._traverse(this._root, callbackFn);
    }
  }

  asArray() {
    // return this tree as a sorted array

    let arr = new Array();

    this.forEach((n) => {
      arr.push(n.data);
    });

    return arr;
  }

  //> internal methods //
  _traverse(node, callbackFn) {
    // recursively traverse the tree starting down
    // the left nodes and then moving back up with
    // the current node and finally the right node

    if (node._left !== null) {
      this._traverse(node._left, callbackFn);
    }
    
    callbackFn(node);
    
    if (node._right !== null) {
      this._traverse(node._right, callbackFn);
    }
  }

  //> symbols//
  [Symbol.iterator]() {
    // start with the root and if the tree is non-empty
    // then move down the left until we find the lowest
    // value node and store as the current ('curr')

    let curr = this._root;

    if (curr !== null) {
      while (curr._left !== null) {
        curr = curr._left;
      }
    }

    return {
      next() {
        // store the current value to be returned later
        // as we're going to attempt to update 'curr' to
        // the next node

        let result = curr;

        if (curr !== null) {
          if (curr._right !== null) {
            // if 'curr' has a node to the right then it's
            // always going to be larger so update 'curr' to
            // that, then move down its left side (if any)
            // to find smallest node in that branch

            curr = curr._right;
            while (curr._left !== null) {
              curr = curr._left;
            }
          } else if (curr._parent !== null) {
            if (curr._parent._left === curr) {
              // if 'curr' has a parent then move to
              // that if 'curr' is a left child of it

              curr = curr._parent;
            } else {
              // otherwise 'curr' must be a right child so
              // continue moving up until 'curr' is a left
              // child or we reach the root

              while (curr._parent !== null &&
              curr._parent._right === curr) {
                curr = curr._parent;
              }

              // if we have traversed the entire tree then 'curr'
              // will be null as we'll be back at the root via
              // the right child, otherwise return the parent

              curr = (curr !== null) ? curr._parent : null;
            }
          } else {
            // 'curr' has no parent and no values to the right
            // which means it's the root and the last value
            // (this means either a tree with one node or the
            // root is the largest value)

            curr = null;
          }
        }

        return (result === null) ?
          { done: true, value: undefined } :
          { done: false, value: result };
      },

      return() {
        curr = null;
        return {done: true, value: undefined};
      },

      [Symbol.iterator]() {
        return this;
      }
    };
  }
};

export default BSTree;
