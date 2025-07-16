import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf08.1";
const carpetaBase = path.join("capturas","gestion_retroalimentacion",nombre);
const unico = "003";


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

test.only('rf08.1-01 (Crear sesión desde cero con todos los campos válidos) [EP(Valido)]', async ({ page }) => {
    const datos_entrada = {name: "Evaluación Parcial"+unico}; //que no repita el id
    const contador = { valor: 0 };
    const casosPrueba = "rf08.1-01";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.getByRole('button', { name: 'Add New Feedback Session' }).click(); //hacer click    
    
    // 3. Rellenar input
    await page.fill('input[id="add-session-name"]', datos_entrada.name);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

    // 4. Resultado 
    const button = page.locator('button#btn-create-session');
    await expect(button).toBeEnabled();
    await button.click();

    // 5. Respuesta 
    await esperaTiempo(2000);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been added');   
});
test.only('rf08.1-02 (Intentar crear sesión sin nombre (flujo alternativo)) [EP(Invalido)]', async ({ page }) => {
    const contador = { valor: 0 };
    const datos_entrada = {name: "hola"}; //que no repita el id
    const casosPrueba = "rf08.1-02";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.getByRole('button', { name: 'Add New Feedback Session' }).click(); //hacer click    

    // 3. Resultado 
    await page.fill('input[id="add-session-name"]', datos_entrada.name);
    await page.fill('input[id="add-session-name"]', '');
    const button = page.locator('button#btn-create-session');
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeDisabled();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
});


test.only('rf08.1-03 (Crear sesión desde plantilla sin modificar fechas) [Transición de Estados]', async ({ page }) =>{
    const datos_entrada = {name: "Evaluación Parcial (copia)"+unico}; //que no repita el id
    const contador = { valor: 0 };
    const casosPrueba = "rf08.1-03";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.getByRole('button', { name: 'Add New Feedback Session' }).click(); //hacer click    
    
    // 3. Copiar la pagina
    const button = page.locator('button#btn-copy-session');
    await expect(button).toBeEnabled();
    await button.click();

    // 4. Rellenar input
    await page.fill('input[id="copy-session-name"]', datos_entrada.name);
    await page.locator('tr').filter({ hasText: 'jcuadrosam.uns-demo' }).filter({ hasText: 'Session with different question types' }).locator('input[type="radio"]').check();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    
    // 5. Copiar
    const button2 = page.locator('button#btn-confirm-copy');
    await expect(button2).toBeEnabled();
    await button2.click();
    await page.getByRole('button', { name: 'OK' }).click(); //ok
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only('rf08.1-04 (Crear sesión como privada con visibilidad oculta y envío automático activo) [Transición de Estados]', async ({ page }) =>{
    const datos_entrada = {name: "Eval Parcial"+unico}; //que no repita el id
    const contador = { valor: 0 };
    const casosPrueba = "rf08.1-04";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.getByRole('button', { name: 'Add New Feedback Session' }).click(); //hacer click    
    
    // 3. Rellenar input
    await page.fill('input[id="add-session-name"]', datos_entrada.name);
    await page.locator('#btn-change-visibility').click();
    await page.locator('#btn-change-email').click();
    
    // 4. camabiar visibilidad 
    await esperaTiempo(2000);
    await page.locator('#email-published').uncheck();
    await page.locator('#email-closing').uncheck();
    const button = page.locator('button#btn-create-session');
    await expect(button).toBeEnabled();
    await button.click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

    // 5. Respuesta 
    await esperaTiempo(2000);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been added'); 
});
test.only('rf08.1-05 (Copiar sesión anterior y modificar solo nombre y fechas) [Transición de Estados]', async ({ page }) =>{
    const datos_entrada = {name: "Eval Parcial (copia) "+unico}; //que no repita el id
    const contador = { valor: 0 };
    const casosPrueba = "rf08.1-05";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.getByRole('button', { name: 'Add New Feedback Session' }).click(); //hacer click    
    
    // 3. Copiar la pagina
    const button = page.locator('button#btn-copy-session');
    await expect(button).toBeEnabled();
    await button.click();

    // 4. Rellenar input
    await page.fill('input[id="copy-session-name"]', datos_entrada.name);
    await page.locator('input[name="copySessionFrom"]').first().check();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    
    // 5. Copiar
    const button2 = page.locator('button#btn-confirm-copy');
    await expect(button2).toBeEnabled();
    await button2.click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});