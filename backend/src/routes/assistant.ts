import { FastifyInstance } from "fastify"

type AssistantBody = {

    message: string

}

export default async function assistantRoute(
    fastify: FastifyInstance
) {

    fastify.post<{
        Body: AssistantBody
    }>(
        "/",
        async (request, reply) => {

            const { message } = request.body

            if (!message)
                return reply.code(400).send({
                    error: "Missing message"
                })

            return {

                reply:
                    "Assistant backend ready.",

                actions: [],

                timestamp:
                    Date.now()

            }

        }
    )

}
