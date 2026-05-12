export function taskFromDb(row) {
  return {
    id: row.id,
    boardId: row.board_id,
    title: row.title,
    status: row.status,
    owner: row.owner,
    dueDate: row.due_date || "",
    progress: row.progress,
    remark: row.remark,
  };
}

export function taskToDb(task) {
  return {
    board_id: task.boardId,
    title: task.title,
    status: task.status,
    owner: task.owner,
    due_date: task.dueDate || null,
    progress: Number(task.progress) || 0,
    remark: task.remark || "",
  };
}

export function productFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    platform: row.platform,
    unified: row.unified,
    supplier: row.supplier,
    cost: Number(row.cost),
    price: Number(row.price),
    margin: Number(row.margin),
    listingStatus: row.listing_status,
    owner: row.owner,
    remark: row.remark,
  };
}

export function productToDb(product) {
  return {
    name: product.name,
    platform: product.platform,
    unified: product.unified,
    supplier: product.supplier || "",
    cost: Number(product.cost) || 0,
    price: Number(product.price) || 0,
    margin: Number(product.margin) || 0,
    listing_status: product.listingStatus || "",
    owner: product.owner || "徐瑞",
    remark: product.remark || "",
  };
}

export function reviewFromDb(row) {
  return {
    id: row.id,
    week: row.week,
    stage: row.stage,
    period: row.period,
    meetingTime: row.meeting_time,
    salesToDate: row.sales_to_date,
    focus: row.focus,
    actions: row.actions,
    deliverables: row.deliverables,
    result: row.result,
    nextPlan: row.next_plan,
    risk: row.risk,
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
    sales: Number(row.sales),
    orders: Number(row.orders),
    acos: Number(row.acos),
    tacos: Number(row.tacos),
    progress: Number(row.progress),
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
