import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { owners, platforms } from "../data/initialData";
import { exportToCsv } from "../utils/csv";
import PageHeader from "./PageHeader";

const emptyProduct = {
  name: "新产品",
  platform: "Amazon",
  unified: "是",
  supplier: "",
  cost: 0,
  price: 0,
  margin: 0,
  listingStatus: "调研中",
  owner: "徐瑞",
  remark: "",
};

export default function ProductTable({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return products.filter((item) => {
      const matchedSearch = !keyword || Object.values(item).some((value) => String(value).toLowerCase().includes(keyword));
      const matchedPlatform = !platform || item.platform === platform;
      return matchedSearch && matchedPlatform;
    });
  }, [products, search, platform]);

  const update = (id, field, value) => {
    const current = products.find((item) => item.id === id);
    if (!current) return;
    const next = { ...current, [field]: value };
    if (field === "cost" || field === "price") {
      const cost = Number(field === "cost" ? value : next.cost);
      const price = Number(field === "price" ? value : next.price);
      next.margin = price ? Number((((price - cost) / price) * 100).toFixed(1)) : 0;
    }
    onUpdateProduct(next);
  };

  return (
    <section>
      <PageHeader
        title="选品总表"
        subtitle="统一管理 Amazon / TikTok / 独立站选品状态、成本、售价与毛利率"
        onAdd={() => onAddProduct(emptyProduct)}
        onExport={() => exportToCsv("选品总表.csv", filtered)}
      />

      <div className="mb-4 grid grid-cols-[1fr_180px] gap-3">
        <input
          className="rounded-lg border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-sage"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="搜索产品、供应商、备注"
        />
        <select className="rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-sage" value={platform} onChange={(event) => setPlatform(event.target.value)}>
          <option value="">全部平台</option>
          {platforms.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs font-semibold text-muted">
            <tr>
              {["产品名称", "平台", "统一选品", "供应商", "成本价", "售价", "毛利率", "上架状态", "负责人", "备注", "操作"].map((head) => (
                <th key={head} className="px-3 py-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-2 py-2">
                  <input className="table-input font-semibold" value={item.name} onChange={(event) => update(item.id, "name", event.target.value)} />
                </td>
                <td className="px-2 py-2">
                  <select className="table-select" value={item.platform} onChange={(event) => update(item.id, "platform", event.target.value)}>
                    {platforms.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <select className="table-select" value={item.unified} onChange={(event) => update(item.id, "unified", event.target.value)}>
                    <option>是</option>
                    <option>否</option>
                  </select>
                </td>
                <td className="px-2 py-2">
                  <input className="table-input" value={item.supplier} onChange={(event) => update(item.id, "supplier", event.target.value)} />
                </td>
                <td className="px-2 py-2">
                  <input className="table-input" type="number" value={item.cost} onChange={(event) => update(item.id, "cost", event.target.value)} />
                </td>
                <td className="px-2 py-2">
                  <input className="table-input" type="number" value={item.price} onChange={(event) => update(item.id, "price", event.target.value)} />
                </td>
                <td className="px-3 py-2 font-semibold">{item.margin}%</td>
                <td className="px-2 py-2">
                  <input className="table-input" value={item.listingStatus} onChange={(event) => update(item.id, "listingStatus", event.target.value)} />
                </td>
                <td className="px-2 py-2">
                  <select className="table-select" value={item.owner} onChange={(event) => update(item.id, "owner", event.target.value)}>
                    {owners.map((owner) => (
                      <option key={owner}>{owner}</option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <input className="table-input" value={item.remark} onChange={(event) => update(item.id, "remark", event.target.value)} />
                </td>
                <td className="px-3 py-2">
                  <button className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-700" onClick={() => onDeleteProduct(item.id)} title="删除">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td className="px-4 py-10 text-center text-muted" colSpan="11">
                  暂无选品，点击右上角新增
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
