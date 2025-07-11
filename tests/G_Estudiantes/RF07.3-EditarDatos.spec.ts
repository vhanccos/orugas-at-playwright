import { test, expect } from "@playwright/test";
import { isAuthValid } from "../../scripts/checkAuth.js";
import { CargaCompleta } from "../../utils/Carga_completa.ts";
import { Guardar_imagen } from "../../utils/Guardar_imagen.ts";
import path from "path";

const storagePath = path.resolve("auth/storageState.json");
const urlBase = "https://teammates-orugas.appspot.com/";
const nombre = "rf07.3";
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
test.only("rf07.3-01 (Editar correo electrónico con formato válido) [EP(valida)]", async ({
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
  const casosPrueba = "rf07.3-01";
  const courseId = "C-RF7.3";
  const courseName = "C-RF7.3";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Verificar si el curso "C-RF7.3" existe, si no, crearlo
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

  // 4. Editar correo electrónico valido (se abre en una nueva pestaña)
  const nuevo_email = "nuevo_" + datos_entrada.email;

  const [page1] = await Promise.all([
    page.context().waitForEvent("page"),
    page.getByRole("link", { name: "Edit" }).click(),
  ]);
  await page1.waitForLoadState("load");
  await CargaCompleta(page1);
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);

  await page1.getByRole("textbox", { name: "E-mail Address:" }).click();
  await page1
    .getByRole("textbox", { name: "E-mail Address:" })
    .fill(nuevo_email);
  await page1.getByRole("button", { name: " Save Changes" }).click();
  await page1
    .getByRole("button", { name: "No, just save the changes" })
    .click();
  await expect(page1.getByRole("alert")).toContainText(
    "Student has been updated",
  );
  await expect(page1.locator("tbody")).toContainText(nuevo_email);
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);

  // 5. Regresar al anterior estado
  await page1.goto(
    `${urlBase}web/instructor/courses/student/edit?courseid=${courseId}&studentemail=${nuevo_email}`,
  );
  await CargaCompleta(page1);
  await page1
    .getByRole("textbox", { name: "E-mail Address:" })
    .fill(datos_entrada.email);
  await page1.getByRole("button", { name: " Save Changes" }).click();
  await page1
    .getByRole("button", { name: "No, just save the changes" })
    .click();
  await expect(page1.getByRole("alert")).toContainText(
    "Student has been updated",
  );
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);
});

test.only("rf07.3-02 (Intentar guardar con correo inválido (sin @)) [EP(invalida)]", async ({
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
  const casosPrueba = "rf07.3-02";
  const courseId = "C-RF7.3";
  const courseName = "C-RF7.3";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Verificar si el curso "C-RF7.3" existe, si no, crearlo
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

  // 4. Editar correo electrónico invalido (se abre en una nueva pestaña)
  const nuevo_email = "nuevo_email.com";

  const [page1] = await Promise.all([
    page.context().waitForEvent("page"),
    page.getByRole("link", { name: "Edit" }).click(),
  ]);
  await page1.waitForLoadState("load");
  await CargaCompleta(page1);
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);

  await page1.getByRole("textbox", { name: "E-mail Address:" }).click();
  await page1
    .getByRole("textbox", { name: "E-mail Address:" })
    .fill(nuevo_email);
  await page1.getByRole("button", { name: " Save Changes" }).click();
  await page1
    .getByRole("button", { name: "No, just save the changes" })
    .click();
  await expect(page1.getByRole("alert")).toContainText(
    `"${nuevo_email}" is not acceptable to TEAMMATES as a/an email because it is not in the correct format. An email address contains some text followed by one '@' sign followed by some more text, and should end with a top level domain address like .com. It cannot be longer than 254 characters, cannot be empty and cannot contain spaces.`,
  );
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);
});

