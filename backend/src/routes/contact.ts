import { FastifyInstance } from "fastify"

import { sendContactMail }
    from "../services/mailService.js"

type ContactBody = {

    name: string
    email: string
    message: string

}

export default async function contactRoute(
    fastify: FastifyInstance
) {

    fastify.post<{
        Body: ContactBody
    }>(
        "/",
        async (request, reply) => {

            const {
                name,
                email,
                message
            } = request.body

            if (!name || !email || !message)
                return reply.code(400).send({
                    error: "Missing fields"
                })

            try {

                await sendContactMail(
                    name,
                    email,
                    message
                )

                return {
                    success: true
                }

            }
            catch (err) {

                fastify.log.error(err)

                return reply.code(500).send({
                    error: "Mail delivery failed"
                })

            }

        }
    )

}
