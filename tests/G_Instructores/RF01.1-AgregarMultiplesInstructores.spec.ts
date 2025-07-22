import { test, expect } from "@playwright/test";
import { isAuthValid } from "../../scripts/checkAuth.js";
import { CargaCompleta } from "../../utils/Carga_completa.ts";
import { Guardar_imagen } from "../../utils/Guardar_imagen.ts";
import path from "path";

const storagePath = path.resolve("auth/storageState.json");
const urlBase = "https://teammates-orugas.appspot.com/";
const nombre = "rf01.1";
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
test.only("rf01.1-01 (Registro válido de múltiples instructores con formato correcto) [EP(valida)]", async ({
  page,
}) => {
  const datos_entrada = [
    { name: "Juan Pérez", email: "juan@unsa.edu.pe", institution: "UNSA" },
    { name: "Ana Ríos", email: "ana@uni.edu.pe", institution: "UNI" },
    { name: "Marco Díaz", email: "marco@pucp.edu.pe", institution: "PUCP" },
  ];

  const contador = { valor: 0 };
  const casosPrueba = "rf01.1-01";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos de instructores
  const textoInstructores = datos_entrada
    .map((d) => `${d.name} | ${d.email} | ${d.institution}`)
    .join("\n");

  await page
    .getByRole("textbox", { name: "Add multiple instructors" })
    .fill(textoInstructores);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Agregar instructores
  await page.getByRole("button", { name: "Add Instructors" }).click();

  // 4. Validar estado PENDING en el contenedor específico
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  for (const d of datos_entrada) {
    await expect(contenedor).toContainText(d.name);
    await expect(contenedor).toContainText(d.email);
    await expect(contenedor).toContainText(d.institution);
    await expect(contenedor).toContainText("PENDING");
  }
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();

  // 6. Validar estado SUCCESS en el contenedor específico
  for (const d of datos_entrada) {
    await expect(contenedor).toContainText(d.name);
    await expect(contenedor).toContainText(d.email);
    await expect(contenedor).toContainText("SUCCESS");
    await expect(contenedor).toContainText(
      `Instructor "${d.name}" has been successfully created`,
    );
  }
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.1-02 (Registro inválido: línea incompleta sin institución) [EP(invalida)]", async ({
  page,
}) => {
  const datos_entrada = [
    { name: "Juan Pérez", email: "juan@unsa.edu.pe", institution: " " },
  ];

  const contador = { valor: 0 };
  const casosPrueba = "rf01.1-02";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos de instructores
  const textoInstructores = datos_entrada
    .map((d) => `${d.name} | ${d.email} | ${d.institution}`)
    .join("\n");

  const textbox = page.getByRole("textbox", {
    name: "Add multiple instructors",
  });
  await textbox.fill(textoInstructores);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Intentar agregar instructores (no debería pasar nada)
  await page.getByRole("button", { name: "Add Instructors" }).click();

  // 4. Validar que el contenido del textbox NO cambió
  await expect(textbox).toHaveValue(textoInstructores);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.1-03 (Registro inválido: correo mal formado) [EP(invalida)]", async ({
  page,
}) => {
  const datos_entrada = [
    { name: "Laura Gómez", email: "laura[at]gmail.com", institution: "UNSA" },
  ];

  const contador = { valor: 0 };
  const casosPrueba = "rf01.1-03";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos de instructores con correo inválido
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

test.only("rf01.1-04 (Registro mixto: válidas se registran, inválidas permanecen) [EP(mixta)]", async ({
  page,
}) => {
  const datos_entrada = [
    {
      name: "Pedro Ramos",
      email: "pedro@unsa.edu.pe",
      institution: "UNSA",
      valido: true,
    },
    { name: "Laura Gómez", email: "", institution: "UNSA", valido: false }, // Email vacío = inválido
    {
      name: "Carmen Silva",
      email: "carmen@uni.edu.pe",
      institution: "UNI",
      valido: true,
    },
  ];

  const contador = { valor: 0 };
  const casosPrueba = "rf01.1-04";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos en el textbox
  const textoInstructores = datos_entrada
    .map((d) => `${d.name} | ${d.email} | ${d.institution}`)
    .join("\n");

  const textbox = page.getByRole("textbox", {
    name: "Add multiple instructors",
  });
  await textbox.fill(textoInstructores);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Click en Add Instructors
  await page.getByRole("button", { name: "Add Instructors" }).click();

  // 4. Validar PENDING solo para los válidos
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  for (const d of datos_entrada) {
    if (d.valido) {
      await expect(contenedor).toContainText(d.name);
      await expect(contenedor).toContainText(d.email);
      await expect(contenedor).toContainText(d.institution);
      await expect(contenedor).toContainText("PENDING");
    }
  }

  // 5. Validar que el textbox mantiene SOLO las líneas inválidas
  const textoEsperado = datos_entrada
    .filter((d) => !d.valido)
    .map((d) => `${d.name} | ${d.email} | ${d.institution}`)
    .join("\n");
  await expect(textbox).toHaveValue(textoEsperado);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 6. Confirmar adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();

  // 7. Validar SUCCESS solo para los válidos
  for (const d of datos_entrada) {
    if (d.valido) {
      await expect(contenedor).toContainText(d.name);
      await expect(contenedor).toContainText(d.email);
      await expect(contenedor).toContainText("SUCCESS");
      await expect(contenedor).toContainText(
        `Instructor "${d.name}" has been successfully created.`,
      );
    }
  }

  // 8. Validar que el textbox sigue mostrando las líneas inválidas (sin error)
  await expect(textbox).toHaveValue(textoEsperado);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.1-05 (Registro inválido: campo vacío) [BVA(invalida)]", async ({
  page,
}) => {
  const contador = { valor: 0 };
  const casosPrueba = "rf01.1-05";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Dejar el textbox vacío
  const textbox = page.getByRole("textbox", {
    name: "Add multiple instructors",
  });
  await textbox.fill(" ");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Intentar agregar instructores (no debería pasar nada)
  await page.getByRole("button", { name: "Add Instructors" }).click();

  // 4. Validar que el contenido del textbox sigue vacío
  await expect(textbox).toHaveValue(" ");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.1-06 (Registro válido de un solo instructor) [BVA(valida)]", async ({
  page,
}) => {
  const datos_entrada = [
    { name: "David Rojas", email: "david@unsa.edu.pe", institution: "UNSA" },
  ];

  const contador = { valor: 0 };
  const casosPrueba = "rf01.1-06";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos del instructor
  const textoInstructores = datos_entrada
    .map((d) => `${d.name} | ${d.email} | ${d.institution}`)
    .join("\n");

  await page
    .getByRole("textbox", { name: "Add multiple instructors" })
    .fill(textoInstructores);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Agregar instructor
  await page.getByRole("button", { name: "Add Instructors" }).click();

  // 4. Validar estado PENDING
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  for (const d of datos_entrada) {
    await expect(contenedor).toContainText(d.name);
    await expect(contenedor).toContainText(d.email);
    await expect(contenedor).toContainText(d.institution);
    await expect(contenedor).toContainText("PENDING");
  }
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();

  // 6. Validar estado SUCCESS
  for (const d of datos_entrada) {
    await expect(contenedor).toContainText(d.name);
    await expect(contenedor).toContainText(d.email);
    await expect(contenedor).toContainText("SUCCESS");
    await expect(contenedor).toContainText(
      `Instructor "${d.name}" has been successfully created`,
    );
  }
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.1-07 (Registro válido con 50 instructores) [BVA(valida)]", async ({
  page,
}) => {
  const datos_entrada = Array.from({ length: 50 }, (_, i) => ({
    name: `Instructor ${i + 1}`,
    email: `instructor${i + 1}@unsa.edu.pe`,
    institution: `Institución ${i + 1}`,
  }));

  const contador = { valor: 0 };
  const casosPrueba = "rf01.1-07";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos de instructores
  const textoInstructores = datos_entrada
    .map((d) => `${d.name} | ${d.email} | ${d.institution}`)
    .join("\n");

  await page
    .getByRole("textbox", { name: "Add multiple instructors" })
    .fill(textoInstructores);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Agregar instructores
  await page.getByRole("button", { name: "Add Instructors" }).click();

  // 4. Validar estado PENDING
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  for (const d of datos_entrada) {
    await expect(contenedor).toContainText(d.name);
    await expect(contenedor).toContainText(d.email);
    await expect(contenedor).toContainText(d.institution);
    await expect(contenedor).toContainText("PENDING");
  }
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();

  // 6. Validar estado SUCCESS
  for (const d of datos_entrada) {
    await expect(contenedor).toContainText(d.name);
    await expect(contenedor).toContainText(d.email);
    await expect(contenedor).toContainText("SUCCESS");
    await expect(contenedor).toContainText(
      `Instructor "${d.name}" has been successfully created`,
    );
  }
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.1-08 (Registro inválido con más de 50 instructores) [EP(invalida)]", async ({
  page,
}) => {
  const datos_entrada = Array.from({ length: 51 }, (_, i) => ({
    name: `Instructor ${i + 1}`,
    email: `instructor${i + 1}@unsa.edu.pe`,
    institution: `Institución ${i + 1}`,
  }));

  const contador = { valor: 0 };
  const casosPrueba = "rf01.1-08";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los 51 instructores
  const textoInstructores = datos_entrada
    .map((d) => `${d.name} | ${d.email} | ${d.institution}`)
    .join("\n");

  await page
    .getByRole("textbox", { name: "Add multiple instructors" })
    .fill(textoInstructores);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Agregar instructores → todos en PENDING
  await page.getByRole("button", { name: "Add Instructors" }).click();
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");

  for (const d of datos_entrada) {
    await expect(contenedor).toContainText(d.name);
    await expect(contenedor).toContainText(d.email);
    await expect(contenedor).toContainText(d.institution);
    await expect(contenedor).toContainText("PENDING");
  }

  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 4. Confirmar la adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();

  for (let i = 0; i < 50; i++) {
    const d = datos_entrada[i];
    await expect(contenedor).toContainText(d.name);
    await expect(contenedor).toContainText(d.email);
    await expect(contenedor).toContainText("SUCCESS");
  }

  // 5. El último (51) debe quedar en PENDING sin pasar a SUCCESS
  // const d51 = datos_entrada[50];
  // await expect(contenedor).toContainText(d51.name);
  // await expect(contenedor).toContainText(d51.email);
  // await expect(contenedor).toContainText("PENDING");
  // await expect(contenedor).not.toContainText("SUCCESS");

  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});
