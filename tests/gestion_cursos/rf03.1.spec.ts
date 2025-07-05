import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf03.1";
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

test.only('rf03.1-01 (Visualización de estadística de un curso específico) [T de estados]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf03.1-01";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

    // 2. Carga courses
	await page.click('text=Courses'); //hacer click
    const showBtn = page.locator('#show-statistics-0');
    await expect(showBtn).toBeEnabled();
    await showBtn.click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
});

test.only('rf03.1-02 (Visualización la lista de cursos bajo Course ID) [T de estados]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf03.1-02";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

    // 2. Carga courses
	await page.click('text=Courses'); //hacer click
    await page.click('#sort-course-id button'); //hacer click  
    const ids = await page
    .locator('#active-courses-table tbody td[id^="course-id-"]')
    .allInnerTexts();
    const sorted = [...ids].sort((a, b) => a.localeCompare(b));
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    expect(ids).toEqual(sorted);
});

test.only('rf03.1-03 (Visualización la lista de cursos bajo Course Name) [T de estados]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf03.1-03";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

    // 2. Carga courses
	await page.click('text=Courses'); //hacer click
    await page.click('#sort-course-name button'); //hacer click  
    const names = await page
    .locator('#active-courses-table tbody tr td:nth-child(2)')
    .allInnerTexts();
    
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    expect(names).toEqual(sortedNames);   
});

test.only('rf03.1-04 (Visualización la lista de cursos bajo Creation Date) [T de estados]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf03.1-04";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 

    // 2. Carga courses
	await page.click('text=Courses'); //hacer click
    await page.click('#sort-creation-date button'); //hacer click  
    const dateTexts = await page
    .locator('#active-courses-table tbody tr td:nth-child(3) span')
    .allInnerTexts();
    
    // convierte a Date para comparar cronológicamente
    const dates = dateTexts.map(text => {
        // Ajusta el parsing si el formato cambia
        return new Date(text.trim());
    });

    const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    expect(dates).toEqual(sortedDates);   
});