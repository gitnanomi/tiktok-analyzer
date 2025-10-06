export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f3e7ff, #fce7f3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <h1 style={{fontSize: '36px', color: '#9333ea', marginBottom: '16px'}}>
          🎬 TikTok Analyzer
        </h1>
        <p style={{color: '#666', marginBottom: '24px'}}>
          Your platform is live! 🎉
        </p>
        <input 
          type="text" 
          placeholder="Paste TikTok URL..." 
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            marginBottom: '12px'
          }}
        />
        <button style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(to right, #9333ea, #ec4899)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Analyze
        </button>
      </div>
    </div>
  )
}
