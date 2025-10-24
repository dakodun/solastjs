FROM docker.io/library/node:25.0-bookworm-slim

# git not installed by default in slim image
RUN apt-get update && apt-get -y upgrade && \
  apt-get install -y git

# create the workspace directory (we project source into this directory)
RUN mkdir -m 755 /workspace

# create default package.json
RUN printf "%s\n" \
  '{' \
  '  "scripts": {' \
  '    "test": "vitest",' \
  '    "test-once": "vitest --run",' \
  '    "test-verbose": "vitest --run --reporter=tree",' \
  '    "test-bench": "vitest bench --run --browser.enabled",' \
  '    "test-coverage": "vitest --run --coverage",' \
  '    "test-coverage-html": "vitest --run --coverage --coverage.reporter=html",' \
  '    "test-browser": "vitest --run --browser.enabled"' \
  '  }' \
  '}' \
  '' > /workspace/package.json

# create default vitest config
RUN printf "%s\n" \
  "import { defineConfig } from 'vitest/config'" \
  "import { playwright } from '@vitest/browser-playwright'" \
  "" \
  "export default defineConfig({" \
  "  test: {" \
  "    include: ['solastjs/tests/unit/**']," \
  "    coverage: {" \
  "      provider: 'istanbul'," \
  "      reporter: ['text']," \
  "      reportsDirectory: 'solastjs/tests/coverage'," \
  "      include: ['solastjs/src/**']" \
  "    }," \
  "    benchmark: {" \
  "      include: ['solastjs/tests/bench/**']" \
  "    }," \
  "    browser: {" \
  "      provider: playwright()," \
  "      instances: [" \
  "        { browser: 'firefox' }," \
  "      ]," \
  "    }," \
  "  }," \
  "})" \
  "" > /workspace/vitest.config.ts

# add alias to use npm via virtual x-server
  RUN printf "%s\n" \
  "" \
  "alias xnpm='xvfb-run npm'" \
  "" >> ~/.bashrc

# install vitest, istanbul for coverage and playwright for browser
# testing (with firefox)
RUN cd /workspace && npm install -D vitest && \
  npm install -D @vitest/coverage-istanbul && \
  npm install -D @vitest/browser-playwright && \
  npx playwright install --with-deps firefox
