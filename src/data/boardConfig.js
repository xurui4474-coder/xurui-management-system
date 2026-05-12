export const boardUuidByKey = {
  selfAmazon: "11111111-1111-4111-8111-111111111111",
  agencyAmazon: "22222222-2222-4222-8222-222222222222",
  tiktok: "33333333-3333-4333-8333-333333333333",
  site: "44444444-4444-4444-8444-444444444444",
  todos: "55555555-5555-4555-8555-555555555555",
  risks: "66666666-6666-4666-8666-666666666666",
};

export const boardKeyByUuid = Object.entries(boardUuidByKey).reduce((result, [key, uuid]) => {
  result[uuid] = key;
  return result;
}, {});

export const taskBoards = [
  {
    key: "selfAmazon",
    id: boardUuidByKey.selfAmazon,
    module: "自运营 Amazon",
    description: "自运营店铺任务、广告复盘、库存与增长动作",
  },
  {
    key: "agencyAmazon",
    id: boardUuidByKey.agencyAmazon,
    module: "代运营 Amazon",
    description: "代运营交付物、会议复盘、销售目标与问题跟进",
  },
  {
    key: "tiktok",
    id: boardUuidByKey.tiktok,
    module: "TikTok 美区",
    description: "达人转化、视频数据、GMV 与店铺运营动作",
  },
  {
    key: "site",
    id: boardUuidByKey.site,
    module: "独立站",
    description: "网站制作、页面设计、产品上架与上线进度",
  },
];
