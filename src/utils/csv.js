const columnLabels = {
  id: "ID",
  boardId: "板块ID",
  board_id: "板块ID",
  module: "板块",
  title: "任务",
  status: "状态",
  owner: "负责人",
  dueDate: "截止日期",
  due_date: "截止日期",
  progress: "进度",
  notes: "备注",
  remark: "备注",
  name: "产品名称",
  platform: "平台",
  unified: "统一选品",
  supplier: "供应商",
  cost: "成本价",
  price: "售价",
  margin: "毛利率",
  listingStatus: "上架状态",
  listing_status: "上架状态",
  week: "周次",
  stage: "阶段",
  period: "周期",
  meetingTime: "沟通时间",
  meeting_time: "沟通时间",
  salesToDate: "截止销售额",
  sales_to_date: "截止销售额",
  focus: "沟通重点",
  actions: "本周具体落实动作",
  deliverables: "代运营交付物",
  result: "本周复盘结果",
  nextPlan: "下周计划",
  next_plan: "下周计划",
  risk: "风险问题",
  channel: "业务板块",
  sales: "销售额",
  orders: "订单数",
  acos: "ACOS",
  tacos: "TACOS",
};

const preferredOrder = [
  "module",
  "boardId",
  "board_id",
  "title",
  "status",
  "owner",
  "dueDate",
  "due_date",
  "progress",
  "notes",
  "remark",
  "name",
  "platform",
  "unified",
  "supplier",
  "cost",
  "price",
  "margin",
  "listingStatus",
  "listing_status",
  "week",
  "stage",
  "period",
  "meetingTime",
  "meeting_time",
  "salesToDate",
  "sales_to_date",
  "focus",
  "actions",
  "deliverables",
  "result",
  "nextPlan",
  "next_plan",
  "risk",
  "channel",
  "sales",
  "orders",
  "acos",
  "tacos",
];

function inferColumns(rows, columns) {
  if (columns?.length) return columns;
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const visibleKeys = keys.filter((key) => key !== "id");
  return visibleKeys.sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a);
    const bIndex = preferredOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

function displayValue(value, key) {
  if (value === true) return "是";
  if (value === false) return "否";
  if ((key === "progress" || key === "margin") && value !== "" && value != null) return `${value}%`;
  return value ?? "";
}

function escapeCell(value, key) {
  const text = String(displayValue(value, key));
  const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

export function buildCsvContent(rows, columns) {
  if (!rows.length) return "";
  const headers = inferColumns(rows, columns);
  const headerLine = headers.map((key) => escapeCell(columnLabels[key] || key, key)).join(",");
  const bodyLines = rows.map((row) => headers.map((key) => escapeCell(row[key], key)).join(","));
  return [headerLine, ...bodyLines].join("\r\n");
}

export function exportToCsv(filename, rows, columns) {
  if (!rows.length) return;
  const csv = buildCsvContent(rows, columns);
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
