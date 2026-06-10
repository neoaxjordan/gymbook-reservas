# ADR-001: Arquitectura del backend

## Contexto
GymBook requiere un backend que maneje reservas con concurrencia real, logs estructurados,
autenticación y tiempo real. Se necesitaba decidir qué patrón arquitectónico usar para
separar correctamente las responsabilidades y facilitar el testing.

El proyecto incluye además una capa `config/scripts` con scripts de seed para inicializar
datos de prueba (usuarios y clases) al levantar el sistema por primera vez.

## Decisión
Se eligió una arquitectura **Layered (por capas)** con las siguientes capas:
- **Routes**: reciben el request HTTP y delegan al controller
- **Middleware**: autenticación, autorización, validación y logging
- **Controllers**: orquestan el flujo, delegan lógica al service
- **Services**: contienen las reglas de negocio (concurrencia, idempotencia, rollback)
- **Models**: esquemas Mongoose con DTOs para serialización
- **Config/Scripts**: configuración de base de datos y scripts de seed

## Alternativas consideradas
- **Hexagonal (Ports & Adapters)**: mayor desacoplamiento pero overhead innecesario para
  el alcance de esta prueba. Justificado para un sistema multi-gimnasio en producción.
- **Monolito modular (estilo Next.js/Remix)**: integra frontend y backend en el mismo
  proyecto raíz, reduce fricción de despliegue pero mezcla responsabilidades y complica
  el testing independiente de cada capa.
- **Arquitectura monolítica sin capas**: rápida de implementar pero dificulta el testing
  unitario y el mantenimiento a medida que crece el dominio.

## Consecuencias
- La lógica crítica de concurrencia vive en `ReservationService`, fácil de testear de forma aislada.
- Si el sistema escala a múltiples gimnasios, la capa de servicios puede extraerse a microservicios sin cambiar controllers ni routes.
- El acoplamiento a Mongoose en los services es una deuda técnica consciente aceptada por tiempo.