# Documentación del PoC - Agricultura Sostenible

FrontEnd en Azure Static Web Apps.
BackEnd en Supabase.

Se eligió el estilo Layered Architecture porque nos permite aislar las funcionalidades técnicas de la plataforma en diferentes capas, facilitando así el matenimiento de esta, ya sea cambiar de base de datos o framework... etc.

Este estilo consiste en cuatro capas: Presentación UX, Business, Persistencia y Data Layer.

Data Layer lo proveera Supabase.