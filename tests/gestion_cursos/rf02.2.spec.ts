import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf02.2";
const carpetaBase = path.join("gestion_cursos","capturas",nombre);

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

test.only('rf02.2-01 (Edición exitosa del nombre) [TD(valida)]', async ({ page }) => {
    const datos_entrada = {courseName: "Programación VII"};
    const contador = { valor: 0 };
    const casosPrueba = "rf02.2-01";
    
    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 
    
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await page.click('#btn-other-actions-0'); //hacer click
    await page.click('a:has-text("Edit")'); //hacer click

    // 3. Ver editar
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('#btn-edit-course'); //hacer click

    // 4. Completar formulario
    await page.fill('input[name="courseName"]', datos_entrada.courseName);
    await expect(page.locator('button', { hasText: 'Save Changes' })).toBeVisible();
    await page.click('text=Save Changes');

    // 5. Respuesta 
	await esperaTiempo(1500);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been edited');
});

test.only('rf02.2-02 (Error al intentar editar con un nombre vacío) [TD(invalida)]', async ({ page }) => {
    const datos_entrada = {courseName: ""};
    const contador = { valor: 0 };
    const casosPrueba = "rf02.2-02";
    
    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 
    
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await page.click('#btn-other-actions-0'); //hacer click
    await page.click('a:has-text("Edit")'); //hacer click

    // 3. Ver editar
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('#btn-edit-course'); //hacer click

    // 4. Completar formulario
    await page.fill('input[name="courseName"]', datos_entrada.courseName);
    await expect(page.locator('button', { hasText: 'Save Changes' })).toBeDisabled();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
});

test.only('rf02.2-03 (Error al intentar editar) [TD(invalida)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf02.2-03";
    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/student/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toHaveCount(0);
});