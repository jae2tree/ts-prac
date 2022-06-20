export interface Tab<T> {
  readonly idx: number,
  readonly title: string,
  readonly content: T,
  delete: () => Tab<T>
}

interface InnerTab<T> extends Tab<T> {
  idx: number,
}

class TabContainer<T> {
  private tabList : Array<InnerTab<T>> = [];
  constructor(mainTab?: {title: string, content: T}) {
    if(mainTab) {
      const tab = this.createInnerTab(mainTab);
      this.tabList.push(tab);
    }
  }

  static Tab = class <V> implements InnerTab<V>{
    constructor(
      readonly idx: number,
      readonly title: string,
      readonly content: V,
      private removeTab: (tab: InnerTab<V>) => Tab<V>,
      private outer : any
    ){}

    delete() : Tab<V> {
      return this.removeTab.bind(this.outer)(this);
    }
  }

  public createInnerTab(tab : {title: string, content: T}) : InnerTab<T> {
    let outer = this;
    return new TabContainer<T>.Tab(
      this.tabList.length,
      tab.title,
      tab.content,
      this.removeTab,
      outer
    );
  }

  addTab(tab: {title: string, content: T}) {
    const newTab = this.createInnerTab(tab);
    this.tabList.push(newTab);
  }

  removeTab(idxOrTab: number | InnerTab<T>) : Tab<T> {
    let removeTab : InnerTab<T>;
    if(typeof idxOrTab === 'number') {
      removeTab = this.tabList.filter((tab) => tab.idx == idxOrTab)[0];
    } else {
      removeTab = idxOrTab;
    }

    this.tabList = this.tabList.filter((tab) => tab !== removeTab);
    return removeTab;
  }

  getList() : Array<Tab<T>>{
    return [...this.tabList];
  }

  
}

export default <T> (mainTab?: {title: string, content: T}) => {
  return new TabContainer(mainTab);
};