import { LanguageGamePage } from './app.po';

describe('language-game App', () => {
  let page: LanguageGamePage;

  beforeEach(() => {
    page = new LanguageGamePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
