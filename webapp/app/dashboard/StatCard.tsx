// components/StatCard.tsx
interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  color: string;
}

export default function StatCard({ title, value, subtext, color }: StatCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex-1 text-center">
      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white ${color}`}>
        {/* Icon Placeholder */}
        <span className="text-lg font-bold">!</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{subtext}</p>
    </div>
  );
}
