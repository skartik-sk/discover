export default function LoadingScreen({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Loading spinner matching cursor style */}
        <div className="relative w-12 h-12 mx-auto mb-4">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />

          {/* Rotating ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"
            style={{
              animationDuration: "0.6s",
            }}
          />

          {/* Center dot with glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary blur-md opacity-75 animate-pulse" />
              {/* Center dot */}
              <div className="relative w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
            </div>
          </div>
        </div>

        {/* Loading text */}
        <p className="text-muted text-xs font-semibold tracking-widest uppercase">
          {message}
        </p>
      </div>
    </div>
  );
}
