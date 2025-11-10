class List {
  static Node = class Node {
    // private fields
      #prev = null;
      #next = null;
    // ...

    constructor(data) {
      this.data = data;
    }

    // getters/setters
    get prev() { return this.#prev; }
    get next() { return this.#next; }

    set prev(prev) {
      if (!(prev instanceof List.Node) && prev !== null) {
        throw new TypeError("List.Node (prev): should be a " +
          "List.Node or null");
      } else if (prev === this) {
        throw new ReferenceError("List.Node (prev): assigning this " +
          "to prev creates a cyclic reference");
      }

      this.#prev = prev;
    }

    set next(next) {
      if (!(next instanceof List.Node) && next !== null) {
        throw new TypeError("List.Node (next): should be a " +
          "List.Node or null");
      } else if (next === this) {
        throw new ReferenceError("List.Node (next): assigning this " +
          "to next creates a cyclic reference");
      }

      this.#next = next;
    }
    // ...
  };

  // private fields
    #front = null;
    #back  = null;
  // ...

	constructor(nodeData = []) {
    if (!(nodeData instanceof Array)) {
      throw new TypeError("List (nodeData): should be an Array");
    }

    nodeData.forEach((e) => { this.push(e); });
  }

  // getters/setters
  get front() { return this.#front; }
  get back()  { return this.#back;  }
  // ...

  push(data) {
    let node = new List.Node(data);

    if (this.#front === null) {
      this.#front = node;
      this.#back = node;
    } else {
      this.#back.next = node;
      node.prev = this.#back;

      this.#back = node;
    }
  }

  delete(node) {
    if (node === this.#front) {
      this.#front = node.next;
    }
    
    if (node === this.#back) {
      this.#back = node.prev;
    }

    if (node.next !== null) {
      node.next.prev = node.prev;
    }

    if (node.prev !== null) {
      node.prev.next = node.next;
    }
  }

  forEach(callbackFn = (n) => {}) {
    let node = this.#front;
    while(node !== null) {
      callbackFn(node);
      node = node.next;
    }
  }

  [Symbol.iterator]() {
    let curr = null;
    let next = this.#front;

    return {
      next: () => {
        if (next !== null) {
          curr = next;
          next = next.next;

          return {done: false, value: curr}; 
        } else {
          return {done: true, value: undefined};
        }
      },

      return: () => {
        next = null;
        return {done: true, value: undefined};
      },

      [Symbol.iterator]() {
        return this;
      }
    };
  }
};

export default List;
