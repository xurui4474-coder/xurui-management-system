import { Search } from "lucide-react";

export default function Filters({ search, setSearch, status, setStatus, owner, setOwner, statuses = [], owners = [] }) {
  return (
    <div className="mb-4 grid grid-cols-[1fr_160px_160px] gap-3">
      <label className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
        <input
          className="w-full rounded-lg border border-line bg-paper py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sage"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="搜索任务、备注、负责人"
        />
      </label>
      <select className="rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-sage" value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="">全部状态</option>
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select className="rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-sage" value={owner} onChange={(event) => setOwner(event.target.value)}>
        <option value="">全部负责人</option>
        {owners.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
