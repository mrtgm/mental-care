#syntax=docker/dockerfile:1

FROM golang:1.24 AS builder
WORKDIR /app
RUN --mount=type=bind,source=./go.mod,target=./go.mod \
  --mount=type=bind,source=./go.sum,target=./go.sum \
  --mount=type=cache,target=/go/pkg/mod\
  --mount=type=cache,target=/root/.cache/go-build\
  go mod download

RUN --mount=type=bind,source=./go.mod,target=./go.mod \
  --mount=type=bind,source=./go.sum,target=./go.sum \
  --mount=type=bind,source=./src,target=./src \
  --mount=type=cache,target=/go/pkg/mod \
  --mount=type=cache,target=/root/.cache/go-build \
  go build -o server ./src/main.go

FROM gcr.io/distroless/base-debian12

ENV ENV=production

WORKDIR /app
COPY --from=builder /app/server .
CMD ["./server"]
