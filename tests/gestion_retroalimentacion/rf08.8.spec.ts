import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf08.8";
const carpetaBase = path.join("capturas","gestion_retroalimentacion",nombre);


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
test.only('rf08.8-01 (Eliminación permanente exitosa de una sesión eliminada) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.8-01";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

	// 2. Carga feedback
	await page.click('text=Sessions'); //hacer click
	const expandBtn = page.locator('#deleted-sessions-heading button.chevron');
	await expect(expandBtn).toBeVisible();
    await expandBtn.click();

	// 3. Resultados
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
	await expect(page.locator('#btn-delete-0')).toBeVisible();
	await page.click('#btn-delete-0');

	// 4. alerta
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await page.getByRole('button', { name: 'Yes' }).click();     

	// 5. Respuesta     
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

});

// Empezar los tests
test.only('rf08.8-02 (Cancelación de la eliminación permanente tras diálogo de confirmación) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.8-02";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

	// 2. Carga feedback
	await page.click('text=Sessions'); //hacer click
	const expandBtn = page.locator('#deleted-sessions-heading button.chevron');
	await expect(expandBtn).toBeVisible();
    await expandBtn.click();

	// 3. Resultados
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
	await expect(page.locator('#btn-delete-0')).toBeVisible();
	await page.click('#btn-delete-0');

	// 4. alerta
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await page.getByRole('button', { name: 'No, cancel the operation' }).click();     

	// 5. Respuesta     
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

});

// Empezar los tests
test.only('rf08.8-03 (Combinación válida: usuario autorizado, sesión válida, confirmación afirmativa) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.8-03";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

	// 2. Carga feedback
	await page.click('text=Sessions'); //hacer click
	const expandBtn = page.locator('#deleted-sessions-heading button.chevron');
	await expect(expandBtn).toBeVisible();
    await expandBtn.click();

	// 3. Resultados
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
	await expect(page.locator('#btn-delete-0')).toBeVisible();
	await page.click('#btn-delete-0');

	// 4. alerta
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await page.getByRole('button', { name: 'Yes' }).click();     

	// 5. Respuesta     
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

});

// Empezar los tests
test.only('rf08.8-04 (Combinación inválida: usuario autorizado, sesión válida, confirmación cancelada) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.8-04";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

	// 2. Carga feedback
	await page.click('text=Sessions'); //hacer click
	const expandBtn = page.locator('#deleted-sessions-heading button.chevron');
	await expect(expandBtn).toBeVisible();
    await expandBtn.click();

	// 3. Resultados
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
	await expect(page.locator('#btn-delete-0')).toBeVisible();
	await page.click('#btn-delete-0');

	// 4. alerta
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await page.getByRole('button', { name: 'No, cancel the operation' }).click();     

	// 5. Respuesta     
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

});

