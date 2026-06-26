class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }
    // Insert at the end Time complexity: O(n)
    insert(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }
    // Delete at the end Time complexity: O(n)
    delete(data) {
        if (!this.head) {
            return;
        }
        if (this.head.data === data) {
            this.head = this.head.next;
            return;
        }
        let current = this.head;
        while (current.next && current.next.data !== data) {
            current = current.next;
        }
        if (current.next) {
            current.next = current.next.next;
        }
    }
    // Delete by Reference Time complexity: O(1)
    deleteByRef(ref) {
        ref.next = ref.next.next;
    }
    // insert by Reference Time complexity: O(1)
    insertByRef(ref, data) {
        if (!ref) {
            return;
        }
        const newNode = new Node(data);
        newNode.next = ref.next;
        ref.next = newNode; s
    }
    // Search Time complexity: O(n)
    search(data) {
        let current = this.head;
        while (current) {
            if (current.data === data) {
                return true;
            }
            current = current.next;
        }
        return false;
    }
    // Print Time complexity: O(n)
    print() {
        let current = this.head;
        while (current) {
            console.log(current.data);
            current = current.next;
        }
    }
}

const list = new LinkedList();
list.insert(1);
list.insert(2);
list.insert(3);
list.print();
list.delete(2);
list.print();
console.log(list.search(1));


