import { FavlistsPage } from './app.po';

describe('favlists App', function() {
  let page: FavlistsPage;

  beforeEach(() => {
    page = new FavlistsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
