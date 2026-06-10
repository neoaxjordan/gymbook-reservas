# ADR-002: Estrategia de concurrencia en el endpoint de reserva

## Contexto
Cada clase de GymBook tiene un número limitado de cupos (`availableCapacity`). Cuando ese
valor llega a 0, la clase está llena y no se permiten más reservas.

El problema surge cuando múltiples usuarios intentan reservar el último cupo al mismo tiempo.
Sin control de concurrencia, dos requests paralelos pueden leer `availableCapacity = 1`,
ambos pasar la validación y decrementar el valor, resultando en `availableCapacity = -1`
y dos reservas confirmadas para un cupo que no existe — una sobreventa.

## Decisión
Se usa **`findOneAndUpdate` atómico de MongoDB** con la condición de cupo embebida en el query:

```js
Class.findOneAndUpdate(
  { _id: classId, availableCapacity: { $gt: 0 }, isActive: true },
  { $inc: { availableCapacity: -1 } },
  { new: true }
)
```

MongoDB ejecuta la lectura y escritura como una operación atómica a nivel de documento.
Si `availableCapacity` ya es 0, el query no encuentra el documento y retorna `null`,
rechazando el request con error claro. Si la creación posterior de la reserva falla
(ej. duplicado por `idempotencyKey`), se ejecuta un **rollback** inmediato:
`$inc: { availableCapacity: +1 }`.

## Alternativas consideradas
- **Optimistic locking con versiones (`__v`)**: requiere reintentos en el cliente,
  más complejo de implementar y testear.
- **Transacciones MongoDB**: requieren replica set, overhead de configuración innecesario
  para un solo nodo en esta prueba.
- **Redis con SETNX**: añade una dependencia externa justificada solo a mayor escala.

## Consecuencias
- Garantiza exactamente una reserva confirmada ante N requests simultáneos al último cupo.
- El rollback protege la consistencia si falla la escritura de la reserva.
- Escalable hasta el throughput de un solo nodo MongoDB; para mayor escala se justifica Redis.