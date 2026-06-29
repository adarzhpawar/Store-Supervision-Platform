export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center w-full gap-2">
      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"></div>
    </div>
  )
}
