export default function News() {
  return (
    <div className="w-full px-10 py-10 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg">
      <h2 className="text-lg font-semibold mb-6">NEWS</h2>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 w-[calc(240px*8+48px)] px-1">
          {[...Array(8)].map((_, i) => (
            <div key={`news-${i}`} className="news-box flex-shrink-0 flex items-center justify-center text-gray-600">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
