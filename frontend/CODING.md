# Frontend coding standards

1. This project uses functional react components.
2. The format of the components should be the same as in react.code-snippets (which is why I encourage you to use the snippets if you are on VSCode)

## Component coding style

All components should be functional react components. Within the functional component and the file it is declared in, the following ordering rules should be respected:

1. Atop the file, imports.
2. Immediately after imports, the prop types used by the component. This is such that the props are immediately obvious when the file is opened.
3. Constants and associated types.
4. The main component (e.g. the default export) and its helper functions.
5. Other components and their helper functions, consider moving any longer (>20 lines) side components to another file.
6. The default export.

Inside the component:

1. Precomputed values or hardcoded constants that are to be expanded upon in the future (e.g. an always-open drawer that will get toggle functionality in the future).
2. States (useState)
3. on\* functions and other callbacks/functions used by useEffect calls.
4. Hooks (useEffect)
5. The component itself.
