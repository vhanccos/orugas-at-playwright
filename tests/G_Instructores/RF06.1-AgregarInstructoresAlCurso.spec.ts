import { test, expect } from "@playwright/test";
import { isAuthValid } from "../../scripts/checkAuth.js";
import { CargaCompleta } from "../../utils/Carga_completa.ts";
import { Guardar_imagen } from "../../utils/Guardar_imagen.ts";
import path from "path";

const storagePath = path.resolve("auth/storageState.json");
const urlBase = "https://teammates-orugas.appspot.com/";
const nombre = "rf06.1";
const carpetaBase = path.join("capturas", "gestion_instructores", nombre);

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
test.only("rf06.1-01 (Agregar correctamente un instructor existente al curso) [EP(valida)]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "Juan Rojas",
    email: "juan.rojas@unsa.edu.pe",
    institution: "UNSA",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf06.1-01";
  const courseId = "C-RF6.1";
  const courseName = "C-RF6.1";

  // 1. Ir a la página de inicio del instructor
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Comprobar si el curso existe, si no crearlo
  await page.goto(urlBase + "web/instructor/courses");
  await CargaCompleta(page);

  const existeCurso = await page
    .locator("#active-courses-table")
    .getByText(courseId)
    .count();
  if (existeCurso === 0) {
    await page.getByRole("button", { name: "+ Add New Course" }).click();
    await page.getByRole("textbox", { name: "Course ID:" }).fill(courseId);
    await page.getByRole("textbox", { name: "Course Name:" }).fill(courseName);
    await page.getByRole("button", { name: "Add Course" }).click();
    await CargaCompleta(page);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
  }

  // 3. Ingresar a la vista de detalles del curso
  await page.goto(urlBase + "web/instructor/courses/edit?courseid=" + courseId);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 4. Agregar el instructor desde la sección de detalles del curso
  await page.getByRole("button", { name: "Add New Instructor" }).click();
  await page.locator("#name-instructor-2").fill(datos_entrada.name);
  await page.locator("#name-instructor-2").press("Tab");
  await page.locator("#email-instructor-2").fill(datos_entrada.email);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page.getByRole("button", { name: "Add Instructor" }).click();
  await expect(page.getByRole("alert")).toContainText(
    `The instructor ${datos_entrada.name} has been added successfully. An email containing how to 'join' this course will be sent to ${datos_entrada.email} in a few minutes.`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar que el instructor se ha agregado correctamente en la tabla
  await expect(page.locator("#name-instructor-2")).toHaveValue(
    datos_entrada.name,
  );
  await expect(page.locator("#email-instructor-2")).toHaveValue(
    datos_entrada.email,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 6. Eliminar el instructor para limpieza
  await page.locator("#btn-delete-instructor-2").click();
  await page.getByRole("button", { name: "Yes" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Instructor is successfully deleted.",
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});
