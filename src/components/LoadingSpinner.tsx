export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-16 h-16 mb-6">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 border-4 border-[#FFDF00]/20 rounded-full"></div>
        {/* Inner spinning ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-[#FFDF00] rounded-full animate-spin"></div>
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-[#FFDF00] rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-white/60 text-sm font-bold uppercase tracking-wider animate-pulse">
        {message}
      </p>
    </div>
  );
}
