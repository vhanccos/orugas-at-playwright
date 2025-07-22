import { test, expect } from "@playwright/test";
import { isAuthValid } from "../../scripts/checkAuth.js";
import { CargaCompleta } from "../../utils/Carga_completa.ts";
import { Guardar_imagen } from "../../utils/Guardar_imagen.ts";
import path from "path";

const storagePath = path.resolve("auth/storageState.json");
const urlBase = "https://teammates-orugas.appspot.com/";
const nombre = "rf01.3";
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
test.only("rf01.3-01 (Visualizar información de un instructor registrado) [CU]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "María Rodríguez",
    email: "maria@uni.edu.pe",
    institution: "UNI",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.3-01";

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

  // 7. Recargar la página y validar que el instructor sigue listado
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);

  const fila = page.locator(
    "#search-table-account-request tbody > tr:nth-child(1)",
  );
  await expect(fila).toContainText(datos_entrada.name);
  await expect(fila).toContainText(datos_entrada.email);
  await expect(fila).toContainText(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.3-02 (Editar los datos de un instructor) [CU]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "María Rodríguez",
    email: "maria@uni.edu.pe",
    institution: "UNI",
  };

  const datos_salida = {
    name: "María Cueva",
    email: "maria@unsa.edu.pe",
    institution: "UNSA",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.3-02";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos del instructor original
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

  // 4. Validar estado PENDING
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText(datos_entrada.email);
  await expect(contenedor).toContainText(datos_entrada.institution);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();
  await expect(contenedor).toContainText("SUCCESS");
  await expect(contenedor).toContainText(
    `Instructor "${datos_entrada.name}" has been successfully created`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 6. Confirmar existencia en la tabla tras recarga
  await page.goto(`${urlBase}web/admin/home`);
  const filaPrimera = page.locator(
    "#search-table-account-request tbody > tr:nth-child(1)",
  );
  await expect(filaPrimera).toContainText(datos_entrada.name);
  await expect(filaPrimera).toContainText(datos_entrada.email);
  await expect(filaPrimera).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 7. Realizar edición directamente sin recargar
  await page
    .getByRole("row", { name: `${datos_entrada.name} ${datos_entrada.email}` })
    .first()
    .getByLabel("Edit account request")
    .click();

  await page.locator("#request-name").fill(datos_salida.name);
  await page.locator("#request-email").fill(datos_salida.email);
  await page.locator("#request-institution").fill(datos_salida.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Account request was successfully updated.",
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 8. Confirmar datos editados en la misma fila
  await expect(filaPrimera).toContainText(datos_salida.name);
  await expect(filaPrimera).toContainText(datos_salida.email);
  await expect(filaPrimera).toContainText(datos_salida.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.3-03 (Eliminar un instructor existente del curso) [CU]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "María Rodríguez",
    email: "maria@uni.edu.pe",
    institution: "UNI",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.3-03";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos del instructor original
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

  // 4. Validar estado PENDING
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText(datos_entrada.email);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();
  await expect(contenedor).toContainText("SUCCESS");
  await expect(contenedor).toContainText(
    `Instructor "${datos_entrada.name}" has been successfully created`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 6. Confirmar existencia en la tabla tras recarga
  await page.goto(`${urlBase}web/admin/home`);
  const filaPrimera = page.locator(
    "#search-table-account-request tbody > tr:nth-child(1)",
  );
  await expect(filaPrimera).toContainText(datos_entrada.name);
  await expect(filaPrimera).toContainText(datos_entrada.email);
  await expect(filaPrimera).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 7. Eliminar el instructor
  await page
    .locator("#search-table-account-request tbody > tr")
    .filter({ hasText: datos_entrada.email })
    .first()
    .getByLabel("Delete account request")
    .click();

  await page.getByRole("button", { name: "Yes" }).click();
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 8. Confirmar mensaje de éxito
  await expect(page.getByRole("alert")).toContainText(
    "Account request successfully deleted.",
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.3-04 (Edición con correo electrónico inválido) [EP(invalida))]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "Luis Torres",
    email: "luis@unsa.edu.pe",
    institution: "UNSA",
  };

  const datos_salida = {
    name: "Luis Torres",
    email: "luisunsa.edu.pe", // inválido (sin @)
    institution: "UNSA",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.3-04";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos del instructor original
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

  // 4. Validar estado PENDING
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText(datos_entrada.email);
  await expect(contenedor).toContainText(datos_entrada.institution);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();
  await expect(contenedor).toContainText("SUCCESS");
  await expect(contenedor).toContainText(
    `Instructor "${datos_entrada.name}" has been successfully created`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 6. Confirmar existencia en la tabla tras recarga
  await page.goto(`${urlBase}web/admin/home`);
  const filaPrimera = page.locator(
    "#search-table-account-request tbody > tr:nth-child(1)",
  );
  await expect(filaPrimera).toContainText(datos_entrada.name);
  await expect(filaPrimera).toContainText(datos_entrada.email);
  await expect(filaPrimera).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 7. Intentar editar con correo inválido
  await page
    .getByRole("row", { name: `${datos_entrada.name} ${datos_entrada.email}` })
    .first()
    .getByLabel("Edit account request")
    .click();

  await page.locator("#request-name").fill(datos_salida.name);
  await page.locator("#request-email").fill(datos_salida.email);
  await page.locator("#request-institution").fill(datos_salida.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page.getByRole("button", { name: "Save" }).click();

  // 8. Validar mensaje de error esperado
  await expect(page.getByRole("alert")).toContainText(
    `"${datos_salida.email}" is not acceptable to TEAMMATES as a/an email because it is not in the correct format. An email address contains some text followed by one '@' sign followed by some more text, and should end with a top level domain address like .com. It cannot be longer than 254 characters, cannot be empty and cannot contain spaces.`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.3-05 (Edición con nombre vacío) [EP(invalida)]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "Luis Torres",
    email: "luis@unsa.edu.pe",
    institution: "UNSA",
  };

  const datos_salida = {
    name: "", // nombre vacío
    email: "luis@unsa.edu.pe",
    institution: "UNSA",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.3-05";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos del instructor original
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

  // 4. Validar estado PENDING
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText(datos_entrada.email);
  await expect(contenedor).toContainText(datos_entrada.institution);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar la adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();
  await expect(contenedor).toContainText("SUCCESS");
  await expect(contenedor).toContainText(
    `Instructor "${datos_entrada.name}" has been successfully created`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 6. Confirmar existencia en la tabla tras recarga
  await page.goto(`${urlBase}web/admin/home`);
  const filaPrimera = page.locator(
    "#search-table-account-request tbody > tr:nth-child(1)",
  );
  await expect(filaPrimera).toContainText(datos_entrada.name);
  await expect(filaPrimera).toContainText(datos_entrada.email);
  await expect(filaPrimera).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 7. Intentar editar dejando el nombre vacío
  await page
    .getByRole("row", { name: `${datos_entrada.name} ${datos_entrada.email}` })
    .first()
    .getByLabel("Edit account request")
    .click();

  await page.locator("#request-name").fill(datos_salida.name);
  await page.locator("#request-email").fill(datos_salida.email);
  await page.locator("#request-institution").fill(datos_salida.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page.getByRole("button", { name: "Save" }).click();

  // 8. Validar mensaje de error por nombre vacío
  await expect(page.getByRole("alert")).toContainText(
    "The field 'person name' is empty. The value of a/an person name should be no longer than 100 characters. It should not be empty.",
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});
