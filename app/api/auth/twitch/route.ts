import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Substitua estas variáveis de ambiente com suas próprias credenciais da Twitch
  // Você pode configurá-las em um arquivo .env.local ou no painel do Vercel
  const clientId = process.env.TWITCH_CLIENT_ID // Seu Client ID da Twitch
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/twitch/callback` // URL base + caminho de callback
  const scope = "user:read:email"

  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`

  return NextResponse.redirect(twitchAuthUrl)
}

