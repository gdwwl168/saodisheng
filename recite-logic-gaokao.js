/** 背诵逻辑 — 高考必背 · 七十二篇（works 来自 recite-data-gaokao.js） */
if (typeof works === 'undefined') console.error('[recite] works missing');
// ═══════════════ State ═══════════════
let currentWork = 1;
let currentMode = 'browse';
let currentCat = 'all';
let fontSize = 24;
let magnifierWork = 1;
let reciteLevel = 1;
let reciteL2Idx = 0;
let l2Tracked = false;
let l3Tracked = false;

// ═══════════════ localStorage ═══════════════
function loadProgress() {
  try { return JSON.parse(localStorage.getItem('gaokao72_progress')) || {}; }
  catch(e) { return {}; }
}
function saveProgress(p) { localStorage.setItem('gaokao72_progress', JSON.stringify(p)); }

function getWorkProgress(id) {
  const p = loadProgress();
  return p[id] || { read: false, dictated: false, attempts: 0, level: 0 };
}
/** 仅 L3 默写达标后调用：边栏打 ✓ */
function markDictationDone(id) {
  const p = loadProgress();
  if (!p[id]) p[id] = { read: false, dictated: false, attempts: 0, level: 0 };
  p[id].read = true;
  p[id].dictated = true;
  p[id].lastRead = Date.now();
  saveProgress(p);
  renderWorkList();
}

function updateWorkProgress(id, quality) {
  const p = loadProgress();
  if (!p[id]) p[id] = { read: false, dictated: false, attempts: 0, level: 0 };
  p[id].attempts = (p[id].attempts || 0) + 1;
  if (quality === 2) p[id].level = Math.min(5, (p[id].level || 0) + 2);
  else if (quality === 1) p[id].level = Math.min(5, (p[id].level || 0) + 1);
  else if (quality === 0) p[id].level = Math.max(0, (p[id].level || 0) - 1);
  p[id].lastReview = Date.now();
  saveProgress(p);
  renderWorkList();
  updateStatsBar();
}
/** 是否已完成默写（边栏勾选）—— 必须 L3 达标 */
function isWorkDictated(prog) {
  if (!prog) return false;
  return prog.dictated === true;
}

function loadNotes() {
  try { return JSON.parse(localStorage.getItem('gaokao72_notes')) || {}; }
  catch(e) { return {}; }
}
function saveNote(id, text) {
  const n = loadNotes();
  n[id] = text;
  localStorage.setItem('gaokao72_notes', JSON.stringify(n));
}

function loadTheme() { return window.cjgResolveTheme ? cjgResolveTheme('gaokao72_theme','') : (localStorage.getItem('gaokao72_theme') !== null ? localStorage.getItem('gaokao72_theme') : (/Android|iPhone|iPad|iPod|Mobile|HarmonyOS|HUAWEI|HONOR/i.test(navigator.userAgent) ? 'dark' : '')); }
function saveTheme(t) { localStorage.setItem('gaokao72_theme', t); }

// ═══════════════ Sidebar ═══════════════
function getFilteredWorks() {
  let w = [...works];
  if (currentCat !== 'all') w = w.filter(x => x.cat === currentCat);
  const sort = document.getElementById('sortSelect')?.value || 'num';
  if (sort === 'progress') {
    w.sort((a, b) => {
      const pa = getWorkProgress(a.id), pb = getWorkProgress(b.id);
      return (pb.level || 0) - (pa.level || 0);
    });
  } else if (sort === 'unread') {
    w.sort((a, b) => {
      const pa = getWorkProgress(a.id), pb = getWorkProgress(b.id);
      return (isWorkDictated(pa) ? 1 : 0) - (isWorkDictated(pb) ? 1 : 0);
    });
  }
  return w;
}

function renderWorkList() {
  const list = document.getElementById('workList');
  const filtered = getFilteredWorks();
  const allProgress = loadProgress();
  let totalRead = 0;
  works.forEach(w => { if (isWorkDictated(allProgress[w.id])) totalRead++; });

  const catLabels = { shi:'诗', ci:'词', qu:'曲', wen:'文' };
  let html = '';
  filtered.forEach(w => {
    const prog = allProgress[w.id] || {};
    const isRead = isWorkDictated(prog);
    const active = w.id === currentWork ? ' active' : '';
    const preview = w.famous ? w.famous.slice(0, 8) : w.text.replace(/\n/g, '').slice(0, 8);
    const hint = (typeof hintsMap !== 'undefined' && hintsMap[w.id]) || '';
    const emoji = (typeof hintEmoji !== 'undefined' && hintEmoji[w.id]) || '';
    const hintLabel = (emoji + ' ' + hint).trim();
    html += '<div class="work-item' + active + '" onclick="navigateToWork(' + w.id + ')">' +
      '<span class="wi-num">' + w.id + '</span>' +
      '<span class="wi-cat ' + w.cat + '">' + (catLabels[w.cat] || w.cat) + '</span>' +
      '<span class="wi-info"><span class="wi-title">' + w.title + '</span>' +
      '<span class="wi-preview">' + preview + '…</span></span>' +
      (hintLabel ? '<span class="wi-hint" title="' + w.id + ' → ' + hint + '">' + hintLabel + '</span>' : '') +
      (isRead ? '<span class="wi-badge" title="L3 默写已达标">✓</span>' : '') +
      '</div>';
  });
  list.innerHTML = html;

  document.getElementById('totalProgressBar').style.width = Math.round(totalRead / 72 * 100) + '%';
  document.getElementById('totalProgressText').textContent = Math.round(totalRead / 72 * 100) + '%';
}

function setCatFilter(cat) {
  currentCat = cat;
  document.querySelectorAll('#catFilters button').forEach(b => b.classList.remove('active'));
  document.querySelector('#catFilters button[data-cat="' + cat + '"]').classList.add('active');
  renderWorkList();
}

// ═══════════════ Navigation ═══════════════
function navigateToWork(id) {
  const maxId = (typeof works !== 'undefined' && works.length)
    ? Math.max.apply(null, works.map(function (w) { return w.id; }))
    : 72;
  id = Math.max(1, Math.min(maxId, id));
  const filtered = getFilteredWorks();
  if (currentCat !== 'all') {
    const ids = filtered.map(w => w.id);
    if (!ids.includes(id)) {
      let closest = filtered[0], minDist = Infinity;
      filtered.forEach(w => { const d = Math.abs(w.id - id); if (d < minDist) { minDist = d; closest = w; } });
      id = closest ? closest.id : 1;
    }
  }
  currentWork = id;
  window.location.hash = id;
  localStorage.setItem('gaokao72_work', id);
  renderContent();
  renderWorkList();
  closeSidebar();
  document.getElementById('content').scrollTop = 0;
}

