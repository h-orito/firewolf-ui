import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 基本的なヘルスチェック
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    }

    return NextResponse.json(healthData, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    )
  }
}
