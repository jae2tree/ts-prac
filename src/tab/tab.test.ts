import createTab, {Tab} from './tab';

const tabs = createTab<string>();

let tab1 = {
  title: 'tabname1',
  content: 'content1'
}

let tab2 = {
  title: 'tabname2',
  content: 'content2'
}
tabs.addTab(tab1);
tabs.addTab(tab2);

test.each(tabs.getList())('add tab', (tab: Tab<string>) => {
  if(tab.title == tab1.title) expect(tab.content).toEqual(tab1.content);
  if(tab.title == tab2.title) expect(tab.content).toEqual(tab2.content);
});

test('tab length',()=>{
  expect(tabs.getList().length).toEqual(2);
  tabs.getList()[0].delete();
  expect(tabs.getList().length).toEqual(1);
});

test('tab length',()=>{
  expect(tabs.getList().length).toEqual(1);
});