function prevWork() {
  const filtered = getFilteredWorks();
  const ids = filtered.map(w => w.id);
  let idx = ids.indexOf(currentWork);
  if (idx < 0) idx = ids.indexOf(Number(currentWork));
  if (idx > 0) navigateToWork(ids[idx - 1]);
  else if (ids.length) navigateToWork(ids[ids.length - 1]);
}
function nextWork() {
  const filtered = getFilteredWorks();
  const ids = filtered.map(w => w.id);
  let idx = ids.indexOf(currentWork);
  if (idx < 0) idx = ids.indexOf(Number(currentWork));
  if (idx >= 0 && idx < ids.length - 1) navigateToWork(ids[idx + 1]);
  else if (ids.length) navigateToWork(ids[0]);
}
window.prevWork = prevWork;
window.nextWork = nextWork;
window.navigateToWork = navigateToWork;

// ═══════════════ Mode Switching ═══════════════
function switchMode(mode) {
  if (mode === 'recite') {
    reciteLevel = reciteLevel >= 3 ? 1 : reciteLevel + 1;
    const labels = {1:'背诵 L1',2:'背诵 L2',3:'背诵 L3'};
    document.getElementById('reciteBtn').textContent = '🗣️ ' + labels[reciteLevel];
    currentMode = 'recite';
  } else {
    currentMode = mode;
  }
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.mode-btn[data-mode="' + mode + '"]').classList.add('active');
  localStorage.setItem('gaokao72_mode', currentMode);
  localStorage.setItem('gaokao72_reciteLevel', reciteLevel);
  renderContent();
}

function changeFontSize(delta) {
  fontSize = Math.max(12, Math.min(40, fontSize + delta));
  const textEl = document.querySelector('.work-text');
  if (textEl) textEl.style.fontSize = fontSize + 'px';
  showToast('字号: ' + fontSize + 'px');
}

// ═══════════════ Content Rendering ═══════════════
function getWork() { return works.find(w => w.id === currentWork) || works[0]; }

function renderContent() {
  const w = getWork();
  const catLabels = { shi:'诗', ci:'词', qu:'曲', wen:'文言文' };
  const hintWord = (typeof hintsMap !== 'undefined' && hintsMap[w.id]) || '';
  const emoji = (typeof hintEmoji !== 'undefined' && hintEmoji[w.id]) || '';
  const container = document.getElementById('content');
  let html = '<div class="work-container">' +
    '<div class="work-header">' +
    '<span class="wh-cat ' + w.cat + '">' + (catLabels[w.cat] || w.cat) + '</span>' +
    '<div class="wh-title">' + w.id + '. ' + w.title +
      (hintWord ? ' <span class="wh-hint-badge" title="' + w.id + '→' + hintWord + '">' + emoji + ' ' + hintWord + '</span>' : '') +
    '</div>' +
    (w.subtitle ? '<div class="wh-subtitle">' + w.subtitle + '</div>' : '') +
    '<div class="wh-meta">' + (w.dynasty || '') + ' · ' + (w.author || '') +
    '</div>' +
    '</div>';

  const text = w.text;
  const lines = text.split('\n');
  const famousSet = new Set((w.famous || '').split(' / ').filter(Boolean).map(s => s.trim()));

  switch (currentMode) {
    case 'browse':
      html += '<div class="work-text" style="font-size:' + fontSize + 'px">';
      lines.forEach(line => {
        html += '<span class="verse">' + (line || '&nbsp;') + '</span>';
      });
      html += '</div>';
      break;

    case 'famous':
      html += '<div class="work-text famous-mode" style="font-size:' + fontSize + 'px">';
      lines.forEach(line => {
        const isFamous = famousSet.size > 0 && (famousSet.has(line.trim()) || [...famousSet].some(f => f && line.includes(f)));
        html += '<span class="verse' + (isFamous ? ' famous' : '') + '">' + (line || '&nbsp;') + '</span>';
      });
      html += '</div>';
      break;

    case 'cloze':
      html += '<div class="work-text cloze-mode" id="clozeText" style="font-size:' + fontSize + 'px">';
      lines.forEach((line, li) => {
        html += '<span class="verse">';
        [...line].forEach((ch, ci) => {
          if (/[，。、；：！？\s\n]/.test(ch)) {
            html += ch;
          } else if (Math.random() < 0.3) {
            html += '<span class="blank" data-idx="' + li + '-' + ci + '" onclick="this.classList.add(\'revealed\')">' + ch + '</span>';
          } else {
            html += ch;
          }
        });
        html += '</span>';
      });
      html += '</div>' +
        '<div style="margin-top:14px;display:flex;gap:8px;justify-content:center;">' +
        '<button onclick="document.querySelectorAll(\'.blank\').forEach(b=>b.classList.add(\'revealed\'))" style="padding:6px 16px;border:1px solid var(--border);border-radius:14px;background:var(--card-bg);color:var(--text);cursor:pointer;font-family:inherit;">全部揭示</button>' +
        '<button onclick="renderContent()" style="padding:6px 16px;border:1px solid var(--border);border-radius:14px;background:var(--card-bg);color:var(--text);cursor:pointer;font-family:inherit;">重新生成</button>' +
        '</div>';
      break;

    case 'recite':
      html += renderReciteMode(text);
      break;

    case 'annotate':
      html += '<div class="annotation-card">' +
        '<div class="ann-label">📜 背景</div>' +
        '<div class="ann-body">' + (w.background || '暂无') + '</div>' +
        '</div>';
      html += '<div class="work-text" style="font-size:' + fontSize + 'px">';
      lines.forEach(line => {
        html += '<span class="verse">' + (line || '&nbsp;') + '</span>';
      });
      html += '</div>';
      html += '<div class="annotation-card">' +
        '<div class="ann-label">💡 赏析</div>' +
        '<div class="ann-body">' + (w.annotation || '暂无') + '</div>' +
        '</div>';
      break;

    case 'notes':
      const notes = loadNotes();
      const noteText = notes[currentWork] || '';
      html += '<div class="notes-card">' +
        '<h3>📋 我的笔记 — ' + w.title +
          (hintWord ? ' <span style="font-size:0.7em;opacity:0.65;">' + emoji + ' ' + hintWord + '</span>' : '') +
        '</h3>' +
        '<textarea id="notesArea" placeholder="写下你的背诵心得……">' + noteText + '</textarea>' +
        '<div class="notes-actions">' +
        '<button class="notes-save" onclick="document.getElementById(\'notesArea\')&&saveNote(' + currentWork + ',document.getElementById(\'notesArea\').value.slice(0,2000))||showToast(\'已保存\')">保存</button>' +
        '<span class="notes-hint" id="notesHint">' + noteText.length + '/2000</span></div></div>';
      setTimeout(() => {
        const area = document.getElementById('notesArea');
        if (area) area.addEventListener('input', () => { document.getElementById('notesHint').textContent = area.value.length + '/2000'; });
      }, 100);
      break;
  }

  html += '</div>';
  container.innerHTML = html;
  container.scrollTop = 0;
  updateStatsBar();
}

