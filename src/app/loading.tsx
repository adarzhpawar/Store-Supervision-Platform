export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-screen w-full gap-2 bg-background">
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
    </div>
  )
}
