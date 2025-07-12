import { test, expect } from "@playwright/test";
import { isAuthValid } from "../../scripts/checkAuth.js";
import { CargaCompleta } from "../../utils/Carga_completa.ts";
import { Guardar_imagen } from "../../utils/Guardar_imagen.ts";
import path from "path";

const storagePath = path.resolve("auth/storageState.json");
const urlBase = "https://teammates-orugas.appspot.com/";
const nombre = "rf07.6";
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
test.only("rf07.6-01 (Búsqueda por nombre completo existente) [EP (valida))]", async ({
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
  const casosPrueba = "rf07.6-01";
  const courseId = "C-RF7.6";
  const courseName = "C-RF7.6";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Verificar si el curso "C-RF7.6" existe, si no, crearlo
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

  // 4. Buscar estudiante
  await page.goto(urlBase + "web/instructor/search");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page.getByRole("textbox", { name: "Your search keyword" }).click();
  await page
    .getByRole("textbox", { name: "Your search keyword" })
    .fill('"Juan Perez"');
  await page
    .getByRole("textbox", { name: "Your search keyword" })
    .press("Enter");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await expect(page.locator("tm-student-result-table")).toContainText(
    "[C-RF7.3]SectionTeamStudent NameStatusEmailAction(s)A1T1Juan PerezYet to Joinjuan@unsa.edu.pe View Edit Send Invite Delete All Records",
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf07.6-02 (Buscar estudiante con nombre inexistente) [EP (invalida))]", async ({
  page,
}) => {
  const datos_entrada = {
    nombre_inexistente: "nombre inexistente",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf07.6-02";
  const courseId = "C-RF7.6";
  const courseName = "C-RF7.6";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Buscar estudiante inexistente
  await page.goto(urlBase + "web/instructor/search");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page.getByRole("textbox", { name: "Your search keyword" }).click();
  await page
    .getByRole("textbox", { name: "Your search keyword" })
    .fill(datos_entrada.nombre_inexistente);
  await page
    .getByRole("textbox", { name: "Your search keyword" })
    .press("Enter");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await expect(page.getByRole("alert")).toContainText("No results found.");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf07.6-03 (Búsqueda por correo electrónico) [EP (valida))]", async ({
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
  const casosPrueba = "rf07.6-03";
  const courseId = "C-RF7.6";
  const courseName = "C-RF7.6";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Verificar si el curso "C-RF7.6" existe, si no, crearlo
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

  // 4. Buscar estudiante por correo
  await page.goto(urlBase + "web/instructor/search");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page.getByRole("textbox", { name: "Your search keyword" }).click();
  await page
    .getByRole("textbox", { name: "Your search keyword" })
    .fill("Búsqueda por nombre completo existente");
  await page
    .getByRole("textbox", { name: "Your search keyword" })
    .press("Enter");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await expect(page.locator("tm-student-result-table")).toContainText(
    "[C-RF7.3]SectionTeamStudent NameStatusEmailAction(s)A1T1Juan PerezYet to Joinjuan@unsa.edu.pe View Edit Send Invite Delete All Records",
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf07.6-04 (Búsqueda con cadena extensa (100+ caracteres)) [BVA (invalida))]", async ({
  page,
}) => {
  let j101: string = "";
  for (let i = 0; i < 101; i++) {
    j101 += "j";
  }
  const cadena_extensa = j101;

  const contador = { valor: 0 };
  const casosPrueba = "rf07.6-04";
  const courseId = "C-RF7.6";
  const courseName = "C-RF7.6";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Buscar estudiante inexistente
  await page.goto(urlBase + "web/instructor/search");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page.getByRole("textbox", { name: "Your search keyword" }).click();
  await page
    .getByRole("textbox", { name: "Your search keyword" })
    .fill(cadena_extensa);
  await page
    .getByRole("textbox", { name: "Your search keyword" })
    .press("Enter");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await expect(page.locator("tm-instructor-search-bar")).toContainText(
    "0 characters left",
  );
  await expect(page.getByRole("alert")).toContainText("No results found.");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf07.6-05 (Búsqueda parcial por nombre (subcadena)) [EP (valida))]", async ({
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
  const casosPrueba = "rf07.6-05";
  const courseId = "C-RF7.6";
  const courseName = "C-RF7.6";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Verificar si el curso "C-RF7.6" existe, si no, crearlo
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

  // 4. Buscar estudiante
  await page.goto(urlBase + "web/instructor/search");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page.getByRole("textbox", { name: "Your search keyword" }).click();
  await page.getByRole("textbox", { name: "Your search keyword" }).fill("Juan");
  await page
    .getByRole("textbox", { name: "Your search keyword" })
    .press("Enter");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await expect(page.locator("tm-student-result-table")).toContainText(
    "[C-RF7.3]SectionTeamStudent NameStatusEmailAction(s)A1T1Juan PerezYet to Joinjuan@unsa.edu.pe View Edit Send Invite Delete All Records",
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});