// ═══════════════ Pinyin Initial Map (comprehensive) ═══════════════
const PINYIN_INIT={
'a': '爱安阿哀嗄奥啊哎哀挨癌矮艾爱碍安氨庵俺岸按案暗昂凹熬袄傲奥澳鞍敖坳埃',
'b': '不百保抱白彼搏冰蔽并倍泊鄙敝本闭败兵必悲宾臂薄病弊辩被拔比宝璧报补伯博把班般伴半扮瓣帮绑榜傍胞饱宝报抱豹暴爆杯碑北备背倍被辈奔逼鼻比笔币毕闭辟碧蔽壁边编鞭贬扁便变辨标表别滨宾冰兵饼并病拨波玻剥播伯驳帛泊勃博搏薄卜补捕不布步部埠柏缤遍陛避卑版崩八谤鬓庇巴',
'c': '常此出成长处辞冲挫尘存刍持揣除疵雌畜车驰骋宠川次慈臣春察从诚朝超乘筹策吹称藏措仓彩财辍赤虫淳脆层寸尺繟草彻陈擦猜才材财裁采彩踩菜参餐残蚕惨灿仓苍舱藏操曹草册侧测策层曾差插茶查察叉拆柴馋缠产昌长肠尝偿常厂场畅倡唱抄超巢朝潮吵炒车扯彻撤尘臣辰沉陈闯衬称趁撑成呈承诚城乘惩程秤吃池驰迟持尺齿耻斥赤翅充冲虫崇抽仇绸愁筹丑瞅臭出初除厨锄处础储楚触川穿传船喘串窗床创吹炊垂锤春纯唇醇蠢辞慈磁此次刺从匆葱聪丛凑粗促醋窜催摧脆翠村存寸错殂槽蹴词沧赐',
'ch': '叉差插查茶察拆柴馋缠产昌长肠尝偿常厂场畅倡唱抄超巢朝潮吵炒车扯彻撤尘臣辰沉陈闯衬称趁撑成呈承诚城乘惩程秤吃池驰迟持尺齿耻斥赤翅充冲虫崇抽仇绸愁筹丑瞅臭出初除厨锄处础储楚触川穿传船喘串窗床创吹炊垂锤春纯唇醇蠢躇踌潺叱澈俶敕谗婵掣怆坻舂滁',
'd': '道地短得盗帝动多涤达德当大冬敦笃殆登独沌澹淡夺定贷毒兑带柢敌代搭达答打大呆代带待怠袋逮戴丹单担耽胆旦但诞弹淡蛋当党档刀叨导岛倒蹈到盗悼道稻得德灯登等邓凳瞪低堤滴敌笛底抵地弟帝递第颠典点电店垫奠殿雕吊钓调掉跌爹叠碟蝶丁叮盯顶订定丢东冬董懂动冻栋洞都兜抖斗豆逗督毒读独堵赌杜肚度渡端短段断堆队对吨敦蹲盾顿多夺朵躲惰岱咄貂窦箪荡昳牍诋的钝',
'e': '而恶儿耳饵二俄鹅额恶饿恩儿而尔耳二蛾',
'f': '非弗夫腹纷富辐发妨复废甫伐风反法泛方负父费粪覆服丰福伏辅奉罚阀帆番翻凡烦繁反返犯饭泛范贩方坊芳防妨房仿访纺放飞非啡肥匪废沸肺费分芬纷坟粉份奋愤粪丰风枫封疯峰锋蜂冯逢缝凤奉佛否夫肤孵伏扶拂服俘浮符幅福抚斧府辅腐父付妇负附赴复副傅富赋缚覆俯烽孚蕃菲霏乏',
'g': '故观高功贵骨敢光狗谷根国共毂归古各公寡改关官割果甘过固刚孤穀广盖刿鬼拱槁弓攻垢该改钙盖概干甘杆肝赶敢感刚岗纲钢港高搞稿告哥歌鸽割搁格阁葛个各给根跟更耕工弓公功攻供宫恭巩拱共贡勾沟钩狗构购够估咕姑孤菇古谷股骨鼓固故顾雇瓜刮挂拐怪关观官冠馆管贯惯灌罐光广逛归龟规闺硅鬼轨柜贵桂滚棍锅国果裹过鬲苟肱躬冈革郭羹觥隔戈',
'h': '和后货或乎阖户患何混惚恍涣慧昏荒孩海惑黑隳好还侯合害化华厚寒祸浑虎含号讳毫褐怀活恢哈还海害含函寒韩喊汉汗旱悍航毫豪好号耗呵喝合何和河核荷盒贺黑痕很狠恨哼恒横衡轰红宏虹洪鸿哄侯喉猴后厚候乎呼忽狐胡壶湖糊虎互户护花华划哗滑化画话怀徊淮坏欢还环缓幻换唤患荒慌皇黄煌晃灰挥恢辉回悔汇会绘贿惠慧昏婚浑魂混活火伙或货获祸惑霍皓晦鹤瀚洄惶豁酣浩篁弘宦桓晖麾壑',
'j': '徼皆较教居见解间久几金骄咎惊及寄诘皦今纪将静极家绝精矜寂君迹楗结救荆棘军佳吉降均既江竭蹶贱基建进坚郊甲角济介径剑祭据攫筋朘忌伎积交兼加九稽俭惧匠饥举稷鸡己击饥机肌鸡迹积基绩激及吉级极即急疾集籍几己挤给脊计记纪技际剂季既济继祭加夹佳家嘉甲假价驾架嫁尖奸坚间肩艰兼监煎拣捡减剪简见件建剑健舰渐践鉴键箭江姜将浆僵疆讲奖匠降酱交郊娇骄胶焦角绞脚搅叫轿较教阶接揭街节劫杰洁结捷截姐解介戒届界借巾今斤金津筋仅紧尽劲近进晋浸禁京经惊晶睛精井颈景警净径竞竟敬境静镜纠究九久酒旧救就舅拘居鞠局菊橘举巨句拒具俱剧据距惧锯聚捐卷倦决绝觉掘军均君菌俊峻跻炬谏楫谨嗟蒹葭啾罥骏矩讥锦雎涧娟唧戟骥碣皲鸠鞯溅郡贾襟',
'k': '可开口狂客旷孔况跨恐窥夸克抗枯卡开凯慨刊堪砍看康抗炕考烤靠科棵颗壳咳可渴克刻客课肯垦恳坑空孔恐控口扣枯哭苦库裤酷夸跨块快宽款筐狂况矿框亏葵愧溃昆困扩括阔嵁柯鲲叩',
'l': '两乱利离览令聋猎邻六牢傫飂乐立寥羸老礼露力灵裂琭珞颣梁陆廉莅流累里来拉啦喇腊辣来莱赖兰拦栏蓝篮览懒烂郎狼廊朗浪捞劳牢老乐勒雷垒泪类累冷厘梨狸离梨犁璃礼李里理鲤力历厉立丽励利例隶粒连帘怜莲联廉脸练炼恋链良凉梁粮两亮谅辆辽疗聊了料列劣烈猎裂邻林临淋伶灵玲铃陵零龄岭领令另刘留流硫榴柳六龙笼隆楼漏芦炉陆录鹿碌路驴旅铝履律虑率绿卵乱掠略伦轮论罗萝锣箩骡落络骆鳞绫澜鲁偻陋卢洌雳庐泸琅冽洛涟凌蜡峦阑枥廪吏篱',
'm': '名母妙门美民绵满莫明目盲昧命没闷冥迷灭马弥猛牡免谋木末吗妈麻码骂埋买迈麦卖脉蛮瞒满曼慢忙芒盲茫猫毛矛茅茂冒贸帽貌么没枚玫眉梅媒煤每妹魅门闷们盟猛梦眯迷谜米秘密蜜眠绵免勉面苗描秒妙灭民敏明鸣命摸模膜摩磨魔抹末沫莫漠墨默谋某亩母牡木目牧墓幕慕暮靡暝耄寐寞莽觅湄蔓庙蒙谬芼谩陌鍪',
'n': '难能乃奈年宁讷鸟诺怒拿哪那纳乃奶耐男南难囊挠脑恼闹呢内嫩能尼泥拟你逆年念娘酿鸟尿捏您宁凝牛扭纽农浓弄奴努怒女暖挪诺辗馁驽侬',
'o': '哦欧偶鸥',
'p': '牝魄朴飘偏譬平普贫烹泮配怕拍排牌派攀盘判盼叛旁庞胖抛炮陪培赔佩配喷盆朋棚蓬鹏捧碰批坯披劈皮疲脾屁片骗漂飘拼频品平评凭屏瓶坡泼颇婆迫破剖扑铺仆葡朴普谱瀑曝辔琶匹瓢琵萍骈袍畔翩霹徘珮',
'q': '其倾前去强屈穷勤且气器取清亲弃巧曲全岂企轻泣缺却奇起求千契犬七妻凄期欺齐奇骑棋旗企启起气弃汽器恰千迁牵铅谦签前钱钳乾浅遣欠枪腔强墙抢悄敲乔桥瞧巧切且窃亲侵琴勤青轻倾清情晴请庆穷丘秋求球区曲驱屈趋渠取去趣圈全权泉拳犬劝缺却雀确鹊裙群衾俟逑箧乞顷秦潜畎卿阙戚寝禽樯歧妾阡琼裘羌擎萋绮',
'r': '人弱锐仁如若柔辱容然日荣攘扔入热戎刃然燃染嚷壤饶扰绕惹热仁忍认任扔仍日绒荣容溶熔融柔肉如儒乳辱入软锐瑞润若弱',
's': '始斯善生声随是圣事恃尚使实似谁数守神死所身私上水时遂四三十埏室色爽失视绳首士深识涉释孰属素少俗食甚式逝虽师散奢胜杀丧寿示石损摄兕势塞施孙祀螫兽疏肆啬伤市驷慎顺舍司手税受社什洒塞赛三伞散桑嗓丧扫嫂色森僧杀沙纱傻厦筛晒山杉衫珊扇闪陕善伤商赏上尚捎烧稍少绍哨舌蛇舍设社射涉摄申伸身深神审婶肾甚渗慎升生声牲胜绳省圣盛剩尸失师诗施湿十什石时识实拾食史使始驶士氏世市示式事侍势视试饰室是适逝收手守首寿受兽售书叔殊梳疏输蔬熟暑属署数术束述树竖数刷耍衰摔甩帅双霜爽谁水税睡顺说丝司私思斯撕死四寺似饲肆松宋送诵搜艘苏俗诉肃素速宿塑酸蒜算虽随岁碎穗孙损笋缩所索锁搔夙粟瑟骚蔌涘邃竦溯',
'sh': '沙纱傻厦筛晒山杉衫珊扇闪陕善伤商赏上尚捎烧稍少绍哨舌蛇舍设社射涉摄申伸身深神审婶肾甚渗慎升生声牲胜绳省圣盛剩尸失师诗施湿十什石时识实拾食史使始驶士氏世市示式事侍势视试饰室是适逝收手守首寿受兽售书叔殊梳疏输蔬熟暑属署数术束述树竖数刷耍衰摔甩帅双霜爽谁水税睡顺说舜硕瘦拭庶嗜朔蜀漱勺轼淑梢裳',
't': '天同橐堂退畋托听通太台忒泰恬脱偷徒投亭田图土推他它她塌塔踏胎台抬太态泰贪摊滩坛谈弹痰坦毯叹炭探汤唐堂塘膛糖躺趟掏逃桃陶淘讨套特疼腾藤梯踢提题蹄体剃替天添田甜填挑条跳贴铁帖厅听廷亭庭停挺艇通同桐铜童统桶筒痛头投透突图徒涂屠土吐兔团推腿退吞屯托拖脱驼妥拓啼窕颓苔潭滕抟潼途汀柝髫涕豚湍涛',
'w': '无万物谓为唯吾外五味闻微畏妄王侮我伪文未顽惟枉洼勿亡往晚芜握卫武威网望挖蛙娃瓦歪外弯湾丸完玩顽挽晚碗万汪亡王网往忘旺望危威微为围违唯惟维伟伪尾纬委萎卫未位味畏胃喂慰温文纹闻蚊吻稳问翁窝我沃卧握乌污屋无吴武侮舞勿务物误悟雾猥呜梧蔚午宛寤罔魏鹉惋兀巫巍',
'x': '玄下相行贤心虚兮象先姓邪信希徐新凶孝学熙享瑕袭雄谿嘘祥小歙兴昔歇笑形习修乡鲜细肖狎徙夕西吸希析息牺悉惜晰稀溪锡熙嘻膝习席袭洗喜戏系细虾瞎峡狭霞下吓夏仙先纤掀鲜闲贤弦咸衔嫌显险县现线限宪陷献乡相香箱详享响想向巷项象像橡削消萧销小晓孝校笑效些歇协邪胁斜携鞋写血泄泻谢蟹心辛欣新薪信兴星猩腥刑行形型醒杏幸性姓凶兄匈胸雄熊休修羞朽秀绣袖须虚需徐许序叙畜绪续宣玄悬旋选穴学雪血勋熏寻巡询循训讯迅襄晞翕屑絮奚曦喧荇屣箫潇馨谐亵偕啸翔懈湘',
'y': '有欲以异又已易音言焉也用盈渊犹龠愈于与尤玉遗营一婴牖曰夷迎御豫俨芸誉悠义忧央余愚窈阅雨亦远域燕约要右矣衣养鱼应渝隅隐阴阳益遇育殃厌饮云倚妖耀宜怨勇抑舆压呀鸦鸭牙芽崖哑雅亚咽烟淹延严言岩炎沿研盐颜衍掩眼演厌宴艳验雁焰央扬羊阳杨洋仰养氧痒样腰邀摇遥咬药要耀爷也冶野业叶页夜液一衣医依仪夷姨移遗疑乙已以蚁椅义艺忆议亦异役译易益谊逸意毅翼因阴音姻银引饮隐印应英婴鹰迎盈营赢影映硬拥永泳勇涌用优忧幽悠由邮犹油游友有又右幼诱于余鱼娱渔愉愚与宇羽雨语玉育狱浴预域欲遇御裕愈誉冤元园员原圆援缘源远怨院愿约月乐岳阅悦跃越云匀允孕运晕韵蕴耶缊伊攸屿怡辕曳淫诣寓烨咏缨喻琊曜吟莺佁郁猿翳鹦砚媵谒肴殷淤涯愠巘祎噫邑逾饴予弈伛',
'z': '之者众知作争治志智则宗湛子中自政载专致宰埴凿状执浊止足忠贼哉兆昭真直彰终骤在赘周字重躁辎主辙谪资制佐壮早左战张镇丈贞质至拙正走注爪尊滋置坐罪召斫折责舟杂灾栽载再在咱攒赞脏葬藏遭糟早枣澡造噪燥责择泽贼怎增赠扎渣闸眨炸摘宅窄债沾粘展崭占战站张章涨掌丈仗帐障招找召兆赵照罩遮折哲者这浙针侦珍真诊枕阵振镇震争征挣睁蒸整正证郑政之支汁芝枝知织肢脂执直值职植止只旨址纸指至志制治质致智置中忠终钟种肿众重州舟周洲粥宙昼皱骤朱珠株诸猪竹逐烛主煮嘱助住注驻柱祝著筑抓爪专砖转赚庄桩装壮状撞追准捉桌浊着仔兹姿资滋紫字自宗综棕踪总纵走奏租足族阻组祖钻嘴最罪醉尊遵昨左作坐座做臧姊樽簪眦卒诹邹暂咨',
'zh': '扎渣闸眨炸摘宅窄债沾粘展崭占战站张章涨掌丈仗帐障招找召兆赵照罩遮折哲者这浙针侦珍真诊枕阵振镇震争征挣睁蒸整正证郑政之支汁芝枝知织肢脂执直值职植止只旨址纸指至志制治质致智置中忠终钟种肿众重州舟周洲粥宙昼皱骤朱珠株诸猪竹逐烛主煮嘱助住注驻柱祝著筑抓濯冢嶂仲撰诏锺雉杼炙沚缀辄拄贽峙杖箸祗妆芷啄陟'
};
function getPinyinInit(c) {
  for (const [init, chars] of Object.entries(PINYIN_INIT)) {
    if (chars.includes(c)) return init.charAt(0);
  }
  return '?';
}

