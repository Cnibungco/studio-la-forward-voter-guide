# LA Forward Voter Guide — Studio

Standalone Sanity Studio for the LA Forward Voter Guide. Lives as a
sibling repo/folder next to the Next.js app (`voter-guide-app`) — not
embedded in it. Project `wcogcahu`, dataset `production`.

## Content model

`Region` → `Race` / `Measure` → `Entry`. See comments in
`schemaTypes/*.ts` and `.cursor/rules/sanity-schema.mdc` for the
one-directional reference convention and locked rating/recommendation
enums — confirm with the project owner before changing either.

## Setup

```bash
npm install
npm run dev      # Studio at localhost:3333
```

## After changing schema

```bash
npx sanity schemas deploy
```

This uploads the schema to the Content Lake so the Next.js app's GROQ
query and any Sanity MCP tooling see the update. Editing schema without
deploying leaves the live guide unaffected.

## CORS

The Next.js app's client reads from this project over the network, so
its origin needs to be allow-listed:

```bash
npx sanity cors add http://localhost:3000 --credentials
```

Repeat with the production URL once the app is deployed.

## Deploy

```bash
npm run deploy   # sanity deploy — hosts the Studio at *.sanity.studio
```

Independent from the Next.js app's deploy — this Studio is not part of
the app's Vercel build.
