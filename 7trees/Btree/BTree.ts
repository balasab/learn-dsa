import { BTreeNode } from "./BTreeNode";
import { searchNode } from "./search";
import { insert } from "./insert";
import { remove } from "./remove";
import { traverseNode } from "./traverse";

export class BTree<K = number, V = string> {
  public root: BTreeNode<K, V>;
  public t: number; // Minimum degree (defines the capacity bounds)

  /**
   * @param t Minimum degree (t >= 2). 
   * Max keys = 2t - 1, Max children = 2t
   */
  constructor(t: number = 3) {
    if (t < 2) throw new Error("Minimum degree 't' must be at least 2.");
    this.root = new BTreeNode<K, V>(true);
    this.t = t;
  }

  /**
   * Search for a key in the B-Tree
   */
  public search(key: K): V | null {
    return searchNode(this.root, key);
  }

  /**
   * Insert a new key-value pair
   */
  public insert(key: K, value: V): void {
    insert(this, key, value);
  }

  /**
   * Remove a key from the B-Tree
   */
  public remove(key: K): void {
    remove(this, key);
  }

  /**
   * In-order traversal to view the sorted tree contents
   */
  public traverse(): void {
    traverseNode(this.root);
  }
}
