import { launch, Page } from 'puppeteer';
import { RequestUtils } from '../commons/utils/RequestUtils';

function getToken(page: Page): Promise<string> {
  return new Promise((resolve, reject) => {
    page.on('response', (response) => {
      const status = response.status();
      if (status >= RequestUtils.REDIRECTION && status <= RequestUtils.BAD_REQUEST) {
        const regex = /https:\/\/platform.*?\.cloud\.coveo\.com.*?access_token=(?<token>.*?)&/gm;
        const match = regex.exec(response.headers()['location']);
        if (match && match.groups && match.groups.token) {
          resolve(match.groups.token);
        }
      }
    });
  });
}

export async function showLoginPopup(platformUrl = 'https://platform.cloud.coveo.com'): Promise<string | null> {
  const browser = await launch({
    headless: false,
    args: [`--window-size=544,860`],
    ignoreDefaultArgs: ['--enable-automation'],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 544,
    height: 860,
    deviceScaleFactor: 1,
  });
  await page.goto(`${platformUrl}/login`, { waitUntil: 'networkidle2' });

  let token = null;
  try {
    token = await getToken(page);
  } catch (error) {
    throw Error('Unable to get token: ' + error);
  }
  await browser.close();

  return token;
}
