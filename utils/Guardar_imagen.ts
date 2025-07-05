import fs from 'fs';
import path from 'path';
import { Page } from '@playwright/test';

/**
 * Guarda una captura y actualiza el contador dentro del objeto.
 * @param page Pagina actual
 * @param carpetaBase Carpeta de salida
 * @param contador Objeto con propiedad `.valor` que se incrementa internamente
 * @param nombreBase Nombre base del archivo
 */
export async function Guardar_imagen(
    page: Page,
    carpetaBase: string,
    contador: { valor: number },
    nombreBase: string
): Promise<void> {
    try {
        contador.valor += 1;

        if (!fs.existsSync(carpetaBase)) {
        fs.mkdirSync(carpetaBase, { recursive: true });
        }

        const nombreArchivo = `${nombreBase}-${String(contador.valor).padStart(2, '0')}.png`;
        const rutaCompleta = path.join(carpetaBase, nombreArchivo);

        await page.screenshot({ path: rutaCompleta });

    } catch (err) {
        console.error('❌ No se pudo guardar la captura:', err);
        throw err;
    }
}
