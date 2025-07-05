import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf02.1";
const carpetaBase = path.join("capturas","gestion_cursos",nombre);
const unico = "001";

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
test.only('rf02.1-01 (Creación exitosa de un curso con todos los campos válido) [TD(valida)]', async ({ page }) => {
	const datos_entrada = {courseName: "Programación I", courseId: "INF101-"+unico}; //que no repita el id
	const contador = { valor: 0 };
	const casosPrueba = "rf02.1-01";

	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

	// 2. Carga courses
	await page.click('text=Courses'); //hacer click
	await expect(page.locator('a', { hasText: 'Add New Course' })).toBeVisible();
	await page.click('text=Add New Course'); //hacer click

	// 3. Completar formulario
    await page.fill('input[name="courseId"]', datos_entrada.courseId);
    await page.fill('input[name="courseName"]', datos_entrada.courseName);
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
	await expect(page.locator('button', { hasText: 'Add Course' })).toBeEnabled();
	await page.click('text=Add Course');

	// 4. Respuesta 
	await esperaTiempo(1500);
	const mensaje = await page.locator('div.toast-body').innerText();
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
	expect(mensaje).toContain('has been added');
});

test.only('rf02.1-02 (Creación fallida al no ser instructor) [TD(invalida)]', async ({ page }) => {
	const contador = { valor: 0 };
	const casosPrueba = "rf02.1-02";

	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/student/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Courses' })).toHaveCount(0);
});

test.only('rf02.1-03 (Creación fallida al ser el código del curso repetido) [TD(invalida)]', async ({ page }) => {
	const datos_entrada = {courseName: "Programación II", courseId: "INF101"};
	const contador = { valor: 0 };
	const casosPrueba = "rf02.1-03";

	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

	// 2. Carga courses
	await page.click('text=Courses'); //hacer click
	await expect(page.locator('a', { hasText: 'Add New Course' })).toBeVisible();
	await page.click('text=Add New Course'); //hacer click

	// 3. Completar formulario
    await page.fill('input[name="courseId"]', datos_entrada.courseId);
    await page.fill('input[name="courseName"]', datos_entrada.courseName);
	await esperaTiempo(1500); 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
	await expect(page.locator('button', { hasText: 'Add Course' })).toBeVisible();
	await page.click('text=Add Course');

	// 4. Respuesta 
	await esperaTiempo(1500); 
	const mensaje = await page.locator('div.toast-body').innerText();
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
	expect(mensaje).not.toContain('has been added');
});

test.only('rf02.1-04 (Creación fallida al ser el nombre del curso vacío) [TD(invalida)]', async ({ page }) => {
	const datos_entrada = {courseName: "", courseId: "INF203"+unico};
	const contador = { valor: 0 };
	const casosPrueba = "rf02.1-04";

	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

	// 2. Carga courses
	await page.click('text=Courses'); //hacer click
	await expect(page.locator('a', { hasText: 'Add New Course' })).toBeVisible();
	await page.click('text=Add New Course'); //hacer click

	// 3. Completar formulario
    await page.fill('input[name="courseId"]', datos_entrada.courseId);
    await page.fill('input[name="courseName"]', datos_entrada.courseName);
	await esperaTiempo(1500); 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
	await expect(page.locator('button', { hasText: 'Add Course' })).toBeDisabled();
});

test.only('rf02.1-05 (Creación fallida al ser el nombre del curso vacío y código repetido) [TD(invalida)]', async ({ page }) => {
	const datos_entrada = {courseName: "", courseId: "INF101"};
	const contador = { valor: 0 };
	const casosPrueba = "rf02.1-05";
	
	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

	// 2. Carga courses
	await page.click('text=Courses'); //hacer click
	await expect(page.locator('a', { hasText: 'Add New Course' })).toBeVisible();
	await page.click('text=Add New Course'); //hacer click

	// 3. Completar formulario
    await page.fill('input[name="courseId"]', datos_entrada.courseId);
    await page.fill('input[name="courseName"]', datos_entrada.courseName);
	await esperaTiempo(1500);  // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
	await expect(page.locator('button', { hasText: 'Add Course' })).toBeDisabled();
});

