export async function CargaCompleta(page: import('@playwright/test').Page): Promise<void> {
    try {
        await page.waitForLoadState('load');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');
    } catch (err) {
        console.error('❌ Error esperando que cargue la pagina:', err);
        throw err;
    }
}