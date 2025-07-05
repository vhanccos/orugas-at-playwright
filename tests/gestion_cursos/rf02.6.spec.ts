import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf02.6";
const carpetaBase = path.join("capturas",nombre);
const unico = "101";

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

test.only('rf02.6-01 (Copiar curso con nuevo nombre e ID válidos) [TD(valida)]', async ({ page }) => {
    const datos_entrada = {courseName: "Programación I", courseId: "HIS202-"+unico}; //que no repita el id
	const contador = { valor: 0 };
	const casosPrueba = "rf02.6-01";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible();
       
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('#btn-other-actions-0'); //hacer click
    await page.click('#btn-copy-0'); //hacer click   

    // 3. Completar formulario
    await page.fill('#copy-course-id', datos_entrada.courseId);
    await page.fill('#copy-course-name', datos_entrada.courseName);
    await expect(page.locator('#copy-course-id')).toHaveValue(datos_entrada.courseId);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    const copyBtn = page.locator('#btn-confirm-copy-course');
    await expect(copyBtn).toBeEnabled();
    await copyBtn.click();

    // 4. Respuesta 
    await esperaTiempo(1500);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been added');    

});

test.only('rf02.6-02 (Copia fallida al no ser instructor) [TD(invalida)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf02.6-02";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/student/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toHaveCount(0);    
});

test.only('rf02.6-03 (Intentar copiar curso con ID existente) [TD(invalida)]', async ({ page }) => {
    const datos_entrada = {courseName: "Matemática II ", courseId: "BIO101"};
	const contador = { valor: 0 };
	const casosPrueba = "rf02.6-03";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible();
       
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('#btn-other-actions-0'); //hacer click
    await page.click('#btn-copy-0'); //hacer click   

    // 3. Completar formulario
    await page.fill('#copy-course-id', datos_entrada.courseId);
    await page.fill('#copy-course-name', datos_entrada.courseName);
    await expect(page.locator('#copy-course-id')).toHaveValue(datos_entrada.courseId);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    const copyBtn = page.locator('#btn-confirm-copy-course');
    await expect(copyBtn).toBeEnabled();
    await copyBtn.click();

    // 4. Respuesta 
    await esperaTiempo(1500);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).not.toContain('has been added');  
});

test.only('rf02.6-04 (Copia fallida al ser el nombre del curso vacío) [TD(invalida)]', async ({ page }) => {
    const datos_entrada = {courseName: "", courseId: "INF303"+unico};
	const contador = { valor: 0 };
	const casosPrueba = "rf02.6-04";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible();
       
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('#btn-other-actions-0'); //hacer click
    await page.click('#btn-copy-0'); //hacer click   

    // 3. Completar formulario
    await page.fill('#copy-course-id', datos_entrada.courseId);
    await page.fill('#copy-course-name', datos_entrada.courseName);
    await expect(page.locator('#copy-course-id')).toHaveValue(datos_entrada.courseId);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    const copyBtn = page.locator('#btn-confirm-copy-course');
    await expect(copyBtn).toBeDisabled();
});

test.only('rf02.6-05 (Copia fallida al ser el nombre del curso vacío e ID repetido) [TD(invalida)]', async ({ page }) => {
    const datos_entrada = {courseName: "", courseId: "BIO101"};
	const contador = { valor: 0 };
	const casosPrueba = "rf02.6-05";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible();
       
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('#btn-other-actions-0'); //hacer click
    await page.click('#btn-copy-0'); //hacer click   

    // 3. Completar formulario
    await page.fill('#copy-course-id', datos_entrada.courseId);
    await page.fill('#copy-course-name', datos_entrada.courseName);
    await expect(page.locator('#copy-course-id')).toHaveValue(datos_entrada.courseId);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    const copyBtn = page.locator('#btn-confirm-copy-course');
    await expect(copyBtn).toBeDisabled();
});

test.only('rf02.6-06 (Copia fallida al ser el código del curso vacío) [EP(invalida)]', async ({ page }) => {
    const datos_entrada = {courseName: "Matemática II ", courseId: ""};
	const contador = { valor: 0 };
	const casosPrueba = "rf02.6-06";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible();
       
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('#btn-other-actions-0'); //hacer click
    await page.click('#btn-copy-0'); //hacer click   

    // 3. Completar formulario
    await page.fill('#copy-course-id', datos_entrada.courseId);
    await page.fill('#copy-course-name', datos_entrada.courseName);
    await expect(page.locator('#copy-course-id')).toHaveValue(datos_entrada.courseId);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    const copyBtn = page.locator('#btn-confirm-copy-course');
    await expect(copyBtn).toBeDisabled();
});

test.only('rf02.6-07 (Copia exitosa de un curso con todos los campos válidos) [EP(valida)]', async ({ page }) => {
    const datos_entrada = {courseName: "Curso A", courseId: "PS-002-"+unico}; //que no repita el id
	const contador = { valor: 0 };
	const casosPrueba = "rf02.6-07";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible();
       
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('#btn-other-actions-0'); //hacer click
    await page.click('#btn-copy-0'); //hacer click   

    // 3. Completar formulario
    await page.fill('#copy-course-id', datos_entrada.courseId);
    await page.fill('#copy-course-name', datos_entrada.courseName);
    await expect(page.locator('#copy-course-id')).toHaveValue(datos_entrada.courseId);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    const copyBtn = page.locator('#btn-confirm-copy-course');
    await expect(copyBtn).toBeEnabled();
    await copyBtn.click();

    // 4. Respuesta 
    await esperaTiempo(1500);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been added');   
});

test.only('rf02.6-08 (Copia fallida al ser el código del curso mayor a 64 caracteres) [EP(invalida)]', async ({ page }) => {
     const datos_entrada = {courseName: "Curso A", courseId: "ABCDEF1234567890_1234567890-1234567890.1234567890$1234567890XYZ45"}; //que no repita el id
	const contador = { valor: 0 };
	const casosPrueba = "rf02.6-08";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible();
       
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('#btn-other-actions-0'); //hacer click
    await page.click('#btn-copy-0'); //hacer click   

    // 3. Completar formulario
    await page.fill('#copy-course-id', datos_entrada.courseId);
    await page.fill('#copy-course-name', datos_entrada.courseName);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    await expect(page.locator('#copy-course-id')).not.toHaveValue(datos_entrada.courseId);
});

test.only('rf02.6-09 (Copia fallida al ser el código del curso con espacio) [EP(invalida)]', async ({ page }) => {
    const datos_entrada = {courseName: "Curso A", courseId: "PS 002"}; //que no repita el id
	const contador = { valor: 0 };
	const casosPrueba = "rf02.6-09";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible();
       
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('#btn-other-actions-0'); //hacer click
    await page.click('#btn-copy-0'); //hacer click   

    // 3. Completar formulario
    await page.fill('#copy-course-id', datos_entrada.courseId);
    await page.fill('#copy-course-name', datos_entrada.courseName);
    await expect(page.locator('#copy-course-id')).toHaveValue(datos_entrada.courseId);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    const copyBtn = page.locator('#btn-confirm-copy-course');
    await expect(copyBtn).toBeEnabled();
    await copyBtn.click();

    // 4. Respuesta 
    await esperaTiempo(1500);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).not.toContain('has been added');   
});