// ═══════════════ Recite Mode ═══════════════
function renderReciteMode(text) {
  switch (reciteLevel) {
    case 1: return renderReciteL1(text);
    case 2: return renderReciteL2(text);
    case 3: return renderReciteL3(text);
    default: return renderReciteL1(text);
  }
}

// L1: 点击认字
function renderReciteL1(text) {
  const chars = [...text];
  let html = '<div class="work-text recite-l1-text" style="font-size:' + fontSize + 'px;line-height:1.35;text-align:left;cursor:default;">';
  for (const c of chars) {
    if (/[，。、；：！？\s\n]/.test(c)) {
      if (c === '\n') html += '<br>'; else if (c === '。') html += '<span style="opacity:0.5;">。</span><br>'; else html += '<span style="opacity:0.5;">' + c + '</span>';
    } else {
      html += '<span class="recite-blank" onclick="revealReciteBlank(this,\'' + c.replace(/'/g,"\\'") + '\')">_</span>';
    }
  }
  html += '</div>';
  html += '<div style="margin-top:16px;text-align:center;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">' +
    '<button onclick="revealAllReciteL1()">👁️ 全部显示</button>' +
    '<button onclick="renderContent();">🔄 重来</button>' +
    '<span style="font-size:0.75em;opacity:0.5;align-self:center;">点击横线认字 · L1初级</span>' +
    '</div>';
  return html;
}

function revealReciteBlank(el, char) {
  el.textContent = char;
  el.style.borderBottom = 'none';
  el.style.cursor = 'default';
  el.style.color = 'var(--accent)';
  el.style.fontWeight = '700';
  el.onclick = null;
}

function revealAllReciteL1() {
  document.querySelectorAll('.recite-blank').forEach(el => {
    el.style.borderBottom = 'none';
    el.style.cursor = 'default';
    el.style.color = 'var(--accent)';
    el.style.fontWeight = '700';
    el.onclick = null;
    const match = el.getAttribute('onclick')?.match(/revealReciteBlank\(this,'([^']*)'\)/);
    if (match) el.textContent = match[1];
  });
}

// L2: 首拼输入
function renderReciteL2(text) {
  reciteL2Idx = 0;
  l2Tracked = false;
  l3Tracked = false;
  const chars = [...text].filter(c => !/[，。、；：！？\s\n]/.test(c));
  const total = chars.length;
  let html = '<div class="work-text recite-l2-text" style="font-size:' + fontSize + 'px;line-height:1.35;text-align:left;">';
  let ci = 0;
  for (const c of [...text]) {
    if (/[，。、；：！？\s\n]/.test(c)) {
      if (c === '\n') html += '<br>'; else if (c === '。') html += '<span style="opacity:0.5;">。</span><br>'; else html += '<span style="opacity:0.5;">' + c + '</span>';
    } else {
      const reveal = ci < reciteL2Idx;
      html += '<span class="rl2c" data-ci="' + ci + '" style="' + (reveal ? 'color:var(--accent);font-weight:700;' : '') + '">' + (reveal ? c : '_') + '</span>';
      ci++;
    }
  }
  html += '</div>';
  const pinyinHint = reciteL2Idx < total ? getPinyinInit(chars[reciteL2Idx]) : '✓';
    html += '<div class="l2-panel" style="margin-top:12px;text-align:left;">' +
    '<span style="font-size:0.8em;opacity:0.55;display:block;margin-top:8px;">按拼音首字母揭示下一个字 · 直接敲字母</span>' +
    '<div style="margin:10px 0 8px 0;font-size:2em;font-weight:700;color:var(--accent);opacity:0.35;min-height:1.2em;" id="l2Hint">' + pinyinHint + '</div>' +
    '<input id="l2Input" type="text" readonly autocomplete="off"' +
    ' class="l2-hidden-input"' +
    ' inputmode="latin" onkeydown="handleL2Keydown(event)">' +
    '<button onclick="toggleL2Hint()" id="l2HintBtn" style="font-size:0.8em;opacity:0.4;border:none;background:none;color:var(--text);cursor:pointer;padding:4px 8px;margin-top:2px;">🙈 隐藏字母</button>' +
    '<div style="margin-top:4px;font-size:0.7em;opacity:0.4;" id="l2Progress">0/' + total + '</div>' +
    '</div>' +
    '<div style="margin-top:12px;text-align:center;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">' +
    '<button onclick="revealAllReciteL2()">👁️ 全部显示</button>' +
    '<button onclick="renderContent();">🔄 重来</button>' +
    '<span style="font-size:0.75em;opacity:0.5;align-self:center;">首拼揭示 · L2中级</span>' +
    '</div>';
  setTimeout(() => { try { document.getElementById('l2Input')?.focus({ preventScroll: true }); } catch (e) { document.getElementById('l2Input')?.focus(); } }, 80);
  return html;
}



var l2HintVisible = true;
document.addEventListener('click', function(e) {
  var inp = document.getElementById('l2Input');
  var hint = document.getElementById('l2Hint');
  if (inp && document.activeElement !== inp && hint && hint.textContent !== '✓ 完成！') {
    // 不要抢走顶栏/侧栏/翻页等导航点击
    if (e.target.closest('button, a, select, input, textarea, .topbar, .sidebar, .sidebar-backdrop, .page-nav-fab, .stats-bar, .work-item, .magnifier-overlay')) return;
    try { inp.focus({ preventScroll: true }); } catch (err) { inp.focus(); }
  }
});
function toggleL2Hint() {
  l2HintVisible = !l2HintVisible;
  var h = document.getElementById('l2Hint');
  var b = document.getElementById('l2HintBtn');
  if (h) h.style.display = l2HintVisible ? '' : 'none';
  if (b) b.textContent = l2HintVisible ? '🙈 隐藏字母' : '🙉 显示字母';
  setTimeout(() => { try { document.getElementById('l2Input')?.focus({ preventScroll: true }); } catch (e) { document.getElementById('l2Input')?.focus(); } }, 50);
}
function handleL2Keydown(e) {
  var letter = null;
  if (e.code && e.code.length === 4 && e.code[3] >= 'A' && e.code[3] <= 'Z') letter = e.code[3].toLowerCase();
  if (e.code === 'Space') e.key = ' ';
  if (e.code === 'Enter') e.key = 'Enter';
  var isLetter = letter !== null;
  var isSkip = e.key === 'Enter' || e.key === ' ';
  if (!isLetter && !isSkip) return;
  e.preventDefault(); e.stopPropagation();
  const text = getWork().text;
  const chars = [...text].filter(c => !/[，。、；：！？\s\n]/.test(c));
  const input = document.getElementById('l2Input');
  const hint = document.getElementById('l2Hint');
  const prog = document.getElementById('l2Progress');
  if (isLetter) {
    if (reciteL2Idx >= chars.length) { hint.textContent = '✓ 完成！'; input.blur(); input.style.display = 'none'; return; }
    const correct = getPinyinInit(chars[reciteL2Idx]);
    if (letter === correct) {
      revealL2Char(chars);
      input.value = '';
      if (reciteL2Idx < chars.length) { input.style.display = ''; input.focus({ preventScroll: true }); hint.textContent = getPinyinInit(chars[reciteL2Idx]); }
      else { input.blur(); input.style.display = 'none'; hint.textContent = '✓ 完成！'; if (!l2Tracked) { if(!l3Tracked){updateWorkProgress(currentWork,1);l3Tracked=true;} l2Tracked = true; } }
      prog.textContent = reciteL2Idx + '/' + chars.length;
    } else {
      hint.textContent = correct + ' ✗';
      hint.style.color = '#b85450'; hint.style.opacity = '1';
      setTimeout(() => { if (hint) { hint.style.color = 'var(--accent)'; hint.style.opacity = '0.3'; } }, 600);
      input.value = ''; input.focus({ preventScroll: true });
    }
  } else {
    if (reciteL2Idx < chars.length) {
      revealL2Char(chars);
      input.value = '';
      if (reciteL2Idx < chars.length) { input.style.display = ''; input.focus({ preventScroll: true }); hint.textContent = getPinyinInit(chars[reciteL2Idx]); }
      else { input.blur(); input.style.display = 'none'; hint.textContent = '✓ 完成！'; if (!l2Tracked) { if(!l3Tracked){updateWorkProgress(currentWork,1);l3Tracked=true;} l2Tracked = true; } }
      prog.textContent = reciteL2Idx + '/' + chars.length;
    }
  }
}

function handleL2Input() {
  const text = getWork().text;
  const chars = [...text].filter(c => !/[，。、；：！？\s\n]/.test(c));
  const total = chars.length;
  const input = document.getElementById('l2Input');
  const hint = document.getElementById('l2Hint');
  const prog = document.getElementById('l2Progress');

  const val = input.value.toLowerCase().trim();
  if (!val) return;
  if (reciteL2Idx >= total) { hint.textContent = '✓ 完成！'; input.value = ''; return; }

  const correct = getPinyinInit(chars[reciteL2Idx]);
  if (val === correct) {
    revealL2Char(chars);
    input.value = '';
    if (reciteL2Idx < total) hint.textContent = getPinyinInit(chars[reciteL2Idx]);
    else { hint.textContent = '✓ 完成！'; if (!l2Tracked) { if(!l3Tracked){updateWorkProgress(currentWork,1);l3Tracked=true;} l2Tracked = true; } }
    prog.textContent = reciteL2Idx + '/' + total;
  } else {
    hint.textContent = correct + ' ✗';
    hint.style.color = '#b85450';
    hint.style.opacity = '1';
    setTimeout(() => { if (hint) { hint.style.color = 'var(--accent)'; hint.style.opacity = '0.3'; } }, 600);
    input.value = '';
  }
}

function revealL2Char(chars) {
  if (reciteL2Idx >= chars.length) return;
  const el = document.querySelector('.rl2c[data-ci="' + reciteL2Idx + '"]');
  if (el) {
    el.textContent = chars[reciteL2Idx];
    el.style.color = 'var(--accent)';
    el.style.fontWeight = '700';
  }
  reciteL2Idx++;
}

function revealAllReciteL2() {
  const text = getWork().text;
  const chars = [...text].filter(c => !/[，。、；：！？\s\n]/.test(c));
  document.querySelectorAll('.rl2c').forEach((el, i) => {
    if (i < chars.length) {
      el.textContent = chars[i];
      el.style.color = 'var(--accent)';
      el.style.fontWeight = '700';
    }
  });
  reciteL2Idx = chars.length;
  const hint = document.getElementById('l2Hint');
  if (hint) hint.textContent = '✓ 完成！';
  const prog = document.getElementById('l2Progress');
  if (prog) prog.textContent = chars.length + '/' + chars.length;
  if (!l2Tracked) { if(!l3Tracked){updateWorkProgress(currentWork,1);l3Tracked=true;} l2Tracked = true; }
}

// L3: 全文默写
function renderReciteL3(text) {
  l3Tracked = false; // 每次进入 L3 重置
  const w = getWork();
  const wubiHref = '8655.html?corpus=gaokao#' + currentWork;
  let html = '<textarea class="recite-area" id="reciteArea" placeholder="在此默写' + w.title + '…\n\n写完后点击下方「核对」按钮查看对比结果。"></textarea>' +
    '<div style="margin-top:16px;text-align:center;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">' +
    '<button onclick="checkRecite()">✅ 核对</button>' +
    '<button onclick="showReciteAnswer()">👁️ 查看原文</button>' +
    '<button onclick="renderContent();">🔄 重来</button>' +
    '<span style="font-size:0.75em;opacity:0.5;align-self:center;">全文默写 · L3高级</span>' +
    '</div>' +
    '<div style="margin-top:14px;text-align:center;padding-bottom:4px;">' +
    '<a href="' + wubiHref + '" target="_blank" rel="noopener" style="display:inline-block;color:var(--accent,#8b4513);text-decoration:underline;font-size:0.9em;">⌨️ 本章五笔打字练习</a>' +
    '</div>' +
    '<div id="reciteResult"></div>';
  return html;
}

// L3 序列对齐：漏字/多字后仍能对齐后文，避免「开头少两个字 → 全盘错位」
function alignReciteChars(orig, user) {
  const m = orig.length, n = user.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (orig[i - 1] === user[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const ops = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && orig[i - 1] === user[j - 1] && dp[i][j] === dp[i - 1][j - 1]) {
      ops.push({ t: 'match', o: orig[i - 1], u: user[j - 1] }); i--; j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      ops.push({ t: 'sub', o: orig[i - 1], u: user[j - 1] }); i--; j--;
    } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
      ops.push({ t: 'del', o: orig[i - 1] }); i--;
    } else {
      ops.push({ t: 'ins', u: user[j - 1] }); j--;
    }
  }
  ops.reverse();
  return ops;
}

