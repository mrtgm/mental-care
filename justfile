killport *port:
    lsof -i :{{port}} | awk 'NR!=1 {print $2}' | xargs kill

# ログ
logs-caddy:
    docker logs -f caddy-local

logs-db:
    docker logs -f db-local

logs-all:
    docker compose -p mental-care_devcontainer logs -f


# 開発環境のリセット
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

    echo "🚀 Starting development environment..."
    tmux new-session -d -s $SESSION_NAME

    # Frontend (TypeScript)
    tmux rename-window -t $SESSION_NAME:0 'frontend'
    tmux send-keys -t $SESSION_NAME:frontend 'cd frontend && echo "🎨 Starting Frontend..." && bun run dev' C-m

    # Backend (Golang)
    tmux new-window -t $SESSION_NAME -n 'backend'
    tmux send-keys -t $SESSION_NAME:backend 'cd backend && echo "⚡ Starting Backend..." && air' C-m

    # Services (Database, Caddy)
    tmux new-window -t $SESSION_NAME -n 'services'
    tmux send-keys -t $SESSION_NAME:services 'echo "🐳 Monitoring Services..." && docker logs -f caddy-local' C-m

    # Terminal
    tmux new-window -t $SESSION_NAME -n 'terminal'
    tmux send-keys -t $SESSION_NAME:terminal 'clear && echo "🔧 Development Terminal Ready"' C-m

    echo "✅ Development environment started!"
    echo "📍 Frontend: http://localhost:3000"
    echo "📍 Backend API: http://localhost/api/"
    echo "📍 Direct Backend: http://localhost:8080"
    echo "💡 Use 'just attach' to reattach to session"
    echo "💡 Use 'just stop' to stop everything"

    # セッションにアタッチ
    tmux attach-session -t $SESSION_NAME

# 既存のセッションにアタッチ
attach:
    tmux attach-session -t mental-care-dev
