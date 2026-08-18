/**
 * 建立「8/19 研習・社團管理系統作品繳交」Google 表單（可收檔案）
 *
 * 怎麼用：
 * 1. 用要當表單擁有人的 Google 帳號（建議 erntmap@gmail.com）登入。
 * 2. 開 https://script.google.com → 新增專案 → 把這整份檔案內容貼進去 → 存檔。
 * 3. 執行 createSubmitForm → 第一次會要求授權（Drive、表單），按同意。
 * 4. 執行紀錄會印出兩個網址：
 *      「填答網址」→ 貼進 practice.html 頁尾的繳交連結（把 id="submitForm" 那行的 href 換掉）
 *      「編輯網址」→ 自己留著改題目、看回覆
 *
 * 注意（請先讀）：
 * - Google 表單的「檔案上傳」題型，填答者必須登入 Google 帳號才能上傳，
 *   而且檔案會存進「表單擁有人」的雲端硬碟、占用他的容量。
 * - 因此本表單設定為「限本人回覆一次」關閉、但保留「收集電子郵件」，方便對照是哪一位老師交的。
 * - 上傳的檔案只會是老師自己做的 HTML 系統檔，不應含學生個資；表單說明已明寫這一點。
 */

function createSubmitForm() {
  var TITLE = '8/19 研習・社團管理系統作品繳交';
  var form = FormApp.create(TITLE);
  form.setTitle(TITLE);
  form.setDescription(
    '財團法人仰望教育基金會 × 國立東華大學｜國中小科學社團扶助計畫\n' +
    '2026/8/19 花蓮地區科學社團教師研習・下半場「從零打造社團管理系統」\n\n' +
    '把你在自造場（https://rlirdo.github.io/yangwang-club-manager/practice.html）做出來的 HTML 檔上傳到這裡。\n' +
    '現場來不及交也沒關係，會後補交即可。\n\n' +
    '【請注意】只上傳你自己做的系統檔（.html）與驗收報告（.txt）。\n' +
    '請不要上傳含有學生姓名、身分證字號、住址的檔案——那些資料只留在學校的紙本與自己的電腦裡。'
  );
  form.setCollectEmail(true);
  form.setAllowResponseEdits(true);
  form.setPublishingSummary(false);
  form.setProgressBar(false);

  // 1 學校
  form.addTextItem()
    .setTitle('學校全稱')
    .setHelpText('例：花蓮縣立北昌國民小學')
    .setRequired(true);

  // 2 姓名
  form.addTextItem()
    .setTitle('你的姓名')
    .setRequired(true);

  // 3 走哪一條路
  form.addMultipleChoiceItem()
    .setTitle('你是用哪一種方式做的？')
    .setChoiceValues([
      '分段路（七關逐段提示詞）',
      '快速路（一整段完整規格提示詞）',
      '兩種都試過',
      '直接改現成的各校專屬版'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // 4 自我驗收分數
  form.addTextItem()
    .setTitle('自造場驗收分數（幾分／20）')
    .setHelpText('把做好的檔案丟回自造場的「上傳驗收」區，會算給你。例：18 / 20')
    .setRequired(false);

  // 5 作品檔（可多檔）
  var up = form.addFileUploadItem()
    .setTitle('你的系統檔（.html）')
    .setHelpText('請上傳你做出來的 HTML 檔；有下載驗收報告 .txt 的話也一起上傳。')
    .setRequired(true);
  up.setDestinationFolder(getOrCreateFolder_('0819研習_作品繳交'));
  up.setAllowedFileTypes([]); // 不限副檔名（.html/.txt 都收）
  up.setMaxFiles(5);
  up.setMaxFileSize(10 * 1024 * 1024); // 每檔 10MB

  // 6 卡住的地方
  form.addParagraphTextItem()
    .setTitle('哪一關卡住了？或想再問什麼？')
    .setHelpText('可以留空。寫下來的話，我們會在後續的線上答疑一併回覆。')
    .setRequired(false);

  form.setConfirmationMessage('收到了，謝謝你！有問題可以寄到 erntmap@gmail.com。');

  Logger.log('填答網址：' + form.getPublishedUrl());
  Logger.log('短網址：' + form.shortenFormUrl(form.getPublishedUrl()));
  Logger.log('編輯網址：' + form.getEditUrl());
  return form.getPublishedUrl();
}

function getOrCreateFolder_(name) {
  var it = DriveApp.getFoldersByName(name);
  if (it.hasNext()) { return it.next(); }
  return DriveApp.createFolder(name);
}
