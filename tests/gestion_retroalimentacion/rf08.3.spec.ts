import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf08.3";
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


test.only('rf08.3-01 (Ver vista previa de una evaluación antes de publicarla) [EP(Valido)]', async ({ page }) => {
	const contador = { valor: 0 };
	const casosPrueba = "rf08.3-01";

	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

	// 2. Carga sessions
	await page.click('text=Sessions'); //hacer click    
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
	
	//3. editar el primero
	await page.click('tr:has-text("Not Published") a[tmrouterlink="/web/instructor/sessions/edit"] button:has-text("Edit")');
	await CargaCompleta(page);
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

	// 4. Visualizar 
	const button = page.locator('button#btn-preview-student');
	await expect(button).toBeEnabled();
	await button.click();
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

	// 5. Hacer carga
	const [newPage] = await Promise.all([
		page.context().waitForEvent('page'), // Esperar nueva pestaña
		page.click('#btn-preview-student')    // Hacer clic
	]);

	// Trabajar con la nueva pestaña
	await newPage.waitForLoadState('networkidle');
	await CargaCompleta(newPage)
	await Guardar_imagen(newPage, carpetaBase, contador, casosPrueba);
});
test.only('rf08.3-02 (Intentar vista previa de evaluación ya publicada) [EP(Valido)]', async ({ page }) => {
	const contador = { valor: 0 };
	const casosPrueba = "rf08.3-02";

	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

	// 2. Carga sessions
	await page.click('text=Sessions'); //hacer click    
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
	
	//3. editar el primero
	await page.click('tr:has(span.ngb-tooltip-class:text-is("Published")) a[tmrouterlink="/web/instructor/sessions/edit"] button:has-text("Edit")');
	await CargaCompleta(page);
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

	// 4. Visualizar 
	const button = page.locator('button#btn-preview-student');
	await expect(button).toBeEnabled();
	await button.click();
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

	// 5. Hacer carga
	const [newPage] = await Promise.all([
		page.context().waitForEvent('page'), // Esperar nueva pestaña
		page.click('#btn-preview-student')    // Hacer clic
	]);

	// Trabajar con la nueva pestaña
	await newPage.waitForLoadState('networkidle');
	await CargaCompleta(newPage)
	await Guardar_imagen(newPage, carpetaBase, contador, casosPrueba);
});
test.only('rf08.3-03 (Verificar que se visualicen correctamente los elementos: título, preguntas, instrucciones, tiempos) [Casos de Uso]', async ({ page }) => {
	const contador = { valor: 0 };
	const casosPrueba = "rf08.3-03";

	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

	// 2. Carga sessions
	await page.click('text=Sessions'); //hacer click    
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
	
	//3. editar el primero
	await page.click('tr:has-text("Not Published") a[tmrouterlink="/web/instructor/sessions/edit"] button:has-text("Edit")');
	await CargaCompleta(page);
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

	// 4. Visualizar 
	const button = page.locator('button#btn-preview-student');
	await expect(button).toBeEnabled();
	await button.click();
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

	// 5. Hacer carga
	const [newPage] = await Promise.all([
		page.context().waitForEvent('page'), 
		page.click('#btn-preview-student') 
	]);

	// Trabajar con la nueva pestaña
	await CargaCompleta(newPage);
	await esperaTiempo(1500);
	await Guardar_imagen(newPage, carpetaBase, contador, casosPrueba);
	await newPage.locator('#btn-submit').waitFor({ state: 'visible' });
	await newPage.locator('#btn-submit').hover({ force: true })
	await esperaTiempo(1500);
	await Guardar_imagen(newPage, carpetaBase, contador, casosPrueba); 

});
test.only('rf08.3-04 (Cancelar vista previa y volver al editor) [Casos de Uso]', async ({ page }) => {
	const contador = { valor: 0 };
	const casosPrueba = "rf08.3-04";

	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

	// 2. Carga sessions
	await page.click('text=Sessions'); //hacer click    
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
	
	//3. editar el primero
	await page.click('tr:has-text("Not Published") a[tmrouterlink="/web/instructor/sessions/edit"] button:has-text("Edit")');
	await CargaCompleta(page);
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

	// 4. Visualizar 
	const button = page.locator('button#btn-preview-student');
	await expect(button).toBeEnabled();
	await button.click();
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

	// 5. Hacer carga
	const [newPage] = await Promise.all([
		page.context().waitForEvent('page'), // Esperar nueva pestaña
		page.click('#btn-preview-student')    // Hacer clic
	]);

	// 6. Trabajar con la nueva pestaña
	await newPage.waitForLoadState('networkidle');
	await CargaCompleta(newPage)
	await Guardar_imagen(newPage, carpetaBase, contador, casosPrueba);
	await newPage.close();

	// 7. regresar
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});