export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo/Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-white/10 border-t-[#FFDF00] animate-spin" />

          {/* Inner pulsing circle */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#FFDF00]/20 to-transparent animate-pulse" />

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#FFDF00]" />
          </div>
        </div>

        {/* Loading text */}
        <p className="text-white/60 uppercase text-sm font-bold tracking-wider">
          Loading...
        </p>
      </div>
    </div>
  );
}
