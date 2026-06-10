# Diagrama de secuencia — Reserva con concurrencia

## Flujo: dos usuarios intentan reservar el último cupo simultáneamente

```mermaid
sequenceDiagram
    actor U1 as Usuario 1 (ganador)
    actor U2 as Usuario 2 (perdedor)
    participant FE1 as Frontend U1
    participant FE2 as Frontend U2
    participant BE as Backend Express
    participant DB as MongoDB
    participant SSE as SSE Service

    Note over U1,U2: Ambos ven 1 cupo disponible en pantalla

    par Request simultáneo
        U1->>FE1: Click "Reservar"
        FE1->>BE: POST /api/reservations (idempotencyKey: uuid-1)
    and
        U2->>FE2: Click "Reservar"
        FE2->>BE: POST /api/reservations (idempotencyKey: uuid-2)
    end

    Note over BE,DB: MongoDB procesa los requests de forma atómica

    BE->>DB: findOneAndUpdate({ availableCapacity > 0 }, { $inc: -1 })
    DB-->>BE: ✅ Clase actualizada (availableCapacity: 0)

    BE->>DB: Reservation.create({ userId: U1, idempotencyKey: uuid-1 })
    DB-->>BE: ✅ Reserva confirmada

    BE->>SSE: notifyAll(clase actualizada)
    SSE-->>FE1: data: { availableCapacity: 0 }
    SSE-->>FE2: data: { availableCapacity: 0 }

    BE-->>FE1: 201 Created — reserva confirmada
    FE1-->>U1: ✅ Toast "Cupo confirmado"

    Note over BE,DB: U2 llega cuando availableCapacity ya es 0

    BE->>DB: findOneAndUpdate({ availableCapacity > 0 }, { $inc: -1 })
    DB-->>BE: ❌ null (no hay cupos)

    BE-->>FE2: 409 Conflict — sin cupos disponibles
    FE2-->>U2: ❌ Toast "No se pudo reservar"

    Note over FE1,FE2: Ambos frontends ya ven 0 cupos via SSE
```

## Notas

- **Atomicidad**: `findOneAndUpdate` con la condición `availableCapacity > 0` garantiza
  que solo un request puede decrementar el último cupo — MongoDB ejecuta la operación
  como una unidad atómica a nivel de documento.

- **Request perdedor**: recibe `409 Conflict` con mensaje claro. No se crea ninguna
  reserva ni se modifica el cupo.

- **Idempotencia**: si U1 reintenta con el mismo `idempotencyKey`, MongoDB rechaza
  la inserción por índice único — se hace rollback del cupo y se retorna error controlado.

- **Propagación en tiempo real**: el `SSE Service` notifica a todos los clientes
  conectados inmediatamente después de confirmar la reserva, sin que necesiten recargar.