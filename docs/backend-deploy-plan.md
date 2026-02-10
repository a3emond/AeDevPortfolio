# AEDev Portfolio — Full Backend + Deployment Architecture Plan

This document defines the complete backend, routing, containerization, and deployment architecture for the AEDev portfolio. It includes:

* Fastify backend (assistant-ready)
* Contact endpoint
* Knowledge‑base‑ready assistant endpoint
* Apache frontend serving Vite build
* Docker Compose deployment
* Reverse proxy routing

This architecture is designed to remain valid long‑term and support future AI assistant integration without structural changes.

---

# 1. Final Technology Stack

Frontend:

* Svelte
* Vite (development and build only)
* Apache serves built static files

Backend:

* Fastify (Node.js)
* Contact endpoint
* Assistant endpoint (knowledge‑base ready)
* Structured routing system

Infrastructure:

* Docker Compose
* Apache container
* Fastify container

AI integration:

* Future integration via Fastify
* No architectural changes required later

---

# 2. High‑Level Architecture

```
Internet
   ↓
Apache container
   ├── /            → frontend static files
   ├── /api/contact → Fastify
   └── /api/assistant → Fastify

Fastify container
   ├── /contact
   ├── /assistant
   ├── /health
   └── knowledge base access

Future:
Fastify → AI provider → response → frontend UI
```

Apache remains public entry point.
Fastify remains private internal service.

---

# 3. Project Structure

```
portfolio/

  frontend/

    src/
    dist/
    package.json
    vite.config.ts

    Dockerfile

  backend/

    server.js

    routes/
      contact.js
      assistant.js
      health.js

    services/
      mailService.js
      knowledgeService.js

    knowledge/
      overview.json
      projects.json
      systems.json
      skills.json

    package.json
    Dockerfile

  apache/

    httpd.conf

  docker-compose.yml
```

---

# 4. Backend Implementation (Fastify)

# 4.1 backend/package.json

```
{
  "name": "aedev-backend",
  "type": "module",
  "dependencies": {
    "fastify": "^4.0.0",
    "nodemailer": "^6.9.0"
  }
}
```

Install:

```
npm install
```

---

# 4.2 backend/server.js

This is the backend entry point.

```
import Fastify from "fastify"

import contactRoute from "./routes/contact.js"
import assistantRoute from "./routes/assistant.js"
import healthRoute from "./routes/health.js"

const fastify = Fastify({
  logger: true
})

fastify.register(healthRoute, { prefix: "/health" })
fastify.register(contactRoute, { prefix: "/contact" })
fastify.register(assistantRoute, { prefix: "/assistant" })

await fastify.listen({
  port: 3001,
  host: "0.0.0.0"
})
```

---

# 4.3 Contact Route

backend/routes/contact.js

```
import mailService from "../services/mailService.js"

export default async function contactRoute(fastify) {

  fastify.post("/", async (request, reply) => {

    const { name, email, message } = request.body

    if (!name || !email || !message)
      return reply.code(400).send()

    await mailService.sendContactMail({
      name,
      email,
      message
    })

    return { success: true }

  })

}
```

---

# 4.4 Mail Service

backend/services/mailService.js

```
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({

  host: "smtp.yourprovider.com",
  port: 587,

  auth: {
    user: "smtp-user",
    pass: "smtp-password"
  }

})

export default {

  async sendContactMail({ name, email, message }) {

    await transporter.sendMail({

      from: "admin@aedev.pro",
      to: "admin@aedev.pro",

      subject: `Portfolio Contact — ${name}`,

      text:
`Name: ${name}
Email: ${email}

${message}`

    })

  }

}
```

---

# 4.5 Assistant Route (base, AI integration later)

backend/routes/assistant.js

```
export default async function assistantRoute(fastify) {

  fastify.post("/", async (request, reply) => {

    const { message } = request.body

    if (!message)
      return reply.code(400).send()

    return {

      reply: "Assistant backend ready.",

      actions: []

    }

  })

}
```

This endpoint will later integrate knowledge base and AI.

---

# 4.6 Health Route

backend/routes/health.js

```
export default async function healthRoute(fastify) {

  fastify.get("/", async () => {

    return { status: "ok" }

  })

}
```

---

# 5. Backend Dockerfile

backend/Dockerfile

```
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

---

# 6. Frontend Dockerfile

frontend/Dockerfile

```
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM httpd:2.4-alpine

COPY --from=build /app/dist/ /usr/local/apache2/htdocs/

COPY ../apache/httpd.conf /usr/local/apache2/conf/httpd.conf
```

---

# 7. Apache Reverse Proxy Configuration

apache/httpd.conf additions:

```
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so

ProxyPass        /api/ http://backend:3001/
ProxyPassReverse /api/ http://backend:3001/
```

---

# 8. Docker Compose

```
version: "3.9"

services:

  frontend:

    build: ./frontend

    container_name: aedev_frontend

    restart: always

    ports:
      - "80:80"

    depends_on:
      - backend

  backend:

    build: ./backend

    container_name: aedev_backend

    restart: always

    expose:
      - "3001"
```

---

# 9. Frontend API Calls

Contact:

```
POST /api/contact
```

Assistant:

```
POST /api/assistant
```

---

# 10. Deployment

Build and run:

```
docker compose up -d --build
```

Update later:

```
docker compose up -d --build
```

---

# 11. Future AI Integration

No structural change required.

Fastify already provides:

```
/api/assistant
```

Knowledge base and AI orchestration will integrate inside this endpoint.

---

