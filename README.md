# Documentación del PoC - Agricultura Sostenible

FrontEnd desplegado en Azure Static Web Apps.

BackEnd en Supabase.

Durante el desarrollo de esta plataforma se seguirá una estructura arquitectónica monolithic con el estilo Layered Architecture. De esta manera podremos aislar las funcionalidades técnicas de la plataforma en diferentes capas, facilitando así el matenimiento de esta, ya sea cambiar de base de datos, framework... etc.
También permite el escalado vertical para futuras versiones de esta PoC o incluso un deployment completo.

Este estilo consiste en cuatro capas: Presentation, Business, Persistence y Data Layer.

Data Layer lo proveera Supabase.

Inicialmente se ideó la siguiente estructura de carpetas
``` cs
src/
├── Presentation-AS-PoC/
│   ├── src/
│   │   ├── pages
│   │   ├── components
│   │   ├── App.tsx
│   │   └── ...
│   └── some Vite stuff...
└── Backend/
    ├── Dockerfile
    ├── docker-compose.yml
    ├── tsconfig.json
    └── src/
        ├── index.ts
        ├── Business/
        │   ├── Routes
        │   ├── Models
        │   ├── BusinessInterfaces
        │   ├── Implements
        │   └── ...
        └── Persistence/
            ├── clients/
            │   ├── remoteSupabaseClient.ts
            │   ├── localSupabaseClient.ts
            │   └── cacheClient.ts
            └── ...
```

El desarrollo del backend se hará localmente con contenedores Docker, luego este será desplegado en Azure Web App para su integración con el FrontEnd de SWA.

Se aplicó Factory Method en la creación de los tokens (tokens.ts) y usuarios (users.ts). Esto para permitir la adición de otros tipos de tokens en el futuro. Ejemplo: Piña Token, BananoToken... etc.