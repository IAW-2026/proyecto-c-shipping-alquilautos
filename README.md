# Shipping App

### `Deploy de produccion:` https://proyecto-c-shipping-alquilautos.vercel.app/

### `Usuario disponible para realizar pruebas:`

    - Usuario: adminshipping+clerk_test@iaw.com
    - Password: iawuser#

## Tener en cuenta para utilizar la aplicacion:

    - Esta app solo seria usada por un usuario con role "admin".
    - El usuario para utilizar la app debe ser el otorgado, que tiene role = "admin"; de lo contrario se solicitará ingresar con un usuario que cuente con los permisos necesarios.

## Descripción breve

Shipping es el módulo de envíos y logística del proyecto de tipo **C (Marketplace)** para la comisión `Alquilautos`.

La aplicación administra procesos de entrega y devolución de vehículos, con una seccion Dashboard que muestra indicadores estadísticos y gráficos basados en el estado de las entregas, asi como con una seccion Entregas para visualizar todas las entregas.

El flujo de estados de una entrega normal (sin contar CANCELADO):

- _PENDIENTE --> COORDINADA --> ENTREGADO --> DEVUELTO_

## Rutas de interes:

### `/dashboard`

Permite:

- Ver indicadores de entregas activas, canceladas, pendientes de coordinar y devoluciones de la semana.
- Visualizar gráficos de entregas vs devoluciones y distribución de estados.

### `/entregas`

Permite:

- Ver listado completo de entregas donde se visualiza:
  - estado
  - fecha y hora de entrega
  - fecha y hora de devolucion
  - ultima actualizacion

- Clickear entrega para que se visualice un modal con el id de reserva, estado, y coordinacion con su horario

- Para entregas cuyo estado es COORDINADA y la fecha/hora actual es posterior a la de fecha/hora de entrega se puede marcar como entregado desde el modal

- Para entregas cuyo estado es ENTREGADO y la fecha/hora actual es posterior a la de fecha/hora de devolucion se puede marcar como DEVUELTO desde el modal

### `/test` (TestDev)

Permite:

- POST Crear entrega: -> Probar creación de una nueva entrega con `POST /api/entrega`.
- PATCH Confirmar horarios seleccionados: -> obtiene horarios disponibles con `GET /api/horario/[id]`.
  -> Confirmar horarios seleccionados con `PATCH /api/entrega horario`.
- PATCH Cancelar: -> Cancelar una entrega con `PATCH /api/cancelar/[id]`.

## Notas para la corrección

- La página `/test` permite crear entregas, consultar horarios, confirmar horas seleccionadas y cancelar procesos sin necesidad de otro frontend (muy saturada).
- Las rutas de API incluyen autenticación Clerk preparada, pero las verificaciones están comentadas en algunos endpoints para facilitar pruebas locales.
- La notificación a Seller-App mediante `SELLER_APP_URL` está contemplada en el código pero permanece comentada como etapa de integración futura.
- Como decision de diseño se eligio que el middleware (proxy.ts) no proteja los endpoints, sino que en cada uno se implementa la autenticacion de usuario y chequeo de role.
