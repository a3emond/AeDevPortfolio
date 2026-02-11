import Fastify from "fastify"

import { env } from "./config/env.js"

import healthRoute from "./routes/health.js"
import contactRoute from "./routes/contact.js"
import assistantRoute from "./routes/assistant.js"

const fastify = Fastify({
    logger: true
})

fastify.register(healthRoute, {
    prefix: "/health"
})

fastify.register(contactRoute, {
    prefix: "/contact"
})

fastify.register(assistantRoute, {
    prefix: "/assistant"
})

await fastify.listen({
    host: "0.0.0.0",
    port: env.PORT
})
