import { test, expect } from "@playwright/test";
import { isAuthValid } from "../../scripts/checkAuth.js";
import { CargaCompleta } from "../../utils/Carga_completa.ts";
import { Guardar_imagen } from "../../utils/Guardar_imagen.ts";
import path from "path";

const storagePath = path.resolve("auth/storageState.json");
const urlBase = "https://teammates-orugas.appspot.com/";
const nombre = "rf07.1";
const carpetaBase = path.join("capturas", "gestion_estudiantes", nombre);

// Eliminar estudiante si ya existe, con evidencia
async function eliminarEstudianteSiExiste(
  page,
  emailObjetivo,
  carpetaBase,
  contador,
  casosPrueba,
) {
  const filas = await page.locator("table tbody tr").count();

  for (let i = 0; i < filas; i++) {
    const email = await page
      .locator(`table tbody tr:nth-child(${i + 1}) td:nth-child(5)`)
      .innerText();

    if (email.trim() === emailObjetivo) {
      await Guardar_imagen(page, carpetaBase, contador, casosPrueba); // Antes
      await page.locator(`#btn-delete-C001-${i}`).click();
      await page.getByRole("button", { name: "Yes" }).click();

      await expect(page.getByRole("alert")).toContainText(
        'Student is successfully deleted from course "C001"',
      );
      await Guardar_imagen(page, carpetaBase, contador, casosPrueba); // Después
      break;
    }
  }
}

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
test.only("rf07.1-01 (Registro correcto de un estudiante mediante formulario) [EP(valida)]", async ({
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
  const casosPrueba = "rf07.1-01";

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

test.only("rf07.1-02 (Correo electrónico inválido (falta @)) [EP(invalida)]", async ({
  page,
}) => {
  const datos_entrada = {
    section: "A1",
    team: "T1",
    name: "Juan Perez",
    email: "juanunsa.edu.pe",
    comment: "observador",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf07.1-02";

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
    "Some students failed to be enrolled, see the summary below.",
    { timeout: 10000 },
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba); // Captura tras alerta

  await expect(page.locator("#results-panel")).toContainText(
    `1 student(s) failed to be enrolled: SectionTeamStudent NameE-mail addressCommentsErrors${datos_entrada.section}${datos_entrada.team}${datos_entrada.name}${datos_entrada.email}${datos_entrada.comment}\"${datos_entrada.email}\" is not acceptable to TEAMMATES as a/an email because it is not in the correct format. An email address contains some text followed by one '@' sign followed by some more text, and should end with a top level domain address like .com. It cannot be longer than 254 characters, cannot be empty and cannot contain spaces.`,
  );

  await Guardar_imagen(page, carpetaBase, contador, casosPrueba); // Captura tras ver resultados
});

test.only('rf07.1-03 (Campo obligatorio "nombre" vacío) [EP(invalida)]', async ({
  page,
}) => {
  const datos_entrada = {
    section: "A1",
    team: "T1",
    name: " ",
    email: "juan@unsa.edu.pe",
    comment: "observador",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf07.1-03";

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
  await expect(page.locator("tm-instructor-course-enroll-page")).toContainText(
    "Found empty compulsory fields and/or sections with more than 100 students.",
  );
  await page
    .getByText(
      "Found empty compulsory fields and/or sections with more than 100 students.",
    )
    .click();
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba); // Captura tras alerta
});

test.only("rf07.1-04 (Equipo repetido en secciones distintas) [EP(invalida)]", async ({
  page,
}) => {
  const estudiantes = [
    {
      section: "A",
      team: "T12",
      name: "Jose",
      email: "jose@unsa.edu.pe",
      comment: "Estudiante de intercambio",
    },
    {
      section: "B",
      team: "T12",
      name: "Pepe",
      email: "pepe@unsa.edu.pe",
      comment: "Estudiante de intercambio",
    },
  ];

  const contador = { valor: 0 };
  const casosPrueba = "rf07.1-04";

  // 1. Ir a la página inicial
  await page.goto(urlBase + "web/instructor/home");
  await CargaCompleta(page);

  // 2. Ir a detalles del curso y eliminar ambos si ya existen
  await page.goto(urlBase + "web/instructor/courses/details?courseid=C001");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  for (const estudiante of estudiantes) {
    await eliminarEstudianteSiExiste(
      page,
      estudiante.email,
      carpetaBase,
      contador,
      casosPrueba,
    );
  }

  // 3. Ir al formulario de inscripción
  await page.goto(urlBase + "web/instructor/courses/enroll?courseid=C001");
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 4. Llenar el formulario con los 2 estudiantes
  for (let i = 0; i < estudiantes.length; i++) {
    const estudiante = estudiantes[i];
    const fila = page.locator(`#newStudentsHOT tbody tr:nth-child(${i + 1})`);

    await fila.locator("td").nth(0).dblclick(); // Section
    await page.locator("textarea").fill(estudiante.section);

    await fila.locator("td").nth(1).dblclick(); // Team
    await page.locator("textarea").fill(estudiante.team);

    await fila.locator("td").nth(2).dblclick(); // Name
    await page.locator("textarea").fill(estudiante.name);

    await fila.locator("td").nth(3).dblclick(); // Email
    await page.locator("textarea").fill(estudiante.email);

    await fila.locator("td").nth(4).dblclick(); // Comment
    await page.locator("textarea").fill(estudiante.comment);
  }

  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Enviar el formulario
  await page.getByRole("button", { name: "Enroll students" }).click();
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 6. Validar la respuesta
  await expect(page.locator("tm-instructor-course-enroll-page")).toContainText(
    "Found duplicated teams in different sections.",
  );
  await page.getByText(mensajeError).click();
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});
