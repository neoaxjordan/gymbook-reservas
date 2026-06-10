# CI/CD Pipeline

El pipeline está implementado en `.github/workflows/ci.yml` usando GitHub Actions.

## Pasos
1. **install** — `npm ci` en backend y frontend
2. **type-check** — `tsc --noEmit` en backend
3. **build** — compila backend y frontend
4. **test** — corre tests del backend

## Pendiente
- Docker build y push a registry en el step de CD
- Deploy automático al merge en main