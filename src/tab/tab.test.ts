import createTab from './tab';

describe('Tab TEST', () => {
  let tabs = createTab<string>();

  let tab1 = { title: 'tabname1', content: 'content1'};
  let tab2 = { title: 'tabname2', content: 'content2'};
  let tab3 = { title: 'tabname3', content: 'content3'};
  beforeEach(() => {
    tabs = createTab<string>();
    tabs.addTab(tab1);
    tabs.addTab(tab2);
    tabs.addTab(tab3);
  });

  it('addTab', () => {
    tabs.addTab(tab2);
    expect(tabs.getList().length).toBe(3);

    let i = 0;
    tabs.getList().forEach((tab) => expect(tab.idx).toEqual(i++));
  });

  it('removeTab', () => {
    const removedTab = tabs.removeTab(1);
    expect(removedTab.title).toBe('tabname2');
    expect(removedTab.content).toBe('content2');
    expect(tabs.getList().length).toBe(2);
    
    let i = 0;
    tabs.getList().forEach((tab) => expect(tab.idx).toEqual(i++));
  });

  it('delete', () => {
    const removedTab = tabs.get(1).delete();
    expect(removedTab.title).toBe('tabname2');
    expect(removedTab.content).toBe('content2');
    expect(tabs.getList().length).toBe(2);

    let i = 0;
    tabs.getList().forEach((tab) => expect(tab.idx).toEqual(i++));
  });

  it('clear', () => {
    expect(tabs.getList().length).toBe(3);
    tabs.clear();
    expect(tabs.getList().length).toBe(0);
    tabs = createTab<string>(tab2);
    tabs.addTab(tab3);
    expect(tabs.getList().length).toBe(2);
    tabs.clear();
    expect(tabs.getList().length).toBe(1);
    const mainTab = tabs.getList()[0];
    expect(mainTab.title).toBe('tabname2');
    expect(mainTab.content).toBe('content2');
  });

});
