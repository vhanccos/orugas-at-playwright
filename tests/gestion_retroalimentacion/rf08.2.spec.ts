import { test, expect } from '@playwright/test';
import { isAuthValid } from '../../scripts/checkAuth.js';
import { CargaCompleta } from '../../utils/Carga_completa.ts';
import { Guardar_imagen } from '../../utils/Guardar_imagen.ts';
import { esperaTiempo } from '../../utils/esperaTiempo.ts';
import path from 'path';

const storagePath = path.resolve('auth/storageState.json');
const urlBase = 'https://teammates-orugas.appspot.com/';
const nombre = "rf08.2";
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

test.only('rf08.2-01 (Agregar una pregunta de texto abierto con todos los campos válidos) [EP(Valido)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.2-01";
    const datos_entrada = {name: "Pregunta abierta 1(1)"};

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
    
    //3. editar el primero
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await CargaCompleta(page);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

    // 4. Agregar nueva pregunta
    const button = page.locator('button#btn-new-question');
    await expect(button).toBeEnabled();
    await button.click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.locator('button.dropdown-item:has-text("Essay question")').waitFor({ state: 'visible' });
    await page.locator('button.dropdown-item:has-text("Essay question")').click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);  

    // 5. Pregunta
    await page.locator('#question-brief').last().fill(datos_entrada.name);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);  

    // 6. aceptar 
    await page.locator('button:has(span#btn-save-new)').click();
    await esperaTiempo(2000);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been added');      
});
test.only('rf08.2-02 (Intentar guardar pregunta sin texto (texto vacío)) [EP(Invalido)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.2-02";
    const datos_entrada = {name: ""};

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
    
    //3. editar el primero
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await CargaCompleta(page);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

    // 4. Agregar nueva pregunta
    const button = page.locator('button#btn-new-question');
    await expect(button).toBeEnabled();
    await button.click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.locator('button.dropdown-item:has-text("Essay question")').waitFor({ state: 'visible' });
    await page.locator('button.dropdown-item:has-text("Essay question")').click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);  

    // 5. Pregunta
    await page.locator('#question-brief').last().fill(datos_entrada.name);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);  

    // 6. aceptar 
    await page.locator('button:has(span#btn-save-new)').click();
    await esperaTiempo(2000);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).not.toContain('has been added');   
});
test.only('rf08.2-03 (Agregar una pregunta de opción múltiple (MCQ) con 4 opciones válidas) [EP(Valido)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.2-03";
    const datos_entrada = {name: "Estas es una pregunta",opciones:["opcion 1", "opcion 2", "opcion 3", "opcion 4"]};

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
    
    //3. editar el primero
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await CargaCompleta(page);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

    // 4. Agregar nueva pregunta
    const button = page.locator('button#btn-new-question');
    await expect(button).toBeEnabled();
    await button.click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.locator('button.dropdown-item:has-text("Multiple-choice (single answer) question")').waitFor({ state: 'visible' });
    await page.locator('button.dropdown-item:has-text("Multiple-choice (single answer) question")').click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);  

    // 5. Llenar la pregunta
    await page.locator('#question-brief').last().fill(datos_entrada.name);
    for (let i = 0; i < datos_entrada.opciones.length; i++) {
        if (i >= 2) {
            await page.locator('button#btn-add-option').last().click();
            await page.locator('input[aria-label="Option"]').nth(i).waitFor({ timeout: 3000 });
        }
        const opcion = datos_entrada.opciones[i];
        const enabledInput = page.locator('input[aria-label="Option"]:not([disabled])').nth(i);
        await enabledInput.waitFor({ timeout: 5000 });
        await enabledInput.fill(opcion);
    }
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);  

    // 6. aceptar 
    await page.locator('button:has(span#btn-save-new)').click();
    await esperaTiempo(2000);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been added');  
});
test.only('rf08.2-04 (Probar creación de MCQ con solo una opción (inválido)) [EP(Invalido)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.2-04";
    const datos_entrada = {name: "Estas es una pregunta solo tiene una opcion",opciones:["opcion 1"]};

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
    
    //3. editar el primero
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await CargaCompleta(page);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

    // 4. Agregar nueva pregunta
    const button = page.locator('button#btn-new-question');
    await expect(button).toBeEnabled();
    await button.click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.locator('button.dropdown-item:has-text("Multiple-choice (single answer) question")').waitFor({ state: 'visible' });
    await page.locator('button.dropdown-item:has-text("Multiple-choice (single answer) question")').click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);  

    // 5. Llenar la pregunta
    await page.locator('#question-brief').last().fill(datos_entrada.name);
    for (let i = 0; i < datos_entrada.opciones.length; i++) {
        if (i >= 2) {
            await page.locator('button#btn-add-option').last().click();
            await page.locator('input[aria-label="Option"]').nth(i).waitFor({ timeout: 3000 });
        }
        const opcion = datos_entrada.opciones[i];
        const enabledInput = page.locator('input[aria-label="Option"]:not([disabled])').nth(i);
        await enabledInput.waitFor({ timeout: 5000 });
        await enabledInput.fill(opcion);
    }
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);  

    // 6. aceptar 
    await page.locator('button:has(span#btn-save-new)').click();
    await esperaTiempo(2000);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).not.toContain('has been added');      
});
test.only('rf08.2-05 (Agregar una pregunta tipo Escala con rango válido de 1 a 5) [EP(Valido)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.2-05";
    const datos_entrada = {name: "Estas es una pregunta", min:"0", max:"5"};

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
    
    //3. editar el primero
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await CargaCompleta(page);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

    // 4. Agregar nueva pregunta
    const button = page.locator('button#btn-new-question');
    await expect(button).toBeEnabled();
    await button.click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.locator('button.dropdown-item:has-text("Numerical-scale question")').waitFor({ state: 'visible' });
    await page.locator('button.dropdown-item:has-text("Numerical-scale question")').click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);  

    // 5. Llenar la pregunta
    await page.locator('#question-brief').last().fill(datos_entrada.name);
    await page.locator('#min-value').last().fill(datos_entrada.min);
    await page.locator('#max-value').last().fill(datos_entrada.max);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

    // 6. aceptar 
    await page.locator('button:has(span#btn-save-new)').click();
    await esperaTiempo(2000);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('has been added');
});
test.only('rf08.2-06 (Crear pregunta tipo Escala con rango inválido (mínimo 6, máximo 5)) [EP(Invalido)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.2-06";
    const datos_entrada = {name: "Estas es una pregunta", min:"6", max:"5"};

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
    
    //3. editar el primero
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await CargaCompleta(page);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

    // 4. Agregar nueva pregunta
    const button = page.locator('button#btn-new-question');
    await expect(button).toBeEnabled();
    await button.click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await page.locator('button.dropdown-item:has-text("Numerical-scale question")').waitFor({ state: 'visible' });
    await page.locator('button.dropdown-item:has-text("Numerical-scale question")').click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);  

    // 5. Llenar la pregunta
    await page.locator('#question-brief').last().fill(datos_entrada.name);
    await page.locator('#min-value').last().fill(datos_entrada.min);
    await page.locator('#max-value').last().fill(datos_entrada.max);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

    // 6. aceptar 
    await page.locator('button:has(span#btn-save-new)').click();
    await esperaTiempo(2000);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).not.toContain('has been added');
});
test.only('rf08.2-07 (Copiar una pregunta desde una sesión anterior) [EP(Valido)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.2-07";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
    
    //3. editar el primero
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await CargaCompleta(page);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

    // 4. Copiar pregunta
    const button = page.locator('button#btn-copy-question');
    await expect(button).toBeEnabled();
    await button.click();
    await page.locator('.feedback-session-tabs button[aria-label="Expand panel"]').first().click();
    await page.locator('tbody tr input[type="checkbox"]:not([disabled])').first().click();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 

    // 5. aceptar 
    await page.locator('#btn-confirm-copy-question').click();
    await esperaTiempo(2000);
    const mensaje = await page.locator('div.toast-body').innerText();
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
    expect(mensaje).toContain('have been added');
});
test.only('rf08.2-08 (Intentar copiar una pregunta desde sesión anterior sin seleccionar ninguna) [EP(Invalido)]', async ({ page }) => {
    const contador = { valor: 0 };
    const casosPrueba = "rf08.2-08";

    // 1. Cargar la pagina inicial
    await page.goto(urlBase + 'web/instructor/home'); //url inicial
    await CargaCompleta(page); // Esperar carga 
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba); 
    await expect(page.locator('a', { hasText: 'Sessions' })).toBeVisible(); 

    // 2. Carga sessions
    await page.click('text=Sessions'); //hacer click    
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   
    
    //3. editar el primero
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await CargaCompleta(page);
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);   

    // 4. Copiar pregunta
    const button = page.locator('button#btn-copy-question');
    await expect(button).toBeEnabled();
    await button.click();

    // 5. intentar copiar
    const button2 = page.locator('#btn-confirm-copy-question');
    await expect(button2).toBeVisible();
    await expect(button2).toBeDisabled();
    await esperaTiempo(1500);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);     
});


