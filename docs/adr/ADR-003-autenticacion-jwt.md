# ADR-003: Mecanismo de autenticación y revocación

## Contexto
Los endpoints de GymBook requieren autenticación. Se necesita un mecanismo stateless
compatible con la arquitectura de contenedores y sin dependencias externas adicionales.

## Decisión
Se usa **JWT (JSON Web Tokens)** firmados con `HS256`:
- El token se genera en login y register, con expiración configurable via `JWT_EXPIRES_IN`.
- El middleware `authMiddleware` valida la firma y expiración en cada request protegido.
- El `userId` extraído del token se adjunta al request para logging y autorización.
- Las contraseñas se hashean con **bcrypt** (cost factor 10).

## Revocación
La revocación se maneja en el cliente eliminando el token del `localStorage`.
En producción se implementaría una **blacklist en Redis** con TTL igual al tiempo restante
del token, o se usaría refresh tokens de corta duración.

## Alternativas consideradas
- **Sessions con express-session**: stateful, requiere almacenamiento compartido entre
  instancias, no compatible con arquitectura de contenedores sin Redis.
- **OAuth2 / Auth0**: overhead innecesario para el alcance de esta prueba.

## Consecuencias
- Arquitectura stateless: cualquier instancia del backend puede validar cualquier token.
- Deuda técnica: la revocación server-side no está implementada. Documentado en
  "Compromisos asumidos" del README.