function checkRecite() {
  const userText = document.getElementById('reciteArea').value.trim();
  const original = getWork().text;
  const resultDiv = document.getElementById('reciteResult');
  if (!userText) {
    resultDiv.innerHTML = '<p style="color:#b85450;margin-top:16px;">请输入内容后再核对。</p>';
    return;
  }
  const isPunct = c => /[，。、；：！？\s\n""''「」『』]/.test(c);
  const userChars = [...userText].filter(c => !isPunct(c));
  const origChars = [...original].filter(c => !isPunct(c));
  const ops = alignReciteChars(origChars, userChars);

  let matchCount = 0, missCount = 0, wrongCount = 0, extraCount = 0;
  let html = '<div class="compare-result"><p style="font-weight:700;margin-bottom:8px;">📋 对比结果：（忽略标点，自动对齐漏/多字）</p><p>';
  let opi = 0;
  for (const oc of [...original]) {
    if (oc === ' ' || oc === '\n') continue;
    if (isPunct(oc)) {
      html += `<span style="opacity:0.4;">${oc}</span>`;
      continue;
    }
    while (opi < ops.length && ops[opi].t === 'ins') {
      const u = ops[opi].u;
      html += `<span class="mismatch" title="多写「${u}」">＋${u}</span>`;
      extraCount++;
      opi++;
    }
    const op = ops[opi++];
    if (!op) {
      html += `<span class="missing">${oc}</span>`;
      missCount++;
      continue;
    }
    if (op.t === 'match') {
      html += `<span class="match">${oc}</span>`;
      matchCount++;
    } else if (op.t === 'sub') {
      html += `<span class="mismatch" title="你写的是「${op.u}」">${oc}</span>`;
      wrongCount++;
    } else if (op.t === 'del') {
      html += `<span class="missing" title="漏写">${oc}</span>`;
      missCount++;
    }
  }
  while (opi < ops.length) {
    if (ops[opi].t === 'ins') {
      html += `<span class="mismatch" title="多写「${ops[opi].u}」">＋${ops[opi].u}</span>`;
      extraCount++;
    }
    opi++;
  }

  html += '</p>';
  const accuracy = origChars.length > 0 ? Math.round((matchCount / origChars.length) * 100) : 0;
  const detail = [];
  if (missCount) detail.push('漏写 ' + missCount);
  if (wrongCount) detail.push('错写 ' + wrongCount);
  if (extraCount) detail.push('多写 ' + extraCount);
  html += '<p style="margin-top:8px;">正确率：<strong>' + accuracy + '%</strong>（' + matchCount + '/' + origChars.length + ' 字）';
  if (detail.length) html += ' · ' + detail.join('，');
  html += '</p>';
  if (accuracy >= 90) {
    if (!l3Tracked) { updateWorkProgress(currentWork, 2); l3Tracked = true; }
    markDictationDone(currentWork);
    html += '<p style="color:#6b8e5a;">🎉 很好！这篇掌握得不错！边栏已标记 ✓</p>';
  } else if (accuracy >= 60) {
    if (!l3Tracked) { updateWorkProgress(currentWork, 1); l3Tracked = true; }
    markDictationDone(currentWork);
    html += '<p style="color:#c4a97d;">📖 继续加油，还有进步空间。边栏已标记 ✓（正确率≥60%）</p>';
  } else {
    if (!l3Tracked) { updateWorkProgress(currentWork, 0); l3Tracked = true; }
    html += '<p style="color:#b85450;">💪 需要多加练习，别灰心！正确率达 60% 后才会打 ✓</p>';
  }
  html += '</div>';
  resultDiv.innerHTML = html;
}

