import { test, expect } from "@playwright/test";
import { isAuthValid } from "../../scripts/checkAuth.js";
import { CargaCompleta } from "../../utils/Carga_completa.ts";
import { Guardar_imagen } from "../../utils/Guardar_imagen.ts";
import path from "path";

const storagePath = path.resolve("auth/storageState.json");
const urlBase = "https://teammates-orugas.appspot.com/";
const nombre = "rf01.4";
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
test.only("rf01.4-01 (Aprobación correcta de una solicitud pendiente) [CU]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "Ana Torres",
    email: "ana.torres@unsa.edu.pe",
    institution: "UNSA",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.4-01";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Ingresar los datos del instructor
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

  // 4. Confirmar estado PENDING
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

  // 6. Confirmar existencia en tabla tras recarga
  await page.goto(`${urlBase}web/admin/home`);
  const filaInstructor = page
    .getByRole("row", { name: `${datos_entrada.name} ${datos_entrada.email}` })
    .first();
  await expect(filaInstructor).toContainText(datos_entrada.name);
  await expect(filaInstructor).toContainText(datos_entrada.email);
  await expect(filaInstructor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 7. Aprobar el instructor desde la fila correspondiente
  await filaInstructor.locator('[id^="approve-account-request-"]').click();
  await expect(page.getByRole("alert")).toContainText(
    `Account request was successfully approved. Email has been sent to ${datos_entrada.email}.`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 8. Confirmar estado APPROVED en la misma fila
  await expect(filaInstructor).toContainText("APPROVED");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 9. Limpieza: eliminar solicitud aprobada desde admin/search
  await page.goto(`${urlBase}web/admin/search`);
  await page.getByRole("textbox", { name: "Search" }).fill(datos_entrada.email);
  await page.getByRole("textbox", { name: "Search" }).press("Enter");
  await page.getByRole("button", { name: "Delete account request" }).click();
  await page.getByRole("button", { name: "Yes" }).click();
});

test.only("rf01.4-02 (Rechazo de solicitud con motivo) [CU]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "Luis Cárdenas",
    email: "luis@correo.com",
    institution: "UNSA",
    motivo: "Solicita acceso desde sede remota",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.4-02";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Registrar la solicitud
  await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
  await page.getByRole("textbox", { name: "Email:" }).fill(datos_entrada.email);
  await page
    .getByRole("textbox", { name: "Institution:" })
    .fill(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page
    .getByRole("button", { name: "Add Instructor", exact: true })
    .click();

  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page.getByRole("button", { name: "Add All Instructors" }).click();
  await expect(contenedor).toContainText("SUCCESS");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Recargar y buscar la fila correspondiente
  await page.goto(`${urlBase}web/admin/home`);
  const filaInstructor = page
    .getByRole("row", { name: `${datos_entrada.name} ${datos_entrada.email}` })
    .first();

  await expect(filaInstructor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 4. Rechazar la solicitud desde la fila
  await filaInstructor.locator('[id^="reject-account-request-"]').click();
  await page.getByRole("button", { name: "Reject With Reason" }).click();

  await expect(page.getByRole("heading")).toContainText(
    `Reject Account Request for`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page.getByRole("button", { name: "Reject" }).click();
  await expect(page.getByRole("alert")).toContainText(
    `Account request was successfully rejected. Email has been sent to ${datos_entrada.email}.`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar estado REJECTED en la fila correspondiente
  await expect(filaInstructor).toContainText("REJECTED");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.4-03 (Rechazo de solicitud sin motivo) [CU]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "Mariana Gutiérrez",
    email: "mariana@unsa.edu.pe",
    institution: "UNSA",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.4-03";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Registrar la solicitud
  await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
  await page.getByRole("textbox", { name: "Email:" }).fill(datos_entrada.email);
  await page
    .getByRole("textbox", { name: "Institution:" })
    .fill(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page
    .getByRole("button", { name: "Add Instructor", exact: true })
    .click();

  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page.getByRole("button", { name: "Add All Instructors" }).click();
  await expect(contenedor).toContainText("SUCCESS");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 3. Recargar y buscar la fila correspondiente
  await page.goto(`${urlBase}web/admin/home`);
  const filaInstructor = page
    .getByRole("row", { name: `${datos_entrada.name} ${datos_entrada.email}` })
    .first();

  await expect(filaInstructor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 4. Rechazo sin motivo (directo)
  await filaInstructor.locator('[id^="reject-account-request-"]').click();
  await page.locator('[id^="reject-request-"]:visible').first().click();

  await expect(page.getByRole("alert")).toContainText(
    "Account request was successfully rejected.",
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Confirmar estado REJECTED
  await expect(filaInstructor).toContainText("REJECTED");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.4-04 (Visualización de información completa de una solicitud pendiente) [CU]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "María Rodríguez",
    email: "maria@uni.edu.pe",
    institution: "UNI",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.4-04";

  // 1. Ir a la página de administración
  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 2. Registrar al instructor (formulario individual)
  await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
  await page.getByRole("textbox", { name: "Email:" }).fill(datos_entrada.email);
  await page
    .getByRole("textbox", { name: "Institution:" })
    .fill(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await page
    .getByRole("button", { name: "Add Instructor", exact: true })
    .click();

  // 3. Confirmar PENDING
  const contenedor = page.locator("tm-admin-home-page > div:nth-child(3)");
  await expect(contenedor).toContainText(datos_entrada.name);
  await expect(contenedor).toContainText(datos_entrada.email);
  await expect(contenedor).toContainText(datos_entrada.institution);
  await expect(contenedor).toContainText("PENDING");
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 4. Confirmar la adición definitiva
  await page.getByRole("button", { name: "Add All Instructors" }).click();
  await expect(contenedor).toContainText("SUCCESS");
  await expect(contenedor).toContainText(
    `Instructor "${datos_entrada.name}" has been successfully created`,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 5. Recargar y buscar la fila
  await page.goto(`${urlBase}web/admin/home`);
  const filaSolicitud = page
    .getByRole("row", { name: `${datos_entrada.name} ${datos_entrada.email}` })
    .first();

  await expect(filaSolicitud).toContainText(datos_entrada.name);
  await expect(filaSolicitud).toContainText(datos_entrada.email);
  await expect(filaSolicitud).toContainText(datos_entrada.institution);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  // 6. Abrir ventana de edición y validar campos
  await filaSolicitud.getByLabel("Edit account request").click();

  await expect(page.locator("#request-name")).toHaveValue(datos_entrada.name);
  await expect(page.locator("#request-email")).toHaveValue(datos_entrada.email);
  await expect(page.locator("#request-institution")).toHaveValue(
    datos_entrada.institution,
  );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});

test.only("rf01.4-05 (Intento de aprobar una solicitud duplicada) [CU]", async ({
  page,
}) => {
  const datos_entrada = {
    name: "Frank Torres",
    email: "frank.torres@unsa.edu.pe",
    institution: "UNSA",
  };

  const contador = { valor: 0 };
  const casosPrueba = "rf01.4-05";

  await page.goto(`${urlBase}web/admin/home`);
  await CargaCompleta(page);
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  for (let i = 0; i < 2; i++) {
    await page.getByRole("textbox", { name: "Name:" }).fill(datos_entrada.name);
    await page
      .getByRole("textbox", { name: "Email:" })
      .fill(datos_entrada.email);
    await page
      .getByRole("textbox", { name: "Institution:" })
      .fill(datos_entrada.institution);
    await page
      .getByRole("button", { name: "Add Instructor", exact: true })
      .click();
  }

  await page.getByRole("button", { name: "Add All Instructors" }).click();

  await page.goto(`${urlBase}web/admin/home`);

  const filas = page.getByRole("row", {
    name: `${datos_entrada.name} ${datos_entrada.email}`,
  });
  const primera = filas.first();
  const segunda = filas.nth(1);

  await primera.locator('[id^="approve-account-request-"]').click();

  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);

  await segunda.locator('[id^="approve-account-request-"]').click();

  const alerta = page.getByRole("alert").first();
  await expect(alerta).toContainText(
    `An account request with email ${datos_entrada.email} has already been approved. Please reject or delete the account request instead.`,
  );

  // await expect(page.getByRole("alert")).toContainText(
  //   `An account request with email ${datos_entrada.email} has already been approved. Please reject or delete the account request instead.`,
  // );
  await Guardar_imagen(page, carpetaBase, contador, casosPrueba);
});
