export default function LoadingScreen({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Simple dot + ring spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          {/* Outer rotating ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"
            style={{
              animationDuration: "0.8s",
            }}
          />

          {/* Center pulsing dot with glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary blur-sm opacity-60" />
              {/* Center dot */}
              <div className="relative w-3 h-3 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Loading text */}
        <p className="text-muted uppercase text-xs font-bold tracking-wider">
          {message}
        </p>
      </div>
    </div>
  );
}