test.only("rf07.3-03 (Editar nombre del estudiante dejándolo vacío) [EP(invalida)]", async ({
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
  const casosPrueba = "rf07.3-03";
  const courseId = "C-RF7.3";
  const courseName = "C-RF7.3";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Verificar si el curso "C-RF7.3" existe, si no, crearlo
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

  // 4. Editar nombre vacio (se abre en una nueva pestaña)
  const nuevo_nombre = " ";

  const [page1] = await Promise.all([
    page.context().waitForEvent("page"),
    page.getByRole("link", { name: "Edit" }).click(),
  ]);
  await page1.waitForLoadState("load");
  await CargaCompleta(page1);
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);

  await page1.getByRole("textbox", { name: "Student Name:" }).click();
  await page1
    .getByRole("textbox", { name: "Student Name:" })
    .fill(nuevo_nombre);
  await page1.getByRole("button", { name: " Save Changes" }).click();
  // await page1
  //   .getByRole("button", { name: "No, just save the changes" })
  //   .click();
  await expect(page1.getByRole("alert")).toContainText(
    "The field 'person name' is empty. The value of a/an person name should be no longer than 100 characters. It should not be empty.",
  );
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);
});

test.only("rf07.3-04 (Editar nombre con exactamente 1 carácter) [BVA(valida)]", async ({
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
  const casosPrueba = "rf07.3-04";
  const courseId = "C-RF7.3";
  const courseName = "C-RF7.3";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Verificar si el curso "C-RF7.3" existe, si no, crearlo
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

  // 4. Editar nombre con un caracter (se abre en una nueva pestaña)
  const nuevo_nombre = "j";

  const [page1] = await Promise.all([
    page.context().waitForEvent("page"),
    page.getByRole("link", { name: "Edit" }).click(),
  ]);
  await page1.waitForLoadState("load");
  await CargaCompleta(page1);
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);

  await page1.getByRole("textbox", { name: "Student Name:" }).click();
  await page1
    .getByRole("textbox", { name: "Student Name:" })
    .fill(nuevo_nombre);
  await page1.getByRole("button", { name: " Save Changes" }).click();
  await expect(page1.getByRole("alert")).toContainText(
    "Student has been updated",
  );
  await expect(page1.locator("tbody")).toContainText(nuevo_nombre);
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);

  // 5. Regresar al anterior estado
  await page1.goto(
    `${urlBase}web/instructor/courses/student/edit?courseid=${courseId}&studentemail=${datos_entrada.email}`,
  );
  await CargaCompleta(page1);
  await page1
    .getByRole("textbox", { name: "Student Name:" })
    .fill(datos_entrada.name);
  await page1.getByRole("button", { name: " Save Changes" }).click();
  await expect(page1.getByRole("alert")).toContainText(
    "Student has been updated",
  );
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);
});

test.only("rf07.3-05 (Editar nombre con exactamente 100 caracteres) [BVA(valida)]", async ({
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
  const casosPrueba = "rf07.3-05";
  const courseId = "C-RF7.3";
  const courseName = "C-RF7.3";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Verificar si el curso "C-RF7.3" existe, si no, crearlo
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

  // 4. Editar nombre con un caracter (se abre en una nueva pestaña)
  let j100: string = "";
  for (let i = 0; i < 100; i++) {
    j100 += "j";
  }
  const nuevo_nombre = j100;

  const [page1] = await Promise.all([
    page.context().waitForEvent("page"),
    page.getByRole("link", { name: "Edit" }).click(),
  ]);
  await page1.waitForLoadState("load");
  await CargaCompleta(page1);
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);

  await page1.getByRole("textbox", { name: "Student Name:" }).click();
  await page1
    .getByRole("textbox", { name: "Student Name:" })
    .fill(nuevo_nombre);
  await page1.getByRole("button", { name: " Save Changes" }).click();
  await expect(page1.getByRole("alert")).toContainText(
    "Student has been updated",
  );
  await expect(page1.locator("tbody")).toContainText(nuevo_nombre);
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);

  // 5. Regresar al anterior estado
  await page1.goto(
    `${urlBase}web/instructor/courses/student/edit?courseid=${courseId}&studentemail=${datos_entrada.email}`,
  );
  await CargaCompleta(page1);
  await page1
    .getByRole("textbox", { name: "Student Name:" })
    .fill(datos_entrada.name);
  await page1.getByRole("button", { name: " Save Changes" }).click();
  await expect(page1.getByRole("alert")).toContainText(
    "Student has been updated",
  );
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);
});

