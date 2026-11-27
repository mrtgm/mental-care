#syntax=docker/dockerfile:1

FROM oven/bun:1.4.5 AS dev-dependencies
WORKDIR /app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lockb,target=bun.lockb \
    --mount=type=cache,target=/root/.bun,sharing=locked \
    bun install --frozen-lockfile

FROM oven/bun:1.4.5 AS prod-dependencies
WORKDIR /app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lockb,target=bun.lockb \
    --mount=type=cache,target=/root/.bun,sharing=locked \
    bun install --frozen-lockfile --production

FROM oven/bun:1.4.5 AS builder
COPY --from=dev-dependencies /app/node_modules /app/node_modules
WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/root/.bun,sharing=locked \
    bun run build

FROM node:22-slim AS prod-runner
WORKDIR /app
COPY --from=prod-dependencies --chown=node:node /app/node_modules /app/node_modules
COPY --from=builder --chown=node:node /app/build /app/build
COPY package.json /app/package.json
USER node
ENV ENV=production NODE_ENV=production
CMD ["node", "node_modules/@react-router/serve/bin.js", "./build/server/index.js"]
