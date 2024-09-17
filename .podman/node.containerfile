FROM docker.io/library/node:current-alpine

RUN apk update && apk add git openssh

RUN mkdir -m 755 /workspace

RUN printf "%s\n" \
  '{' \
  '  "scripts": {' \
  '    "test": "vitest --run",' \
  '    "watch": "vitest",' \
  '    "verbose": "vitest --run --reporter=verbose",' \
  '    "coverage": "vitest --run --coverage"' \
  '  }' \
  '}' \
  '' > /workspace/package.json

RUN printf "%s\n" \
  "import { defineConfig } from 'vitest/config'" \
  "" \
  "export default defineConfig({" \
  "  test: {" \
  "    coverage: {" \
  "      provider: 'istanbul'," \
  "      reporter: ['text']," \
  "      include: ['**/scr/**']" \
  "    }," \
  "  }," \
  "})" \
  "" > /workspace/vitest.config.ts

RUN cd /workspace && npm install -D vitest && \
  npm install -D @vitest/coverage-istanbul
