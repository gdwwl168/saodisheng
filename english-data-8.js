/** 外研英语词表数据 — 外研英语 · 八年级同步 */
var UNITS = [
  {
    id: "m1", book: "上册", code: "Module 1", title: "How to learn English", titleZh: "如何学英语",
    emoji: "📘",
    words: [
      { en: "pair", phon: "/peə/", zh: "一对", pos: "n." },
      { en: "correct", phon: "/kəˈrekt/", zh: "改正", pos: "v./adj." },
      { en: "spelling", phon: "/ˈspelɪŋ/", zh: "拼写", pos: "n." },
      { en: "practise", phon: "/ˈpræktɪs/", zh: "练习", pos: "v." },
      { en: "match", phon: "/mætʃ/", zh: "匹配", pos: "v." },
      { en: "complete", phon: "/kəmˈpliːt/", zh: "完成", pos: "v." },
      { en: "sentence", phon: "/ˈsentəns/", zh: "句子", pos: "n." },
      { en: "dictionary", phon: "/ˈdɪkʃənri/", zh: "词典", pos: "n." },
      { en: "grammar", phon: "/ˈɡræmə/", zh: "语法", pos: "n." },
      { en: "look up", phon: "", zh: "查阅", pos: "phr." },
      { en: "mistake", phon: "/mɪˈsteɪk/", zh: "错误", pos: "n." },
      { en: "make a mistake", phon: "", zh: "犯错误", pos: "phr." },
      { en: "advice", phon: "/ədˈvaɪs/", zh: "建议", pos: "n." },
      { en: "should", phon: "/ʃʊd/", zh: "应该", pos: "v." },
      { en: "write down", phon: "", zh: "写下", pos: "phr." },
      { en: "pronounce", phon: "/prəˈnaʊns/", zh: "发音", pos: "v." },
      { en: "aloud", phon: "/əˈlaʊd/", zh: "大声地", pos: "adv." },
      { en: "pronunciation", phon: "/prəˌnʌnsiˈeɪʃn/", zh: "发音", pos: "n." },
      { en: "agree with", phon: "", zh: "同意", pos: "phr." },
      { en: "improve", phon: "/ɪmˈpruːv/", zh: "提高", pos: "v." },
      { en: "advise", phon: "/ədˈvaɪz/", zh: "建议", pos: "v." },
      { en: "suggest", phon: "/səˈdʒest/", zh: "建议", pos: "v." },
      { en: "conversation", phon: "/ˌkɒnvəˈseɪʃn/", zh: "对话", pos: "n." },
      { en: "vocabulary", phon: "/vəˈkæbjələri/", zh: "词汇", pos: "n." }
    ],
    phrases: [
      { en: "look up", zh: "查阅" },
      { en: "make a mistake", zh: "犯错误" },
      { en: "write down", zh: "写下" },
      { en: "agree with sb.", zh: "同意某人" },
      { en: "ask for advice", zh: "征求建议" }
    ],
    patterns: [
      { en: "You should …", zh: "你应该…", ex: "You should look up new words in a dictionary." },
      { en: "Why not …?", zh: "为什么不…？", ex: "Why not practise speaking English every day?" },
      { en: "advise sb. to do", zh: "建议某人做", ex: "I advise you to read aloud." }
    ],
    sentences: [
      { en: "How can I improve my English?", zh: "我怎样才能提高英语？" },
      { en: "Please write down the new words.", zh: "请把生词写下来。" },
      { en: "I agree with your advice.", zh: "我同意你的建议。" }
    ],
    grammar: [
      { title: "提建议", points: [
        "should / Why not…? / What about…?",
        "advise sb. to do; suggest doing",
        "look up the word in a dictionary"
      ] }
    ],
    tip: "外研版八上 Module 1：英语学习方法与建议。"
  },
  {
    id: "m2", book: "上册", code: "Module 2", title: "My home town and my country", titleZh: "我的家乡与祖国",
    emoji: "🏙️",
    words: [
      { en: "hill", phon: "/hɪl/", zh: "小山", pos: "n." },
      { en: "population", phon: "/ˌpɒpjuˈleɪʃn/", zh: "人口", pos: "n." },
      { en: "wide", phon: "/waɪd/", zh: "宽的", pos: "adj." },
      { en: "million", phon: "/ˈmɪljən/", zh: "百万", pos: "num." },
      { en: "pretty", phon: "/ˈprɪti/", zh: "漂亮的", pos: "adj." },
      { en: "pretty good", phon: "", zh: "相当好", pos: "phr." },
      { en: "than", phon: "/ðæn/", zh: "比", pos: "prep." },
      { en: "north", phon: "/nɔːθ/", zh: "北方", pos: "n." },
      { en: "south", phon: "/saʊθ/", zh: "南方", pos: "n." },
      { en: "west", phon: "/west/", zh: "西方", pos: "n." },
      { en: "home town", phon: "", zh: "家乡", pos: "n." },
      { en: "especially", phon: "/ɪˈspeʃəli/", zh: "尤其", pos: "adv." },
      { en: "be famous for", phon: "", zh: "因…著名", pos: "phr." },
      { en: "university", phon: "/ˌjuːnɪˈvɜːsəti/", zh: "大学", pos: "n." },
      { en: "island", phon: "/ˈaɪlənd/", zh: "岛", pos: "n." },
      { en: "area", phon: "/ˈeəriə/", zh: "地区", pos: "n." },
      { en: "low", phon: "/ləʊ/", zh: "低的", pos: "adj." },
      { en: "mountain", phon: "/ˈmaʊntən/", zh: "山", pos: "n." },
      { en: "countryside", phon: "/ˈkʌntrisaɪd/", zh: "乡村", pos: "n." },
      { en: "umbrella", phon: "/ʌmˈbrelə/", zh: "伞", pos: "n." }
    ],
    phrases: [
      { en: "be famous for", zh: "因…闻名" },
      { en: "home town", zh: "家乡" },
      { en: "pretty good", zh: "相当好" },
      { en: "in the north of", zh: "在…北部" },
      { en: "larger than", zh: "比…大" }
    ],
    patterns: [
      { en: "A is … than B", zh: "A 比 B…", ex: "Shanghai is bigger than my home town." },
      { en: "be famous for", zh: "因…著名", ex: "Hangzhou is famous for the West Lake." },
      { en: "in the + 方位 + of", zh: "在…的某方位", ex: "Harbin is in the north of China." }
    ],
    sentences: [
      { en: "My home town is pretty good.", zh: "我的家乡相当不错。" },
      { en: "Beijing has a large population.", zh: "北京人口众多。" },
      { en: "China is famous for its long history.", zh: "中国以悠久历史闻名。" }
    ],
    grammar: [
      { title: "形容词比较级", points: [
        "big → bigger; large → larger; famous → more famous",
        "A is <code>bigger than</code> B",
        "pretty good = quite good"
      ] }
    ],
    tip: "外研版八上 Module 2：家乡、国家与比较级。"
  },
  {
    id: "m3", book: "上册", code: "Module 3", title: "Sports", titleZh: "体育运动",
    emoji: "⚽",
    words: [
      { en: "baseball", phon: "/ˈbeɪsbɔːl/", zh: "棒球", pos: "n." },
      { en: "volleyball", phon: "/ˈvɒlibɔːl/", zh: "排球", pos: "n." },
      { en: "boring", phon: "/ˈbɔːrɪŋ/", zh: "无聊的", pos: "adj." },
      { en: "exciting", phon: "/ɪkˈsaɪtɪŋ/", zh: "令人兴奋的", pos: "adj." },
      { en: "relaxing", phon: "/rɪˈlæksɪŋ/", zh: "放松的", pos: "adj." },
      { en: "score", phon: "/skɔː/", zh: "得分", pos: "n./v." },
      { en: "already", phon: "/ɔːlˈredi/", zh: "已经", pos: "adv." },
      { en: "matter", phon: "/ˈmætə/", zh: "要紧/问题", pos: "v./n." },
      { en: "What's the matter?", phon: "", zh: "怎么了？", pos: "phr." },
      { en: "hurt", phon: "/hɜːt/", zh: "受伤", pos: "v." },
      { en: "stadium", phon: "/ˈsteɪdiəm/", zh: "体育场", pos: "n." },
      { en: "plenty of", phon: "", zh: "许多", pos: "phr." },
      { en: "beat", phon: "/biːt/", zh: "打败", pos: "v." },
      { en: "careless", phon: "/ˈkeələs/", zh: "粗心的", pos: "adj." },
      { en: "cheer … on", phon: "", zh: "为…加油", pos: "phr." },
      { en: "coach", phon: "/kəʊtʃ/", zh: "教练", pos: "n." },
      { en: "against", phon: "/əˈɡenst/", zh: "对阵", pos: "prep." },
      { en: "train", phon: "/treɪn/", zh: "训练", pos: "v." },
      { en: "practice", phon: "/ˈpræktɪs/", zh: "练习", pos: "n." },
      { en: "warm-up", phon: "/ˈwɔːm ʌp/", zh: "热身", pos: "n." },
      { en: "better", phon: "/ˈbetə/", zh: "更好", pos: "adj." },
      { en: "chance", phon: "/tʃɑːns/", zh: "机会", pos: "n." },
      { en: "confident", phon: "/ˈkɒnfɪdənt/", zh: "自信的", pos: "adj." },
      { en: "pass", phon: "/pɑːs/", zh: "传球", pos: "v." }
    ],
    phrases: [
      { en: "What's the matter?", zh: "怎么了？" },
      { en: "plenty of", zh: "许多" },
      { en: "cheer … on", zh: "为…加油" },
      { en: "play against", zh: "对阵" },
      { en: "warm up", zh: "热身" }
    ],
    patterns: [
      { en: "I prefer … to …", zh: "比起…更喜欢…", ex: "I prefer baseball to volleyball." },
      { en: "What's the matter?", zh: "怎么了？", ex: "What's the matter with your leg?" },
      { en: "beat sb.", zh: "打败某人", ex: "Our team beat them 2–1." }
    ],
    sentences: [
      { en: "Sports make me strong and confident.", zh: "运动让我强壮又自信。" },
      { en: "What's the matter? Did you get hurt?", zh: "怎么了？你受伤了吗？" },
      { en: "We need plenty of practice.", zh: "我们需要大量练习。" }
    ],
    grammar: [
      { title: "比较级 / 对阵表达", points: [
        "more exciting / more relaxing",
        "play against another team",
        "beat ≠ win（beat 后接对手；win 后接比赛）"
      ] }
    ],
    tip: "外研版八上 Module 3：运动项目、比赛与伤病。"
  },
  {
    id: "m4", book: "上册", code: "Module 4", title: "Planes, ships and trains", titleZh: "飞机轮船与火车",
    emoji: "✈️",
    words: [
      { en: "road", phon: "/rəʊd/", zh: "路", pos: "n." },
      { en: "accident", phon: "/ˈæksɪdənt/", zh: "事故", pos: "n." },
      { en: "except", phon: "/ɪkˈsept/", zh: "除了", pos: "prep." },
      { en: "choice", phon: "/tʃɔɪs/", zh: "选择", pos: "n." },
      { en: "far", phon: "/fɑː/", zh: "远", pos: "adj." },
      { en: "far from", phon: "", zh: "远离", pos: "phr." },
      { en: "close", phon: "/kləʊs/", zh: "近的", pos: "adj." },
      { en: "crowded", phon: "/ˈkraʊdɪd/", zh: "拥挤的", pos: "adj." },
      { en: "all the time", phon: "", zh: "一直", pos: "phr." },
      { en: "journey", phon: "/ˈdʒɜːni/", zh: "旅程", pos: "n." },
      { en: "book", phon: "/bʊk/", zh: "预订", pos: "v." },
      { en: "park", phon: "/pɑːk/", zh: "停车", pos: "v." },
      { en: "outside", phon: "/ˌaʊtˈsaɪd/", zh: "在外面", pos: "adv." },
      { en: "however", phon: "/haʊˈevə/", zh: "然而", pos: "adv." },
      { en: "cost", phon: "/kɒst/", zh: "花费", pos: "v./n." },
      { en: "by plane", phon: "", zh: "乘飞机", pos: "phr." },
      { en: "by ship", phon: "", zh: "乘船", pos: "phr." },
      { en: "by train", phon: "", zh: "乘火车", pos: "phr." },
      { en: "take", phon: "/teɪk/", zh: "花费时间", pos: "v." },
      { en: "comfortable", phon: "/ˈkʌmftəbl/", zh: "舒适的", pos: "adj." }
    ],
    phrases: [
      { en: "far from", zh: "远离" },
      { en: "all the time", zh: "一直" },
      { en: "by plane / train / ship", zh: "乘飞机/火车/船" },
      { en: "book a ticket", zh: "订票" },
      { en: "except for", zh: "除了" }
    ],
    patterns: [
      { en: "It takes … to …", zh: "做…花费…", ex: "It takes two hours to get there by train." },
      { en: "A is farther than B", zh: "A 比 B 更远", ex: "The airport is farther than the station." },
      { en: "The best way is to …", zh: "最好的方式是…", ex: "The best way is to go by plane." }
    ],
    sentences: [
      { en: "Going by train is more comfortable.", zh: "坐火车更舒适。" },
      { en: "The bus is crowded all the time.", zh: "公交车总是很挤。" },
      { en: "How much does the ticket cost?", zh: "票价多少？" }
    ],
    grammar: [
      { title: "交通比较", points: [
        "far → farther / further",
        "It takes + 时间 + to do",
        "by + 交通工具（by bus/train/plane）"
      ] }
    ],
    tip: "外研版八上 Module 4：出行方式比较。"
  },
  {
    id: "m5", book: "上册", code: "Module 5", title: "Lao She Teahouse", titleZh: "老舍茶馆",
    emoji: "🍵",
    words: [
      { en: "actress", phon: "/ˈæktrəs/", zh: "女演员", pos: "n." },
      { en: "teahouse", phon: "/ˈtiːhaʊs/", zh: "茶馆", pos: "n." },
      { en: "offer", phon: "/ˈɒfə/", zh: "提供", pos: "v." },
      { en: "end", phon: "/end/", zh: "结束", pos: "n./v." },
      { en: "in the end", phon: "", zh: "最后", pos: "phr." },
      { en: "no idea", phon: "", zh: "不知道", pos: "phr." },
      { en: "act", phon: "/ækt/", zh: "一幕", pos: "n." },
      { en: "show", phon: "/ʃəʊ/", zh: "演出", pos: "n." },
      { en: "common", phon: "/ˈkɒmən/", zh: "普通的", pos: "adj." },
      { en: "describe", phon: "/dɪˈskraɪb/", zh: "描述", pos: "v." },
      { en: "society", phon: "/səˈsaɪəti/", zh: "社会", pos: "n." },
      { en: "college", phon: "/ˈkɒlɪdʒ/", zh: "大学", pos: "n." },
      { en: "novel", phon: "/ˈnɒvl/", zh: "小说", pos: "n." },
      { en: "if", phon: "/ɪf/", zh: "如果", pos: "conj." },
      { en: "magic", phon: "/ˈmædʒɪk/", zh: "魔法", pos: "n." },
      { en: "agree to", phon: "", zh: "同意做", pos: "phr." },
      { en: "decide to", phon: "", zh: "决定", pos: "phr." },
      { en: "want to", phon: "", zh: "想要", pos: "phr." },
      { en: "hope to", phon: "", zh: "希望", pos: "phr." },
      { en: "plan to", phon: "", zh: "计划", pos: "phr." }
    ],
    phrases: [
      { en: "in the end", zh: "最后" },
      { en: "no idea", zh: "不知道" },
      { en: "offer to do", zh: "主动提出做" },
      { en: "decide to do", zh: "决定做" },
      { en: "teahouse", zh: "茶馆" }
    ],
    patterns: [
      { en: "want / hope / decide / plan to do", zh: "想要/希望/决定/计划做", ex: "We decided to watch the show." },
      { en: "offer to do", zh: "主动提出做", ex: "She offered to take us to the teahouse." },
      { en: "in the end", zh: "最后", ex: "In the end, we all loved the play." }
    ],
    sentences: [
      { en: "Lao She is a great Chinese writer.", zh: "老舍是伟大的中国作家。" },
      { en: "We decided to go to the teahouse.", zh: "我们决定去茶馆。" },
      { en: "In the end, the show was wonderful.", zh: "最后，演出非常精彩。" }
    ],
    grammar: [
      { title: "动词 + to do", points: [
        "want / hope / decide / plan / offer to do",
        "agree to do sth.",
        "in the end = finally"
      ] }
    ],
    tip: "外研版八上 Module 5：老舍茶馆与不定式。"
  },
  {
    id: "m6", book: "上册", code: "Module 6", title: "Animals in danger", titleZh: "濒危动物",
    emoji: "🐼",
    words: [
      { en: "snake", phon: "/sneɪk/", zh: "蛇", pos: "n." },
      { en: "neck", phon: "/nek/", zh: "脖子", pos: "n." },
      { en: "danger", phon: "/ˈdeɪndʒə/", zh: "危险", pos: "n." },
      { en: "in danger", phon: "", zh: "处于危险", pos: "phr." },
      { en: "at last", phon: "", zh: "终于", pos: "phr." },
      { en: "interested", phon: "/ˈɪntrəstɪd/", zh: "感兴趣的", pos: "adj." },
      { en: "allow", phon: "/əˈlaʊ/", zh: "允许", pos: "v." },
      { en: "think of", phon: "", zh: "想起/认为", pos: "phr." },
      { en: "protect", phon: "/prəˈtekt/", zh: "保护", pos: "v." },
      { en: "wild", phon: "/waɪld/", zh: "野生的", pos: "adj." },
      { en: "take away", phon: "", zh: "拿走", pos: "phr." },
      { en: "enough", phon: "/ɪˈnʌf/", zh: "足够", pos: "adj." },
      { en: "peace", phon: "/piːs/", zh: "和平", pos: "n." },
      { en: "in peace", phon: "", zh: "平静地", pos: "phr." },
      { en: "look after", phon: "", zh: "照料", pos: "phr." },
      { en: "raise", phon: "/reɪz/", zh: "筹集/饲养", pos: "v." },
      { en: "research", phon: "/rɪˈsɜːtʃ/", zh: "研究", pos: "n." },
      { en: "situation", phon: "/ˌsɪtʃuˈeɪʃn/", zh: "情况", pos: "n." },
      { en: "scientist", phon: "/ˈsaɪəntɪst/", zh: "科学家", pos: "n." },
      { en: "in order to", phon: "", zh: "为了", pos: "phr." },
      { en: "government", phon: "/ˈɡʌvənmənt/", zh: "政府", pos: "n." },
      { en: "set up", phon: "", zh: "建立", pos: "phr." },
      { en: "nature park", phon: "", zh: "自然公园", pos: "n." },
      { en: "symbol", phon: "/ˈsɪmbl/", zh: "象征", pos: "n." }
    ],
    phrases: [
      { en: "in danger", zh: "处于危险" },
      { en: "look after", zh: "照料" },
      { en: "in order to", zh: "为了" },
      { en: "set up", zh: "建立" },
      { en: "be interested in", zh: "对…感兴趣" }
    ],
    patterns: [
      { en: "in order to do", zh: "为了做…", ex: "We protect pandas in order to save them." },
      { en: "allow sb. to do", zh: "允许某人做", ex: "The park allows people to visit." },
      { en: "be in danger", zh: "处于危险中", ex: "Many animals are in danger." }
    ],
    sentences: [
      { en: "Many wild animals are in danger.", zh: "许多野生动物处于危险中。" },
      { en: "We must protect them in order to save nature.", zh: "为了拯救自然我们必须保护它们。" },
      { en: "Scientists set up nature parks.", zh: "科学家建立了自然公园。" }
    ],
    grammar: [
      { title: "不定式作目的状语", points: [
        "in order to do / to do",
        "allow sb. to do",
        "be interested in doing"
      ] }
    ],
    tip: "外研版八上 Module 6：濒危动物与保护。"
  },
  {
    id: "m7", book: "上册", code: "Module 7", title: "A famous story", titleZh: "一个著名故事",
    emoji: "🐇",
    words: [
      { en: "fall", phon: "/fɔːl/", zh: "落下", pos: "v." },
      { en: "follow", phon: "/ˈfɒləʊ/", zh: "跟随", pos: "v." },
      { en: "hole", phon: "/həʊl/", zh: "洞", pos: "n." },
      { en: "rabbit", phon: "/ˈræbɪt/", zh: "兔子", pos: "n." },
      { en: "ground", phon: "/ɡraʊnd/", zh: "地面", pos: "n." },
      { en: "tea party", phon: "", zh: "茶会", pos: "n." },
      { en: "twice", phon: "/twaɪs/", zh: "两次", pos: "adv." },
      { en: "once or twice", phon: "", zh: "一两次", pos: "phr." },
      { en: "suddenly", phon: "/ˈsʌdənli/", zh: "突然", pos: "adv." },
      { en: "pocket", phon: "/ˈpɒkɪt/", zh: "口袋", pos: "n." },
      { en: "field", phon: "/fiːld/", zh: "田野", pos: "n." },
      { en: "think about", phon: "", zh: "考虑", pos: "phr." },
      { en: "deep", phon: "/diːp/", zh: "深的", pos: "adj." },
      { en: "while", phon: "/waɪl/", zh: "当…时", pos: "conj." },
      { en: "land", phon: "/lænd/", zh: "着陆", pos: "v." },
      { en: "dry", phon: "/draɪ/", zh: "干的", pos: "adj." },
      { en: "run after", phon: "", zh: "追赶", pos: "phr." },
      { en: "go down", phon: "", zh: "下去", pos: "phr." },
      { en: "have a tea party", phon: "", zh: "举行茶会", pos: "phr." },
      { en: "fall down", phon: "", zh: "倒下", pos: "phr." }
    ],
    phrases: [
      { en: "once or twice", zh: "一两次" },
      { en: "think about", zh: "考虑" },
      { en: "fall down", zh: "倒下/落下" },
      { en: "run after", zh: "追赶" },
      { en: "tea party", zh: "茶会" }
    ],
    patterns: [
      { en: "past continuous", zh: "过去进行时", ex: "She was sitting by the river." },
      { en: "while / when", zh: "当…时", ex: "While she was reading, a rabbit ran by." },
      { en: "suddenly", zh: "突然", ex: "Suddenly she fell down the hole." }
    ],
    sentences: [
      { en: "Alice was sitting by the river with her sister.", zh: "爱丽丝正和姐姐坐在河边。" },
      { en: "Suddenly a white rabbit ran past.", zh: "突然一只白兔跑过。" },
      { en: "She followed the rabbit down the hole.", zh: "她跟着兔子下了洞。" }
    ],
    grammar: [
      { title: "过去进行时", points: [
        "was / were + doing",
        "while 引导的同时发生动作",
        "She <code>was reading</code> when the rabbit appeared."
      ] }
    ],
    tip: "外研版八上 Module 7：爱丽丝故事与过去进行时。"
  },
  {
    id: "m8", book: "上册", code: "Module 8", title: "Accidents", titleZh: "事故",
    emoji: "⚠️",
    words: [
      { en: "pale", phon: "/peɪl/", zh: "苍白的", pos: "adj." },
      { en: "appear", phon: "/əˈpɪə/", zh: "出现", pos: "v." },
      { en: "corner", phon: "/ˈkɔːnə/", zh: "拐角", pos: "n." },
      { en: "hit", phon: "/hɪt/", zh: "碰撞", pos: "v." },
      { en: "glad", phon: "/ɡlæd/", zh: "高兴的", pos: "adj." },
      { en: "in time", phon: "", zh: "及时", pos: "phr." },
      { en: "fall off", phon: "", zh: "跌落", pos: "phr." },
      { en: "risk", phon: "/rɪsk/", zh: "风险", pos: "n." },
      { en: "attention", phon: "/əˈtenʃn/", zh: "注意", pos: "n." },
      { en: "pay attention", phon: "", zh: "注意", pos: "phr." },
      { en: "side by side", phon: "", zh: "并排", pos: "phr." },
      { en: "bite", phon: "/baɪt/", zh: "咬", pos: "v." },
      { en: "climb", phon: "/klaɪm/", zh: "爬", pos: "v." },
      { en: "hide", phon: "/haɪd/", zh: "躲藏", pos: "v." },
      { en: "throw", phon: "/θrəʊ/", zh: "扔", pos: "v." },
      { en: "pain", phon: "/peɪn/", zh: "疼痛", pos: "n." },
      { en: "worse", phon: "/wɜːs/", zh: "更糟", pos: "adj." },
      { en: "medicine", phon: "/ˈmedsn/", zh: "药", pos: "n." },
      { en: "accident", phon: "/ˈæksɪdənt/", zh: "事故", pos: "n." },
      { en: "careful", phon: "/ˈkeəfl/", zh: "小心的", pos: "adj." }
    ],
    phrases: [
      { en: "in time", zh: "及时" },
      { en: "fall off", zh: "跌落" },
      { en: "pay attention", zh: "注意" },
      { en: "side by side", zh: "并排" },
      { en: "have an accident", zh: "出事故" }
    ],
    patterns: [
      { en: "past continuous for background", zh: "过去进行表背景", ex: "I was walking when a car appeared." },
      { en: "pay attention to", zh: "注意", ex: "Pay attention to the traffic." },
      { en: "in time", zh: "及时", ex: "The doctor arrived in time." }
    ],
    sentences: [
      { en: "He was riding when the accident happened.", zh: "事故发生时他正在骑车。" },
      { en: "Please pay attention on the road.", zh: "请在路上注意安全。" },
      { en: "She fell off her bike and felt pain.", zh: "她从自行车上摔下感到疼痛。" }
    ],
    grammar: [
      { title: "过去进行时叙述事故", points: [
        "was/were doing when …",
        "in time / on time 区别",
        "fall off / fall down"
      ] }
    ],
    tip: "外研版八上 Module 8：事故与安全。"
  },
  {
    id: "m9", book: "上册", code: "Module 9", title: "Population", titleZh: "人口",
    emoji: "👥",
    words: [
      { en: "noise", phon: "/nɔɪz/", zh: "噪音", pos: "n." },
      { en: "prepare", phon: "/prɪˈpeə/", zh: "准备", pos: "v." },
      { en: "report", phon: "/rɪˈpɔːt/", zh: "报告", pos: "n./v." },
      { en: "billion", phon: "/ˈbɪljən/", zh: "十亿", pos: "num." },
      { en: "huge", phon: "/hjuːdʒ/", zh: "巨大的", pos: "adj." },
      { en: "increase", phon: "/ɪnˈkriːs/", zh: "增长", pos: "v./n." },
      { en: "hang on", phon: "", zh: "稍等", pos: "phr." },
      { en: "cause", phon: "/kɔːz/", zh: "引起", pos: "v." },
      { en: "problem", phon: "/ˈprɒbləm/", zh: "问题", pos: "n." },
      { en: "birth", phon: "/bɜːθ/", zh: "出生", pos: "n." },
      { en: "flat", phon: "/flæt/", zh: "公寓", pos: "n." },
      { en: "rubbish", phon: "/ˈrʌbɪʃ/", zh: "垃圾", pos: "n." },
      { en: "quiet", phon: "/ˈkwaɪət/", zh: "安静的", pos: "adj." },
      { en: "local", phon: "/ˈləʊkl/", zh: "当地的", pos: "adj." },
      { en: "close down", phon: "", zh: "关闭", pos: "phr." },
      { en: "pollution", phon: "/pəˈluːʃn/", zh: "污染", pos: "n." },
      { en: "solve", phon: "/sɒlv/", zh: "解决", pos: "v." },
      { en: "public", phon: "/ˈpʌblɪk/", zh: "公共的", pos: "adj." },
      { en: "service", phon: "/ˈsɜːvɪs/", zh: "服务", pos: "n." },
      { en: "pupil", phon: "/ˈpjuːpl/", zh: "小学生", pos: "n." },
      { en: "reduce", phon: "/rɪˈdjuːs/", zh: "减少", pos: "v." },
      { en: "create", phon: "/kriˈeɪt/", zh: "创造", pos: "v." }
    ],
    phrases: [
      { en: "hang on", zh: "稍等" },
      { en: "close down", zh: "关闭" },
      { en: "birth rate", zh: "出生率" },
      { en: "solve problems", zh: "解决问题" },
      { en: "increase / reduce", zh: "增加/减少" }
    ],
    patterns: [
      { en: "too many / too much", zh: "太多", ex: "There are too many people in big cities." },
      { en: "increase / reduce", zh: "增加/减少", ex: "We should reduce pollution." },
      { en: "It causes …", zh: "它导致…", ex: "Traffic causes noise and pollution." }
    ],
    sentences: [
      { en: "The world population is still increasing.", zh: "世界人口仍在增长。" },
      { en: "Huge cities face many problems.", zh: "大城市面临许多问题。" },
      { en: "We must reduce rubbish and pollution.", zh: "我们必须减少垃圾和污染。" }
    ],
    grammar: [
      { title: "大数字与人口问题", points: [
        "million / billion",
        "increase / reduce / cause",
        "too many + 可数；too much + 不可数"
      ] }
    ],
    tip: "外研版八上 Module 9：人口与城市问题。"
  },
  {
    id: "m10", book: "上册", code: "Module 10", title: "The weather", titleZh: "天气",
    emoji: "🌤️",
    words: [
      { en: "cloud", phon: "/klaʊd/", zh: "云", pos: "n." },
      { en: "shower", phon: "/ˈʃaʊə/", zh: "阵雨", pos: "n." },
      { en: "snow", phon: "/snəʊ/", zh: "雪", pos: "n./v." },
      { en: "storm", phon: "/stɔːm/", zh: "暴风雨", pos: "n." },
      { en: "cloudy", phon: "/ˈklaʊdi/", zh: "多云的", pos: "adj." },
      { en: "rainy", phon: "/ˈreɪni/", zh: "多雨的", pos: "adj." },
      { en: "snowy", phon: "/ˈsnəʊi/", zh: "下雪的", pos: "adj." },
      { en: "sunny", phon: "/ˈsʌni/", zh: "晴朗的", pos: "adj." },
      { en: "windy", phon: "/ˈwɪndi/", zh: "有风的", pos: "adj." },
      { en: "temperature", phon: "/ˈtemprətʃə/", zh: "温度", pos: "n." },
      { en: "degree", phon: "/dɪˈɡriː/", zh: "度", pos: "n." },
      { en: "minus", phon: "/ˈmaɪnəs/", zh: "零下", pos: "adj." },
      { en: "although", phon: "/ɔːlˈðəʊ/", zh: "虽然", pos: "conj." },
      { en: "wet", phon: "/wet/", zh: "湿的", pos: "adj." },
      { en: "neither", phon: "/ˈnaɪðə/", zh: "两者都不", pos: "pron." },
      { en: "terrible", phon: "/ˈterəbl/", zh: "糟糕的", pos: "adj." },
      { en: "probably", phon: "/ˈprɒbəbli/", zh: "可能", pos: "adv." },
      { en: "come on", phon: "", zh: "加油/快点", pos: "phr." },
      { en: "from time to time", phon: "", zh: "有时", pos: "phr." },
      { en: "might", phon: "/maɪt/", zh: "可能", pos: "v." },
      { en: "thick", phon: "/θɪk/", zh: "厚的", pos: "adj." },
      { en: "ice", phon: "/aɪs/", zh: "冰", pos: "n." }
    ],
    phrases: [
      { en: "from time to time", zh: "有时" },
      { en: "come on", zh: "加油" },
      { en: "minus five degrees", zh: "零下五度" },
      { en: "although", zh: "虽然" },
      { en: "It might …", zh: "可能…" }
    ],
    patterns: [
      { en: "What is the weather like?", zh: "天气怎么样？", ex: "It's sunny but windy." },
      { en: "It might …", zh: "可能…", ex: "It might rain later." },
      { en: "although", zh: "虽然", ex: "Although it is cold, I like winter." }
    ],
    sentences: [
      { en: "What's the weather like today?", zh: "今天天气怎么样？" },
      { en: "It is cloudy and the temperature is low.", zh: "多云，气温很低。" },
      { en: "It might snow tomorrow.", zh: "明天可能下雪。" }
    ],
    grammar: [
      { title: "天气与 might", points: [
        "sunny / rainy / windy / cloudy / snowy",
        "might = 可能",
        "although 引导让步状语从句"
      ] }
    ],
    tip: "外研版八上 Module 10：天气描述与预测。"
  },
  {
    id: "m11", book: "上册", code: "Module 11", title: "Way of life", titleZh: "生活方式",
    emoji: "🥢",
    words: [
      { en: "cap", phon: "/kæp/", zh: "帽子", pos: "n." },
      { en: "chess", phon: "/tʃes/", zh: "国际象棋", pos: "n." },
      { en: "chopstick", phon: "/ˈtʃɒpstɪk/", zh: "筷子", pos: "n." },
      { en: "gift", phon: "/ɡɪft/", zh: "礼物", pos: "n." },
      { en: "surprise", phon: "/səˈpraɪz/", zh: "惊喜", pos: "n." },
      { en: "immediately", phon: "/ɪˈmiːdiətli/", zh: "立刻", pos: "adv." },
      { en: "difference", phon: "/ˈdɪfrəns/", zh: "差别", pos: "n." },
      { en: "accept", phon: "/əkˈsept/", zh: "接受", pos: "v." },
      { en: "tradition", phon: "/trəˈdɪʃn/", zh: "传统", pos: "n." },
      { en: "for example", phon: "", zh: "例如", pos: "phr." },
      { en: "must", phon: "/mʌst/", zh: "必须", pos: "v." },
      { en: "serious", phon: "/ˈsɪəriəs/", zh: "严肃的", pos: "adj." },
      { en: "taste", phon: "/teɪst/", zh: "尝起来", pos: "v." },
      { en: "experience", phon: "/ɪkˈspɪəriəns/", zh: "经历", pos: "n." },
      { en: "for the first time", phon: "", zh: "第一次", pos: "phr." },
      { en: "sandwich", phon: "/ˈsænwɪdʒ/", zh: "三明治", pos: "n." },
      { en: "fish and chips", phon: "", zh: "炸鱼薯条", pos: "n." },
      { en: "gentleman", phon: "/ˈdʒentlmən/", zh: "绅士", pos: "n." },
      { en: "video game", phon: "", zh: "电子游戏", pos: "n." },
      { en: "a chess set", phon: "", zh: "一副象棋", pos: "n." }
    ],
    phrases: [
      { en: "for example", zh: "例如" },
      { en: "for the first time", zh: "第一次" },
      { en: "must / must not", zh: "必须/禁止" },
      { en: "way of life", zh: "生活方式" },
      { en: "fish and chips", zh: "炸鱼薯条" }
    ],
    patterns: [
      { en: "must / mustn’t", zh: "必须/不许", ex: "You must not open the gift immediately." },
      { en: "for the first time", zh: "第一次", ex: "I tried chopsticks for the first time." },
      { en: "for example", zh: "例如", ex: "For example, we use chopsticks in China." }
    ],
    sentences: [
      { en: "Different countries have different ways of life.", zh: "不同国家有不同生活方式。" },
      { en: "You must be careful with traditions.", zh: "你必须注意传统习俗。" },
      { en: "Fish and chips is popular in Britain.", zh: "炸鱼薯条在英国很受欢迎。" }
    ],
    grammar: [
      { title: "情态动词 must", points: [
        "must = 必须；mustn’t = 禁止",
        "You must wait.",
        "for example 举例"
      ] }
    ],
    tip: "外研版八上 Module 11：文化习俗与 must。"
  },
  {
    id: "m12", book: "上册", code: "Module 12", title: "Help", titleZh: "帮助",
    emoji: "🆘",
    words: [
      { en: "broken", phon: "/ˈbrəʊkən/", zh: "破损的", pos: "adj." },
      { en: "glass", phon: "/ɡlɑːs/", zh: "玻璃", pos: "n." },
      { en: "stairs", phon: "/steəz/", zh: "楼梯", pos: "n." },
      { en: "first aid", phon: "", zh: "急救", pos: "n." },
      { en: "medical", phon: "/ˈmedɪkl/", zh: "医疗的", pos: "adj." },
      { en: "imagine", phon: "/ɪˈmædʒɪn/", zh: "想象", pos: "v." },
      { en: "bottom", phon: "/ˈbɒtəm/", zh: "底部", pos: "n." },
      { en: "trouble", phon: "/ˈtrʌbl/", zh: "麻烦", pos: "n." },
      { en: "lift up", phon: "", zh: "抬起", pos: "phr." },
      { en: "harmful", phon: "/ˈhɑːmfl/", zh: "有害的", pos: "adj." },
      { en: "drop", phon: "/drɒp/", zh: "掉落", pos: "v." },
      { en: "make sure", phon: "", zh: "确保", pos: "phr." },
      { en: "cover", phon: "/ˈkʌvə/", zh: "覆盖", pos: "v." },
      { en: "earthquake", phon: "/ˈɜːθkweɪk/", zh: "地震", pos: "n." },
      { en: "warn", phon: "/wɔːn/", zh: "警告", pos: "v." },
      { en: "inside", phon: "/ˌɪnˈsaɪd/", zh: "在里面", pos: "adv." },
      { en: "under", phon: "/ˈʌndə/", zh: "在下面", pos: "prep." },
      { en: "keep clear of", phon: "", zh: "远离", pos: "phr." },
      { en: "calm", phon: "/kɑːm/", zh: "冷静的", pos: "adj." },
      { en: "brave", phon: "/breɪv/", zh: "勇敢的", pos: "adj." },
      { en: "helpful", phon: "/ˈhelpfl/", zh: "有帮助的", pos: "adj." },
      { en: "power", phon: "/ˈpaʊə/", zh: "电力", pos: "n." }
    ],
    phrases: [
      { en: "first aid", zh: "急救" },
      { en: "make sure", zh: "确保" },
      { en: "keep clear of", zh: "远离" },
      { en: "What's wrong with…?", zh: "…怎么了？" },
      { en: "at the bottom of", zh: "在…底部" }
    ],
    patterns: [
      { en: "must / can for advice", zh: "建议", ex: "You must stay calm in an earthquake." },
      { en: "make sure that…", zh: "确保…", ex: "Make sure the door is closed." },
      { en: "What's wrong with…?", zh: "…怎么了？", ex: "What's wrong with your hand?" }
    ],
    sentences: [
      { en: "Stay calm and be brave in trouble.", zh: "遇到麻烦时保持冷静、勇敢。" },
      { en: "First aid can save lives.", zh: "急救可以挽救生命。" },
      { en: "Keep clear of broken glass.", zh: "远离碎玻璃。" }
    ],
    grammar: [
      { title: "祈使句与安全建议", points: [
        "Stay calm. / Don’t run.",
        "must / mustn’t for rules",
        "make sure + 从句/名词"
      ] }
    ],
    tip: "外研版八上 Module 12：急救、地震与互助。"
  },
  {
    id: "d1", book: "下册", code: "Module 1", title: "Feelings and impressions", titleZh: "感觉与印象",
    emoji: "👃",
    words: [
      { en: "smell", phon: "/smel/", zh: "闻起来", pos: "v." },
      { en: "soft", phon: "/sɒft/", zh: "柔软的", pos: "adj." },
      { en: "sour", phon: "/ˈsaʊə/", zh: "酸的", pos: "adj." },
      { en: "feel", phon: "/fiːl/", zh: "感觉", pos: "v." },
      { en: "look", phon: "/lʊk/", zh: "看起来", pos: "v." },
      { en: "sound", phon: "/saʊnd/", zh: "听起来", pos: "v." },
      { en: "taste", phon: "/teɪst/", zh: "尝起来", pos: "v." },
      { en: "fresh", phon: "/freʃ/", zh: "新鲜的", pos: "adj." },
      { en: "lovely", phon: "/ˈlʌvli/", zh: "可爱的", pos: "adj." },
      { en: "pretty", phon: "/ˈprɪti/", zh: "漂亮的", pos: "adj." },
      { en: "noisy", phon: "/ˈnɔɪzi/", zh: "吵闹的", pos: "adj." },
      { en: "quiet", phon: "/ˈkwaɪət/", zh: "安静的", pos: "adj." },
      { en: "proud", phon: "/praʊd/", zh: "自豪的", pos: "adj." },
      { en: "angry", phon: "/ˈæŋɡri/", zh: "生气的", pos: "adj." },
      { en: "nervous", phon: "/ˈnɜːvəs/", zh: "紧张的", pos: "adj." },
      { en: "relaxed", phon: "/rɪˈlækst/", zh: "放松的", pos: "adj." }
    ],
    phrases: [
      { en: "smell", zh: "闻起来" },
      { en: "soft", zh: "柔软的" },
      { en: "sour", zh: "酸的" },
      { en: "feel", zh: "感觉" },
      { en: "look", zh: "看起来" }
    ],
    patterns: [
      { en: "Use: smell", zh: "闻起来", ex: "Remember: smell — 闻起来." }
    ],
    sentences: [
      { en: "I can use the word 'smell'.", zh: "我会用单词“闻起来”。" },
      { en: "I can use the word 'soft'.", zh: "我会用单词“柔软的”。" },
      { en: "I can use the word 'sour'.", zh: "我会用单词“酸的”。" }
    ],
    grammar: [
      { title: "本模块重点", points: [
        "外研版八下 Module 1：感官动词 feel/look/sound/smell/taste。"
      ] }
    ],
    tip: "外研版八下 Module 1：感官动词 feel/look/sound/smell/taste。"
  },
  {
    id: "d2", book: "下册", code: "Module 2", title: "Experiences", titleZh: "经历",
    emoji: "🧳",
    words: [
      { en: "ever", phon: "/ˈevə/", zh: "曾经", pos: "adv." },
      { en: "enter", phon: "/ˈentə/", zh: "进入", pos: "v." },
      { en: "win", phon: "/wɪn/", zh: "赢", pos: "v." },
      { en: "prize", phon: "/praɪz/", zh: "奖品", pos: "n." },
      { en: "dream", phon: "/driːm/", zh: "梦想", pos: "n." },
      { en: "abroad", phon: "/əˈbrɔːd/", zh: "在国外", pos: "adv." },
      { en: "fantastic", phon: "/fænˈtæstɪk/", zh: "极好的", pos: "adj." },
      { en: "interested", phon: "/ˈɪntrəstɪd/", zh: "感兴趣的", pos: "adj." },
      { en: "move", phon: "/muːv/", zh: "搬家", pos: "v." },
      { en: "send", phon: "/send/", zh: "发送", pos: "v." },
      { en: "invite", phon: "/ɪnˈvaɪt/", zh: "邀请", pos: "v." },
      { en: "enjoy oneself", phon: "", zh: "玩得开心", pos: "phr." }
    ],
    phrases: [
      { en: "ever", zh: "曾经" },
      { en: "enter", zh: "进入" },
      { en: "win", zh: "赢" },
      { en: "prize", zh: "奖品" },
      { en: "dream", zh: "梦想" }
    ],
    patterns: [
      { en: "Use: ever", zh: "曾经", ex: "Remember: ever — 曾经." }
    ],
    sentences: [
      { en: "I can use the word 'ever'.", zh: "我会用单词“曾经”。" },
      { en: "I can use the word 'enter'.", zh: "我会用单词“进入”。" },
      { en: "I can use the word 'win'.", zh: "我会用单词“赢”。" }
    ],
    grammar: [
      { title: "本模块重点", points: [
        "外研版八下 Module 2：现在完成时 have/has + 过去分词。"
      ] }
    ],
    tip: "外研版八下 Module 2：现在完成时 have/has + 过去分词。"
  },
  {
    id: "d3", book: "下册", code: "Module 3", title: "Journey to space", titleZh: "太空之旅",
    emoji: "🚀",
    words: [
      { en: "earth", phon: "/ɜːθ/", zh: "地球", pos: "n." },
      { en: "moon", phon: "/muːn/", zh: "月球", pos: "n." },
      { en: "news", phon: "/njuːz/", zh: "新闻", pos: "n." },
      { en: "latest", phon: "/ˈleɪtɪst/", zh: "最新的", pos: "adj." },
      { en: "planet", phon: "/ˈplænɪt/", zh: "行星", pos: "n." },
      { en: "reach", phon: "/riːtʃ/", zh: "到达", pos: "v." },
      { en: "spacecraft", phon: "/ˈspeɪskrɑːft/", zh: "宇宙飞船", pos: "n." },
      { en: "discover", phon: "/dɪˈskʌvə/", zh: "发现", pos: "v." },
      { en: "yet", phon: "/jet/", zh: "还/已经", pos: "adv." },
      { en: "just", phon: "/dʒʌst/", zh: "刚刚", pos: "adv." },
      { en: "already", phon: "/ɔːlˈredi/", zh: "已经", pos: "adv." },
      { en: "project", phon: "/ˈprɒdʒekt/", zh: "项目", pos: "n." }
    ],
    phrases: [
      { en: "earth", zh: "地球" },
      { en: "moon", zh: "月球" },
      { en: "news", zh: "新闻" },
      { en: "latest", zh: "最新的" },
      { en: "planet", zh: "行星" }
    ],
    patterns: [
      { en: "Use: earth", zh: "地球", ex: "Remember: earth — 地球." }
    ],
    sentences: [
      { en: "I can use the word 'earth'.", zh: "我会用单词“地球”。" },
      { en: "I can use the word 'moon'.", zh: "我会用单词“月球”。" },
      { en: "I can use the word 'news'.", zh: "我会用单词“新闻”。" }
    ],
    grammar: [
      { title: "本模块重点", points: [
        "外研版八下 Module 3：现在完成时 already/yet/just。"
      ] }
    ],
    tip: "外研版八下 Module 3：现在完成时 already/yet/just。"
  },
  {
    id: "d4", book: "下册", code: "Module 4", title: "Seeing the doctor", titleZh: "看病",
    emoji: "🏥",
    words: [
      { en: "cold", phon: "/kəʊld/", zh: "感冒", pos: "n." },
      { en: "fever", phon: "/ˈfiːvə/", zh: "发烧", pos: "n." },
      { en: "cough", phon: "/kɒf/", zh: "咳嗽", pos: "n./v." },
      { en: "headache", phon: "/ˈhedeɪk/", zh: "头痛", pos: "n." },
      { en: "stomach ache", phon: "", zh: "胃痛", pos: "n." },
      { en: "temperature", phon: "/ˈtemprətʃə/", zh: "体温", pos: "n." },
      { en: "medicine", phon: "/ˈmedsn/", zh: "药", pos: "n." },
      { en: "awful", phon: "/ˈɔːfl/", zh: "糟糕的", pos: "adj." },
      { en: "serious", phon: "/ˈsɪəriəs/", zh: "严重的", pos: "adj." },
      { en: "health", phon: "/helθ/", zh: "健康", pos: "n." },
      { en: "exercise", phon: "/ˈeksəsaɪz/", zh: "锻炼", pos: "n./v." },
      { en: "active", phon: "/ˈæktɪv/", zh: "积极的", pos: "adj." }
    ],
    phrases: [
      { en: "cold", zh: "感冒" },
      { en: "fever", zh: "发烧" },
      { en: "cough", zh: "咳嗽" },
      { en: "headache", zh: "头痛" },
      { en: "stomach ache", zh: "胃痛" }
    ],
    patterns: [
      { en: "Use: cold", zh: "感冒", ex: "Remember: cold — 感冒." }
    ],
    sentences: [
      { en: "I can use the word 'cold'.", zh: "我会用单词“感冒”。" },
      { en: "I can use the word 'fever'.", zh: "我会用单词“发烧”。" },
      { en: "I can use the word 'cough'.", zh: "我会用单词“咳嗽”。" }
    ],
    grammar: [
      { title: "本模块重点", points: [
        "外研版八下 Module 4：看病用语与情态动词。"
      ] }
    ],
    tip: "外研版八下 Module 4：看病用语与情态动词。"
  },
  {
    id: "d5", book: "下册", code: "Module 5", title: "Cartoons", titleZh: "卡通",
    emoji: "🎬",
    words: [
      { en: "handsome", phon: "/ˈhænsəm/", zh: "英俊的", pos: "adj." },
      { en: "smart", phon: "/smɑːt/", zh: "聪明的", pos: "adj." },
      { en: "funny", phon: "/ˈfʌni/", zh: "有趣的", pos: "adj." },
      { en: "cartoon", phon: "/kɑːˈtuːn/", zh: "卡通", pos: "n." },
      { en: "ugly", phon: "/ˈʌɡli/", zh: "丑陋的", pos: "adj." },
      { en: "fight", phon: "/faɪt/", zh: "打斗", pos: "v./n." },
      { en: "hero", phon: "/ˈhɪərəʊ/", zh: "英雄", pos: "n." },
      { en: "experience", phon: "/ɪkˈspɪəriəns/", zh: "经历", pos: "n." },
      { en: "private", phon: "/ˈpraɪvət/", zh: "私人的", pos: "adj." },
      { en: "own", phon: "/əʊn/", zh: "自己的", pos: "adj." },
      { en: "satisfy", phon: "/ˈsætɪsfaɪ/", zh: "使满意", pos: "v." },
      { en: "invent", phon: "/ɪnˈvent/", zh: "发明", pos: "v." }
    ],
    phrases: [
      { en: "handsome", zh: "英俊的" },
      { en: "smart", zh: "聪明的" },
      { en: "funny", zh: "有趣的" },
      { en: "cartoon", zh: "卡通" },
      { en: "ugly", zh: "丑陋的" }
    ],
    patterns: [
      { en: "Use: handsome", zh: "英俊的", ex: "Remember: handsome — 英俊的." }
    ],
    sentences: [
      { en: "I can use the word 'handsome'.", zh: "我会用单词“英俊的”。" },
      { en: "I can use the word 'smart'.", zh: "我会用单词“聪明的”。" },
      { en: "I can use the word 'funny'.", zh: "我会用单词“有趣的”。" }
    ],
    grammar: [
      { title: "本模块重点", points: [
        "外研版八下 Module 5：卡通人物与 since/for。"
      ] }
    ],
    tip: "外研版八下 Module 5：卡通人物与 since/for。"
  },
  {
    id: "d6", book: "下册", code: "Module 6", title: "Hobbies", titleZh: "爱好",
    emoji: "🎯",
    words: [
      { en: "hobby", phon: "/ˈhɒbi/", zh: "爱好", pos: "n." },
      { en: "collect", phon: "/kəˈlekt/", zh: "收集", pos: "v." },
      { en: "stamp", phon: "/stæmp/", zh: "邮票", pos: "n." },
      { en: "fan", phon: "/fæn/", zh: "迷", pos: "n." },
      { en: "tidy", phon: "/ˈtaɪdi/", zh: "整齐的", pos: "adj." },
      { en: "valuable", phon: "/ˈvæljuəbl/", zh: "有价值的", pos: "adj." },
      { en: "as a result", phon: "", zh: "结果", pos: "phr." },
      { en: "develop", phon: "/dɪˈveləp/", zh: "发展", pos: "v." },
      { en: "skill", phon: "/skɪl/", zh: "技能", pos: "n." },
      { en: "activity", phon: "/ækˈtɪvəti/", zh: "活动", pos: "n." },
      { en: "interest", phon: "/ˈɪntrəst/", zh: "兴趣", pos: "n." },
      { en: "enjoy", phon: "/ɪnˈdʒɔɪ/", zh: "享受", pos: "v." }
    ],
    phrases: [
      { en: "hobby", zh: "爱好" },
      { en: "collect", zh: "收集" },
      { en: "stamp", zh: "邮票" },
      { en: "fan", zh: "迷" },
      { en: "tidy", zh: "整齐的" }
    ],
    patterns: [
      { en: "Use: hobby", zh: "爱好", ex: "Remember: hobby — 爱好." }
    ],
    sentences: [
      { en: "I can use the word 'hobby'.", zh: "我会用单词“爱好”。" },
      { en: "I can use the word 'collect'.", zh: "我会用单词“收集”。" },
      { en: "I can use the word 'stamp'.", zh: "我会用单词“邮票”。" }
    ],
    grammar: [
      { title: "本模块重点", points: [
        "外研版八下 Module 6：爱好与 as a result。"
      ] }
    ],
    tip: "外研版八下 Module 6：爱好与 as a result。"
  }
];
