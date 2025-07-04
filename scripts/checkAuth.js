const fs = require('fs');


/**
 * Verifica si la sesión guardada en storageState.json ha expirado.
 * @param {string} storagePath Ruta al archivo de sesión.
 * @returns {boolean} true si se puede usar, false si se vencio o no hay el archivo.
 */
function isAuthValid(storagePath = 'auth/storageState.json') {
    if (!fs.existsSync(storagePath)) {
        console.warn('storageState.json no encontrado.');
        return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const storage = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
    const googleCookies = storage.cookies.filter(c =>
        c.domain.includes('google') && typeof c.expires === 'number'
    );
    // verificar si esta vencida
    for (const cookie of googleCookies) {
        if (cookie.expires > 0 && cookie.expires < now) {
            console.warn(`Cookie expirada: ${cookie.name}`);
            return false;
        }
    }

    return true;
}

module.exports = { isAuthValid };
if (require.main === module) {
    const valid = isAuthValid();
    if (valid) {
        console.log('✅ La sesion de Google es valida');
        process.exit(0);
    } else {
        console.log('🔴 La sesion de Google es invalida');
        process.exit(0);
    }
}