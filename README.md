# 自选股APP

标签（空格分隔）： Vue APP

---

## 简介
> 自选股APP是一款简易的股票行情看盘软件。

## 功能分布
### 基本功能介绍：
   -  行情列表展示
        - 个股最新价、涨跌幅展示
        - 可编辑当前展示分组个股：删除、全选、反选、取消
   - Header拓展功能
        - 自选股自定义分组管理：系统分组、个人分组、添加分组
        - 换肤功能：黑白色
   -  热搜榜、股票查询记录
        - 热搜榜
        - 搜索股票增至不同分组
   -  个股交易数据展示
        - 现价、涨跌价、涨跌幅、今开、昨收、成交量、成交额、市值等信息
        - 五档、详情、大单
   -  资讯展示
        - 包括：新闻、公告、资金、简况、研报 

### 功能实现过程 :
一、行情列表展示
1. 个股最新价、涨跌幅数据和颜色展示、价格和涨跌排序

    (1) 通过GET请求获取股票列表

   **数据接口**：http://sqt.gtimg.cn/utf8/q=sz000729

   **查询参数**：q=sz000729  (备:q的查询参数值格式为字符串)

   **响应内容格式**：文本格式;

   **响应结果**：
`~000729~6.31~6.35~6.33~37621~20261~17357~6.31~1181~6.30~1228~6.29~99~6.28~137~6.27~151~6.33~588~6.34~341~6.35~454~6.36~787~6.37~207~15:00:04/6.31/161/S/101591/9530|14:56:57/6.31/55/S/34757/9445|14:56:45/6.33/7/B/4428/9437|14:56:42/6.32/4/B/2528/9435|14:56:39/6.32/10/B/6320/9433|14:56:36/6.32/20/S/12640/9431~20180920150045~-0.04~-0.63~6.37~6.30~6.31/37621/23844290~37621~2384~0.15~100.82~~6.37~6.30~1.10~158.35~177.85~1.33~6.99~5.72~0.84~419~6.34~17.55~110.23";`

   **数据处理**：对相应结果的字符串格式，格式化处理成json，便于做渲染；

   **渲染数据格式**：
   list=[
     {name: "中金岭南", code: "000060", newPrice: "4.50", percent: "1.35%", code2: "sz000060", …},
     {...}
    ]


   (2) 价格、涨跌幅排序

   **逻辑**：
    * 保存默认排序顺序(Object.assign())
    * 当传进的字段和上一次被点击的字段相同时，走下面正常排序方式，当不等于上次字段，则修改默认值为降序，并保存上次点击字段。
   
   **实现**:
 ```
  sort: function(field) {
    if (field !== this.sortValue) { //sortValue:''保存上个被点击的字段
     this.sortDir = 0;//sortDir: 0,保存降序默认值为1，点击排降序为1后，调整升序为-1
    this.sortValue = field;
      }
    if (this.sortDir === 1) {
      this.sortDir = -1;
      this.list.sort(function(p1, p2) {
        return parseFloat(p1[field]) < parseFloat(p2[field]) ? 1 : -1;
      });
    } else if (this.sortDir === -1) {
      this.sortDir = 0;
    // 把list的顺序恢复成stockList一样
      this.list = Object.assign([], this.defaultList);
    } else {
      this.sortDir = 1;
      this.list.sort(function(p1, p2) {
        return parseFloat(p1[field]) < parseFloat(p2[field]) ? -1 : 1;
        });
      }
    }
```


   2.可编辑当前展示分组个股：删除(确认,取消)、全选、反选、取消，并弹窗确认删除与否。

   (1) 点击title的编辑按钮可展示底部功能按钮，四个按钮分别实现不同功能。

   **删除**：无勾选时disabled；勾选时highlight，并显示勾选数量。勾选与否由渲染数据中clickValue=true/false决定，勾选数量也由此统计。

   **确认&取消**：点击确认后**watch** stocklist列表变化并重新渲染；取消返回主界面(列表页面)

   **全选**：修改list的chickValue=true，并显示勾选数量

   **反选**：根据全选中chickValue状态做相反处理，并显示勾选数量

   **取消**：返回主界面(列表页面)，编辑功能按钮隐藏

---

二、Header拓展功能
1. 自选股自定义分组管理:系统分组/个人分组/添加分组(`locaLstorage读写`)

    **系统分组**：主页面`created`时来读取locaLstorage做全部分组渲染,读取过程中判断系统分组内stock是否为空，若为空，渲染`默认给的stockList`去渲染;

    **个人分组**：配合添加分组功能使用，增加分组后写入locaLstorage。

2. 颜色切换:子组件通过EventBus.$emit/$on通知兄弟组件和父组件同时切色
---

三、热搜榜、股票查询记录
1. 热搜榜

   **接口地址**：http://proxy.finance.qq.com/ifzqgtimg/appstock/app/HotStock/getHotStock;

   **响应内容格式**：json

   **响应结果**：
```
"code": 0,
"msg": "",
"data": [
    ["hk03690",     //market+code
    "美团点评-Ｗ",  //name
    "GP"],
    ["sz300104",
    "乐视网",
    "GP-A"],
    ...
]
```

   **数据处理**：`res.data`

2. 搜索股票增至不同分组

   **接口地址**：`http://proxy.finance.qq.com/ifzqgtimg/appstock/smartbox/search/get?q=${this.inputNumber}`

   **查询参数**: `q=${this.inputNumber}` (定义inputNumber为input输入值)

   **响应内容格式**：json

   **响应结果**：res=
```
{
  "code": 0,
  "msg": "",
  "data": {
  "stock": [
    ["sh",            //market
     "600001",       //code
     "邯郸钢铁",    //name
     "hdgt",        //简称
     "GP-A"         //所属A股
    ]
  ],
  "sector": []
  }
}
```
   **数据处理**：对返回结果的json格式，处理成数组，便于做渲染；
