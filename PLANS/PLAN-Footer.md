# Refactoring Plan: `@contextual-ui/core/components/footer`

**Goal**: Align the `Footer` component architecture with the recent improvements made to `Navbar`. This means introducing context-driven `linkClassName` inheritance, removing unnecessary wrapper components, allowing render props for all main sections, and ensuring flexible composition of both schema-rendered items and custom interactive elements.

## 1. Context Inheritance (`footer.context.ts` & `footer.types.ts`)

Currently, `Footer` components don't pass down default styling for links. We will introduce a context-driven inheritance model for links and social items.

### Updates to `FooterContextValue`:
- Add `linkClassName?: string;`
- Add `socialClassName?: string;`

### Updates to Props Interfaces (`footer.types.ts`):
- `FooterColumnsProps`: Add `linkClassName?: string` and `titleClassName?: string`. Add support for `children?: ReactNode | ((columns: FooterColumn[]) => ReactNode)`.
- `FooterColumnProps`: Add `linkClassName?: string` and `titleClassName?: string`. Add support for `children?: ReactNode | ((column: FooterColumn) => ReactNode)`.
- `FooterLinksProps`: Add `linkClassName?: string`. Add support for `children?: ReactNode | ((links: FooterLinkItem[]) => ReactNode)`.
- `FooterSocialsProps`: Add `socialClassName?: string`. Add support for `children?: ReactNode | ((socials: FooterSocialLink[]) => ReactNode)`.
- `FooterBottomProps`: Add `linkClassName?: string`. Add support for `children?: ReactNode | ((data: FooterData) => ReactNode)`.
- `FooterBrandProps`: Add support for `children?: ReactNode | ((brand: FooterData['brand']) => ReactNode)`.

## 2. Removing Redundant Components (`Footer.Content`)

Just like `Navbar.Content`, `Footer.Content` is simply a wrapper `div` that doesn't add value. It forces unnecessary DOM nesting.
- **Action**: Deprecate and remove `<Footer.Content />` entirely. Developers can use standard `<div>` elements for layout or map directly to `<Footer.Columns />` and `<Footer.Bottom />`.

## 3. `<Footer.Links />` Refactor (Zero-Wrapper & Render Props)

Currently, `<Footer.Links />` forces an `<ul>` wrapper and `<li>` items. We need to make it as flexible as `Navbar.Links`.

### Key Changes:
- **Remove Forced `<ul>` / `<li>`**: If no `className` is provided and `asChild` is false, it should render as a Fragment (`<>`) just like `Navbar.Links`, allowing developers to define their own Grid/Flexbox layouts without breaking them.
- **Inherit `linkClassName`**: If `linkClassName` is provided at the `Footer.Root`, `Footer.Columns`, or `Footer.Column` level, `<Footer.Links />` should consume it from context and apply it to each `<Footer.Link />`.
- **Render Props**: Support `{(links) => ... }` as children for full iteration control.

## 4. `<Footer.Socials />` Refactor

Similar to `Links`, `Socials` should support inherited styling and flexible wrappers.

### Key Changes:
- Consume `socialClassName` from `FooterContext`.
- If no `className` is passed, render as a Fragment (`<>`).
- Pass inherited `socialClassName` down to automatically rendered `<Footer.SocialLink />` instances.
- Support render props: `{(socials) => ...}`.

## 5. `<Footer.Column />` & `<Footer.Columns />` Refactor

These components should act as context providers for nested links.

### Key Changes:
- **Context Injection**: `<Footer.Columns>` and `<Footer.Column>` should inject `linkClassName` and `titleClassName` into the context if provided, cascading the styles downwards.
- **Render Props**: Support `{(columns) => ...}` on `<Footer.Columns>` and `{(column) => ...}` on `<Footer.Column>`.

## 6. Layout Composition & DX (Like `Navbar`)

The final developer experience should allow both declarative zero-boilerplate and highly customized compositions.

### Expected Pattern A: Zero Boilerplate
```tsx
<Footer.Root data={data.footer} className="bg-zinc-950 p-8">
  <Footer.Brand />
  
  <Footer.Columns 
    className="grid grid-cols-4 gap-8" 
    titleClassName="font-bold text-white mb-4"
    linkClassName="text-zinc-400 hover:text-white block py-1" 
  />

  <Footer.Bottom 
    className="border-t border-zinc-800 mt-8 pt-8 flex justify-between"
    linkClassName="text-xs text-zinc-500 hover:text-white"
  />
</Footer.Root>
```

### Expected Pattern B: Composable with Custom Elements
```tsx
<Footer.Root className="...">
  {/* Custom mapping injected seamlessly */}
  <Footer.Columns className="grid grid-cols-3">
    <Footer.Column id="resources" linkClassName="hover:underline">
      <Footer.ColumnTitle />
      <Footer.Links />
      {/* Appended custom link sharing the column's inherited styles */}
      <Footer.Link href="/custom">Custom Resource</Footer.Link>
    </Footer.Column>
  </Footer.Columns>
</Footer.Root>
```

## 7. Migration Steps
1. Update `footer.types.ts` to include `linkClassName`, `socialClassName`, `titleClassName`, and update all `children` props to accept functions.
2. Update `footer.context.ts` to manage the new style inheritance strings.
3. Remove `Footer.Content`.
4. Refactor `Footer.tsx` (`Root`, `Brand`, `Columns`, `Column`, `Links`, `Link`, `Socials`, `SocialLink`, `Bottom`).
5. Update `index.ts` to reflect the removed `Content` component.
6. Write robust tests in `footer.test.tsx` verifying context propagation, fragment rendering, and render props.
7. Update `packages/core/README.md` and `apps/starter-kit/app/docs/DocsClient.tsx` to showcase the new API.
