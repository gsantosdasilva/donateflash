import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    // Exchange the code for an access token
    const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID!, // Seu Client ID da Twitch
        client_secret: process.env.TWITCH_CLIENT_SECRET!, // Seu Client Secret da Twitch
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/twitch/callback`, // URL base + caminho de callback
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.access_token) {
      // Get user info
      const userResponse = await fetch("https://api.twitch.tv/helix/users", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID!, // Seu Client ID da Twitch
        },
      })

      const userData = await userResponse.json()

      // Aqui você normalmente criaria uma sessão ou JWT para o usuário
      // Para este exemplo, apenas redirecionamos para o dashboard com as informações do usuário

      // Definir um cookie para indicar que o usuário está autenticado
      const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`)
      response.cookies.set("authenticated", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 dias
      })

      return response
    }
  }

  // Se algo deu errado, redirecionar para a página inicial
  return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL!)
}

