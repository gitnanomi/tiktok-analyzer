export const metadata = {
  title: 'TikTok Creator Platform',
  description: 'AI-Powered Video Analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body style={{margin: 0, padding: 0}}>
        {children}
      </body>
    </html>
  )
}
