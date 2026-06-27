export {};

class Node<T> {
    data: T;
    next: Node<T> | null;
    constructor(data: T) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList<T = number> {
    head: Node<T> | null;
    constructor() {
        this.head = null;
    }
    // Insert at the end Time complexity: O(n)
    insert(data: T): void {
        const newNode = new Node<T>(data);
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
    delete(data: T): void {
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
    deleteByRef(ref: Node<T>): void {
        if (ref.next) {
            ref.next = ref.next.next;
        }
    }
    // insert by Reference Time complexity: O(1)
    insertByRef(ref: Node<T> | null, data: T): void {
        if (!ref) {
            return;
        }
        const newNode = new Node<T>(data);
        newNode.next = ref.next;
        ref.next = newNode;
    }
    // Search Time complexity: O(n)
    search(data: T): boolean {
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
    print(): void {
        let current = this.head;
        while (current) {
            console.log(current.data);
            current = current.next;
        }
    }
}

const list = new LinkedList<number>();
list.insert(1);
list.insert(2);
list.insert(3);
list.print();
list.delete(2);
list.print();
console.log(list.search(1));
