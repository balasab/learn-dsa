import { BPlusTreeNode } from "./BPlusTreeNode";
import { searchNode } from "./search";
import { insert } from "./insert";
import { remove } from "./remove";
import { traverseDFS, traverseLeaves } from "./traverse";

export class BPlusTree<K = number, V = string> {
  public root: BPlusTreeNode<K, V>;
  public t: number; // Minimum degree (defines capacity bounds)

  /**
   * @param t Minimum degree (t >= 2). 
   * Max keys = 2t - 1, Max children = 2t
   */
  constructor(t: number = 3) {
    if (t < 2) throw new Error("Minimum degree 't' must be at least 2.");
    this.root = new BPlusTreeNode<K, V>(true);
    this.t = t;
  }

  /**
   * Search for a key in the B+ Tree
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
   * Remove a key from the B+ Tree
   */
  public remove(key: K): void {
    remove(this, key);
  }

  /**
   * In-order DFS traversal
   */
  public traverse(): void {
    traverseDFS(this.root);
  }

  /**
   * Sequential traversal using leaf node links
   */
  public traverseLeaves(): void {
    traverseLeaves(this.root);
  }
}
