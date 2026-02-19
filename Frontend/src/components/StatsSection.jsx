export default function StatsSection() {
  const stats = [
    { title: "Total Issues", value: 124 },
    { title: "Resolved", value: 87 },
    { title: "In Progress", value: 25 },
    { title: "Cities Covered", value: 12 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
        >
          <p className="text-gray-500">{item.title}</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