function showReciteAnswer() {
  const resultDiv = document.getElementById('reciteResult');
  const text = getWork().text.replace(/\n/g, '<br>');
  resultDiv.innerHTML = '<div class="compare-result"><p style="font-weight:700;margin-bottom:8px;">📖 原文：</p><p>' + text + '</p></div>';
  if(!l3Tracked){updateWorkProgress(currentWork,0);l3Tracked=true;}
}

// ═══════════════ Stats Bar ═══════════════
function updateStatsBar() {
  const w = getWork();
  const prog = getWorkProgress(w.id);
  const stars = '★'.repeat(Math.min(5, prog.level || 0)) + '☆'.repeat(Math.max(0, 5 - (prog.level || 0)));
  const catLabels = { shi:'诗', ci:'词', qu:'曲', wen:'文' };
  const lastDate = prog.lastReview || prog.lastRead;
  document.getElementById('statsBar').innerHTML =
    '<span>掌握度 ' + stars + '</span>' +
    '<span>练习 ' + (prog.attempts || 0) + ' 次</span>' +
    (lastDate ? '<span>最近复习 ' + new Date(lastDate).toLocaleDateString('zh-CN') + '</span>' : '') +
    '<span>#' + w.id + ' · 高考 · ' + (catLabels[w.cat] || w.cat) + '</span>';
}

