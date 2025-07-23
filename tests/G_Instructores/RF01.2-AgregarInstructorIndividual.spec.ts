import { test, expect } from "@playwright/test";
import { isAuthValid } from "../../scripts/checkAuth.js";
import { CargaCompleta } from "../../utils/Carga_completa.ts";
import { Guardar_imagen } from "../../utils/Guardar_imagen.ts";
import path from "path";

const storagePath = path.resolve("auth/storageState.json");
const urlBase = "https://teammates-orugas.appspot.com/";
const nombre = "rf01.2";
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
test.only("rf01.2-01 (Registro exitoso de un instructor con datos válidos) [EP(valida)]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "María Rodríguez",
    email: "maria@uni.edu.pe",
    institution: "UNI",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.2-01";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos del instructor en el formulario individual
  await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
  await page.getByRole("textbox", { name: "Email:" }).fill(datos_entrada.email);
  await page
    .getByRole("textbox", { name: "Institution:" })
    .fill(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Agregar el instructor
  await page
    .getByRole("button", { name: "Add Instructor", exact: true })
    .click();

  // 4. Validar estado PENDING en el contenedor específico
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText(datos_entrada.email);
  await expect(contenedor).toContainText(datos_entrada.institution);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();

  // 6. Validar estado SUCCESS en el contenedor específico
  await expect(contenedor).toContainText("SUCCESS");
  await expect(contenedor).toContainText(
    `Instructor "${datos_entrada.name}" has been successfully created`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.2-02 (No se permite registrar un instructor con correo inválido) [EP(invalida)]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "Carlos Pérez",
    email: "carlos_uni.edu.pe",
    institution: "UNSA",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.2-02";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos inválidos en el formulario individual
  await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
  await page.getByRole("textbox", { name: "Email:" }).fill(datos_entrada.email);
  await page
    .getByRole("textbox", { name: "Institution:" })
    .fill(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Intentar agregar el instructor (sección superior del formulario)
  await page
    .getByRole("button", { name: "Add Instructor", exact: true })
    .click();

  // 4. Validar que aparece mensaje de error de correo inválido
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText(datos_entrada.email);
  await expect(contenedor).toContainText(datos_entrada.institution);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva y validar que falle con mensaje específico
  await page.getByRole("button", { name: "Add All Instructors" }).click();
  await expect(contenedor).toContainText("FAIL");
  await expect(contenedor).toContainText(
    `"${datos_entrada.email}" is not acceptable to TEAMMATES as a/an email because it is not in the correct format.`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.2-03 (No se permite registrar un instructor sin nombre) [EP(invalida)]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "",
    email: "javier@tecsup.edu.pe",
    institution: "TECSUP",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.2-03";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos inválidos en el formulario individual (sin nombre)
  await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
  await page.getByRole("textbox", { name: "Email:" }).fill(datos_entrada.email);
  await page
    .getByRole("textbox", { name: "Institution:" })
    .fill(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Intentar agregar el instructor (no debería pasar nada)
  await page
    .getByRole("button", { name: "Add Instructor", exact: true })
    .click();

  // 4. Validar que los campos siguen iguales después del intento
  await expect(page.getByRole("textbox", { name: "Name:" })).toHaveValue(
    datos_entrada.name,
  );
  await expect(page.getByRole("textbox", { name: "Email:" })).toHaveValue(
    datos_entrada.email,
  );
  await expect(page.getByRole("textbox", { name: "Institution:" })).toHaveValue(
    datos_entrada.institution,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.2-04 (No se permite registrar un instructor sin institución) [EP(invalida)]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "Sofía Llanos",
    email: "sofia@sanmarcos.edu.pe",
    institution: "",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.2-04";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos inválidos en el formulario individual (sin institución)
  await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
  await page.getByRole("textbox", { name: "Email:" }).fill(datos_entrada.email);
  await page
    .getByRole("textbox", { name: "Institution:" })
    .fill(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Intentar agregar el instructor (no debería pasar nada)
  await page
    .getByRole("button", { name: "Add Instructor", exact: true })
    .click();

  // 4. Validar que los campos siguen iguales después del intento
  await expect(page.getByRole("textbox", { name: "Name:" })).toHaveValue(
    datos_entrada.name,
  );
  await expect(page.getByRole("textbox", { name: "Email:" })).toHaveValue(
    datos_entrada.email,
  );
  await expect(page.getByRole("textbox", { name: "Institution:" })).toHaveValue(
    datos_entrada.institution,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.2-05 (Registrar instructor con nombre en límite inferior) [BVA(valida)]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "A",
    email: "a@upc.edu.pe",
    institution: "UPC",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.2-05";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos del instructor en el formulario individual
  await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
  await page.getByRole("textbox", { name: "Email:" }).fill(datos_entrada.email);
  await page
    .getByRole("textbox", { name: "Institution:" })
    .fill(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Agregar el instructor
  await page
    .getByRole("button", { name: "Add Instructor", exact: true })
    .click();

  // 4. Validar estado PENDING en el contenedor específico
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText(datos_entrada.email);
  await expect(contenedor).toContainText(datos_entrada.institution);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();

  // 6. Validar estado SUCCESS en el contenedor específico
  await expect(contenedor).toContainText("SUCCESS");
  await expect(contenedor).toContainText(
    `Instructor "${datos_entrada.name}" has been successfully created`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.2-06 (Registrar instructor con nombre en límite superior) [BVA(valida)]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "A".repeat(100),
    email: "limite100@upc.edu.pe",
    institution: "UPC",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.2-06";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos del instructor en el formulario individual
  await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
  await page.getByRole("textbox", { name: "Email:" }).fill(datos_entrada.email);
  await page
    .getByRole("textbox", { name: "Institution:" })
    .fill(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Agregar el instructor
  await page
    .getByRole("button", { name: "Add Instructor", exact: true })
    .click();

  // 4. Validar estado PENDING en el contenedor específico
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText(datos_entrada.email);
  await expect(contenedor).toContainText(datos_entrada.institution);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();

  // 6. Validar estado SUCCESS en el contenedor específico
  await expect(contenedor).toContainText("SUCCESS");
  await expect(contenedor).toContainText(
    `Instructor "${datos_entrada.name}" has been successfully created`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.2-07 (Fallo al registrar instructor con nombre que supera el límite) [BVA(invalida)]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "A".repeat(101),
    email: "limite101@upc.edu.pe",
    institution: "UPC",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.2-07";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos del instructor en el formulario individual
  await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
  await page.getByRole("textbox", { name: "Email:" }).fill(datos_entrada.email);
  await page
    .getByRole("textbox", { name: "Institution:" })
    .fill(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Agregar el instructor
  await page
    .getByRole("button", { name: "Add Instructor", exact: true })
    .click();

  // 4. Validar estado PENDING en el contenedor específico
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText(datos_entrada.email);
  await expect(contenedor).toContainText(datos_entrada.institution);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva y validar el fallo
  await page.getByRole("button", { name: "Add All Instructors" }).click();

  await expect(contenedor).toContainText("FAIL");
  await expect(contenedor).toContainText(
    `"${datos_entrada.name}" is not acceptable to TEAMMATES as a/an person name because it is too long. The value of a/an person name should be no longer than 100 characters. It should not be empty.`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.2-08 (Fallo al registrar instructor con correo inválido: sin dominio) [EP(invalida)]", async ({
  page,
}) => {
  const datos_entrada = [
    { name: "Luis Gutierrez", email: "luis@", institution: "UNSA" },
  ];

  const contador = { valor: 0 };
  const casosPrueba = "rf01.2-08";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos de instructores con correo inválido (sin dominio)
  const textoInstructores = datos_entrada
    .map((d) => `${d.name} | ${d.email} | ${d.institution}`)
    .join("\n");

  const textbox = page.getByRole("textbox", {
    name: "Add multiple instructors",
  });
  await textbox.fill(textoInstructores);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Intentar agregar instructores
  await page.getByRole("button", { name: "Add Instructors" }).click();

  // 4. Validar que la entrada quedó en estado PENDING
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  for (const d of datos_entrada) {
    await expect(contenedor).toContainText(d.name);
    await expect(contenedor).toContainText(d.email);
    await expect(contenedor).toContainText(d.institution);
    await expect(contenedor).toContainText("PENDING");
  }
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva y validar que falle
  await page.getByRole("button", { name: "Add All Instructors" }).click();

  for (const d of datos_entrada) {
    await expect(contenedor).toContainText(d.name);
    await expect(contenedor).toContainText(d.email);
    await expect(contenedor).toContainText(d.institution);
    await expect(contenedor).toContainText("FAIL");
    await expect(contenedor).toContainText(
      `"${d.email}" is not acceptable to TEAMMATES as a/an email because it is not in the correct format. An email address contains some text followed by one '@' sign followed by some more text, and should end with a top level domain address like .com. It cannot be longer than 254 characters, cannot be empty and cannot contain spaces.`,
    );
  }
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.2-09 (Fallo al registrar instructor con nombre mayor al límite: 150 caracteres) [EP(invalida)]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "A".repeat(150),
    email: "largo1@up.edu.pe",
    institution: "UP",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.2-09";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos del instructor en el formulario individual
  await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
  await page.getByRole("textbox", { name: "Email:" }).fill(datos_entrada.email);
  await page
    .getByRole("textbox", { name: "Institution:" })
    .fill(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Agregar el instructor
  await page
    .getByRole("button", { name: "Add Instructor", exact: true })
    .click();

  // 4. Validar estado PENDING en el contenedor específico
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText(datos_entrada.email);
  await expect(contenedor).toContainText(datos_entrada.institution);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva y validar el fallo
  await page.getByRole("button", { name: "Add All Instructors" }).click();

  await expect(contenedor).toContainText("FAIL");
  await expect(contenedor).toContainText(
    `"${datos_entrada.name}" is not acceptable to TEAMMATES as a/an person name because it is too long. The value of a/an person name should be no longer than 100 characters. It should not be empty.`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.2-10 (Fallo al registrar instructor con institución mayor al límite: 150 caracteres) [EP(invalida)]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "Rosa Pérez",
    email: "rosa@unsa.edu.pe",
    institution: "A".repeat(150),
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.2-10";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos del instructor en el formulario individual
  await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
  await page.getByRole("textbox", { name: "Email:" }).fill(datos_entrada.email);
  await page
    .getByRole("textbox", { name: "Institution:" })
    .fill(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Agregar el instructor
  await page
    .getByRole("button", { name: "Add Instructor", exact: true })
    .click();

  // 4. Validar estado PENDING en el contenedor específico
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText(datos_entrada.email);
  await expect(contenedor).toContainText(datos_entrada.institution);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva y validar el fallo
  await page.getByRole("button", { name: "Add All Instructors" }).click();

  await expect(contenedor).toContainText("FAIL");
  await expect(contenedor).toContainText(
    `"${datos_entrada.institution}" is not acceptable to TEAMMATES as a/an institute name because it is too long. The value of a/an institute name should be no longer than 128 characters. It should not be empty.`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});
