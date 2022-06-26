interface Tree<T> {
  key : number | string,
  lvl : number,
  ord : number,
  content : T,
  parent : Tree<T> | undefined,
  child : () => Set<Tree<T>>,
  addChild : (tree: T) => void
}

class TreeContainer<T> {
  private treeSet = new Set<Tree<T>>;
  constructor(treeList? : Array<Tree<T>>){
    if(!treeList) return;
    treeList.forEach((tree) => { this.treeSet.add(tree)});
  };

  static InnerTree = class <T> implements Tree<T> {
    childTreeSet = new Set<Tree<T>>();
    constructor(
      public lvl : number,
      public ord : number,
      public key : number | string,
      public content : T,
      public parent : Tree<T> | undefined,
      private outer : any
    ){}
      
    child() {
      return this.childTreeSet;
    }
    addChild(tree : T) {
      
    };

  }

  init(treeList : Array<Tree<T>>) {
    this.treeSet.clear();
    treeList.forEach((tree) => { this.treeSet.add(tree)});
  }

  clear() {
    this.treeSet.clear();
  }

  add(key : number | string, content : T) {
    let lvlSet = this.filter({ lvl : 1});
    let keySet = this.filter({ key: key}, lvlSet);
    if(keySet.size != 0) this.treeSet.delete(keySet.values[0]);
    this.privateAdd(1, 1, key, content, undefined);
  }

  private privateAdd(lvl: number, ord: number, key: number|string, content: T, parent: Tree<T>|undefined) {
    this.treeSet.add(new TreeContainer.InnerTree(lvl, ord, key, content, parent, this));
  }

  getOderList(treeSet : Set<Tree<T>>) {
    let orderList = new Array<Tree<T>>();
    let filteredSet = this.filter({lvl : 1});

    const circularPush = (tree: Tree<T>) => {
      orderList.push(tree);
      if(tree.child().size > 0) this.getOrderByOrd(tree.child()).forEach((child) => circularPush(child));
    }

    this.getOrderByOrd(filteredSet).forEach((tree) => circularPush(tree));
  }

  private getOrderByOrd(treeSet : Set<Tree<T>>) {
    let ordList: number[] = [];
    treeSet.forEach( (tree) => { if(ordList.indexOf(tree.ord) == -1) ordList.push(tree.ord); });

    let orderList = new Array<Tree<T>>();
    ordList.forEach( (ordnum) => {
      this.filter({ord: ordnum}, treeSet).forEach((tree) => orderList.push(tree));
    });
    return orderList;
  }

  private filter(filter : object, treeSet? : Set<Tree<T>>) {
    let filterKeys = Object.keys(filter);
    const filterSet = new Set<Tree<T>>;
    if(!treeSet) treeSet = this.treeSet;
    treeSet.forEach( (tree) => {
      let validate = true;
      filterKeys.forEach( (key) => {
        if(tree.hasOwnProperty(key) && tree[key] != filter[key]) 
          validate = false;
      });
      if(validate) filterSet.add(tree);
    });
    return filterSet;
  }
}
