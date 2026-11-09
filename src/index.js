const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

async function run() {
    try {
        // 1. Obtener la ruta de la carpeta que introdujo el usuario (por defecto la raíz '.')
        const buildFolder = core.getInput('build-folder') || '.';

        // Calcular la ruta absoluta en el contenedor de GitHub Actions
        const fullPath = path.resolve(process.env.GITHUB_WORKSPACE, buildFolder);
        const indexPath = path.join(fullPath, 'index.html');

        core.info(`Verificando la existencia de index.html en: ${fullPath}`);

        // 2. Comprobar si el archivo index.html existe
        if (!fs.existsSync(indexPath)) {
            // Detener el flujo si no se encuentra el archivo obligatorio de GitHub Pages
            throw new Error(`¡Falta el archivo index.html obligatorio en la ruta: ${buildFolder}! Tu sitio dará un error 404.`);
        }

        core.info('✅ ¡Archivo index.html encontrado con éxito!');

        // 3. Generar una salida de ejemplo (la hora en que se validó)
        const validationTime = new Date().toISOString();
        core.setOutput('validated-at', validationTime);

    } catch (error) {
        // 4. Reportar el fallo directamente a la interfaz de GitHub Actions
        core.setFailed(`Error en la validación: ${error.message}`);
    }
}

run();
