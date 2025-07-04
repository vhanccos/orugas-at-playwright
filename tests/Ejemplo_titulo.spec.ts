import { test, expect } from '@playwright/test';
import { isAuthValid } from '../scripts/checkAuth.js';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';

// validar el login inicial
test.beforeAll(() => {
  	if (! isAuthValid(storagePath)) {
    	throw new Error(
      	'❌ La sesion de Google ha expirado o no existe. ' +
      	'Ejecuta `node scripts/saveAuth.js` para regenerar auth/storageState.json'
    	);
  	}
});

// configurar contexto
test.use({
  	storageState: storagePath
});

// Empezar los tests
test('El titulo de TEAMMATES', async ({ page }) => {
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	// Esperar carga 
	await page.waitForLoadState('load');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');

	await expect(page.locator('h1')).toContainText('Home');
	await page.screenshot({ path: 'screenshots/prueba.png' });
});
