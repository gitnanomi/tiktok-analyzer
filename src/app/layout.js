import './globals.css'

export const metadata = {
  title: 'TikTok视频分析工具',
  description: 'AI驱动的视频深度分析',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
