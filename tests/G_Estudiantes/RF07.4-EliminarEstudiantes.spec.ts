import { test, expect } from "@playwright/test";
import { isAuthValid } from "../../scripts/checkAuth.js";
import { CargaCompleta } from "../../utils/Carga_completa.ts";
import { Guardar_imagen } from "../../utils/Guardar_imagen.ts";
import path from "path";

const storagePath = path.resolve("auth/storageState.json");
const urlBase = "https://teammates-orugas.appspot.com/";
const nombre = "rf07.4";
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

test.only("rf07.4-01 (Eliminar exitosamente un estudiante inscrito) [CU]", async ({
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
  const casosPrueba = "rf07.4-01";
  const courseId = "C001";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);

  // 2. Ir a detalles del curso
  await page.goto(
    `${urlBase}web/instructor/courses/details?courseid=${courseId}`,
  );
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Verificar si el estudiante está inscrito, si no lo está, inscribirlo
  let encontrado = false;
  const filas = await page.locator("table tbody tr").count();

  for (let i = 0; i < filas; i++) {
    const email = await page
      .locator(`table tbody tr:nth-child(${i + 1}) td:nth-child(5)`)
      .innerText();

    if (email.trim() === datos_entrada.email) {
      encontrado = true;
      break;
    }
  }

  if (!encontrado) {
    // Ir al formulario de inscripción
    await page.goto(
      `${urlBase}web/instructor/courses/enroll?courseid=${courseId}`,
    );
    await CargaCompleta(page);

    // Llenar el formulario
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

    // Enviar
    await page.getByRole("button", { name: "Enroll students" }).click();
    await expect(page.getByRole("alert")).toContainText(
      "Enrollment successful. Summary given below.",
      { timeout: 10000 },
    );

    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

    // Volver a la tabla de detalles
    await page.goto(
      `${urlBase}web/instructor/courses/details?courseid=${courseId}`,
    );
    await CargaCompleta(page);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
  }

  // 4. Eliminar al estudiante
  const filasFinal = await page.locator("table tbody tr").count();
  for (let i = 0; i < filasFinal; i++) {
    const email = await page
      .locator(`table tbody tr:nth-child(${i + 1}) td:nth-child(5)`)
      .innerText();

    if (email.trim() === datos_entrada.email) {
      await Guardar_imagen(page, carpetaBase, contador, casosPrueba); // Antes de eliminar
      await page.locator(`#btn-delete-${courseId}-${i}`).click();
      await page.getByRole("button", { name: "Yes" }).click();

      await expect(page.getByRole("alert")).toContainText(
        `Student is successfully deleted from course "${courseId}"`,
        { timeout: 10000 },
      );

      await Guardar_imagen(page, carpetaBase, contador, casosPrueba); // Después de eliminar
      break;
    }
  }
});

test.only("rf07.4-02 (Cancelar la eliminación de un estudiante) [CU]", async ({
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
  const casosPrueba = "rf07.4-02";
  const courseId = "C001";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);

  // 2. Ir a detalles del curso
  await page.goto(
    `${urlBase}web/instructor/courses/details?courseid=${courseId}`,
  );
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Verificar si el estudiante está inscrito, si no lo está, inscribirlo
  let encontrado = false;
  const filas = await page.locator("table tbody tr").count();

  for (let i = 0; i < filas; i++) {
    const email = await page
      .locator(`table tbody tr:nth-child(${i + 1}) td:nth-child(5)`)
      .innerText();

    if (email.trim() === datos_entrada.email) {
      encontrado = true;
      break;
    }
  }

  if (!encontrado) {
    // Ir al formulario de inscripción
    await page.goto(
      `${urlBase}web/instructor/courses/enroll?courseid=${courseId}`,
    );
    await CargaCompleta(page);

    // Llenar el formulario
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

    // Enviar
    await page.getByRole("button", { name: "Enroll students" }).click();
    await expect(page.getByRole("alert")).toContainText(
      "Enrollment successful. Summary given below.",
      { timeout: 10000 },
    );

    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

    // Volver a la tabla de detalles
    await page.goto(
      `${urlBase}web/instructor/courses/details?courseid=${courseId}`,
    );
    await CargaCompleta(page);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
  }

  // 4. Eliminar al estudiante
  const filasFinal = await page.locator("table tbody tr").count();
  for (let i = 0; i < filasFinal; i++) {
    const email = await page
      .locator(`table tbody tr:nth-child(${i + 1}) td:nth-child(5)`)
      .innerText();

    if (email.trim() === datos_entrada.email) {
      await Guardar_imagen(page, carpetaBase, contador, casosPrueba); // Antes de eliminar
      await page.locator(`#btn-delete-${courseId}-${i}`).click();
      await page
        .getByRole("button", { name: "No, cancel the operation" })
        .click();

      await expect(page.locator("tbody")).toContainText(
        "A1T1Juan PerezYet to Joinjuan@unsa.edu.pe",
      );

      await Guardar_imagen(page, carpetaBase, contador, casosPrueba); // Después de eliminar
      break;
    }
  }
});
