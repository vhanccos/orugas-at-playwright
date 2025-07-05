import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf02.5";
const carpetaBase = path.join("capturas","gestion_cursos",nombre);
const courseId = 'jcuadrosam.uns-demo';  //Cambiar id para esta prueba (personal)

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

test.only('rf02.5-01 (Visualización de curso con gran número de inscritos) [T de estados]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf02.5-01";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 
    
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    const fila = page.locator('tr', { hasText: courseId });
    await fila.locator('button', { hasText: 'Other Actions' }).click();
    await fila.locator('.dropdown-menu.show').waitFor();
    await fila.locator('a', { hasText: 'View' }).click();
    
    // 3. Guardar captura
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

});

test.only('rf02.5-02 (Descargar de un curso con gran número de inscritos) [T de estados]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf02.5-02";
    
    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 
    
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    const fila = page.locator('tr', { hasText: courseId });
    await fila.locator('button', { hasText: 'Other Actions' }).click();
    await fila.locator('.dropdown-menu.show').waitFor();
    await fila.locator('a', { hasText: 'View' }).click();
    
    // 3. Guardar captura
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

    // 4. descargar
    const [ download ] = await Promise.all([
        page.waitForEvent('download'),
        page.click('#btn-download'),
    ]);
    // 5. guardar el csv
    const filePath = path.join(carpetaBase, 'student_list.csv');
    await download.saveAs(filePath);

    const suggestedFileName = download.suggestedFilename();
    expect(suggestedFileName).toContain('.csv');

});