/**
 * Root loading UI – shown while the initial route segment is loading.
 * Gives a consistent first-load experience instead of a blank screen.
 */
export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 animate-pulse"
          aria-hidden
        />
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
        </div>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
