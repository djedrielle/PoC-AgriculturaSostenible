# Documentación del PoC - Agricultura Sostenible

FrontEnd desplegado en Azure Static Web Apps.

BackEnd en Supabase.

Durante el desarrollo de esta plataforma se seguirá una estructura arquitectónica monolithic con el estilo Layered Architecture. De esta manera podremos aislar las funcionalidades técnicas de la plataforma en diferentes capas, facilitando así el matenimiento de esta, ya sea cambiar de base de datos, framework... etc.
También permite el escalado vertical para futuras versiones de esta PoC o incluso un deployment completo.

Este estilo consiste en cuatro capas: Presentation, Business, Persistence y Data Layer.

Data Layer lo proveera Supabase.

Inicialmente se ideó la siguiente estructura de carpetas
``` js
src/
├── Presentation/
│   ├── pages
│   ├── components
│   └── ...
├── Business/
│   ├── Models
│   ├── BusinessInterfaces
│   ├── Implements
│   └── ...
└── Persistence/
    ├── clients
    ├── cache
    └── ...
```