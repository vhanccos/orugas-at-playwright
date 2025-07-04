import { test, expect } from '@playwright/test';

test('El titulo de TEAMMATES', async ({ page }) => {
  await page.goto('https://teammates-orugas.appspot.com/'); //url inicial

  await expect(page).toHaveTitle(/TEAMMATES/); //si el titulo contiene TEAMMATES
  
});
