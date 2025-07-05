import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf02.3";
const carpetaBase = path.join("capturas",nombre)

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

test.only('rf02.3-01 (Eliminación exitosa de curso) [TD(valida)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf02.3-01";
    
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
    await page.click('#btn-soft-delete-0'); //hacer click      

    // 3. alerta
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.getByRole('button', { name: 'Yes' }).click(); 

    // 4. Respuesta 
    await esperaTiempo(1500);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been deleted');

});

test.only('rf02.3-02 (Estudiante intenta eliminar un curso) [TD(invalida)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf02.3-02";
    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/student/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Courses' })).toHaveCount(0);    
}); 

test.only('rf02.3-03 (Intento de eliminación de un instructor sin permisos) [TD(invalida)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf02.3-03";
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

test.only('rf02.3-04 (Cancelar la eliminación de un instructor sin permisos) [TD(invalida)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf02.3-04";
    
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
    await page.click('#btn-soft-delete-0'); //hacer click    

    // 3. alerta
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.getByRole('button', { name: 'No, cancel the operation' }).click(); 

    // 4. Verificar que el nombre ya este en la lista
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    await expect(page.locator(`text=${courseId}`)).toHaveCount(1);   
});