// ═══════════════ Magnifier ═══════════════
function openMagnifier() {
  magnifierWork = currentWork;
  document.getElementById('magnifier').classList.add('open');
  renderMagnifier();
}
function closeMagnifier() { document.getElementById('magnifier').classList.remove('open'); }
function renderMagnifier() {
  const w = works.find(x => x.id === magnifierWork) || works[0];
  const hintWord = (typeof hintsMap !== 'undefined' && hintsMap[w.id]) || '';
  const emoji = (typeof hintEmoji !== 'undefined' && hintEmoji[w.id]) || '';
  const parts = w.text.replace(/\n/g, '').split('。').filter(p => p.trim());
  document.getElementById('magnifierContent').innerHTML =
    '<div class="mag-title">' + (emoji ? emoji + ' ' : '') + w.title +
      (w.subtitle ? ' · ' + w.subtitle : '') +
      (hintWord ? ' · ' + hintWord : '') +
      ' <span style="font-size:0.4em;opacity:0.5;">#' + w.id + '</span></div>' +
    '<div class="mag-text">' + parts.map(p => '<span class="verse">' + p.trim() + '。</span>').join('') + '</div>';
}
function magnifierPrev() {
  const filtered = getFilteredWorks();
  const ids = filtered.map(w => w.id);
  const idx = ids.indexOf(magnifierWork);
  magnifierWork = idx > 0 ? ids[idx - 1] : ids[ids.length - 1] || 1;
  renderMagnifier();
}
function magnifierNext() {
  const filtered = getFilteredWorks();
  const ids = filtered.map(w => w.id);
  const idx = ids.indexOf(magnifierWork);
  magnifierWork = idx < ids.length - 1 ? ids[idx + 1] : ids[0] || 1;
  renderMagnifier();
}

