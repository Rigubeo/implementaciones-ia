# Tarjetas de fidelidad: base de trabajo

Estado: modelos y tablas iniciales creados en el proyecto Supabase existente
«MiWeb»; editor local de configuración en `/panel/fidelidad`. El servicio de
fidelidad para titulares todavía no está operativo. La conexión local
existente a esa base fue comprobada el 11 de noviembre de 2026. La migración
`20261111173305_loyalty_initial.sql` solo agrega tablas y restricciones de
fidelidad; no elimina los datos de otros servicios.

El editor permite guardar un negocio y un programa por perfil de cliente, con
premio, promoción, sellos y cinco paletas. Por ahora, si ya existen tarjetas,
no permite cambiar el premio ni el número de sellos. Los sellos en el editor
son una demostración. Hay un flujo implementado para vincular una tarjeta a un
correo verificado y para que el negocio registre sellos o canjee premios. Cada
tarjeta muestra un QR individual; el lector del negocio comprueba la titularidad
del programa y pide confirmar el sello. El QR de la demostración es ilustrativo.
Falta probar de extremo a extremo estos flujos con cuentas de prueba, confirmar
la entrega de correos y verificar la separación entre negocios y el escaneo con
una cámara física antes de publicar. En teléfonos la cámara requiere HTTPS.

Para ver la aplicación localmente: `npm run dev -- --hostname 127.0.0.1 --port 3000`
y abrir `http://localhost:3000`. Esta ejecución utiliza `.env.local`, que apunta
a MiWeb; los cambios guardados con una cuenta real afectan esa base. La ruta
`/servicios/tarjetas/demo` es una vista interactiva que no guarda información.

## Objetivo

Ofrecer tarjetas de sellos a varios negocios desde el mismo sitio. Un negocio es
cliente de Soluciones Tecnológicas; sus consumidores son personas distintas que
pueden tener tarjetas de varios negocios. Cada programa establece cuántos sellos
se necesitan y cuál es el premio.

## Modelo inicial

- `LoyaltyBusiness`: negocio asociado a un cliente comercial.
- `LoyaltyStaff`: personas autorizadas para operar un negocio.
- `LoyaltyProgram`: condiciones de una tarjeta de sellos.
- `LoyaltyCard`: tarjeta única por persona y programa.
- `LoyaltyStampEvent`: historial de sellos, canjes y ajustes, con actor y clave
  para evitar que una solicitud repetida se registre dos veces.

El saldo será la suma de movimientos, no un dato que el navegador pueda editar.
Las condiciones de canje, cambios de premio y ajustes deben definirse antes de
activar operaciones; en particular, hay que conservar las reglas aplicables a
los sellos ya obtenidos cuando un negocio modifica su programa.

## Acceso propuesto

Para las personas que usan tarjetas, proponer correo verificado con enlace o
código de acceso, sin contraseña. Es necesario verificar la propiedad del correo:
conocer una dirección no debe dar acceso a su tarjeta. Los negocios deben usar
cuentas autenticadas y solo administrar sus propios programas y tarjetas. El
administrador de la plataforma necesita acceso separado y explícito.

El registro actual asigna el rol CLIENT por defecto y crea un perfil comercial
automáticamente. Antes de habilitar tarjetas hay que separar ese flujo del de los
consumidores; crear una cuenta de tarjeta no debe crear un cliente comercial.
No conceder privilegios por metadatos editables del usuario.

## Requisitos antes de operar

1. Verificar la configuración del entorno de producción en Hostinger y el
   estado de Supabase Auth; no se ha comprobado el acceso de producción.
2. Mantener la migración inicial versionada; no ejecutar `prisma db push` contra
   esta base compartida, ya que contiene tablas de otros servicios.
3. Mantener RLS activa en las tablas expuestas y diseñar permisos por negocio y
   titular. Prisma usa acceso de servidor y requiere comprobaciones explícitas
   de autorización: no confiar únicamente en RLS para las rutas del servidor.
4. Implementar transacciones que bloqueen la tarjeta al sumar o canjear sellos,
   validar reglas y permisos en servidor y asegurar idempotencia. Añadir pruebas
   de acceso cruzado entre negocios, solicitudes repetidas y concurrencia.
5. Configurar correo transaccional propio y URL de retorno para autenticación;
   el correo integrado de prueba de Supabase no sirve para usuarios externos.
6. Construir y probar el alta del negocio, registro del titular, visualización
   de su tarjeta y operación de sellos/canje. Definir manejo de empleados,
   políticas de privacidad y recuperación de acceso antes de lanzar.

## Pendientes de producto

- Cuántos sellos y qué premio tendrá el primer negocio piloto.
- Cómo se incorporarán empleados adicionales al negocio.
- Confirmar con un negocio piloto que el canje manual le resulta adecuado.
- Cómo se administran cambios de condiciones, vigencia y sellos duplicados.

Los modelos son un punto de partida, no una implementación lista para uso real.
