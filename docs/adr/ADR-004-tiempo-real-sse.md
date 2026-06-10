# ADR-004: Mecanismo de tiempo real

## Contexto
En un gimnasio, los cupos de una clase popular pueden agotarse en segundos desde que
se abren las reservas. Si un usuario está viendo el catálogo y otro reserva el último
cupo, el primero debe ver el cambio reflejado inmediatamente — sin recargar la página
y sin polling agresivo que sobrecargue el servidor.

HU-05 requiere que cualquier cambio en la disponibilidad de cupos (reserva o cancelación)
se propague en tiempo real a todos los clientes conectados que estén viendo el catálogo
o el detalle de una clase.

## Decisión
Se implementó **Server-Sent Events (SSE)** sobre el endpoint `GET /api/reservations/classes/events`:
- El servidor mantiene conexiones HTTP persistentes con cada cliente.
- Cuando cambia un cupo (reserva o cancelación), `SseService.notifyAll()` emite el
  objeto clase actualizado a todos los clientes conectados.
- El frontend Angular consume el stream con `EventSource` en `RealtimeService`.

## Alternativas consideradas
- **WebSockets (Socket.io)**: comunicación bidireccional innecesaria para este caso
  (solo el servidor emite cambios). Mayor overhead de infraestructura.
- **Polling cada N segundos**: simple de implementar pero genera carga innecesaria
  en el servidor y tiene latencia proporcional al intervalo.
- **Long polling**: más complejo que SSE sin ventajas claras para este caso de uso.

## Consecuencias
- SSE es unidireccional (server → client), suficiente para notificar cambios de cupos.
- Soportado nativamente en todos los browsers modernos sin librerías adicionales.
- Para escalar horizontalmente (múltiples instancias), SSE requiere un broker de mensajes
  (Redis Pub/Sub) para sincronizar notificaciones entre instancias. Documentado como
  deuda técnica.