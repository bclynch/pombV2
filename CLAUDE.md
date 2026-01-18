# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

POMB is a cross-platform travel/mapping application built as a monorepo with:
- **apps/web**: React 19 + Vite + TypeScript
- **apps/mobile**: Expo (React Native) for iOS/Android
- **packages/common**: Shared Relay environment and database types
- **Backend**: Supabase with GraphQL API

## Commands

```bash
# Development (auto-starts Docker, Supabase, and edge functions)
npm run dev:web          # Start backend + web app + Relay compiler
npm run dev:mobile       # Start backend + mobile app + Relay compiler
npm run start:backend    # Start backend only (Docker, Supabase, edge functions)

# Build & Quality
npm run build            # Build all apps/packages
npm run lint             # Lint all
npm run check-types      # TypeScript check all
npm run format           # Prettier format

# GraphQL/Relay
npm run relay            # Compile GraphQL queries once
npm run relay:watch      # Watch mode
npm run schema:fetch     # Fetch schema from Supabase and transform it
```

## Local Development Setup

The dev scripts automatically handle backend startup:
1. Checks Docker is running
2. Starts Supabase if not already running (`supabase start`)
3. Waits for services to be healthy
4. Starts edge functions (`supabase functions serve`)
5. Launches the app

**Prerequisites**: Docker Desktop must be installed and running.

## Architecture

```
Client Apps (web/, mobile/)
         │
         ▼
  @pomb/common package
  ├─ relay-environment.ts (GraphQL client setup)
  └─ database.types.ts (Supabase-generated types)
         │
         ▼
  Supabase GraphQL API
  http://127.0.0.1:54321/graphql/v1
         │
         ▼
  PostgreSQL (trips, profiles, photos tables)
```

## Key Patterns

### GraphQL with Relay
- Run `npm run relay` to generate types in `__generated__/` folders
- **Inline all GraphQL**: Pass the `graphql` tagged template directly to `useLazyLoadQuery` and `useFragment`. Do not extract to variables.

```tsx
// ❌ BAD - Don't extract to a variable
const MyQuery = graphql`
  query MyComponentQuery($id: ID!) { ... }
`;
const data = useLazyLoadQuery(MyQuery, { id });

// ✅ GOOD - Inline the query
const data = useLazyLoadQuery<MyComponentQuery>(graphql`
  query MyComponentQuery($id: ID!) { ... }
`, { id });

// ❌ BAD - Don't extract fragments either
const MyFragment = graphql`
  fragment MyComponent_data on MyType { ... }
`;
const data = useFragment(MyFragment, ref);

// ✅ GOOD - Inline the fragment
const data = useFragment(graphql`
  fragment MyComponent_data on MyType { ... }
`, ref);
```

- For `fetchQuery` or other APIs that need the compiled query node, import from `__generated__`:
```tsx
import MyComponentQueryNode from "./__generated__/MyComponentQuery.graphql";
fetchQuery(environment, MyComponentQueryNode, { id });
```

### Authentication
- Both apps use Supabase Auth via `lib/AuthContext.tsx`
- `useAuth()` hook provides `signIn`, `signUp`, `signOut`, `user`, `session`
- Main content is accessible without auth; auth required for mutations

### Navigation
- **Web**: React Router (`/`, `/login`, `/signup`, `/:username`, `/:username/:tripSlug`)
- **Mobile**: React Navigation with modal auth flow

### Absolute Imports (Mobile)
- Mobile uses `@/` alias configured in `babel.config.js` and `tsconfig.json`
- Example: `import { useAuth } from "@/lib/AuthContext"`

### Environment Variables
- **Web**: `VITE_` prefix (e.g., `VITE_SUPABASE_URL`)
- **Mobile**: `EXPO_PUBLIC_` prefix (e.g., `EXPO_PUBLIC_SUPABASE_URL`)

## Tech Stack

- **UI**: Coinbase Design System (`@coinbase/cds-web`, `@coinbase/cds-mobile`)
- **Maps**: MapLibre GL (web), @maplibre/maplibre-react-native (mobile)
- **State/Data**: Relay 20.x for GraphQL
- **Build**: Turborepo, Vite (web), Metro (mobile)
- **React**: 19.1.0 (pinned across monorepo via overrides)

## TypeScript Guidelines

**Use `type` instead of `interface`**: This codebase exclusively uses type aliases. Do not use `interface` declarations.

```tsx
// ❌ BAD - Don't use interface
interface UserProps {
  name: string;
  age: number;
}

// ✅ GOOD - Use type
type UserProps = {
  name: string;
  age: number;
};
```

