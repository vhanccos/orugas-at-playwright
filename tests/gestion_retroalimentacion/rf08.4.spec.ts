import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf08.4";
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


test.only('rf08.4-01 (Visualizar correctamente todas las sesiones de un curso activo) [EP(Valida)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.4-01";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);     
});
test.only('rf08.4-02 (Acceso desde usuario sin permisos) [EP(Invalida)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.4-02";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/student/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toHaveCount(0);       
});
test.only('rf08.4-03 (Ordenar cursos por ID alfabéticamente e inversamente) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.4-03";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

    // 2. Filtro 
    await page.getByRole('button', { name: 'Course ID' }).click(); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
});
test.only('rf08.4-04 (Ordenar cursos por nombre alfabéticamente e inversamente) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.4-04";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

    // 2. Filtro 
    await page.getByRole('button', { name: 'Session Name' }).click(); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
});
test.only('rf08.4-05 (Ver lista vacía cuando no hay sesiones creadas) [Casos de Uso]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.4-05";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(2500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});