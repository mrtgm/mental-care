#syntax=docker/dockerfile:1

FROM oven/bun:latest AS dev-dependencies
WORKDIR /app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lockb,target=bun.lockb \
    --mount=type=cache,target=/root/.bun,sharing=locked \
    bun install --frozen-lockfile

FROM oven/bun:latest AS prod-dependencies
WORKDIR /app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lockb,target=bun.lockb \
    --mount=type=cache,target=/root/.bun,sharing=locked \
    bun install --frozen-lockfile --production

FROM oven/bun:latest AS builder
COPY --from=dev-dependencies /app/node_modules /app/node_modules
WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/root/.bun,sharing=locked \
    bun run build

FROM oven/bun:slim AS prod-runner
COPY --from=prod-dependencies --chown=bun:bun /app/node_modules /app/node_modules
COPY --from=builder --chown=bun:bun /app/build /app/build
COPY package.json /app/package.json
WORKDIR /app
USER bun
ENV ENV=production
CMD ["bun", "run", "start"]