## CDS (Coinbase Design System) Guidelines

**IMPORTANT**: Always use CDS components and style props instead of inline styles or custom CSS. Do not use `style={{}}` objects or define `const styles = {}` objects.

### Layout Components
Use these instead of `<div>` with inline styles:
- `Box` - Base container with all style props
- `VStack` - Vertical flex layout (column)
- `HStack` - Horizontal flex layout (row)
- `Grid` - CSS Grid layout with `columns`, `columnMin`, `gap` props

### Style Props (available on Box, VStack, HStack, Grid)
```tsx
// Spacing (values: 0, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10)
padding={3} paddingX={2} paddingY={4} marginBottom={2}

// Colors (semantic tokens)
background="bg" | "bgAlternate" | "bgTertiary" | "bgPrimary"
color="fg" | "fgMuted" | "fgPrimary"

// Layout
display="flex" | "block" | "grid" | "none"
flexDirection="column" | "row"
justifyContent="center" | "space-between" | "start" | "end"
alignItems="center" | "start" | "end" | "stretch"
gap={2} // for flex/grid spacing

// Borders
borderedBottom borderedTop bordered
borderRadius={100} | {200} | {300} | {400} | {500}

// Dimensions
width={200} height="100%" minHeight="100vh" maxWidth={1200}
```

### Typography Components
```tsx
import { TextTitle1, TextTitle2, TextTitle3, TextBody, TextLabel2 } from "@coinbase/cds-web/typography";

<TextTitle1>Page Title</TextTitle1>
<TextBody color="fgMuted">Muted text</TextBody>
<TextLabel2>Small label</TextLabel2>
```

### Other Key Components
```tsx
// Buttons
import { Button, AvatarButton, IconButton } from "@coinbase/cds-web/buttons";

// Cards
import { Card } from "@coinbase/cds-web/cards";
<Card size="large" background="bgAlternate">...</Card>

// Media
import { Avatar } from "@coinbase/cds-web/media";
<Avatar src={url} name="Username" size="xxxl" />

// Overlays
import { Modal, ModalHeader } from "@coinbase/cds-web/overlays";

// Controls
import { TextInput } from "@coinbase/cds-web/controls";

// Tags
import { Tag } from "@coinbase/cds-web/tag";
<Tag colorScheme="yellow">Draft</Tag>

// Interactive
import { Pressable } from "@coinbase/cds-web/system";
```

### Example Migration (Web)
```tsx
// ❌ BAD - Don't do this
<div style={{ padding: 24, backgroundColor: "#fff", display: "flex" }}>
  <span style={{ color: "#666" }}>Text</span>
</div>

// ✅ GOOD - Use CDS components
<Box padding={3} background="bg" display="flex">
  <TextBody color="fgMuted">Text</TextBody>
</Box>
```

### Mobile-Specific CDS Patterns

**Import paths** - Mobile uses path-based imports:
```tsx
// Layout
import { Box, VStack, HStack } from "@coinbase/cds-mobile/layout";

// Typography
import { TextTitle1, TextBody, TextLabel2 } from "@coinbase/cds-mobile/typography";

// Buttons
import { Button, AvatarButton } from "@coinbase/cds-mobile/buttons";

// Controls
import { TextInput } from "@coinbase/cds-mobile/controls/TextInput";

// Media
import { Avatar } from "@coinbase/cds-mobile/media/Avatar";

// System
import { Pressable } from "@coinbase/cds-mobile/system/Pressable";
```

**Mobile-specific notes**:
- Use `VStack gap={N}` instead of `marginBottom` on elements (margin props only accept 0 or negative values)
- `flexGrow={1}` instead of `flex: 1` for flex children
- Use RN's `SafeAreaView` for screen containers, then CDS `Box` inside
- `borderedBottom` prop works on Box, VStack, HStack for dividers

**Example Mobile Screen**:
```tsx
<SafeAreaView style={{ flex: 1 }} edges={["top"]}>
  <Box flexGrow={1} background="bg">
    <VStack padding={3} gap={4}>
      <TextTitle1>Screen Title</TextTitle1>
      <TextBody color="fgMuted">Description</TextBody>
    </VStack>
  </Box>
</SafeAreaView>
```

## Workspace Commands

Run commands in specific workspace:
```bash
npm run --workspace=web dev
npm run --workspace=mobile ios
```

Or with Turborepo filter:
```bash
npx turbo build --filter=web
```