test.only("rf07.3-06 (Editar nombre con exactamente 101 caracteres) [BVA(invalida)]", async ({
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
  const casosPrueba = "rf07.3-06";
  const courseId = "C-RF7.3";
  const courseName = "C-RF7.3";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Verificar si el curso "C-RF7.3" existe, si no, crearlo
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

  // 4. Editar nombre con un caracter (se abre en una nueva pestaña)
  let j101: string = "";
  for (let i = 0; i < 101; i++) {
    j101 += "j";
  }
  const nuevo_nombre = j101;

  const [page1] = await Promise.all([
    page.context().waitForEvent("page"),
    page.getByRole("link", { name: "Edit" }).click(),
  ]);
  await page1.waitForLoadState("load");
  await CargaCompleta(page1);
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);

  await page1.getByRole("textbox", { name: "Student Name:" }).click();
  await page1
    .getByRole("textbox", { name: "Student Name:" })
    .fill(nuevo_nombre);
  await expect(page1.locator("#instructor-student-edit-form")).toContainText(
    "The field 'Student Name' should not exceed 100 characters.",
  );
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);
});

test.only("rf07.3-07 (Editar correo electrónico con formato válido) [EP(valida)]", async ({
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
  const casosPrueba = "rf07.3-07";
  const courseId = "C-RF7.3";
  const courseName = "C-RF7.3";

  // 1. Cargar la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Verificar si el curso "C-RF7.3" existe, si no, crearlo
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

  // 4. Editar datos validos (se abre en una nueva pestaña)
  const nuevo_nombre = "nuevo_" + datos_entrada.name;
  const nuevo_seccion = "nuevo_" + datos_entrada.section;
  const nuevo_equipo = "nuevo_" + datos_entrada.team;
  const nuevo_email = "nuevo_" + datos_entrada.email;
  const nuevo_comentario = "nuevo_" + datos_entrada.comment;

  const [page1] = await Promise.all([
    page.context().waitForEvent("page"),
    page.getByRole("link", { name: "Edit" }).click(),
  ]);
  await page1.waitForLoadState("load");
  await CargaCompleta(page1);
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);

  await page1
    .getByRole("textbox", { name: "Student Name:" })
    .fill(nuevo_nombre);
  await page1
    .getByRole("textbox", { name: "Section Name:" })
    .fill(nuevo_seccion);
  await page1.getByRole("textbox", { name: "Team Name:" }).fill(nuevo_equipo);
  await page1
    .getByRole("textbox", { name: "E-mail Address:" })
    .fill(nuevo_email);
  await page1
    .getByRole("textbox", { name: "Comments:" })
    .fill(nuevo_comentario);

  await page1.getByRole("button", { name: " Save Changes" }).click();
  await page1.getByRole("button", { name: "Yes" }).click();
  await page1
    .getByRole("button", { name: "No, just save the changes" })
    .click();

  await expect(page1.getByRole("alert")).toContainText(
    "Student has been updated",
  );
  await expect(page1.locator("tbody")).toContainText(nuevo_email);
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);

  // 5. Regresar al anterior estado
  await page1.goto(
    `${urlBase}web/instructor/courses/student/edit?courseid=${courseId}&studentemail=${nuevo_email}`,
  );
  await CargaCompleta(page1);

  await page1
    .getByRole("textbox", { name: "Student Name:" })
    .fill(datos_entrada.name);
  await page1
    .getByRole("textbox", { name: "Section Name:" })
    .fill(datos_entrada.section);
  await page1
    .getByRole("textbox", { name: "Team Name:" })
    .fill(datos_entrada.team);
  await page1
    .getByRole("textbox", { name: "E-mail Address:" })
    .fill(datos_entrada.email);
  await page1
    .getByRole("textbox", { name: "Comments:" })
    .fill(datos_entrada.comment);

  await page1.getByRole("button", { name: " Save Changes" }).click();
  await page1.getByRole("button", { name: "Yes" }).click();
  await page1
    .getByRole("button", { name: "No, just save the changes" })
    .click();

  await expect(page1.getByRole("alert")).toContainText(
    "Student has been updated",
  );
  await Guardar_imagen(page1, carpetaBase, contador, casosPrueba);
});
