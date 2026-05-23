export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100/80">
      {/* Image placeholder */}
      <div className="skeleton" style={{ aspectRatio: '1' }} />
      {/* Info placeholder */}
      <div className="p-5 space-y-3.5">
        <div className="skeleton h-2.5 w-16 rounded-full" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="skeleton h-3 w-28 rounded-full" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-5 w-20 rounded-lg" />
          <div className="skeleton h-6 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
