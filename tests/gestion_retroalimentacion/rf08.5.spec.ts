import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf08.5";
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

test.only('rf08.5-01 (Eliminación exitosa de una sesión no publicada con confirmación) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.5-01";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('.btn.btn-light.btn-sm.btn-soft-delete-0');

    // 3. Resultados
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.getByRole('button', { name: 'Yes' }).click();     

    // 4. Respuesta 
    await esperaTiempo(1500);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been deleted');         
});
test.only('rf08.5-02 (Cancelación de eliminación por el usuario) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.5-02";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('.btn.btn-light.btn-sm.btn-soft-delete-0');

    // 3. Resultados
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.getByRole('button', { name: 'No, cancel the operation' }).click(); 
    
    // 4. Respuesta 
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
});
test.only('rf08.5-03 (Eliminación lógica vs física según configuración) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.5-03";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
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
test.only('rf08.5-04 (Eliminación de sesión con estudiantes ya habiendo respondido) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.5-04";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click
    const expandBtn = page.locator('#deleted-sessions-heading button.chevron');
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();

    // 3. Resultados
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    const fila = page.locator('tr', {
        has: page.locator('a.show-response-rate-0')
    });  
    await fila.locator('a.show-response-rate-0').click();
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
test.only('rf08.5-05 (Eliminación fallida por sesión inexistente o ya eliminada) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.5-05";
    const page2 = await page.context().newPage();

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await page2.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await CargaCompleta(page2); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 
    await expect(page2.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await page2.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.click('.btn.btn-light.btn-sm.btn-soft-delete-0');
    await page2.click('.btn.btn-light.btn-sm.btn-soft-delete-0');

    // 3. Eliminacion
    await esperaTiempo(1500);
    await page.getByRole('button', { name: 'Yes' }).click();  
    await esperaTiempo(1500);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been deleted'); 

    // 4. Eliminacion fallida 
    await esperaTiempo(1500);
    await page2.getByRole('button', { name: 'Yes' }).click();  
    await esperaTiempo(1500);
    const mensaje2 = await page2.locator('div.toast-body').innerText();
    await Guardar_imagen(page2, carpetaBase, contador, casosPrueba);
    expect(mensaje2).not.toContain('has been deleted');  

});

