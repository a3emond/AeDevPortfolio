# AEDev Portfolio

A technical, app-like personal portfolio engineered as a real system rather than a static website.

This project is built as a full-stack application from day one, with a strong emphasis on structure, determinism, and long-term maintainability. The goal is to present projects, systems, and competencies through a controlled, minimal interface that reflects real-world engineering practices.

---

## Core Principles

* Structure over style
* Motion as feedback, not decoration
* Frontend is deterministic and stateless where possible
* Backend owns all sensitive logic
* No unnecessary complexity or tooling
* Dev and production environments mirror each other closely

---

## High-Level Architecture

### Frontend

* Svelte (SPA)
* TypeScript
* Vite
* Motion One for deliberate UI transitions
* No UI framework

### Backend

* Node.js (TypeScript)
* Fastify
* Strict validation, rate limiting, and structured logging

### Infrastructure

* Docker Compose (development and production)
* Apache reverse proxy in production
* Static frontend + proxied API

### AI

* Server-side AI proxy
* Fully scoped to curated, versioned knowledge
* Strict rate limiting and abuse control
* No secrets or direct provider access from the frontend

---

## Repository Structure

```
portfolio/
  frontend/   # Svelte + Vite application
  backend/    # Fastify API (Node.js / TypeScript)
  infra/      # Docker and deployment configuration
  docs/       # Architecture notes and technical documentation
```

---

## Non-Goals

* No CMS
* No SSR
* No heavy database unless clearly justified
* No design-heavy assets or illustrations
* No frontend access to secrets or AI providers

---

## Status

This repository is under active development.
Features are implemented end-to-end and deployed incrementally.

---

## Author

**Alexandre Emond**
© 2025 — All rights reserved

---

## License

```
Copyright © 2025 Alexandre Emond

All rights reserved.

This software and its associated source code, documentation, and assets
are the exclusive property of Alexandre Emond.

No part of this project may be copied, modified, published, distributed,
sublicensed, or used in derivative works without explicit written
permission from the author.

This repository is provided for viewing and evaluation purposes only.
Unauthorized use is strictly prohibited.
```

