```bash
just install  # Install dependencies
just maintenance  # Run maintenance tasks
just deploy  # Copy files to the server
```

/opt/mental 以下に下記を配置：
- compose/
  - compose.yml
  - .env
- secrets/
  - ansible_vault_pass
  - postgres_password ...
- docker/
  - caddy/Caddyfile
  - db/
    - init.sql
