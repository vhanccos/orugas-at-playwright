## Recomendaciones
Para logearse y guardar usa `node scripts/saveAuth.js` (desde la ruta base)
Para validar el logeo manualmente `node scripts/checkAuth.js` (desde la ruta base)

Usa `npx playwright test --project="chromium"`
Para ver reporte `npx playwright show-report` 


# para testear 
- Testeo Universal: **npx playwright test**
- Testeo a un solo test: **npx playwright test Ejemplo_titulo.spec.ts** (OJO usar con terminaciones **spec.ts**)
- Parametros Usa: npx playwright test [options] [test-filter...]:
1. `--project=<browser>`, donde browser = ["chromium","firefox","webkit","all"], se puede habilitar mas en playwright.config.ts

- Parametros no usados 
2. `--headed`, para ver la interfaz grafica
3. `--workers=<workers>`,  define cuantas pruebas se pueden ejecutar en paralelo al mismo tiempo.
4. `--reporter <reporter>`,  Como guardar el reporte "list", "line", "dot", "json", "junit","null", "github", "html", "blob" (default: "list")
5. `--output <dir>`, Carpeta de salida (default: "test-results")
6. `--debug`, modo depuracion 

7. `--ui` Run tests in interactive UI mode
8. `--ui-host <host>` Host to serve UI on; specifying this option opens UI in a browser tab
9. `--ui-port <port>` Port to serve UI on, 0 for any free port; specifying this option opens UI in a browser tab



