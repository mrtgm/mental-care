```bash
just install  # Install dependencies
just maintenance  # Run maintenance tasks
just deploy  # Copy files to the server
```

VPS の /opt/mental 以下に /vps 以下をコピー：
- compose/
  - compose.yml
  - .env # 本番用環境変数ファイル
- secrets/
  - ansible_vault_pass
  - postgres_password ...
- docker/
  - caddy/Caddyfile
  - db/
    - init.sql
