# Configuration File Documentation

This document provides an overview of key configuration files used in the ΛΞVON OS project. Understanding these files is important for setting up the development environment, building the project, and customizing its behavior.

## 1. Next.js Configuration (`next.config.js`)

- **Purpose:** Configures the Next.js framework, controlling aspects like build process, server behavior, and integrations.
- **Key Configurations:**
    - `transpilePackages: ['three']`: Ensures the `three` package (for Three.js 3D graphics) is transpiled by Babel, which is necessary if it uses modern JavaScript features not supported by all target browsers or Node.js versions.
    - `images`:
        - `remotePatterns`: Configures allowed sources for optimized images using `next/image`. Currently allows images from `https://placehold.co/**`.
    - `experimental`:
        - `allowedDevOrigins`: Specifies URLs that are allowed to access the Next.js development server. This is useful for specific cloud development environments like Gitpod or Cloud Workstations.

## 2. TypeScript Configuration (`tsconfig.json`)

- **Purpose:** Configures the TypeScript compiler (`tsc`) and provides settings for IDEs.
- **Key `compilerOptions`:**
    - `target: "ES2017"`: TypeScript will compile code down to ECMAScript 2017.
    - `lib: ["dom", "dom.iterable", "esnext"]`: Includes standard DOM type definitions, iterables, and ESNext features.
    - `allowJs: true`: Allows JavaScript files to be compiled.
    - `skipLibCheck: true`: Skips type checking of all declaration files (`*.d.ts`).
    - `strict: true`: Enables all strict type-checking options.
    - `noEmit: true`: Prevents the TypeScript compiler from emitting JavaScript files. Next.js handles the compilation.
    - `esModuleInterop: true`: Improves compatibility between CommonJS and ES modules.
    - `module: "esnext"`: Specifies that ES modules should be used.
    - `moduleResolution: "bundler"`: Uses the "bundler" strategy for module resolution, aligning with modern bundlers like Webpack (used by Next.js).
    - `resolveJsonModule: true`: Allows importing `.json` files.
    - `isolatedModules: true`: Ensures each file can be transpiled without relying on other files, which is beneficial for some build tools.
    - `jsx: "preserve"`: Keeps JSX as is in the output, for another transformation step (like Babel) to handle.
    - `incremental: true`: Enables incremental compilation, speeding up subsequent builds.
    - `plugins: [{ "name": "next" }]`: Integrates the Next.js TypeScript plugin for improved type checking and build features specific to Next.js.
    - `paths: { "@/*": ["./src/*"] }`: Defines a path alias so that `@/` maps to the `src/` directory, simplifying imports.
- **`include` & `exclude`:**
    - `include`: Specifies files to be included in the compilation (Next.js environment types, all `.ts` and `.tsx` files, and Next.js generated types).
    - `exclude`: Excludes `node_modules` from compilation.

## 3. Tailwind CSS Configuration (`tailwind.config.ts`)

- **Purpose:** Configures the Tailwind CSS utility-first CSS framework.
- **Key Features:**
    - `darkMode: ['class']`: Enables class-based dark mode (toggled by adding/removing a 'dark' class on a parent element, usually `<html>`).
    - `content`: Specifies files in `src/pages`, `src/components`, and `src/app` for Tailwind to scan for used utility classes.
    - `theme`:
        - `container`: Configures default container centering and padding.
        - `extend`: Customizes and extends the default Tailwind theme:
            - `fontFamily`: Sets `Comfortaa` for `headline` and `Lexend` for `body`, aligning with `docs/blueprint.md`.
            - `colors`: Defines an extensive color palette using HSL CSS variables (e.g., `hsl(var(--border))`). This is a standard Shadcn/UI practice and allows for easy theming. Includes specific color sets for `chart` and `sidebar`.
            - `borderRadius`: Defines border radius sizes using a CSS variable (`--radius`).
            - `keyframes`: Defines custom animations:
                - `accordion-down`, `accordion-up`: For Shadcn/UI accordion components.
                - `aurora-glow`: A glowing effect, likely for backgrounds or highlights.
                - `subtle-pulse`: A gentle pulsing animation.
                - `window-mount`, `window-unmount`: Animations for Micro-App windows appearing/disappearing.
            - `animation`: Maps keyframes to animation utility classes.
            - `boxShadow`: Defines `glass-inset` and `glass-edge` for the glassmorphism aesthetic.
    - `plugins: [require("tailwindcss-animate")]`: Adds the `tailwindcss-animate` plugin for enhanced animation capabilities.

## 4. PostCSS Configuration (`postcss.config.mjs`)

- **Purpose:** Configures PostCSS, a tool for transforming CSS with JavaScript plugins.
- **Configuration:**
    - `plugins: { tailwindcss: {} }`: Simply includes the `tailwindcss` plugin. Next.js handles Autoprefixer and other necessary PostCSS transformations by default.

## 5. Components JSON (`components.json`)

- **Purpose:** Configuration file for the Shadcn/UI CLI, used to add pre-built components to the project.
- **Key Settings:**
    - `$schema`: URL to the schema for this file.
    - `style: "default"`: Specifies the default visual style for Shadcn/UI components.
    - `rsc: true`: New components will be generated as React Server Components.
    - `tsx: true`: New components will use the `.tsx` file extension.
    - `tailwind`:
        - `config: "tailwind.config.ts"`: Path to the Tailwind CSS configuration file.
        - `css: "src/app/globals.css"`: Path to the global CSS file where Tailwind base styles and component styles are imported.
        - `baseColor: "neutral"`: Specifies the neutral color palette used for generating component styles.
        - `cssVariables: true`: Indicates that component styles should use CSS variables for theming.
        - `prefix: ""`: No prefix is added to Tailwind utility classes.
    - `aliases`: Defines path aliases used within the generated components:
        - `components: "@/components"`
        - `utils: "@/lib/utils"`
        - `ui: "@/components/ui"`
        - `lib: "@/lib"`
        - `hooks: "@/hooks"`

These configurations collectively define the build process, styling system, TypeScript settings, and component management for the ΛΞVON OS project.
