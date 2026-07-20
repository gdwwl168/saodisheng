/** 外研英语词表数据 — 外研英语 · 七年级同步 */
var UNITS = [
  {
    id: "s", book: "上册", code: "Starter", title: "Welcome to junior high!", titleZh: "欢迎来到初中",
    emoji: "🎒",
    words: [
      { en: "junior high", phon: "/ˈdʒuːniə haɪ/", zh: "初中", pos: "n." },
      { en: "ready", phon: "/ˈredi/", zh: "准备好", pos: "adj." },
      { en: "textbook", phon: "/ˈtekstbʊk/", zh: "课本", pos: "n." },
      { en: "eraser", phon: "/ɪˈreɪzə/", zh: "橡皮", pos: "n." },
      { en: "geography", phon: "/dʒiˈɒɡrəfi/", zh: "地理", pos: "n." },
      { en: "biology", phon: "/baɪˈɒlədʒi/", zh: "生物", pos: "n." },
      { en: "history", phon: "/ˈhɪstri/", zh: "历史", pos: "n." },
      { en: "uniform", phon: "/ˈjuːnɪfɔːm/", zh: "校服", pos: "n." },
      { en: "of course", phon: "/əv kɔːs/", zh: "当然", pos: "phr." },
      { en: "forget", phon: "/fəˈɡet/", zh: "忘记", pos: "v." },
      { en: "teaching building", phon: "/ˈtiːtʃɪŋ ˈbɪldɪŋ/", zh: "教学楼", pos: "n." },
      { en: "dining hall", phon: "/ˈdaɪnɪŋ hɔːl/", zh: "食堂", pos: "n." },
      { en: "lab", phon: "/læb/", zh: "实验室", pos: "n." },
      { en: "introduce", phon: "/ˌɪntrəˈdjuːs/", zh: "介绍", pos: "v." },
      { en: "yourself", phon: "/jɔːˈself/", zh: "你自己", pos: "pron." },
      { en: "hobby", phon: "/ˈhɒbi/", zh: "爱好", pos: "n." },
      { en: "nervous", phon: "/ˈnɜːvəs/", zh: "紧张的", pos: "adj." },
      { en: "join", phon: "/dʒɔɪn/", zh: "加入", pos: "v." },
      { en: "take part in", phon: "/teɪk pɑːt ɪn/", zh: "参加", pos: "phr." },
      { en: "each other", phon: "", zh: "互相", pos: "phr." }
    ],
    phrases: [
      { en: "Welcome to junior high!", zh: "欢迎来到初中！" },
      { en: "get ready", zh: "做好准备" },
      { en: "introduce yourself", zh: "自我介绍" },
      { en: "school uniform", zh: "校服" },
      { en: "take part in", zh: "参加" }
    ],
    patterns: [
      { en: "I'm … / My name is …", zh: "我是…", ex: "I'm ready for junior high." },
      { en: "Nice to meet you.", zh: "很高兴认识你。", ex: "— Nice to meet you. — Nice to meet you, too." },
      { en: "of course", zh: "当然", ex: "Of course I can help you." }
    ],
    sentences: [
      { en: "Welcome to junior high!", zh: "欢迎来到初中！" },
      { en: "I'm a bit nervous.", zh: "我有点紧张。" },
      { en: "Let me introduce myself.", zh: "让我自我介绍一下。" }
    ],
    grammar: [
      { title: "be 动词 am / is / are", points: [
        "I <code>am</code> a student.",
        "He / She / It <code>is</code> …",
        "You / We / They <code>are</code> …"
      ] }
    ],
    tip: "外研版（2024）七上 Starter：适应初中，学科、校园与自我介绍。"
  },
  {
    id: "u1", book: "上册", code: "Unit 1", title: "A new start", titleZh: "新的开始",
    emoji: "🌟",
    words: [
      { en: "without", phon: "/wɪˈðaʊt/", zh: "没有", pos: "prep." },
      { en: "sentence", phon: "/ˈsentəns/", zh: "句子", pos: "n." },
      { en: "point out", phon: "/pɔɪnt aʊt/", zh: "指出", pos: "phr." },
      { en: "mistake", phon: "/mɪˈsteɪk/", zh: "错误", pos: "n." },
      { en: "polite", phon: "/pəˈlaɪt/", zh: "有礼貌的", pos: "adj." },
      { en: "mind", phon: "/maɪnd/", zh: "头脑", pos: "n." },
      { en: "hers", phon: "/hɜːz/", zh: "她的", pos: "pron." },
      { en: "meaning", phon: "/ˈmiːnɪŋ/", zh: "意思", pos: "n." },
      { en: "in fact", phon: "/ɪn fækt/", zh: "事实上", pos: "phr." },
      { en: "need", phon: "/niːd/", zh: "需要", pos: "v." },
      { en: "remember", phon: "/rɪˈmembə/", zh: "记得", pos: "v." },
      { en: "really", phon: "/ˈriːəli/", zh: "真正地", pos: "adv." },
      { en: "important", phon: "/ɪmˈpɔːtnt/", zh: "重要的", pos: "adj." },
      { en: "plan", phon: "/plæn/", zh: "计划", pos: "n./v." },
      { en: "problem", phon: "/ˈprɒbləm/", zh: "问题", pos: "n." },
      { en: "homework", phon: "/ˈhəʊmwɜːk/", zh: "作业", pos: "n." },
      { en: "task", phon: "/tɑːsk/", zh: "任务", pos: "n." },
      { en: "project", phon: "/ˈprɒdʒekt/", zh: "课题", pos: "n." },
      { en: "advice", phon: "/ədˈvaɪs/", zh: "建议", pos: "n." },
      { en: "primary school", phon: "/ˈpraɪməri skuːl/", zh: "小学", pos: "n." },
      { en: "protect", phon: "/prəˈtekt/", zh: "保护", pos: "v." },
      { en: "through", phon: "/θruː/", zh: "穿过", pos: "prep." },
      { en: "hope", phon: "/həʊp/", zh: "希望", pos: "v./n." },
      { en: "thought", phon: "/θɔːt/", zh: "想法", pos: "n." }
    ],
    phrases: [
      { en: "point out", zh: "指出" },
      { en: "in fact", zh: "事实上" },
      { en: "without …", zh: "没有…" },
      { en: "make a plan", zh: "制定计划" },
      { en: "do homework", zh: "做作业" },
      { en: "primary school", zh: "小学" }
    ],
    patterns: [
      { en: "Is it polite to …?", zh: "做…有礼貌吗？", ex: "Is it polite to point out the mistake?" },
      { en: "It's important to …", zh: "做…很重要", ex: "It's important to think more in your learning." },
      { en: "without + n.", zh: "没有…", ex: "I cannot write a sentence without a pen." }
    ],
    sentences: [
      { en: "Please point out my mistake.", zh: "请指出我的错误。" },
      { en: "A sentence needs a subject and a verb.", zh: "句子需要主语和动词。" },
      { en: "It's important to make a good plan.", zh: "制定好计划很重要。" },
      { en: "In fact, junior high is a new start.", zh: "事实上，初中是一个新的开始。" }
    ],
    grammar: [
      { title: "名词性物主代词", points: [
        "mine / yours / his / <code>hers</code> / ours / theirs",
        "This book is <code>hers</code>.",
        "Is this pen <code>yours</code> or mine?"
      ] }
    ],
    tip: "外研版（2024）七上 Unit 1：新起点、课堂礼貌、学习建议。必背含 without / sentence / point out 等。"
  },
  {
    id: "u2", book: "上册", code: "Unit 2", title: "More than fun", titleZh: "不止于好玩",
    emoji: "🎸",
    words: [
      { en: "rock music", phon: "/ˈrɒk ˌmjuːzɪk/", zh: "摇滚乐", pos: "n." },
      { en: "electric", phon: "/ɪˈlektrɪk/", zh: "电动的", pos: "adj." },
      { en: "guitar", phon: "/ɡɪˈtɑː/", zh: "吉他", pos: "n." },
      { en: "band", phon: "/bænd/", zh: "乐队", pos: "n." },
      { en: "sound", phon: "/saʊnd/", zh: "声音", pos: "n." },
      { en: "different", phon: "/ˈdɪfrənt/", zh: "不同的", pos: "adj." },
      { en: "suddenly", phon: "/ˈsʌdənli/", zh: "突然", pos: "adv." },
      { en: "decide", phon: "/dɪˈsaɪd/", zh: "决定", pos: "v." },
      { en: "practice", phon: "/ˈpræktɪs/", zh: "练习", pos: "v./n." },
      { en: "stage", phon: "/steɪdʒ/", zh: "舞台", pos: "n." },
      { en: "instrument", phon: "/ˈɪnstrəmənt/", zh: "乐器", pos: "n." },
      { en: "smile", phon: "/smaɪl/", zh: "微笑", pos: "v./n." },
      { en: "enjoy", phon: "/ɪnˈdʒɔɪ/", zh: "享受", pos: "v." },
      { en: "club", phon: "/klʌb/", zh: "俱乐部", pos: "n." },
      { en: "volleyball", phon: "/ˈvɒlibɔːl/", zh: "排球", pos: "n." },
      { en: "traditional", phon: "/trəˈdɪʃənl/", zh: "传统的", pos: "adj." },
      { en: "paper-cutting", phon: "/ˈpeɪpə ˌkʌtɪŋ/", zh: "剪纸", pos: "n." },
      { en: "adventure", phon: "/ədˈventʃə/", zh: "冒险", pos: "n." },
      { en: "classmate", phon: "/ˈklɑːsmeɪt/", zh: "同学", pos: "n." },
      { en: "lonely", phon: "/ˈləʊnli/", zh: "孤独的", pos: "adj." },
      { en: "magic", phon: "/ˈmædʒɪk/", zh: "魔法", pos: "n." },
      { en: "joy", phon: "/dʒɔɪ/", zh: "快乐", pos: "n." },
      { en: "notebook", phon: "/ˈnəʊtbʊk/", zh: "笔记本", pos: "n." },
      { en: "leave", phon: "/liːv/", zh: "离开", pos: "v." }
    ],
    phrases: [
      { en: "rock music", zh: "摇滚乐" },
      { en: "more than fun", zh: "不止好玩" },
      { en: "enjoy doing", zh: "喜欢做…" },
      { en: "join a club", zh: "加入社团" },
      { en: "paper-cutting", zh: "剪纸" }
    ],
    patterns: [
      { en: "enjoy + doing", zh: "喜欢做…", ex: "I enjoy listening to rock music." },
      { en: "decide to do", zh: "决定做…", ex: "They decide to practice every day." },
      { en: "more than", zh: "不仅仅", ex: "Hobbies are more than fun." }
    ],
    sentences: [
      { en: "Rock music meets the erhu.", zh: "摇滚乐遇见了二胡。" },
      { en: "I enjoy playing the guitar.", zh: "我喜欢弹吉他。" },
      { en: "She joins the music club.", zh: "她加入了音乐社。" }
    ],
    grammar: [
      { title: "enjoy / practice + doing", points: [
        "enjoy <code>playing</code> volleyball",
        "practice <code>singing</code> on the stage",
        "decide <code>to join</code> the band"
      ] }
    ],
    tip: "外研版（2024）七上 Unit 2：兴趣爱好、音乐与社团，爱好不止好玩。"
  },
  {
    id: "u3", book: "上册", code: "Unit 3", title: "Family ties", titleZh: "家庭纽带",
    emoji: "👨‍👩‍👧‍👦",
    words: [
      { en: "silent", phon: "/ˈsaɪlənt/", zh: "沉默的", pos: "adj." },
      { en: "along", phon: "/əˈlɒŋ/", zh: "沿着", pos: "prep." },
      { en: "mountain", phon: "/ˈmaʊntən/", zh: "山", pos: "n." },
      { en: "road", phon: "/rəʊd/", zh: "路", pos: "n." },
      { en: "handsome", phon: "/ˈhænsəm/", zh: "英俊的", pos: "adj." },
      { en: "strict", phon: "/strɪkt/", zh: "严格的", pos: "adj." },
      { en: "follow", phon: "/ˈfɒləʊ/", zh: "跟随", pos: "v." },
      { en: "postman", phon: "/ˈpəʊstmən/", zh: "邮递员", pos: "n." },
      { en: "touching", phon: "/ˈtʌtʃɪŋ/", zh: "感人的", pos: "adj." },
      { en: "son", phon: "/sʌn/", zh: "儿子", pos: "n." },
      { en: "serve", phon: "/sɜːv/", zh: "服务", pos: "v." },
      { en: "absent", phon: "/ˈæbsənt/", zh: "缺席的", pos: "adj." },
      { en: "seldom", phon: "/ˈseldəm/", zh: "很少", pos: "adv." },
      { en: "carry", phon: "/ˈkæri/", zh: "搬运", pos: "v." },
      { en: "across", phon: "/əˈkrɔːs/", zh: "穿过", pos: "prep." },
      { en: "memory", phon: "/ˈmeməri/", zh: "记忆", pos: "n." },
      { en: "tear", phon: "/tɪə/", zh: "眼泪", pos: "n." },
      { en: "growth", phon: "/ɡrəʊθ/", zh: "成长", pos: "n." },
      { en: "care", phon: "/keə/", zh: "关心", pos: "v./n." },
      { en: "hug", phon: "/hʌɡ/", zh: "拥抱", pos: "v./n." },
      { en: "kiss", phon: "/kɪs/", zh: "吻", pos: "v./n." },
      { en: "pick up", phon: "/pɪk ʌp/", zh: "接人", pos: "phr." },
      { en: "change", phon: "/tʃeɪndʒ/", zh: "改变", pos: "v./n." },
      { en: "serious", phon: "/ˈsɪəriəs/", zh: "严肃的", pos: "adj." }
    ],
    phrases: [
      { en: "family ties", zh: "家庭纽带" },
      { en: "pick up", zh: "接人" },
      { en: "care for", zh: "关心" },
      { en: "grow up", zh: "成长" },
      { en: "along the road", zh: "沿着路" }
    ],
    patterns: [
      { en: "be strict with", zh: "对…严格", ex: "My father is strict with me." },
      { en: "seldom + v.", zh: "很少…", ex: "He is seldom absent from school." },
      { en: "pick sb. up", zh: "接某人", ex: "Mum picks me up after school." }
    ],
    sentences: [
      { en: "Family ties mean a lot to us.", zh: "家庭纽带对我们很重要。" },
      { en: "He is a strict but loving father.", zh: "他是一位严格却慈爱的父亲。" },
      { en: "I will never forget that memory.", zh: "我永远不会忘记那段记忆。" }
    ],
    grammar: [
      { title: "频度副词", points: [
        "always / usually / often / <code>seldom</code> / never",
        "位置：be 后、实义动词前",
        "He is <code>seldom</code> late."
      ] }
    ],
    tip: "外研版（2024）七上 Unit 3：亲情、家人付出与成长。"
  },
  {
    id: "u4", book: "上册", code: "Unit 4", title: "Time to celebrate", titleZh: "庆祝时光",
    emoji: "🎉",
    words: [
      { en: "unusual", phon: "/ʌnˈjuːʒuəl/", zh: "不寻常的", pos: "adj." },
      { en: "celebrate", phon: "/ˈselɪbreɪt/", zh: "庆祝", pos: "v." },
      { en: "treat", phon: "/triːt/", zh: "招待", pos: "v./n." },
      { en: "realise", phon: "/ˈrɪəlaɪz/", zh: "意识到", pos: "v." },
      { en: "dumpling", phon: "/ˈdʌmplɪŋ/", zh: "饺子", pos: "n." },
      { en: "whole", phon: "/həʊl/", zh: "整个的", pos: "adj." },
      { en: "lantern", phon: "/ˈlæntən/", zh: "灯笼", pos: "n." },
      { en: "balloon", phon: "/bəˈluːn/", zh: "气球", pos: "n." },
      { en: "dish", phon: "/dɪʃ/", zh: "菜肴", pos: "n." },
      { en: "joke", phon: "/dʒəʊk/", zh: "玩笑", pos: "n." },
      { en: "laugh", phon: "/lɑːf/", zh: "笑", pos: "v." },
      { en: "reunion", phon: "/ˌriːˈjuːniən/", zh: "团聚", pos: "n." },
      { en: "Christmas", phon: "/ˈkrɪsməs/", zh: "圣诞节", pos: "n." },
      { en: "throw away", phon: "/θrəʊ əˈweɪ/", zh: "扔掉", pos: "phr." },
      { en: "pollution", phon: "/pəˈluːʃn/", zh: "污染", pos: "n." },
      { en: "plastic", phon: "/ˈplæstɪk/", zh: "塑料", pos: "n./adj." },
      { en: "meal", phon: "/miːl/", zh: "一餐", pos: "n." },
      { en: "usually", phon: "/ˈjuːʒuəli/", zh: "通常", pos: "adv." },
      { en: "firework", phon: "/ˈfaɪəwɜːk/", zh: "烟花", pos: "n." },
      { en: "smell", phon: "/smel/", zh: "气味", pos: "n./v." },
      { en: "fill", phon: "/fɪl/", zh: "装满", pos: "v." },
      { en: "waste", phon: "/weɪst/", zh: "浪费", pos: "n./v." },
      { en: "shape", phon: "/ʃeɪp/", zh: "形状", pos: "n." },
      { en: "round", phon: "/raʊnd/", zh: "圆形的", pos: "adj." }
    ],
    phrases: [
      { en: "time to celebrate", zh: "庆祝的时刻" },
      { en: "family reunion", zh: "家人团聚" },
      { en: "throw away", zh: "扔掉" },
      { en: "eat dumplings", zh: "吃饺子" },
      { en: "hang lanterns", zh: "挂灯笼" }
    ],
    patterns: [
      { en: "What do people do on …?", zh: "人们在…做什么？", ex: "What do people do on Spring Festival?" },
      { en: "We usually …", zh: "我们通常…", ex: "We usually eat dumplings." },
      { en: "It's time to …", zh: "是时候…", ex: "It's time to celebrate!" }
    ],
    sentences: [
      { en: "It's time to celebrate!", zh: "是时候庆祝了！" },
      { en: "We eat dumplings at the reunion meal.", zh: "我们在团圆饭上吃饺子。" },
      { en: "Don't throw away plastic waste.", zh: "不要乱扔塑料垃圾。" }
    ],
    grammar: [
      { title: "一般现在时表习惯", points: [
        "节日习俗用一般现在时",
        "People <code>eat</code> mooncakes on Mid-Autumn Day.",
        "We <code>usually</code> get together."
      ] }
    ],
    tip: "外研版（2024）七上 Unit 4：节日庆祝与环保意识。"
  },
  {
    id: "u5", book: "上册", code: "Unit 5", title: "The power of plants", titleZh: "植物的力量",
    emoji: "🌱",
    words: [
      { en: "within", phon: "/wɪˈðɪn/", zh: "在…之内", pos: "prep." },
      { en: "quarter", phon: "/ˈkwɔːtə/", zh: "四分之一", pos: "n." },
      { en: "leaf", phon: "/liːf/", zh: "叶子", pos: "n." },
      { en: "root", phon: "/ruːt/", zh: "根", pos: "n." },
      { en: "stem", phon: "/stem/", zh: "茎", pos: "n." },
      { en: "collect", phon: "/kəˈlekt/", zh: "收集", pos: "v." },
      { en: "send", phon: "/send/", zh: "发送", pos: "v." },
      { en: "rise", phon: "/raɪz/", zh: "上升", pos: "v." },
      { en: "mix", phon: "/mɪks/", zh: "混合", pos: "v." },
      { en: "produce", phon: "/prəˈdjuːs/", zh: "产生", pos: "v." },
      { en: "sugar", phon: "/ˈʃʊɡə/", zh: "糖", pos: "n." },
      { en: "oxygen", phon: "/ˈɒksɪdʒən/", zh: "氧气", pos: "n." },
      { en: "human", phon: "/ˈhjuːmən/", zh: "人类", pos: "n." },
      { en: "breathe", phon: "/briːð/", zh: "呼吸", pos: "v." },
      { en: "seed", phon: "/siːd/", zh: "种子", pos: "n." },
      { en: "grow", phon: "/ɡrəʊ/", zh: "生长", pos: "v." },
      { en: "rainforest", phon: "/ˈreɪnfɒrɪst/", zh: "雨林", pos: "n." },
      { en: "health", phon: "/helθ/", zh: "健康", pos: "n." },
      { en: "bamboo", phon: "/ˌbæmˈbuː/", zh: "竹子", pos: "n." },
      { en: "cotton", phon: "/ˈkɒtn/", zh: "棉花", pos: "n." },
      { en: "popular", phon: "/ˈpɒpjələ/", zh: "受欢迎的", pos: "adj." },
      { en: "prefer", phon: "/prɪˈfɜː/", zh: "更喜欢", pos: "v." },
      { en: "natural", phon: "/ˈnætʃrəl/", zh: "自然的", pos: "adj." },
      { en: "connect", phon: "/kəˈnekt/", zh: "连接", pos: "v." }
    ],
    phrases: [
      { en: "the power of plants", zh: "植物的力量" },
      { en: "breathe oxygen", zh: "呼吸氧气" },
      { en: "grow from seeds", zh: "从种子生长" },
      { en: "prefer to do", zh: "更喜欢做" },
      { en: "in the rainforest", zh: "在雨林里" }
    ],
    patterns: [
      { en: "Plants produce …", zh: "植物产生…", ex: "Plants produce oxygen for humans." },
      { en: "prefer A to B", zh: "更喜欢A而非B", ex: "I prefer bamboo to cotton." },
      { en: "We need plants to …", zh: "我们需要植物来…", ex: "We need plants to breathe." }
    ],
    sentences: [
      { en: "Plants give us food and oxygen.", zh: "植物给我们食物和氧气。" },
      { en: "A small seed can grow into a big tree.", zh: "小种子能长成大树。" },
      { en: "We should protect the rainforest.", zh: "我们应该保护雨林。" }
    ],
    grammar: [
      { title: "植物与 can / need", points: [
        "Plants <code>can</code> produce oxygen.",
        "Humans <code>need</code> plants to live.",
        "leaf → leaves（复数）"
      ] }
    ],
    tip: "外研版（2024）七上 Unit 5：植物结构、作用与环保。"
  },
  {
    id: "u6", book: "上册", code: "Unit 6", title: "Fantastic friends", titleZh: "奇妙的朋友",
    emoji: "🐾",
    words: [
      { en: "pigeon", phon: "/ˈpɪdʒɪn/", zh: "鸽子", pos: "n." },
      { en: "surprise", phon: "/səˈpraɪz/", zh: "惊喜", pos: "n./v." },
      { en: "boring", phon: "/ˈbɔːrɪŋ/", zh: "无聊的", pos: "adj." },
      { en: "feed", phon: "/fiːd/", zh: "喂养", pos: "v." },
      { en: "scary", phon: "/ˈskeəri/", zh: "吓人的", pos: "adj." },
      { en: "research", phon: "/rɪˈsɜːtʃ/", zh: "研究", pos: "n./v." },
      { en: "recognise", phon: "/ˈrekəɡnaɪz/", zh: "认出", pos: "v." },
      { en: "themselves", phon: "/ðəmˈselvz/", zh: "他们自己", pos: "pron." },
      { en: "mirror", phon: "/ˈmɪrə/", zh: "镜子", pos: "n." },
      { en: "maybe", phon: "/ˈmeɪbi/", zh: "也许", pos: "adv." },
      { en: "several", phon: "/ˈsevrəl/", zh: "几个", pos: "det." },
      { en: "kilometre", phon: "/ˈkɪləmiːtə/", zh: "公里", pos: "n." },
      { en: "get lost", phon: "/ɡet lɒst/", zh: "迷路", pos: "phr." },
      { en: "speed", phon: "/spiːd/", zh: "速度", pos: "n." },
      { en: "amazing", phon: "/əˈmeɪzɪŋ/", zh: "惊人的", pos: "adj." },
      { en: "enough", phon: "/ɪˈnʌf/", zh: "足够", pos: "adv./adj." },
      { en: "wolf", phon: "/wʊlf/", zh: "狼", pos: "n." },
      { en: "hero", phon: "/ˈhɪərəʊ/", zh: "英雄", pos: "n." },
      { en: "rescue", phon: "/ˈreskjuː/", zh: "营救", pos: "v./n." },
      { en: "save", phon: "/seɪv/", zh: "拯救", pos: "v." },
      { en: "die out", phon: "/daɪ aʊt/", zh: "灭绝", pos: "phr." },
      { en: "fantastic", phon: "/fænˈtæstɪk/", zh: "极好的", pos: "adj." },
      { en: "friendly", phon: "/ˈfrendli/", zh: "友好的", pos: "adj." },
      { en: "forest", phon: "/ˈfɒrɪst/", zh: "森林", pos: "n." }
    ],
    phrases: [
      { en: "fantastic friends", zh: "奇妙的朋友" },
      { en: "get lost", zh: "迷路" },
      { en: "die out", zh: "灭绝" },
      { en: "look after", zh: "照料" },
      { en: "feed animals", zh: "喂动物" }
    ],
    patterns: [
      { en: "Animals can be …", zh: "动物可以是…", ex: "Animals can be our fantastic friends." },
      { en: "get lost", zh: "迷路", ex: "Don't get lost in the forest." },
      { en: "die out", zh: "灭绝", ex: "Some animals may die out." }
    ],
    sentences: [
      { en: "Animals can be our fantastic friends.", zh: "动物可以是我们奇妙的朋友。" },
      { en: "We should save animals in danger.", zh: "我们应该拯救濒危动物。" },
      { en: "Pigeons can recognise themselves in a mirror.", zh: "鸽子能在镜子中认出自己。" }
    ],
    grammar: [
      { title: "反身代词", points: [
        "myself / yourself / himself / herself / <code>itself</code> / <code>themselves</code>",
        "They can look after <code>themselves</code>.",
        "The bird sees <code>itself</code> in the mirror."
      ] }
    ],
    tip: "外研版（2024）七上 Unit 6：动物朋友、保护与智慧。"
  },
  {
    id: "d1", book: "下册", code: "Unit 1", title: "The secrets of happiness", titleZh: "幸福的秘诀",
    emoji: "😊",
    words: [
      { en: "review", phon: "/rɪˈvjuː/", zh: "评论", pos: "n." },
      { en: "chocolate", phon: "/ˈtʃɒklət/", zh: "巧克力", pos: "n." },
      { en: "factory", phon: "/ˈfæktri/", zh: "工厂", pos: "n." },
      { en: "exciting", phon: "/ɪkˈsaɪtɪŋ/", zh: "令人兴奋的", pos: "adj." },
      { en: "magical", phon: "/ˈmædʒɪkl/", zh: "神奇的", pos: "adj." },
      { en: "poor", phon: "/pɔː/", zh: "贫穷的", pos: "adj." },
      { en: "rich", phon: "/rɪtʃ/", zh: "富有的", pos: "adj." },
      { en: "choose", phon: "/tʃuːz/", zh: "选择", pos: "v." },
      { en: "complete", phon: "/kəmˈpliːt/", zh: "完成", pos: "v." },
      { en: "agree", phon: "/əˈɡriː/", zh: "同意", pos: "v." },
      { en: "understand", phon: "/ˌʌndəˈstænd/", zh: "理解", pos: "v." },
      { en: "experience", phon: "/ɪkˈspɪəriəns/", zh: "经历", pos: "n." },
      { en: "opinion", phon: "/əˈpɪnjən/", zh: "看法", pos: "n." },
      { en: "topic", phon: "/ˈtɒpɪk/", zh: "话题", pos: "n." },
      { en: "believe", phon: "/bɪˈliːv/", zh: "相信", pos: "v." },
      { en: "positive", phon: "/ˈpɒzətɪv/", zh: "积极的", pos: "adj." },
      { en: "smile", phon: "/smaɪl/", zh: "微笑", pos: "v." },
      { en: "surprised", phon: "/səˈpraɪzd/", zh: "吃惊的", pos: "adj." },
      { en: "receive", phon: "/rɪˈsiːv/", zh: "收到", pos: "v." },
      { en: "smart", phon: "/smɑːt/", zh: "聪明的", pos: "adj." },
      { en: "finally", phon: "/ˈfaɪnəli/", zh: "终于", pos: "adv." },
      { en: "once", phon: "/wʌns/", zh: "曾经", pos: "adv." },
      { en: "touch", phon: "/tʌtʃ/", zh: "触动", pos: "v." },
      { en: "expression", phon: "/ɪkˈspreʃn/", zh: "表达", pos: "n." }
    ],
    phrases: [
      { en: "the secrets of happiness", zh: "幸福的秘诀" },
      { en: "feel happy", zh: "感到快乐" },
      { en: "agree with", zh: "同意" },
      { en: "in my opinion", zh: "在我看来" },
      { en: "a positive life", zh: "积极的生活" }
    ],
    patterns: [
      { en: "Happiness is …", zh: "幸福是…", ex: "Happiness is helping others." },
      { en: "I believe that …", zh: "我相信…", ex: "I believe that a smile can change a day." },
      { en: "in my opinion", zh: "在我看来", ex: "In my opinion, kindness brings happiness." }
    ],
    sentences: [
      { en: "What are the secrets of happiness?", zh: "幸福的秘诀是什么？" },
      { en: "A simple smile can change your day.", zh: "一个简单的微笑就能改变你的一天。" },
      { en: "Choose to be positive every day.", zh: "每天选择积极面对。" }
    ],
    grammar: [
      { title: "一般过去时（入门）", points: [
        "过去动作用过去式",
        "规则：+ed；不规则：choose→chose",
        "Yesterday I <code>smiled</code> at a stranger."
      ] }
    ],
    tip: "外研版（2024）七下 Unit 1：幸福、选择与积极心态。"
  },
  {
    id: "d2", book: "下册", code: "Unit 2", title: "Go for it!", titleZh: "加油争取！",
    emoji: "🏆",
    words: [
      { en: "marathon", phon: "/ˈmærəθən/", zh: "马拉松", pos: "n." },
      { en: "however", phon: "/haʊˈevə/", zh: "然而", pos: "adv." },
      { en: "still", phon: "/stɪl/", zh: "仍然", pos: "adv." },
      { en: "metre", phon: "/ˈmiːtə/", zh: "米", pos: "n." },
      { en: "breath", phon: "/breθ/", zh: "气息", pos: "n." },
      { en: "confident", phon: "/ˈkɒnfɪdənt/", zh: "自信的", pos: "adj." },
      { en: "choice", phon: "/tʃɔɪs/", zh: "选择", pos: "n." },
      { en: "seem", phon: "/siːm/", zh: "似乎", pos: "v." },
      { en: "cheer", phon: "/tʃɪə/", zh: "欢呼", pos: "v." },
      { en: "dream", phon: "/driːm/", zh: "梦想", pos: "n." },
      { en: "record", phon: "/ˈrekɔːd/", zh: "纪录", pos: "n." },
      { en: "member", phon: "/ˈmembə/", zh: "成员", pos: "n." },
      { en: "possible", phon: "/ˈpɒsəbl/", zh: "可能的", pos: "adj." },
      { en: "raise", phon: "/reɪz/", zh: "筹集", pos: "v." },
      { en: "encourage", phon: "/ɪnˈkʌrɪdʒ/", zh: "鼓励", pos: "v." },
      { en: "competition", phon: "/ˌkɒmpəˈtɪʃn/", zh: "比赛", pos: "n." },
      { en: "medal", phon: "/ˈmedl/", zh: "奖牌", pos: "n." },
      { en: "brave", phon: "/breɪv/", zh: "勇敢的", pos: "adj." },
      { en: "goal", phon: "/ɡəʊl/", zh: "进球/目标", pos: "n." },
      { en: "victory", phon: "/ˈvɪktəri/", zh: "胜利", pos: "n." },
      { en: "chance", phon: "/tʃɑːns/", zh: "机会", pos: "n." },
      { en: "improve", phon: "/ɪmˈpruːv/", zh: "提高", pos: "v." },
      { en: "success", phon: "/səkˈses/", zh: "成功", pos: "n." },
      { en: "courage", phon: "/ˈkʌrɪdʒ/", zh: "勇气", pos: "n." }
    ],
    phrases: [
      { en: "go for it", zh: "加油争取" },
      { en: "hold your breath", zh: "屏住呼吸" },
      { en: "try one's best", zh: "尽最大努力" },
      { en: "pay attention", zh: "注意" },
      { en: "never give up", zh: "永不放弃" }
    ],
    patterns: [
      { en: "Go for it!", zh: "加油！", ex: "Go for it and try your best!" },
      { en: "It seems that …", zh: "似乎…", ex: "It seems possible to win." },
      { en: "encourage sb. to do", zh: "鼓励某人做", ex: "Teachers encourage us to dream big." }
    ],
    sentences: [
      { en: "Go for it and never give up!", zh: "加油，永不放弃！" },
      { en: "Practice makes perfect.", zh: "熟能生巧。" },
      { en: "I believe success comes from courage.", zh: "我相信成功来自勇气。" }
    ],
    grammar: [
      { title: "一般过去时巩固", points: [
        "win → won, run → ran, feel → felt",
        "否定：did not / didn't + 动词原形",
        "Last week we <code>won</code> the game."
      ] }
    ],
    tip: "外研版（2024）七下 Unit 2：拼搏、运动与勇气。"
  },
  {
    id: "d3", book: "下册", code: "Unit 3", title: "Food matters", titleZh: "食物很重要",
    emoji: "🍎",
    words: [
      { en: "beef", phon: "/biːf/", zh: "牛肉", pos: "n." },
      { en: "carrot", phon: "/ˈkærət/", zh: "胡萝卜", pos: "n." },
      { en: "mutton", phon: "/ˈmʌtn/", zh: "羊肉", pos: "n." },
      { en: "onion", phon: "/ˈʌnjən/", zh: "洋葱", pos: "n." },
      { en: "pancake", phon: "/ˈpænkeɪk/", zh: "薄饼", pos: "n." },
      { en: "porridge", phon: "/ˈpɒrɪdʒ/", zh: "粥", pos: "n." },
      { en: "menu", phon: "/ˈmenjuː/", zh: "菜单", pos: "n." },
      { en: "medicine", phon: "/ˈmedsn/", zh: "药", pos: "n." },
      { en: "delicious", phon: "/dɪˈlɪʃəs/", zh: "美味的", pos: "adj." },
      { en: "sandwich", phon: "/ˈsænwɪdʒ/", zh: "三明治", pos: "n." },
      { en: "salt", phon: "/sɔːlt/", zh: "盐", pos: "n." },
      { en: "oil", phon: "/ɔɪl/", zh: "油", pos: "n." },
      { en: "recipe", phon: "/ˈresəpi/", zh: "食谱", pos: "n." },
      { en: "ingredient", phon: "/ɪnˈɡriːdiənt/", zh: "食材", pos: "n." },
      { en: "diet", phon: "/ˈdaɪət/", zh: "饮食", pos: "n." },
      { en: "restaurant", phon: "/ˈrestrɒnt/", zh: "餐馆", pos: "n." },
      { en: "salad", phon: "/ˈsæləd/", zh: "沙拉", pos: "n." },
      { en: "hamburger", phon: "/ˈhæmbɜːɡə/", zh: "汉堡", pos: "n." },
      { en: "snack", phon: "/snæk/", zh: "零食", pos: "n." },
      { en: "dessert", phon: "/dɪˈzɜːt/", zh: "甜点", pos: "n." },
      { en: "sweet", phon: "/swiːt/", zh: "甜的", pos: "adj." },
      { en: "special", phon: "/ˈspeʃl/", zh: "特别的", pos: "adj." },
      { en: "order", phon: "/ˈɔːdə/", zh: "点餐/顺序", pos: "n./v." },
      { en: "add", phon: "/æd/", zh: "添加", pos: "v." }
    ],
    phrases: [
      { en: "food matters", zh: "食物很重要" },
      { en: "a balanced diet", zh: "均衡饮食" },
      { en: "order food", zh: "点餐" },
      { en: "junk food", zh: "垃圾食品" },
      { en: "be good for", zh: "对…有益" }
    ],
    patterns: [
      { en: "I prefer … to …", zh: "比起…我更喜欢…", ex: "I prefer salad to hamburgers." },
      { en: "How about …?", zh: "…怎么样？", ex: "How about some carrots?" },
      { en: "We should eat more …", zh: "我们应该多吃…", ex: "We should eat more vegetables." }
    ],
    sentences: [
      { en: "Food matters for our health.", zh: "食物对我们的健康很重要。" },
      { en: "A balanced diet keeps us strong.", zh: "均衡饮食让我们保持强壮。" },
      { en: "This dumpling is delicious.", zh: "这饺子很好吃。" }
    ],
    grammar: [
      { title: "可数与不可数", points: [
        "可数：carrot → carrots",
        "不可数：beef, oil, salt, porridge",
        "量词：a bowl of porridge, a piece of bread"
      ] }
    ],
    tip: "外研版（2024）七下 Unit 3：食物、烹饪与健康饮食。"
  },
  {
    id: "d4", book: "下册", code: "Unit 4", title: "The art of having fun", titleZh: "玩的艺术",
    emoji: "🎨",
    words: [
      { en: "imagine", phon: "/ɪˈmædʒɪn/", zh: "想象", pos: "v." },
      { en: "alone", phon: "/əˈləʊn/", zh: "独自", pos: "adv." },
      { en: "tool", phon: "/tuːl/", zh: "工具", pos: "n." },
      { en: "novel", phon: "/ˈnɒvl/", zh: "小说", pos: "n." },
      { en: "magazine", phon: "/ˌmæɡəˈziːn/", zh: "杂志", pos: "n." },
      { en: "bored", phon: "/bɔːd/", zh: "无聊的", pos: "adj." },
      { en: "feeling", phon: "/ˈfiːlɪŋ/", zh: "感觉", pos: "n." },
      { en: "funny", phon: "/ˈfʌni/", zh: "有趣的", pos: "adj." },
      { en: "invite", phon: "/ɪnˈvaɪt/", zh: "邀请", pos: "v." },
      { en: "housework", phon: "/ˈhaʊswɜːk/", zh: "家务", pos: "n." },
      { en: "explore", phon: "/ɪkˈsplɔː/", zh: "探索", pos: "v." },
      { en: "discover", phon: "/dɪˈskʌvə/", zh: "发现", pos: "v." },
      { en: "notice", phon: "/ˈnəʊtɪs/", zh: "注意到", pos: "v." },
      { en: "dangerous", phon: "/ˈdeɪndʒərəs/", zh: "危险的", pos: "adj." },
      { en: "screen", phon: "/skriːn/", zh: "屏幕", pos: "n." },
      { en: "outside", phon: "/ˌaʊtˈsaɪd/", zh: "在户外", pos: "adv." },
      { en: "fresh", phon: "/freʃ/", zh: "新鲜的", pos: "adj." },
      { en: "tennis", phon: "/ˈtenɪs/", zh: "网球", pos: "n." },
      { en: "hike", phon: "/haɪk/", zh: "远足", pos: "v./n." },
      { en: "daily", phon: "/ˈdeɪli/", zh: "每日的", pos: "adj." },
      { en: "social", phon: "/ˈsəʊʃl/", zh: "社交的", pos: "adj." },
      { en: "balanced", phon: "/ˈbælənst/", zh: "均衡的", pos: "adj." },
      { en: "couch potato", phon: "", zh: "电视迷", pos: "n." },
      { en: "unforgettable", phon: "/ˌʌnfəˈɡetəbl/", zh: "难忘的", pos: "adj." }
    ],
    phrases: [
      { en: "the art of having fun", zh: "玩的艺术" },
      { en: "have fun", zh: "玩得开心" },
      { en: "couch potato", zh: "电视迷" },
      { en: "go hiking", zh: "去远足" },
      { en: "in free time", zh: "在空闲时间" }
    ],
    patterns: [
      { en: "How do you spend …?", zh: "你如何度过…？", ex: "How do you spend your weekend?" },
      { en: "It is fun to …", zh: "做…很有趣", ex: "It is fun to explore outside." },
      { en: "invite sb. to do", zh: "邀请某人做", ex: "They invite me to play tennis." }
    ],
    sentences: [
      { en: "Having fun is also an art.", zh: "会玩也是一门艺术。" },
      { en: "Don't be a couch potato all day.", zh: "别整天当电视迷。" },
      { en: "I like hiking and breathing fresh air.", zh: "我喜欢远足、呼吸新鲜空气。" }
    ],
    grammar: [
      { title: "频度与休闲表达", points: [
        "I often play tennis at weekends.",
        "sometimes / usually / never",
        "be bored with … 对…感到无聊"
      ] }
    ],
    tip: "外研版（2024）七下 Unit 4：健康休闲与文娱生活。"
  },
  {
    id: "d5", book: "下册", code: "Unit 5", title: "Amazing nature", titleZh: "奇妙的自然",
    emoji: "🏞️",
    words: [
      { en: "plateau", phon: "/ˈplætəʊ/", zh: "高原", pos: "n." },
      { en: "cloud", phon: "/klaʊd/", zh: "云", pos: "n." },
      { en: "soft", phon: "/sɒft/", zh: "柔软的", pos: "adj." },
      { en: "sky", phon: "/skaɪ/", zh: "天空", pos: "n." },
      { en: "calm", phon: "/kɑːm/", zh: "平静的", pos: "adj." },
      { en: "above", phon: "/əˈbʌv/", zh: "在…上方", pos: "prep." },
      { en: "grassland", phon: "/ˈɡrɑːslænd/", zh: "草原", pos: "n." },
      { en: "field", phon: "/fiːld/", zh: "田野", pos: "n." },
      { en: "proud", phon: "/praʊd/", zh: "自豪的", pos: "adj." },
      { en: "local", phon: "/ˈləʊkl/", zh: "当地的", pos: "adj." },
      { en: "guide", phon: "/ɡaɪd/", zh: "指南", pos: "n." },
      { en: "describe", phon: "/dɪˈskraɪb/", zh: "描述", pos: "v." },
      { en: "landscape", phon: "/ˈlændskeɪp/", zh: "风景", pos: "n." },
      { en: "common", phon: "/ˈkɒmən/", zh: "常见的", pos: "adj." },
      { en: "exhibition", phon: "/ˌeksɪˈbɪʃn/", zh: "展览", pos: "n." },
      { en: "tour", phon: "/tʊə/", zh: "游览", pos: "v./n." },
      { en: "scientist", phon: "/ˈsaɪəntɪst/", zh: "科学家", pos: "n." },
      { en: "land", phon: "/lænd/", zh: "陆地", pos: "n." },
      { en: "surface", phon: "/ˈsɜːfɪs/", zh: "表面", pos: "n." },
      { en: "suggest", phon: "/səˈdʒest/", zh: "建议", pos: "v." },
      { en: "snake", phon: "/sneɪk/", zh: "蛇", pos: "n." },
      { en: "wood", phon: "/wʊd/", zh: "木头", pos: "n." },
      { en: "disappear", phon: "/ˌdɪsəˈpɪə/", zh: "消失", pos: "v." },
      { en: "national", phon: "/ˈnæʃnəl/", zh: "国家的", pos: "adj." }
    ],
    phrases: [
      { en: "amazing nature", zh: "奇妙的自然" },
      { en: "be proud of", zh: "为…自豪" },
      { en: "such as", zh: "例如" },
      { en: "national park", zh: "国家公园" },
      { en: "describe the landscape", zh: "描述风景" }
    ],
    patterns: [
      { en: "There is / are …", zh: "有…", ex: "There are high mountains above the clouds." },
      { en: "be proud of", zh: "为…自豪", ex: "We are proud of our land." },
      { en: "such as", zh: "例如", ex: "Animals such as snakes live here." }
    ],
    sentences: [
      { en: "Nature is full of amazing things.", zh: "大自然充满奇妙事物。" },
      { en: "The sky above the plateau is so blue.", zh: "高原上的天空如此蓝。" },
      { en: "We should protect national parks.", zh: "我们应该保护国家公园。" }
    ],
    grammar: [
      { title: "there be 与方位介词", points: [
        "there is + 单数；there are + 复数",
        "above / in / on / under",
        "There is a calm lake in the field."
      ] }
    ],
    tip: "外研版（2024）七下 Unit 5：自然风光与地理景观。"
  },
  {
    id: "d6", book: "下册", code: "Unit 6", title: "Hitting the road", titleZh: "踏上旅途",
    emoji: "🧳",
    words: [
      { en: "airport", phon: "/ˈeəpɔːt/", zh: "机场", pos: "n." },
      { en: "expect", phon: "/ɪkˈspekt/", zh: "期待", pos: "v." },
      { en: "reply", phon: "/rɪˈplaɪ/", zh: "回答", pos: "v." },
      { en: "mask", phon: "/mɑːsk/", zh: "面具", pos: "n." },
      { en: "ancient", phon: "/ˈeɪnʃənt/", zh: "古代的", pos: "adj." },
      { en: "look forward to", phon: "", zh: "期待", pos: "phr." },
      { en: "curious", phon: "/ˈkjʊəriəs/", zh: "好奇的", pos: "adj." },
      { en: "cultural", phon: "/ˈkʌltʃərəl/", zh: "文化的", pos: "adj." },
      { en: "main", phon: "/meɪn/", zh: "主要的", pos: "adj." },
      { en: "prefer", phon: "/prɪˈfɜː/", zh: "更喜欢", pos: "v." },
      { en: "interest", phon: "/ˈɪntrəst/", zh: "兴趣", pos: "n." },
      { en: "places of interest", phon: "", zh: "名胜", pos: "n." },
      { en: "hotel", phon: "/həʊˈtel/", zh: "酒店", pos: "n." },
      { en: "comfortable", phon: "/ˈkʌmftəbl/", zh: "舒适的", pos: "adj." },
      { en: "postcard", phon: "/ˈpəʊstkɑːd/", zh: "明信片", pos: "n." },
      { en: "waterfall", phon: "/ˈwɔːtəfɔːl/", zh: "瀑布", pos: "n." },
      { en: "huge", phon: "/hjuːdʒ/", zh: "巨大的", pos: "adj." },
      { en: "beauty", phon: "/ˈbjuːti/", zh: "美丽", pos: "n." },
      { en: "discuss", phon: "/dɪˈskʌs/", zh: "讨论", pos: "v." },
      { en: "accept", phon: "/əkˈsept/", zh: "接受", pos: "v." },
      { en: "traffic", phon: "/ˈtræfɪk/", zh: "交通", pos: "n." },
      { en: "set out", phon: "/set aʊt/", zh: "出发", pos: "phr." },
      { en: "achieve", phon: "/əˈtʃiːv/", zh: "实现", pos: "v." },
      { en: "climb", phon: "/klaɪm/", zh: "攀登", pos: "v." }
    ],
    phrases: [
      { en: "hit the road", zh: "上路出发" },
      { en: "look forward to", zh: "期待" },
      { en: "places of interest", zh: "名胜" },
      { en: "set out", zh: "出发" },
      { en: "by plane / train", zh: "乘飞机/火车" }
    ],
    patterns: [
      { en: "look forward to + n./doing", zh: "期待…", ex: "I look forward to visiting the waterfall." },
      { en: "prefer A to B", zh: "更喜欢A", ex: "I prefer hotels to camping." },
      { en: "set out for …", zh: "出发去…", ex: "We set out for the airport early." }
    ],
    sentences: [
      { en: "It's time to hit the road!", zh: "是时候上路了！" },
      { en: "I look forward to this trip.", zh: "我期待这次旅行。" },
      { en: "Travel can open our eyes.", zh: "旅行能开阔眼界。" }
    ],
    grammar: [
      { title: "旅行相关表达", points: [
        "look forward to doing",
        "set out / set off",
        "as … as 平级比较：This trip is as exciting as that one."
      ] }
    ],
    tip: "外研版（2024）七下 Unit 6：旅行出发、文化与名胜。"
  }
];
