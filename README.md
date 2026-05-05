# uservice
a minimal user service example, composed of microservices

<p align="center" width="100%">
  <video src="https://github.com/user-attachments/assets/06c8bd8c-14c5-480e-8ff7-55efec8ada53" width="80%" controls></video>
</p>

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
  ./setup.sh
```
to run the suite:
`podman compose -f compose.yaml -f compose.<env>.yaml up [service]`

# about
- Features
  - login
    - login with passkey
    - login with google (oauth)
    - login with email
      - with magic link
    - logout
  - email
    - verify email
      - with magic link
    - add email
    - delete email
  - passkey
    - add passkey
    - delete passkey
  - sessions
    - delete sessions
  - pwa
    - demo pwa caching
    - manifest, installable
- Technical
  - tooling
    - AWS (EC2, ECR)
    - Github actions
    - Docker/Podman
    - Configurable logger
    - Fullstack Typescript
    - React
    - Tanstack Router
    - Tanstack Query
    - Zustand (application state management)
    - Shadcn
    - Tailwind
    - Vite
    - Bun
    - Elysia
    - Eden (tprc-like typesafe api client)
    - Drizzle Orm
    - Sqlite
    - React Email
    - Node Mailer
    - Bunqueue

  - microservices architecture
    - dedicated mobile first, responsive web client
    - dedicated api
    - dedicated mailing microservice
    - embedded db
    - jwt access and refresh token auth
    - containerized services (docker or podman)
    - reverse proxies

  - features
    - refresh token used for generating access tokens
      - access tokens used for accessing protected apis
        - refresh and access tokens regenerated on protected requests
      - sessions used for managing auth instances across devices
    - passkey default security
      - no passwords whatsoever
      - email login via magic link for account access across devices
    - containerized dev env for maximal dev/prod symmetry
    - scalable to 1mil+ users by default
      - each service configurable to have reverse proxies by default
      - each service configurable to be deployed to separate instances by default
  - all services have their own client for modularity and service agnosticism
- Notes
  - application is for demonstration purposes
    - intended to show tooling proficiency, architectural competency, design coherence
    - some functionality may be buggy
      - ui may not be pixel perfect
      - some standard features may not be present
        - error boundary
        - 404 page
        - account deletion
        - account editing
        - robust test suite
