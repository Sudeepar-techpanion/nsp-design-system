export default function Loading() {
  return (
    <div className="p-8 space-y-4">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      <div className="h-4 w-96 bg-muted animate-pulse rounded" />
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="h-64 bg-muted animate-pulse rounded" />
        <div className="col-span-2 h-64 bg-muted animate-pulse rounded" />
      </div>
    </div>
  )
}
