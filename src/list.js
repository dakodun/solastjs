class List {
  // list - data structure

  static Node = class Node {
    // a node (or entry) in the list that holds
    // data

    //> public properties //
    data = null;

    //> internal properties //
    _prev = null;
    _next = null;

    //> constructor //
    constructor(data) {
      this.data = data;
    }

    //> getters/setters //
    get prev() { return this._prev; }
    get next() { return this._next; }
  };

  //> internal properties //
  _front = null;
  _back  = null;

  //> constructor //
	constructor(nodeData = []) {
    if (!(nodeData instanceof Array)) {
      throw new TypeError("List: 'nodeData' should be an Array");
    }

    nodeData.forEach((e) => { this.push(e); });
  }

  //> getters/setters //
  get front() { return this._front; }
  get back()  { return this._back;  }

  //> public methods //
  push(data) {
    let node = new List.Node(data);

    if (this._front === null) {
      this._front = node;
      this._back = node;
    } else {
      this._back._next = node;
      node._prev = this._back;

      this._back = node;
    }
  }

  delete(node) {
    if (node === this._front) {
      this._front = node._next;
    }
    
    if (node === this._back) {
      this._back = node._prev;
    }

    if (node._next !== null) {
      node._next._prev = node._prev;
    }

    if (node._prev !== null) {
      node._prev._next = node._next;
    }
  }

  forEach(callbackFn = (n) => {}) {
    let node = this._front;
    while(node !== null) {
      callbackFn(node);
      node = node._next;
    }
  }

  //> symbols //
  [Symbol.iterator]() {
    let curr = null;
    let next = this._front;

    return {
      next: () => {
        if (next !== null) {
          curr = next;
          next = next._next;

          return { done: false, value: curr }; 
        } else {
          return { done: true, value: undefined };
        }
      },

      return: () => {
        next = null;
        return { done: true, value: undefined };
      },

      [Symbol.iterator]() {
        return this;
      }
    };
  }
};

export default List;
