import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf02.4";
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

test.only('rf02.4-01 (Archivar exitosamente un curso) [TD(valida)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf02.4-01";
    
    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 
    
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    const courseId = await page.locator('#course-id-0').innerText();
    await page.click('#btn-other-actions-0'); //hacer click
    await page.click('#btn-archive-0'); //hacer click    

    // 3. Respuesta 
    await esperaTiempo(1500);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been archived');    
});

test.only('rf02.4-02 (Estudiante intenta archivar un curso) [TD(invalida)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf02.4-02";
    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/student/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toHaveCount(0);        
});

test.only('rf02.4-03 (Intento de archivar de un instructor sin permisos) [TD(invalida)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf02.4-03";
    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

    await expect(page.locator('a', { hasText: 'Courses' })).toBeVisible(); 
    
    // 2. Carga courses 
    await page.click('text=Courses'); //hacer click
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a[href="/web/instructor/courses/enroll?courseid=vhanccos.uns-demo"]')).toHaveCount(0);
});