test.only('rf02.1-06 (Creación fallida al ser el código del curso vacío) EP(invalida)]', async ({ page }) => {
	const datos_entrada = {courseName: "Curso A", courseId: ""};
	const contador = { valor: 0 };
	const casosPrueba = "rf02.1-06";
	
	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

	// 2. Carga courses
	await page.click('text=Courses'); //hacer click
	await expect(page.locator('a', { hasText: 'Add New Course' })).toBeVisible();
	await page.click('text=Add New Course'); //hacer click

	// 3. Completar formulario
    await page.fill('input[name="courseId"]', datos_entrada.courseId);
    await page.fill('input[name="courseName"]', datos_entrada.courseName);
	await esperaTiempo(1500);  // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
	await expect(page.locator('button', { hasText: 'Add Course' })).toBeDisabled();
});

test.only('rf02.1-07 (Creación exitosa de un curso con todos los campos válidos) [EP(valida)]', async ({ page }) => {
	const datos_entrada = {courseName: "Curso A", courseId: "PS-001-"+unico}; //que no repita el id
	const contador = { valor: 0 };
	const casosPrueba = "rf02.1-07";
	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

	// 2. Carga courses
	await page.click('text=Courses'); //hacer click
	await expect(page.locator('a', { hasText: 'Add New Course' })).toBeVisible();
	await page.click('text=Add New Course'); //hacer click

	// 3. Completar formulario
    await page.fill('input[name="courseId"]', datos_entrada.courseId);
    await page.fill('input[name="courseName"]', datos_entrada.courseName);
	await esperaTiempo(1500); 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
	await expect(page.locator('button', { hasText: 'Add Course' })).toBeVisible();
	await page.click('text=Add Course');

	// 4. Respuesta 
	await esperaTiempo(1500);
	const mensaje = await page.locator('div.toast-body').innerText();
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
	expect(mensaje).toContain('has been added');
});

test.only('rf02.1-08 (Creación fallida al ser el código del curso mayor a 64 caracteres) [EP(invalida)]', async ({ page }) => {
	const datos_entrada = {courseName: "Curso A", courseId: "ABCDEF1234567890_1234567890-1234567890.1234567890$1234567890XYZ45"};
	const contador = { valor: 0 };
	const casosPrueba = "rf02.1-08";

	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

	// 2. Carga courses
	await page.click('text=Courses'); //hacer click
	await expect(page.locator('a', { hasText: 'Add New Course' })).toBeVisible();
	await page.click('text=Add New Course'); //hacer click

	// 3. Completar formulario
    await page.fill('input[name="courseId"]', datos_entrada.courseId);
    await page.fill('input[name="courseName"]', datos_entrada.courseName);
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
	await expect(page.locator('input[name="courseId"]')).not.toHaveValue(datos_entrada.courseId); //no se copio todo
});

test.only('rf02.1-09 (Creación fallida al ser el código del curso con espacio) [EP(invalida)]', async ({ page }) => {
	const datos_entrada = {courseName: "Curso A", courseId: "PS 002"};
	const contador = { valor: 0 };
	const casosPrueba = "rf02.1-09";

	// 1. Cargar la pagina inicial
	await page.goto(urlBase + 'web/instructor/home'); //url inicial
	await CargaCompleta(page); // Esperar carga 
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
	await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

	// 2. Carga courses
	await page.click('text=Courses'); //hacer click
	await expect(page.locator('a', { hasText: 'Add New Course' })).toBeVisible();
	await page.click('text=Add New Course'); //hacer click

	// 3. Completar formulario
    await page.fill('input[name="courseId"]', datos_entrada.courseId);
    await page.fill('input[name="courseName"]', datos_entrada.courseName);
	await esperaTiempo(1500);
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
	await expect(page.locator('button', { hasText: 'Add Course' })).toBeVisible();
	await page.click('text=Add Course');

	// 4. Respuesta 
	await esperaTiempo(1500);
	const mensaje = await page.locator('div.toast-body').innerText();
	await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
	expect(mensaje).not.toContain('has been added');
});
