'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <div className="rounded-full bg-red-100 p-4">
          <span className="material-symbols-outlined text-6xl text-red-600">error</span>
        </div>
        <h2 className="text-2xl font-bold text-header-text">Something went wrong!</h2>
        <p className="text-body-text">{error.message || 'An unexpected error occurred'}</p>
        <button
          onClick={reset}
          className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-btn h-10 px-5 bg-primary-green text-white text-sm font-semibold transition-all duration-200 ease-in-out hover:scale-105"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
