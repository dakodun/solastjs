class ListNode {
  constructor(data) {
    this.prev = null;
    this.next = null;

    this.data = data;
  }
};

class List {
  constructor() {
    this.front = null;
    this.last = null;
  }

  // add a node containing 'data' to the end of the list
  push(data) {
    let node = new ListNode(data);

    if (this.front == null) {
      // list is empty
      // this is now the first and last node
      this.front = node;
      this.last = node;
    }
    else {
      // this is now the last node
      // link it to the previous last node
      this.last.next = node;
      node.prev = this.last;

      this.last = node;
    }
  }

  // remove a 'node' from the list and update as necessary
  delete(node) {
    // update list's first and last node if necessary
    if (node == this.front) {
      this.front = node.next;
    }
    
    if (node == this.last) {
      this.last = node.prev;
    }

    // link previous and next nodes together
    if (node.next != null) {
      node.next.prev = node.prev;
    }

    if (node.prev != null) {
      node.prev.next = node.next;
    }
  }
};

export default List;
