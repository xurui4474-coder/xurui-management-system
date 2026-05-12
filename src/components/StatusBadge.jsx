const colorMap = {
  未开始: "bg-gray-100 text-gray-700",
  进行中: "bg-blue-50 text-steel",
  已完成: "bg-green-50 text-sage",
  延期: "bg-orange-50 text-clay",
  风险: "bg-red-50 text-red-700",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colorMap[status] || colorMap["未开始"]}`}>
      {status}
    </span>
  );
}
