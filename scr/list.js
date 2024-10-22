class List {
  static Node = class {
    constructor(data) {
      this.prev = null;
      this.next = null;

      this.data = data;
    }
  };

	constructor() {
		this.front = null;
    this.last = null;
	}

  push(data) {
    let node = new List.Node(data);

    if (this.front === null) {
      this.front = node;
      this.last = node;
    } else {
      this.last.next = node;
      node.prev = this.last;

      this.last = node;
    }
  }

  delete(node) {
    if (node === this.front) {
      this.front = node.next;
    }
    
    if (node === this.last) {
      this.last = node.prev;
    }

    if (node.next !== null) {
      node.next.prev = node.prev;
    }

    if (node.prev !== null) {
      node.prev.next = node.next;
    }
  }
};

export default List;
