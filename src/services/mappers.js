function toYesNo(value) {
  if (value === true) return "是";
  if (value === false) return "否";
  if (value === "true") return "是";
  if (value === "false") return "否";
  return value || "否";
}

function toBoolean(value) {
  if (value === true || value === "true" || value === "是" || value === "yes" || value === 1) return true;
  return false;
}

export function taskFromDb(row) {
  const notes = row.notes || row.remark || "";
  return {
    id: row.id,
    boardId: row.board_id,
    board_id: row.board_id,
    module: row.module || "",
    title: row.title || "",
    status: row.status || "未开始",
    owner: row.owner || "徐瑞",
    dueDate: row.due_date || "",
    due_date: row.due_date || "",
    progress: Number(row.progress) || 0,
    notes,
    remark: notes,
  };
}

export function taskToDb(task) {
  return {
    board_id: task.boardId || task.board_id,
    module: task.module || "",
    title: task.title || task.taskName || "新任务",
    status: task.status || "未开始",
    owner: task.owner || "徐瑞",
    due_date: task.dueDate || task.due_date || task.deadline || null,
    progress: Number(task.progress) || 0,
    notes: task.notes || task.remark || "",
  };
}

export function productFromDb(row) {
  return {
    id: row.id,
    name: row.name || "",
    platform: row.platform || "Amazon",
    unified: toYesNo(row.unified),
    supplier: row.supplier || "",
    cost: Number(row.cost) || 0,
    price: Number(row.price) || 0,
    margin: Number(row.margin) || 0,
    listingStatus: row.listing_status || "",
    owner: row.owner || "徐瑞",
    remark: row.remark || "",
  };
}

export function productToDb(product) {
  return {
    name: product.name || "新产品",
    platform: product.platform || "Amazon",
    unified: toBoolean(product.unified),
    supplier: product.supplier || "",
    cost: Number(product.cost) || 0,
    price: Number(product.price) || 0,
    margin: Number(product.margin) || 0,
    listing_status: product.listingStatus || "调研中",
    owner: product.owner || "徐瑞",
    remark: product.remark || "",
  };
}

export function reviewFromDb(row) {
  return {
    id: row.id,
    week: row.week || "",
    stage: row.stage || "",
    period: row.period || "",
    meetingTime: row.meeting_time || "",
    salesToDate: row.sales_to_date || "",
    focus: row.focus || "",
    actions: row.actions || "",
    deliverables: row.deliverables || "",
    result: row.result || "",
    nextPlan: row.next_plan || "",
    risk: row.risk || "",
  };
}

export function reviewToDb(review) {
  return {
    week: review.week || "",
    stage: review.stage || "",
    period: review.period || "",
    meeting_time: review.meetingTime || "",
    sales_to_date: review.salesToDate || "",
    focus: review.focus || "",
    actions: review.actions || "",
    deliverables: review.deliverables || "",
    result: review.result || "",
    next_plan: review.nextPlan || "",
    risk: review.risk || "",
  };
}

export function metricFromDb(row) {
  return {
    id: row.id,
    channel: row.channel,
    sales: Number(row.sales) || 0,
    orders: Number(row.orders) || 0,
    acos: Number(row.acos) || 0,
    tacos: Number(row.tacos) || 0,
    progress: Number(row.progress) || 0,
  };
}

export function metricToDb(metric) {
  return {
    channel: metric.channel,
    sales: Number(metric.sales) || 0,
    orders: Number(metric.orders) || 0,
    acos: Number(metric.acos) || 0,
    tacos: Number(metric.tacos) || 0,
    progress: Number(metric.progress) || 0,
  };
}
