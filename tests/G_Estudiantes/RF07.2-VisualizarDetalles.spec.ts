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
  const courseId = "C-RF7.2";
  const courseName = "C-RF7.2";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Verificar si el curso "C-RF7.2" existe, si no, crearlo
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

  // 3. Verificar si el curso tiene estudiantes, si no, inscribir uno
  await page.goto(
    urlBase + "web/instructor/courses/details?courseid=" + courseId,
  );
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  const sinEstudiantes =
    (await page.locator("text=Total students: 0").count()) > 0;
  if (sinEstudiantes) {
    await page.goto(
      urlBase + "web/instructor/courses/enroll?courseid=" + courseId,
    );
    await CargaCompleta(page);

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

    await page.getByRole("button", { name: "Enroll students" }).click();
    await expect(page.getByRole("alert")).toContainText(
      "Enrollment successful",
      { timeout: 10000 },
    );

    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

    await page.goto(
      urlBase + "web/instructor/courses/details?courseid=" + courseId,
    );
    await CargaCompleta(page);
    await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
  }

  // 4. Visualizar los detalles del estudiante (se abre en una nueva pestaña)
  const [page1] = await Promise.all([
    page.context().waitForEvent("page"),
    page.getByRole("link", { name: "View" }).click(),
  ]);
  await page1.waitForLoadState("load");
  await CargaCompleta(page1);
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);

  await expect(page1.locator("#main-content")).toContainText(
    `${datos_entrada.name}Enrollment DetailsCourse${courseId}Section Name${datos_entrada.section}Team Name${datos_entrada.team}Official Email${datos_entrada.email}Comments${datos_entrada.comment}`,
  );
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);
});

test.only("rf07.2-02 (Intentar visualizar detalles en curso sin estudiantes) [CU]", async ({
  page,
}) => {
  const contador = { valor: 0 };
  const casosPrueba = "rf07.2-02";
  const courseId = "C-RF7.2-02";
  const courseName = "C-RF7.2-02";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Verificar si el curso "C-RF7.2-02" existe, si no, crearlo
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

  // 3. Ir a los detalles del curso y validar que no haya estudiantes
  await page.goto(urlBase + "web/instructor/students");
  await CargaCompleta(page);
  await page.getByText("[C-RF7.2-02]: C-RF7.2-02").click();
  await expect(page.locator("h5")).toContainText(
    "There are no students in this course.",
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});