// ═══════════════ Theme ═══════════════
/* toggleTheme → theme-boot.js */

// ═══════════════ Toast ═══════════════
/* showToast → ui-toast.js */

// ═══════════════ Sidebar Toggle ═══════════════
function openSidebar() {
  const sb = document.getElementById('sidebar');
  const bd = document.getElementById('sidebarBackdrop');
  if (sb) sb.classList.add('open');
  if (bd) bd.classList.add('show');
}
function closeSidebar() {
  const sb = document.getElementById('sidebar');
  const bd = document.getElementById('sidebarBackdrop');
  if (sb) sb.classList.remove('open');
  if (bd) bd.classList.remove('show');
}
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (sb && sb.classList.contains('open')) closeSidebar();
  else openSidebar();
}

// ═══════════════ Keyboard ═══════════════
document.addEventListener('keydown', e => {
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  if (document.getElementById('magnifier').classList.contains('open')) {
    if (e.key === 'Escape') closeMagnifier();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); magnifierPrev(); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); magnifierNext(); }
    return;
  }
  switch (e.key) {
    case 'ArrowLeft': case 'ArrowUp': prevWork(); break;
    case 'ArrowRight': case 'ArrowDown': nextWork(); break;
    case '1': switchMode('browse'); break;
    case '2': switchMode('famous'); break;
    case '3': switchMode('cloze'); break;
    case '4': switchMode('recite'); break;
    case '5': switchMode('notes'); break;
    case '6': switchMode('annotate'); break;
    case '-': changeFontSize(-1); break;
    case '=': changeFontSize(1); break;
    case 'm': openMagnifier(); break;
    case 't': toggleTheme(); break;
    case '5': window.open('memory-game.html','_blank'); break;
    case '6': window.open('poetry-chain.html','_blank'); break;
    case '7': window.open('xiao-game.html','_blank'); break;
    case '8': window.open('emoji-match.html','_blank'); break;
    case '9': window.open('saolei.html','_blank'); break;
    case '0': window.open('2048.html','_blank'); break;
    case 'h': case 'H': e.preventDefault(); location.href = 'index.html'; break;
    case 'Escape': closeMagnifier(); break;
  }
});

// ═══════════════ Init ═══════════════
(function init() {
  document.documentElement.setAttribute('data-theme', loadTheme());
  renderWorkList();
  // 支持 ?mode=recite&level=3#篇号（从五笔练习页跳回默打）
  const urlParams = new URLSearchParams(window.location.search);
  const urlMode = urlParams.get('mode');
  const urlLevel = parseInt(urlParams.get('level'), 10);
  if (urlMode) {
    currentMode = urlMode;
    if (urlLevel >= 1 && urlLevel <= 3) reciteLevel = urlLevel;
    localStorage.setItem('gaokao72_mode', currentMode);
    localStorage.setItem('gaokao72_reciteLevel', String(reciteLevel));
  } else {
    const savedMode = localStorage.getItem('gaokao72_mode');
    if (savedMode) { currentMode = savedMode; reciteLevel = parseInt(localStorage.getItem('gaokao72_reciteLevel')) || 1; }
  }
  if (currentMode === 'recite') {
    const labels = {1:'背诵 L1',2:'背诵 L2',3:'背诵 L3'};
    document.getElementById('reciteBtn').textContent = '🗣️ ' + labels[reciteLevel];
  }
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.mode-btn[data-mode="${currentMode}"]`)?.classList.add('active');
  const hash = parseInt(window.location.hash.replace('#',''));
  const savedWork = parseInt(localStorage.getItem('gaokao72_work'));
  const startWork = (hash >= 1 && hash <= 72) ? hash : (savedWork >= 1 && savedWork <= 72) ? savedWork : 1;
  navigateToWork(startWork);
})();

// ═══════════════ 手机左右滑动翻篇（内嵌，不依赖外部脚本） ═══════════════
(function setupMobilePageSwipe() {
  var startX = 0, startY = 0, on = false, lock = false;
  function go(dir) {
    if (lock) return;
    lock = true;
    setTimeout(function () { lock = false; }, 280);
    try {
      if (dir < 0) { if (typeof nextWork === 'function') nextWork(); }
      else { if (typeof prevWork === 'function') prevWork(); }
    } catch (err) { console.warn('[swipe]', err); }
  }
  function okTarget(t) {
    if (!t || !t.closest) return true;
    return !t.closest('input,textarea,select,button,a,label,.topbar,.sidebar,.sidebar-backdrop,.page-nav-fab,.magnifier-overlay,.recite-area,.notes-area');
  }
  function bind(el) {
    if (!el || el._pageSwipeOn) return;
    el._pageSwipeOn = true;
    el.addEventListener('touchstart', function (e) {
      if (!e.touches || e.touches.length !== 1) return;
      if (!okTarget(e.target)) { on = false; return; }
      on = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (!on || !e.changedTouches || !e.changedTouches.length) { on = false; return; }
      on = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - startX;
      var dy = t.clientY - startY;
      if (Math.abs(dx) < 48) return;
      if (Math.abs(dy) > Math.abs(dx) * 0.9) return;
      go(dx < 0 ? -1 : 1);
    }, { passive: true });
    el.addEventListener('touchcancel', function () { on = false; }, { passive: true });
  }
  // only bind content once
  bind(document.getElementById('content') || document.querySelector('.main') || document.body);
})();


document.addEventListener("keydown",function(e){if(e.key==="?"||e.key==="/"){e.preventDefault();toggleGuide();}});function toggleGuide(){var p=document.getElementById("guideOverlay");p.style.display=p.style.display==="flex"?"none":"flex";}