import { createClient } from "@/lib/supabase/server"
import { getEnvVarOrEdgeConfigValue } from "@/lib/utils/env"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")
  const provider = requestUrl.searchParams.get("provider")

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.exchangeCodeForSession(code)

    // Only apply domain filtering for Google provider
    if (provider === "google") {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (user && user.email) {
        const email = user.email

        // Get domain whitelist from environment variables
        const emailDomainWhitelistPatternsString =
          await getEnvVarOrEdgeConfigValue("EMAIL_DOMAIN_WHITELIST")
        const emailDomainWhitelist = emailDomainWhitelistPatternsString?.trim()
          ? emailDomainWhitelistPatternsString?.split(",")
          : []
        const emailWhitelistPatternsString =
          await getEnvVarOrEdgeConfigValue("EMAIL_WHITELIST")
        const emailWhitelist = emailWhitelistPatternsString?.trim()
          ? emailWhitelistPatternsString?.split(",")
          : []

        // If there are whitelist patterns, check if the email is allowed
        if (emailDomainWhitelist.length > 0 || emailWhitelist.length > 0) {
          const domainMatch = emailDomainWhitelist?.includes(
            email.split("@")[1]
          )
          const emailMatch = emailWhitelist?.includes(email)

          if (!domainMatch && !emailMatch) {
            // Sign out the user
            await supabase.auth.signOut()

            // Redirect to login page with error message
            return NextResponse.redirect(
              `${requestUrl.origin}/login?message=Email ${email} is not allowed to sign in.`
            )
          }
        }
      }
    }
  }

  if (next) {
    return NextResponse.redirect(requestUrl.origin + next)
  } else {
    return NextResponse.redirect(requestUrl.origin)
  }
}
