export const formConfig = [
  {
    label: "用途",
    type: "select",
    name: "purpose",
    search: true,
    required: true,
    options: [
      {
        label: "住宅",
        value: "住宅",
      },
      {
        label: "别墅",
        value: "别墅",
      },
      {
        label: "公寓",
        value: "公寓",
      },
      {
        label: "写字楼",
        value: "写字楼",
      },
      {
        label: "商铺",
        value: "商铺",
      },
      {
        label: "厂房",
        value: "厂房",
      },
      {
        label: "仓库",
        value: "仓库",
      },
      {
        label: "车位",
        value: "车位",
      },
    ],
  },
  {
    label: "交易类型",
    type: "select",
    name: "transaction_type",
    required: true,
    options: [
      {
        label: "出售",
        value: "出售",
      },
      {
        label: "出租",
        value: "出租",
      },
      {
        label: "租售",
        value: "租售",
      },
    ],
  },
  {
    label: "状态",
    type: "select",
    name: "house_status",
    required: true,
    options: [
      {
        label: "有效",
        value: "有效",
        options: [
          {
            label: "公盘",
            value: "公盘",
          },
        ],
      },
      {
        label: "暂缓",
        value: "暂缓",
        options: [
          {
            label: "公盘",
            value: "公盘",
          },
        ],
      },
      {
        label: "未知",
        value: "未知",
        options: [
          {
            label: "公盘",
            value: "公盘",
          },
        ],
      },
      {
        label: "他租",
        value: "他租",
        options: [
          {
            label: "公盘",
            value: "公盘",
          },
        ],
      },
    ],
  },
  {
    label: "业主姓名",
    type: "input",
    name: "owner_name",
    required: true,
    optionsAfter: [
      {
        label: "本人",
        value: "本人",
      },
      {
        label: "配偶",
        value: "配偶",
      },
      {
        label: "亲戚",
        value: "亲戚",
      },
      {
        label: "朋友",
        value: "朋友",
      },
      {
        label: "子女",
        value: "子女",
      },
      {
        label: "授权委托人",
        value: "授权委托人",
      },
      {
        label: "二房东",
        value: "二房东",
      },
    ],
  },
  {
    label: "联系电话",
    type: "input",
    name: "phone",
    required: true,
    optionsAfter: "#业主姓名",
  },
  {
    label: "图片/视频",
    type: "upload/image",
    name: "images",
    required: true,
  },
  {
    label: "小区",
    type: "map",
    name: "community_address",
    required: true,
  },
  {
    label: "位置",
    name: "location",
    type: "map",
  },
  {
    label: "楼层",
    type: "Space.Compact",
    required: true,
    name: "floor_range",
    split: "-",
    children: [
      {
        type: "door_number_from",
        placeholder: "请输入",
      },
      {
        type: "door_number_to",
        placeholder: "请输入",
        addonAfter: "楼",
      },
    ],
  },
  {
    label: "门牌号",
    name: "door_number",
    type: "Space.Compact",
    split: "-",
    required: true,
    children: [
      {
        label: "座栋",
        type: "input",
        name: "building_number",
        placeholder: "请输入",
      },
      {
        label: "单元",
        type: "input",
        name: "unit_number",
        placeholder: "请输入",
      },
      {
        label: "门牌号",
        type: "input",
        name: "door_number",
        placeholder: "请输入",
      },
    ],
  },
  {
    label: "房源标题",
    name: "title",
    type: "input",
    placeholder: "请输入",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "公寓",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
    ],
  },
  {
    label: "推荐标签",
    name: "tags",
    type: "Options",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
        options: [
          {
            label: "交通便利",
            value: "交通便利",
          },
          {
            label: "干燥",
            value: "干燥",
          },
          {
            label: "通风",
            value: "通风",
          },
        ],
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
        options: [
          {
            label: "优质地段",
            value: "优质地段",
          },
          {
            label: "临街旺铺",
            value: "临街旺铺",
          },
          {
            label: "人流密集",
            value: "人流密集",
          },
          {
            label: "紧邻地铁",
            value: "紧邻地铁",
          },
          {
            label: "交通要塞",
            value: "交通要塞",
          },
        ],
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "公寓",
      },
      {
        ref: "用途",
        value: "写字楼",
        options: [
          {
            label: "交通便利",
            value: "交通便利",
          },
          {
            label: "配套齐全",
            value: "配套齐全",
          },
        ],
      },
    ],
    options: [
      {
        label: "免税",
        value: "免税",
      },
      {
        label: "交通便利",
        value: "交通便利",
      },
      {
        label: "学区房",
        value: "学区房",
      },
      {
        label: "地铁房",
        value: "地铁房",
      },
      {
        label: "采光好",
        value: "采光好",
      },
      {
        label: "环境好",
        value: "环境好",
      },
      {
        label: "配套齐全",
        value: "配套齐全",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
  },
  {
    label: "车位高度",
    name: "car_height",
    type: "input",
    required: true,
    dataType: "number",
    addonAfter: "米",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
    ],
  },
  {
    label: "户型",
    name: "house_type",
    type: "Space.Compact",
    required: true,
    relation: [
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    children: [
      {
        addonAfter: "室",
        name: "room",
        type: "input",
        placeholder: "请输入",
      },
      {
        addonAfter: "厅",
        name: "hall",
        type: "input",
        placeholder: "请输入",
      },
      {
        addonAfter: "卫",
        name: "bathroom",
        type: "input",
        placeholder: "请输入",
      },
      {
        addonAfter: "厨",
        name: "kitchen",
        type: "input",
        placeholder: "请输入",
      },
      {
        addonAfter: "阳台",
        name: "balcony",
        type: "input",
        placeholder: "请输入",
      },
    ],
  },
  {
    label: "梯户",
    type: "Space.Compact",
    name: "stairs",
    relation: [
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
    ],
    children: [
      {
        addonAfter: "梯",
        name: "stairs",
        type: "input",
        placeholder: "请输入",
      },
      {
        addonAfter: "户",
        type: "input",
        name: "rooms",
        placeholder: "请输入",
      },
    ],
  },
  {
    label: "实率",
    name: "actual_rate",
    type: "input",
    dataType: "number",
    addonAfter: "%",
    placeholder: "请输入",
    relation: [
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
    ],
  },
  {
    label: "级别",
    name: "level",
    type: "select",
    relation: [
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
    ],
    options: [
      {
        label: "A级",
        value: "A级",
      },
      {
        label: "B级",
        value: "B级",
      },
      {
        label: "C级",
        value: "C级",
      },
      {
        label: "投资级",
        value: "投资级",
      },
      {
        label: "机构级",
        value: "机构级",
      },
      {
        label: "投契级",
        value: "投契级",
      },
    ],
  },
  {
    label: "层高",
    name: "floor_height",
    type: "input",
    addonAfter: "米",
    relation: [
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
    ],
  },
  {
    label: "进深",
    name: "progress_depth",
    type: "input",
    addonAfter: "米",
    relation: [
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
    ],
  },
  {
    label: "门宽",
    name: "door_width",
    type: "input",
    addonAfter: "米",
    relation: [
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
    ],
  },
  {
    label: "建筑面积",
    name: "building_area",
    required: true,
    addonAfter: "平米",
    type: "input",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
  },
  {
    label: "使用面积",
    name: "use_area",
    addonAfter: "平米",
    type: "input",
    relation: [
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
  },
  {
    label: "售价",
    name: "sale_price",
    addonAfter: "万元",
    type: "input",
    required: true,
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
  },
  {
    label: "租价",
    addonAfter: "元/月",
    name: "rent_price",
    type: "input",
    required: true,
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
  },
  {
    label: "出租低价",
    addonAfter: "元",
    type: "input",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
  },
  {
    label: "首付",
    addonAfter: "%",
    name: "down_payment",
    type: "input",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
  },
  {
    label: "出售低价",
    name: "sale_low_price",
    addonAfter: "万元",
    type: "input",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
  },
  {
    label: "房屋类型",
    type: "select",
    name: "house_type",
    relation: [
      {
        ref: "用途",
        value: "车位",
        options: [
          {
            label: "地面停车位",
            value: "地面停车位",
          },
          {
            label: "独立车库停车位",
            value: "独立车库停车位",
          },
          {
            label: "地下车库停车位",
            value: "地下车库停车位",
          },
          {
            label: "机械立体停车位",
            value: "机械立体停车位",
          },
          {
            label: "停车楼车位",
            value: "停车楼车位",
          },
        ],
      },
      {
        ref: "用途",
        value: "仓库",
        options: [
          {
            label: "平房型仓库",
            value: "平房型仓库",
          },
          {
            label: "二层楼房型仓库",
            value: "二层楼房型仓库",
          },
          {
            label: "多层楼房型仓库",
            value: "多层楼房型仓库",
          },
          {
            label: "地下仓库",
            value: "地下仓库",
          },
          {
            label: "立体仓库",
            value: "立体仓库",
          },
        ],
      },
      {
        ref: "用途",
        value: "厂房",
        options: [
          {
            label: "独立式",
            value: "独立式",
          },
          {
            label: "合租式",
            value: "合租式",
          },
          {
            label: "私宅式",
            value: "私宅式",
          },
          {
            label: "平房",
            value: "平房",
          },
          {
            label: "铁皮房",
            value: "铁皮房",
          },
        ],
      },
      {
        ref: "用途",
        value: "商铺",
        options: [
          {
            label: "商业街商铺",
            value: "商业街商铺",
          },
          {
            label: "市场型商铺",
            value: "市场型商铺",
          },
          {
            label: "社区型商铺",
            value: "社区型商铺",
          },
          {
            label: "住宅底层商铺",
            value: "住宅底层商铺",
          },
          {
            label: "百货商场",
            value: "百货商场",
          },
          {
            label: "购物中心商铺",
            value: "购物中心商铺",
          },
          {
            label: "写字楼商铺",
            value: "写字楼商铺",
          },
          {
            label: "交通设施商铺",
            value: "交通设施商铺",
          },
        ],
      },
      {
        ref: "用途",
        value: "写字楼",
        options: [
          {
            label: "单纯型写字楼",
            value: "单纯型写字楼",
          },
          {
            label: "商住型写字楼",
            value: "商住型写字楼",
          },
          {
            label: "综合型写字楼",
            value: "综合型写字楼",
          },
        ],
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    options: [
      {
        label: "底层",
        value: "底层",
      },
      {
        label: "多层",
        value: "多层",
      },
      {
        label: "小高层",
        value: "小高层",
      },
      {
        label: "洋房",
        value: "洋房",
      },
      {
        label: "高层",
        value: "高层",
      },
      {
        label: "跃层式住宅",
        value: "跃层式住宅",
      },
      {
        label: "复式住宅",
        value: "复式住宅",
      },
      {
        label: "公寓住宅",
        value: "公寓住宅",
      },
      {
        label: "普通住宅",
        value: "普通住宅",
      },
      {
        label: "高档住宅",
        value: "高档住宅",
      },
      {
        label: "LOFT",
        value: "LOFT",
      },
      {
        label: "别墅",
        value: "别墅",
      },
      {
        label: "老式里弄",
        value: "老式里弄",
      },
      {
        label: "老式花园住宅",
        value: "老式花园住宅",
      },
      {
        label: "老式公寓",
        value: "老式公寓",
      },
    ],
  },
  {
    label: "朝向",
    type: "select",
    name: "house_orientation",
    relation: [
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    options: [
      {
        label: "东西",
        value: "东西",
      },
      {
        label: "南北",
        value: "南北",
      },
      {
        label: "东",
        value: "东",
      },
      {
        label: "南",
        value: "南",
      },
      {
        label: "西",
        value: "西",
      },
      {
        label: "北",
        value: "北",
      },
      {
        label: "金角",
        value: "金角",
      },
      {
        label: "银角",
        value: "银角",
      },
    ],
  },
  {
    label: "装修",
    type: "select",
    name: "house_decoration",
    required: true,
    relation: [
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    options: [
      {
        label: "毛坯",
        value: "毛坯",
      },
      {
        label: "简装",
        value: "简装",
      },
      {
        label: "精装",
        value: "精装",
      },
      {
        label: "豪装",
        value: "豪装",
      },
    ],
  },
  {
    label: "满减年限",
    type: "select",
    name: "discount_year_limit",
    required: true,
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    options: [
      {
        label: "1年",
        value: "1年",
      },
      {
        label: "2年",
        value: "2年",
      },
      {
        label: "3年",
        value: "3年",
      },
      {
        label: "4年",
        value: "4年",
      },
      {
        label: "5年",
        value: "5年",
      },
    ],
  },
  {
    label: "看房方式",
    type: "select",
    name: "view_method",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    options: [
      {
        label: "提前预约",
        value: "提前预约",
      },
      {
        label: "直接带看",
        value: "直接带看",
      },
      {
        label: "借钥匙带看",
        value: "借钥匙带看",
      },
    ],
  },
  {
    label: "付款方式",
    type: "select",
    name: "payment_method",
    placeholder: "请输入",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
        options: [
          {
            label: "一次性付款",
            value: "一次性付款",
          },
          {
            label: "分期付款",
            value: "分期付款",
          },
          {
            label: "银行按揭付款",
            value: "银行按揭付款",
          },
        ],
      },
      {
        ref: "交易类型",
        value: "出租",
        options: [
          {
            label: "押一付三",
            value: "押一付三",
          },
          {
            label: "按月付",
            value: "按月付",
          },
          {
            label: "半年付",
            value: "半年付",
          },
          {
            label: "整年付",
            value: "整年付",
          },
        ],
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
  },
  {
    label: "房源税费",
    name: "property_tax",
    type: "textarea",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
  },
  {
    label: "建筑结构",
    name: "building_structure",
    type: "select",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    options: [
      {
        label: "板楼",
        value: "板楼",
      },
      {
        label: "框架",
        value: "框架",
      },
      {
        label: "砖混",
        value: "砖混",
      },
      {
        label: "砖木",
        value: "砖木",
      },
      {
        label: "钢混",
        value: "钢混",
      },
      {
        label: "钢木",
        value: "钢木",
      },
    ],
  },
  {
    label: "建筑年代",
    type: "select",
    name: "building_year",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    options: "@range(1970, 2023, 1)",
    placeholder: "请输入",
  },
  {
    label: "产权性质",
    type: "select",
    name: "property_rights",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    options: [
      {
        label: "商品房",
        value: "商品房",
      },
      {
        label: "公产房",
        value: "公产房",
      },
      {
        label: "私产房",
        value: "私产房",
      },
      {
        label: "经适房",
        value: "经适房",
      },
      {
        label: "企业房",
        value: "企业房",
      },
      {
        label: "军产房",
        value: "军产房",
      },
      {
        label: "安置房",
        value: "安置房",
      },
      {
        label: "小产权",
        value: "小产权",
      },
    ],
  },
  {
    label: "产权年限",
    type: "select",
    name: "property_year_limit",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    options: [
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        label: "70",
        value: "70",
      },
      {
        label: "50",
        value: "50",
      },
      {
        label: "40",
        value: "40",
      },
    ],
    placeholder: "请输入",
  },
  {
    label: "产证日期",
    type: "date",
    name: "certificate_date",
    relation: [
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
  },
  {
    label: "交房日期",
    type: "date",
    name: "handover_date",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
  },
  {
    label: "学位",
    type: "select",
    name: "degree",
    relation: [
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    options: "@range(2019, 2031, 1)",
    addonAfter: "年",
    placeholder: "请输入",
  },
  {
    label: "户口",
    type: "select",
    name: "household",
    relation: [
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
    options: [
      {
        label: "集体户口可买",
        value: "集体户口可买",
      },
      {
        label: "业主可协助过户",
        value: "业主可协助过户",
      },
    ],
  },
  {
    label: "来源",
    type: "select",
    name: "source",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    options: [
      {
        label: "上门",
        value: "上门",
      },
      {
        label: "电话",
        value: "电话",
      },
      {
        label: "陌拜",
        value: "陌拜",
      },
      {
        label: "驻守",
        value: "驻守",
      },
      {
        label: "窗体广告",
        value: "窗体广告",
      },
      {
        label: "搜房",
        value: "搜房",
      },
      {
        label: "新浪乐居",
        value: "新浪乐居",
      },
      {
        label: "58",
        value: "58",
      },
      {
        label: "赶集",
        value: "赶集",
      },
      {
        label: "已成交客户推荐",
        value: "已成交客户推荐",
      },
      {
        label: "公司网站",
        value: "公司网站",
      },
      {
        label: "朋友介绍",
        value: "朋友介绍",
      },
      {
        label: "老客户",
        value: "老客户",
      },
      {
        label: "派单",
        value: "派单",
      },
      {
        label: "微博",
        value: "微博",
      },
      {
        label: "微店",
        value: "微店",
      },
      {
        label: "微信公众账号",
        value: "微信公众账号",
      },
    ],
  },
  {
    label: "委托编号",
    type: "input",
    name: "delegate_number",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
  },
  {
    label: "唯一住房",
    type: "select",
    name: "unique_housing",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
    ],
    placeholder: "请输入",
    options: [
      {
        label: "是",
        value: "是",
      },
      {
        label: "否",
        value: "否",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
    ],
  },
  {
    label: "全款",
    type: "select",
    name: "full_payment",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
    options: [
      {
        label: "是",
        value: "是",
      },
      {
        label: "否",
        value: "否",
      },
    ],
  },
  {
    label: "抵押",
    type: "select",
    name: "mortgage",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
    options: [
      {
        label: "是",
        value: "是",
      },
      {
        label: "否",
        value: "否",
      },
    ],
  },
  {
    label: "急切",
    type: "select",
    name: "urgent",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
    options: [
      {
        label: "是",
        value: "是",
      },
      {
        label: "否",
        value: "否",
      },
    ],
  },
  {
    label: "配套",
    type: "select",
    name: "support",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
        options: [
          {
            label: "水",
            value: "水",
          },
          {
            label: "电",
            value: "电",
          },
          {
            label: "通风",
            value: "通风",
          },
        ],
      },
      {
        ref: "用途",
        value: "商铺",
        options: [
          {
            label: "自来水",
            value: "自来水",
          },
          {
            label: "空调",
            value: "空调",
          },
          {
            label: "电",
            value: "电",
          },
          {
            label: "宽带",
            value: "宽带",
          },
          {
            label: "煤气",
            value: "煤气",
          },
          {
            label: "车位",
            value: "车位",
          },
          {
            label: "银行",
            value: "银行",
          },
        ],
      },
      {
        ref: "用途",
        value: "写字楼",
        options: [
          {
            label: "会议室",
            value: "会议室",
          },
          {
            label: "银行",
            value: "银行",
          },
          {
            label: "停车场",
            value: "停车场",
          },
          {
            label: "便利店",
            value: "便利店",
          },
          {
            label: "活动场",
            value: "活动场",
          },
          {
            label: "休息场",
            value: "休息场",
          },
          {
            label: "图书馆",
            value: "图书馆",
          },
          {
            label: "电梯系统",
            value: "电梯系统",
          },
        ],
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
    options: [
      {
        ref: "用途",
        value: "厂房",
      },
      {
        label: "床",
        value: "床",
      },
      {
        label: "衣柜",
        value: "衣柜",
      },
      {
        label: "书桌",
        value: "书桌",
      },
      {
        label: "空调",
        value: "空调",
      },
      {
        label: "冰箱",
        value: "冰箱",
      },
      {
        label: "电视",
        value: "电视",
      },
      {
        label: "洗衣机",
        value: "洗衣机",
      },
      {
        label: "宽带",
        value: "宽带",
      },
      {
        label: "WIFI",
        value: "WIFI",
      },
      {
        label: "油烟机",
        value: "油烟机",
      },
      {
        label: "燃气灶",
        value: "燃气灶",
      },
      {
        label: "电热水器",
        value: "电热水器",
      },
    ],
  },
  {
    label: "现状",
    type: "select",
    name: "present_state",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
    options: [
      {
        label: "空置",
        value: "空置",
      },
      {
        label: "在用",
        value: "在用",
      },
      {
        label: "全新",
        value: "全新",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
  },
  {
    label: "外网同步",
    type: "select",
    name: "external_sync",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
    options: [
      {
        label: "是",
        value: "是",
      },
      {
        label: "否",
        value: "否",
      },
    ],
  },
  {
    label: "备注",
    type: "textarea",
    name: "remark",
    relation: [
      {
        ref: "用途",
        value: "车位",
      },
      {
        ref: "用途",
        value: "仓库",
      },
      {
        ref: "用途",
        value: "厂房",
      },
      {
        ref: "用途",
        value: "商铺",
      },
      {
        ref: "用途",
        value: "写字楼",
      },
      {
        ref: "用途",
        value: "住宅",
      },
      {
        ref: "交易类型",
        value: "出售",
      },
      {
        ref: "交易类型",
        value: "出租",
      },
      {
        ref: "用途",
        value: "别墅",
      },
      {
        ref: "用途",
        value: "公寓",
      },
    ],
    placeholder: "请输入",
  },
];
