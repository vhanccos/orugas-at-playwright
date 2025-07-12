import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf08.6";
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

// Empezar los tests
test.only('rf08.6-01 (Visualizar lista de sesiones eliminadas desde la interfaz correspondiente) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.6-01";

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
    await page.keyboard.press('End'); //Bajar hasta abajo
    await esperaTiempo(2000);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

});

test.only('rf08.6-02 (Usuario sin permisos intenta acceder a sesiones eliminadas) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.6-02";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/student/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toHaveCount(0);    
});
test.only('rf08.6-03 (Consultar detalles de una sesión eliminada) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.6-03";
    
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
    await page.keyboard.press('End'); //Bajar hasta abajo
    await esperaTiempo(2000);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});
test.only('rf08.6-04 (Acceder a la lista cuando no hay sesiones eliminadas) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.6-04";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click

    // 3. Resultados
    await page.keyboard.press('End'); //Bajar hasta abajo
    await esperaTiempo(2000);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);  
});
