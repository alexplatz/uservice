# uservice
a minimal user microservice example

# installation
clone in the repo and run nix:
```
  git clone https://gitlab.com/odd/webapp-template
  cd webapp-template
  nix develop
```
to setup the db:
```
  cd apps/db
  bunx --bun drizzle-kit generate --dialect sqlite --schema ./schema.ts
  bun run migrate.ts
  bun run seed.ts
```
to run the suite:
`podman compose up [service]`
