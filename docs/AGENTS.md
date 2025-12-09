# 🤖 AGENTS.md — Protocol Mestre de Desenvolupament i Arquitectura

Aquest document estableix la **font de la veritat** per a qualsevol desenvolupament dins d'aquest projecte. El seu compliment és obligatori per mantenir la integritat, l'escalabilitat i la qualitat del programari.

**Objectiu Suprem:** Zero Deute Tècnic. Separació Radical de Responsabilitats.

---

## 1. 🏗️ Fonaments Arquitectònics (Clean Architecture)

L'arquitectura es basa en cercles concèntrics de dependència. La regla d'or és: **les dependències només apunten cap a dins**.

### Estructura de Carpetes Sagrada (src/)

No creïs fitxers fora d'aquestes ubicacions sense una justificació arquitectònica crítica.

```text
src/
├── app/                     # CAPA D'INFRAESTRUCTURA (Framework)
│   │                        # ÚNIC punt d'entrada de Next.js (Rutes, Layouts).
│   └──api/                  # Rutes API (Edge Functions, Webhooks).
│
├── features/                # CAPA DE PRESENTACIÓ (Modularitzada)
│   └── [feature-name]/      # Ex: auth, billing, projects
│       ├── components/      # UI específica d'aquesta feature.
│       ├── hooks/           # Lògica d'estat de UI (local).
│       └── actions/         # Server Actions específiques (Next.js).
│
├── components/              # CAPA DE PRESENTACIÓ (Compartida)
│   ├── ui/                  # Àtoms i Molècules (Shadcn/UI, Botons, Inputs).
│   └── layout/              # Organismes globals (Navbar, Sidebar).
│
├── services/                # CAPA D'APLICACIÓ (Use Cases)
│   │                        # Orquestra el flux de dades. NO sap res de UI ni de DB.
│   └── [Entity]Service.ts   # Ex: UserService.ts, AuditService.ts
│
├── repositories/            # CAPA D'INTERFÍCIE (Data Access)
│   ├── interfaces/          # Contractes abstractes (Ports).
│   └── supabase/            # Implementació concreta (Adapters).
│
├── lib/                     # CAPA DE SUPORT (Utils)
│   │                        # Funcions pures, sense efectes secundaris.
│   ├── utils.ts             # Helpers generals.
│   └── validations/         # Esquemes Zod.
│
├── adapters/                # CAPA D'ADAPTACIÓ EXTERNA
│   │                        # Transformadors de dades (DTOs) per a APIs de tercers.
│   └── [Service]Adapter.ts  # Ex: StripeAdapter.ts, OpenAIAdapter.ts
│
└── types/                   # NUCLI (Entities)
    └── models.ts            # Definicions de tipus TypeScript globals i DTOs.
2. 🛡️ Protocol de Separació de Responsabilitats (SoC)Per evitar el "Spaghetti Code", cada fitxer ha de tenir una única raó per canviar.❌ El que està PROHIBIT:Consultes a la BD dins de Components: Mai facis un supabase.from('table').select() dins d'un .tsx.Lògica de Negoci dins de Server Actions: Els Server Actions només han de validar input, cridar al Service i gestionar la resposta/redirect.Tipus any: Està prohibit. Si no saps el tipus, usa unknown i valida'l.Estils Hardcoded: Usa sempre classes de Tailwind o variables CSS definides a globals.css.✅ El Flux de Dades Correcte:Usuari interactua amb Component (UI).Component crida a Server Action (o API Route).Server Action valida dades (Zod) i crida al Service.Service aplica regles de negoci i demana dades al Repository.Repository executa la query a la BD (Supabase) i retorna dades netes.3. 💻 Estàndards de Codi (Coding Standards)Nomenclatura (Naming Conventions)Sigueu estrictes i consistents.ElementFormatExempleFitxers/DirectorisFitxers/Directoriskebab-caseuser-profile.tsx, auth-service.tsComponentsComponentsPascalCaseUserProfileCard-FuncionscamelCasegetUserById, submitForm-VariablescamelCaseisActive, userData-ConstantsSCREAMING_SNAKEMAX_RETRY_COUNT, DEFAULT_LOCALE-Tipus/InterfíciesPascalCaseUserDTO, IAuditRepository-BoolsPrefix is, has, shouldisEnabled, hasError-TypeScript i SeguretatStrict Mode: Sempre activat.DTOs (Data Transfer Objects): Defineix tipus clars per al que entra i surt de les capes (ex: CreateUserDTO, UserResponseDTO).Gestió d'Errors: No llencis strings. Usa try/catch i retorna objectes tipats:TypeScripttype Result<T> = { success: true; data: T } | { success: false; error: string };
Comentaris i Documentació (JSDoc)No comentis què fa el codi (això s'ha de llegir sol), comenta per què ho fa si és complex. Usa JSDoc per a funcions públiques de serveis i repositoris.TypeScript/**
 * Calcula l'escore SEO basat en les mètriques Core Web Vitals.
 * Utilitza l'algorisme v2 definit a la documentació interna.
 *
 * @param metrics - Objecte amb LCP, CLS, etc.
 * @returns Puntuació de 0 a 100.
 */
4. 🎨 UI/UX i Estils (Tailwind CSS)Mobile FirstEl disseny base (sense prefix) és per a mòbil.Afegeix md:, lg:, xl: per a pantalles més grans.Sistema d'Espaiat (Layouts)Per evitar que el contingut quedi enganxat a les vores en pantalles grans (Portàtils/Monitors), utilitza sempre aquesta classe als contenidors principals:TypeScript// ✅ PATRÓ OBLIGATORI PER A SECCIONS I CONTAINERS
<div className="container mx-auto px-6 md:px-10 lg:px-14">
  {/* El teu contingut */}
</div>
5. 🛠️ Gestió de l'Estat i DadesServer State: Prefereix React Server Components (RSC) per a fer fetch de dades sempre que sigui possible.Client State: Usa useState o useReducer només per a interaccions locals (modals, formularis, toggles).URL State: Per a filtres, paginació i cerques, guarda l'estat a la URL (searchParams) perquè sigui compartible.6. 🔄 Control de Versions (Git)Fes servir Conventional Commits per mantenir un historial net.feat: Nova funcionalitat (ex: feat: add user dashboard).fix: Solució d'un bug (ex: fix: hydration error on navbar).refactor: Canvis de codi que no alteren la funcionalitat (ex: refactor: move auth logic to service).style: Canvis de format, espaiat, etc.docs: Canvis a la documentació.chore: Manteniment, dependències.7. 🤖 Instruccions per a l'Agent (Tu)Quan generis codi, segueix aquest procés mental:Analitza el Context: On va aquest fitxer? Pertany a una feature existent o és una de nova?Verifica l'Arquitectura: Estic important un component de UI dins d'un servei? (Prohibit). Estic fent una query SQL dins d'un component? (Prohibit).Aplica els Estàndards: Revisa els noms, el tipatge i l'estil (Tailwind).Pensa en l'Escalabilitat: Si això creix 10x, aquest codi aguantarà o caldrà reescriure'l?Sigues Complet: No deixis // TODO o codi a mitges. Genera les importacions i exportacions necessàries.Idioma: Tot el codi (noms de variables, comentaris) en Anglès. Tota la comunicació amb l'usuari i textos visibles de la UI en Català (o segons config i18n).Aquest document és la llei del projecte. El seu incompliment es considera deute tècnic immediat.