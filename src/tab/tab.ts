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
  private defaultTabInfo : {title: string, content: T};
  constructor(mainTab?: {title: string, content: T}) {
    if(mainTab) {
      const tab = this.createInnerTab(mainTab);
      this.defaultTabInfo = mainTab;
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
    if(this.tabList.filter((v) => v.title == tab.title).length > 0) return;
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
    this.tabList.forEach((tab, idx) => tab.idx = idx);
    return removeTab;
  }

  get(titleOrIdx : number | string) : Tab<T> | undefined {
    let filtered : Array<Tab<T>>;
    if(typeof titleOrIdx === 'number') {
      filtered = this.tabList.filter((tab) => tab.idx == titleOrIdx);
    } else if(typeof titleOrIdx === 'string') {
      filtered = this.tabList.filter((tab) => tab.title == titleOrIdx);
    } else throw new Error('');
    return filtered.length > 0 ? filtered[0] : undefined;
  }

  getList() : Array<Tab<T>>{
    return [...this.tabList];
  }

  clear() {
    this.tabList = [];
    if(this.defaultTabInfo) this.addTab(this.defaultTabInfo);
  }
}

export default function createTab<T> (mainTab?: {title: string, content: T}) {
  return new TabContainer(mainTab);
};