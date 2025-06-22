killport *port:
    lsof -i :{{port}} | awk 'NR!=1 {print $2}' | xargs kill

# イメージビルド
image-build:
    ./bin/image-build.sh

# ログ
logs-caddy:
    docker logs -f caddy-local

logs-db:
    docker logs -f db-local

logs-all:
    docker compose -p mental-care_devcontainer logs -f

# 開発環境のリセット
kill-all:
    docker kill $(docker ps -q)
    docker rm $(docker ps -aq)

clean:
    docker compose -p mental-care_devcontainer down
    docker volume prune -f
    docker image prune -f

# データベース操作
connect-db:
    psql -h db -p 5432 -U mental -d postgres

seed-db:
    docker compose exec db psql -U postgres -d mydb -f /docker-entrypoint-initdb.d/seed.sql

dev:
    #!/usr/bin/env bash
    SESSION_NAME="mental-care-dev"

    # 既存セッションがあれば削除
    tmux has-session -t $SESSION_NAME 2>/dev/null && tmux kill-session -t $SESSION_NAME

    tmux new-session -d -s $SESSION_NAME

    tmux rename-window -t $SESSION_NAME:0 'dev'
    tmux split-window -t $SESSION_NAME:dev -h
    tmux send-keys -t $SESSION_NAME:dev.0 'cd frontend && echo "🎨 Starting Frontend..." && bun run dev' C-m
    tmux send-keys -t $SESSION_NAME:dev.1 'cd backend && echo "⚡ Starting Backend..." && air' C-m

    tmux new-window -t $SESSION_NAME -n 'services'
    tmux send-keys -t $SESSION_NAME:services 'echo "🐳 Monitoring Services..." && docker logs -f caddy-local' C-m

    tmux new-window -t $SESSION_NAME -n 'terminal'
    tmux send-keys -t $SESSION_NAME:terminal 'clear && echo "🔧 Development Terminal Ready"' C-m

    tmux select-window -t $SESSION_NAME:dev

    tmux attach-session -t $SESSION_NAME

# 既存のセッションにアタッチ
attach:
    tmux attach-session -t mental-care-dev
