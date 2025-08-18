export default function BreathingDots() {
    return(
    <div className="flex items-center justify-center gap-2">
      {[0, 0.3, 0.6].map((delay) => (
        <div
          key={delay}
          className="w-3 h-3 rounded-full bg-current opacity-70"
          style={{
            animation: 'breath 1.5s infinite ease-in-out',
            animationDelay: `${delay}s`
          }}
        />
      ))}
    </div>
  )
}