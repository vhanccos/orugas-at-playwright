import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf04";
const carpetaBase = path.join("capturas","gestion_cursos",nombre);

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
test.only('rf04-01 (Visualizar la lista de cursos archivados) [T de estados]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf04-01";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

    // 2. Carga courses
    await page.click('text=Courses'); //hacer click
    const expandBtn = page.locator('#archived-table-heading button.chevron');
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();

    // 3. Resultados
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

});

test.only('rf04-02 (Restaurar curso archivado) [T de estados]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf04-02";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

    // 2. Carga courses
    await page.click('text=Courses'); //hacer click
    const expandBtn = page.locator('#archived-table-heading button.chevron');
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();

    // 3. Eleccion de boton
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    await expect(page.locator('#btn-unarchive-0')).toBeVisible();
    await page.click('#btn-unarchive-0');

    // 4. Respuesta 
    await esperaTiempo(1500);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been unarchived');    

});

test.only('rf04-03 (Mostrar la alerta correctamente después de intentar eliminar el curso) [T de estados]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf04-03";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

    // 2. Carga courses
    await page.click('text=Courses'); //hacer click
    const expandBtn = page.locator('#archived-table-heading button.chevron');
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();

    // 3. Eleccion de boton
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    await expect(page.locator('#btn-soft-delete-archived-0')).toBeVisible();
    await page.click('#btn-soft-delete-archived-0');

    // 4. alerta
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
});

test.only('rf04-04 (Eliminar un curso archivado) [T de estados]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf04-04";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

    // 2. Carga courses
    await page.click('text=Courses'); //hacer click
    const expandBtn = page.locator('#archived-table-heading button.chevron');
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();

    // 3. Eleccion de boton
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    await expect(page.locator('#btn-soft-delete-archived-0')).toBeVisible();
    await page.click('#btn-soft-delete-archived-0');

    // 4. alerta
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.getByRole('button', { name: 'Yes' }).click();     

    // 5. Respuesta 
    await esperaTiempo(1500);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been deleted');    
});

test.only('rf04-05 (Cancelar la eliminación de un curso archivado) [T de estados]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf04-05";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

    // 2. Carga courses
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    const expandBtn = page.locator('#archived-table-heading button.chevron');
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();

    // 3. Eleccion de boton
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    await expect(page.locator('#btn-soft-delete-archived-0')).toBeVisible();
    const courseId = await page.locator('#archived-course-id-0').innerText();
    await page.click('#btn-soft-delete-archived-0');

    // 4. alerta
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.getByRole('button', { name: 'No, cancel the operation' }).click();     

    // 5. Respuesta     
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    await expect(page.locator(`text=${courseId}`)).toHaveCount(1);      
});
