import { test, expect } from "@playwright/test";
import { isAuthValid } from "../../scripts/checkAuth.js";
import { CargaCompleta } from "../../utils/Carga_completa.ts";
import { Guardar_imagen } from "../../utils/Guardar_imagen.ts";
import path from "path";

const storagePath = path.resolve("auth/storageState.json");
const urlBase = "https://teammates-orugas.appspot.com/";
const nombre = "rf07.2";
const carpetaBase = path.join("capturas", "gestion_estudiantes", nombre);

test.beforeAll(() => {
  if (!isAuthValid(storagePath)) {
    throw new Error(
      "❌ La sesión de Google ha expirado o no existe. " +
        "Ejecuta `node scripts/saveAuth.js` para regenerar auth/storageState.json",
    );
  }
});

test.use({
  storageState: storagePath,
});

// Empezar los tests
test.only("rf07.2-01 (Visualizar detalles completos de un estudiante con todos los datos registrados) [CU]", async ({
  page,
}) => {
  const datos_entrada = {
    section: "A1",
    team: "T1",
    name: "Juan Perez",
    email: "juan@unsa.edu.pe",
    comment: "observador",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf07.2-01";

  // 1. Cargar la pagina inicial
  await page.goto(urlBase + "web/instructor/home"); //url inicial
  await CargaCompleta(page); // Esperar carga

  // 2. Ir a detalles del curso y eliminar si ya existe
  await page.goto(urlBase + "web/instructor/courses/details?courseid=C001");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
  await eliminarEstudianteSiExiste(
    page,
    datos_entrada.email,
    carpetaBase,
    contador,
    casosPrueba,
  );

  // 3. Ir al formulario de inscripción
  await page.goto(urlBase + "web/instructor/courses/enroll?courseid=C001");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 4. Llenar el formulario de inscripción
  await page.locator("#newStudentsHOT td").first().dblclick();
  await page.locator("textarea").fill(datos_entrada.section);

  await page.locator("td:nth-child(3)").first().dblclick();
  await page.locator("textarea").fill(datos_entrada.team);

  await page.locator("td:nth-child(4)").first().dblclick();
  await page.locator("textarea").fill(datos_entrada.name);

  await page.locator("td:nth-child(5)").first().dblclick();
  await page.locator("textarea").fill(datos_entrada.email);

  await page.locator("td:nth-child(6)").first().dblclick();
  await page.locator("textarea").fill(datos_entrada.comment);

  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Enviar el formulario
  await page.getByRole("button", { name: "Enroll students" }).click();
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 6. Validar la respuesta
  await expect(page.getByRole("alert")).toContainText(
    "Enrollment successful. Summary given below.",
    { timeout: 10000 },
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba); // Captura tras alerta

  await expect(page.locator("#results-panel")).toContainText(
    `1 student(s) added: SectionTeamStudent NameE-mail addressComments${datos_entrada.section}${datos_entrada.team}${datos_entrada.name}${datos_entrada.email}${datos_entrada.comment}`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba); // Captura tras ver resultados
});
