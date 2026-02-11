function requireEnv(name: string): string {

    const value = process.env[name]

    if (!value)
        throw new Error(`Missing environment variable: ${name}`)

    return value

}

export const env = {

    NODE_ENV:
        process.env.NODE_ENV ?? "development",

    PORT:
        Number(process.env.PORT ?? 3001),

    SMTP_HOST:
        requireEnv("SMTP_HOST"),

    SMTP_PORT:
        Number(requireEnv("SMTP_PORT")),

    SMTP_USER:
        requireEnv("SMTP_USER"),

    SMTP_PASS:
        requireEnv("SMTP_PASS"),

    CONTACT_TO:
        requireEnv("CONTACT_TO"),

    CONTACT_FROM:
        requireEnv("CONTACT_FROM")

}
