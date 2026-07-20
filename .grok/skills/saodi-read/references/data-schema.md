# 阅读库数据 Schema

## notes-data.js

```js
window.NOTES_META = {
  generatedAt: "YYYY-MM-DD HH:mm",
  bookCount: number,
  highlightCount: number,
  ideaCount: number
};

window.NOTES = [
  {
    id: "bookId",
    title: string,
    author: string,
    cover: string,
    link: string,          // 微信读书详情 deepLink 或 web 链接
    progress: number|null, // 0-100
    finished: 0|1,
    hlCount: number,
    ideaCount: number,
    highlights: [
      {
        text: string,      // 划线原文
        chapter: string,
        date: "YYYY-MM-DD",
        color: any
      }
    ],
    ideas: [
      {
        content: string,   // 扫地僧想法
        abstract: string,  // 对应原文（可空）
        chapter: string,
        date: "YYYY-MM-DD",
        star: number|null
      }
    ]
  }
];
```

## notes-social.js

```js
window.NOTES_SOCIAL_META = {
  generatedAt: "YYYY-MM-DD HH:mm",
  bookCount: number,
  withHot: number,
  withReview: number
};

window.NOTES_SOCIAL = {
  "bookId": {
    hot: {
      text: string,      // 热门划线原文
      count: number,     // 划线人数
      chapter: string
    } | null,
    review: {
      content: string,   // 高赞点评全文
      author: string,    // 点评者昵称（他人）
      likes: number,
      comments: number,
      star: number,      // 20/40/60/80/100 → 1–5 星
      date: "YYYY-MM-DD",
      finished: 0|1
    } | null
  }
};
```

## 书单页 BOOKS（reading / readed / unread）

```js
const BOOKS = [
  {
    id: string,
    title: string,
    author: string,
    cover: string,
    category: string,   // 如 "经济理财-财经"
    catMain: string,    // 主类 如 "经济理财"
    date: "YYYY-MM-DD", // 在读=最近阅读；已读=读完；未读=更新时间
    year: number,
    link: string,
    secret: 0|1
  }
];
```

## 数量口径（与导出一致时）

| 集合 | 口径 |
|------|------|
| 在读 | 未读完 ∧ 有阅读记录 |
| 已读 | finishReading=1 |
| 未读 | 未读完 ∧ 无阅读记录 |
| 笔记书 | noteCount>0 ∨ reviewCount>0 的导出结果 |

## 微信读书接口（同步用）

网关：`POST https://i.weread.qq.com/api/agent/gateway`  
Header：`Authorization: Bearer $WEREAD_API_KEY`  
Body：业务参数与 `api_name`、`skill_version` **同层平铺**。

常用：`/shelf/sync`、`/user/notebooks`、`/book/bookmarklist`、`/review/list/mine`、`/book/bestbookmarks`、`/review/list`。
