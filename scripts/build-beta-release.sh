#!/bin/bash
set -e

echo "📦 Building packages..."
pnpm build

echo "📦 Packing contextual-ui core..."
cd packages/core
pnpm pack

echo "✅ Done! Tarball created:"
ls -la *.tgz
echo ""
echo "🚀 Next steps:"
echo "1. Publish jsonld-graph-builder to npm: cd packages/jsonld-graph-builder && npm publish --access public"
echo "2. Create a GitHub Release (e.g. v0.2.0-beta.1)"
echo "3. Upload the created packages/core/contextual-ui-*.tgz tarball to the release assets."
