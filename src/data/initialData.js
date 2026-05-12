export const statuses = ["未开始", "进行中", "已完成", "延期", "风险"];
export const owners = ["徐瑞", "运营A", "运营B", "设计", "代运营", "供应链"];
export const platforms = ["Amazon", "TikTok", "独立站"];

export const businessSections = [
  { id: "selfAmazon", name: "自运营亚马逊", shortName: "自运营", accent: "sage" },
  { id: "agencyAmazon", name: "代运营亚马逊", shortName: "代运营", accent: "steel" },
  { id: "tiktok", name: "TikTok 美区", shortName: "TikTok", accent: "clay" },
  { id: "site", name: "独立站", shortName: "独立站", accent: "sage" },
];

export const initialTasks = {
  selfAmazon: [
    {
      id: "task-1",
      title: "Minirain 核心词广告 ACOS 复盘",
      status: "进行中",
      owner: "徐瑞",
      dueDate: "2026-05-15",
      progress: 60,
      remark: "重点看 Sales、CTR、CPC、ACOS 与自然单占比",
    },
    {
      id: "task-2",
      title: "库存风险 SKU 周检查",
      status: "风险",
      owner: "供应链",
      dueDate: "2026-05-13",
      progress: 30,
      remark: "低于 21 天库存需同步补货节奏",
    },
  ],
  agencyAmazon: [
    {
      id: "task-3",
      title: "Softrain 代运营交付物确认",
      status: "延期",
      owner: "代运营",
      dueDate: "2026-05-10",
      progress: 45,
      remark: "需补充关键词动作和下周预算建议",
    },
    {
      id: "task-4",
      title: "周度复盘会议纪要",
      status: "进行中",
      owner: "徐瑞",
      dueDate: "2026-05-14",
      progress: 70,
      remark: "按销售额、广告、Review、库存输出结论",
    },
  ],
  tiktok: [
    {
      id: "task-5",
      title: "达人视频转化数据整理",
      status: "进行中",
      owner: "运营A",
      dueDate: "2026-05-16",
      progress: 55,
      remark: "关注 ROI、CPM、CTR、完播率、GMV",
    },
  ],
  site: [
    {
      id: "task-6",
      title: "独立站首页视觉与产品页结构确认",
      status: "未开始",
      owner: "设计",
      dueDate: "2026-05-20",
      progress: 15,
      remark: "先完成首屏、类目页、产品详情页",
    },
  ],
  todos: [
    {
      id: "task-7",
      title: "整理本周老板汇报数据",
      status: "进行中",
      owner: "徐瑞",
      dueDate: "2026-05-17",
      progress: 50,
      remark: "输出结果、问题、卡点、计划、支持需求",
    },
  ],
  risks: [
    {
      id: "risk-1",
      title: "代运营广告动作不够具体",
      status: "风险",
      owner: "徐瑞",
      dueDate: "2026-05-14",
      progress: 20,
      remark: "需要求按广告组和关键词层级给调整记录",
    },
  ],
};

export const initialReviews = [
  {
    id: "review-1",
    week: "2026-W20",
    stage: "增长优化",
    period: "2026/05/11-2026/05/17",
    meetingTime: "周四 16:00",
    salesToDate: "¥86,500",
    focus: "广告 ACOS、自然单占比、库存风险",
    actions: "压低高 CPC 词，补充核心词排名，检查 Review 增长",
    deliverables: "广告调整表、关键词报表、下周预算计划",
    result: "待复盘",
    nextPlan: "聚焦高转化词，清理低效预算",
    risk: "部分广告组未提供具体调整依据",
  },
];

export const initialProducts = [
  {
    id: "product-1",
    name: "Rain cover organizer",
    platform: "Amazon",
    unified: "是",
    supplier: "供应商A",
    cost: 35,
    price: 89,
    margin: 60.7,
    listingStatus: "待上架",
    owner: "徐瑞",
    remark: "适合 Minirain 关联测试",
  },
  {
    id: "product-2",
    name: "Travel soft storage bag",
    platform: "TikTok",
    unified: "否",
    supplier: "供应商B",
    cost: 18,
    price: 49,
    margin: 63.3,
    listingStatus: "调研中",
    owner: "运营A",
    remark: "需验证达人视频卖点",
  },
];

export const initialMetrics = [
  { id: "metric-1", channel: "自运营亚马逊", sales: 128000, orders: 980, acos: 22.5, tacos: 10.8, progress: 72 },
  { id: "metric-2", channel: "代运营亚马逊", sales: 86500, orders: 620, acos: 28.7, tacos: 14.2, progress: 58 },
  { id: "metric-3", channel: "TikTok 美区", sales: 41200, orders: 390, acos: 0, tacos: 0, progress: 46 },
  { id: "metric-4", channel: "独立站", sales: 18600, orders: 88, acos: 0, tacos: 0, progress: 35 },
];
