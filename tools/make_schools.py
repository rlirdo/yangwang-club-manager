# -*- coding: utf-8 -*-
"""從 index.html 產生各校專屬版與選校頁。新增學校：改 SCHOOLS 後執行 python tools/make_schools.py"""
import io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SCHOOLS = [
    "花蓮縣立北昌國民小學",
    "花蓮縣立秀林國民中學",
    "花蓮縣立美崙國民中學",
    "花蓮縣立國風國民中學",
    "花蓮縣光復鄉大興國民小學",
    "花蓮縣秀林鄉佳民國民小學",
    "花蓮縣壽豐鄉豐山國民小學",
    "花蓮縣壽豐鄉豐裡國民小學",
    "花蓮縣秀林鄉西寶國民小學",
]

PICKER_TEMPLATE = '''<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>仰望科學社團管理系統・選擇你的學校</title>
<style>
  body{{font-family:system-ui,"Microsoft JhengHei","Noto Sans CJK TC",sans-serif;
    background:#faf7f0;color:#111;max-width:720px;margin:0 auto;padding:32px 20px;line-height:1.7}}
  h1{{font-size:26px;margin-bottom:4px}}
  .sub{{color:#5b5650;margin-bottom:20px}}
  ol{{padding-left:0;list-style:none}}
  ol li{{margin-bottom:10px}}
  ol a{{display:block;background:#fff;border:3px solid #000;border-radius:3px;
    box-shadow:5px 5px 0 0 #000;padding:12px 16px;font-size:18px;font-weight:700;
    color:#111;text-decoration:none}}
  ol a:active{{transform:translate(5px,5px);box-shadow:none}}
  .warn{{background:#fff3f3;border:3px solid #B43B3B;border-radius:3px;padding:12px 16px;
    margin:22px 0;font-weight:700}}
  .tip{{background:#eefbf4;border:3px solid #2fbf71;border-radius:3px;padding:12px 16px;margin:22px 0}}
</style>
</head>
<body>
<h1>仰望科學社團管理系統</h1>
<p class="sub">財團法人仰望教育基金會 × 國立東華大學｜請點你的學校</p>
<ol>
{rows}
</ol>
<div class="tip"><b>要離線用（建議）：</b>點進你的學校後，到「備份與設定」按
<b>「下載隨身版 HTML（含目前資料）」</b>存到桌面或隨身碟——之後雙擊那個檔案就能繼續編輯，資料會跟著檔案走。
用 <b>Ctrl+S</b> 也可以，但存檔類型要選「<b>網頁，完整</b>」。</div>
<div class="warn">注意：線上版和存到本機的檔案<u>不會互相自動同步</u>——請認定一份當主要工作檔。
要把資料搬到另一份或另一台電腦：用「下載隨身版 HTML」整包帶走，或「匯出備份 → 匯入備份」。</div>
<p class="sub"><a href="../index.html">→ 通用版（未預填校名）</a>｜<a href="../prompts.html">提示詞卡①–⑤</a></p>
</body>
</html>
'''

def main():
    src = io.open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    outdir = os.path.join(ROOT, "schools")
    os.makedirs(outdir, exist_ok=True)
    links = []
    for i, s in enumerate(SCHOOLS, 1):
        out = src.replace('var PRESET_SCHOOL = ""', 'var PRESET_SCHOOL = "%s"' % s)
        out = out.replace('var STORE_KEY = "yw-club-mgr-v1"', 'var STORE_KEY = "yw-club-mgr-v1-s%02d"' % i)
        out = out.replace('<title>仰望科學社團管理系統</title>', '<title>仰望科學社團管理系統・%s</title>' % s)
        out = out.replace('href="prompts.html"', 'href="../prompts.html"')
        fn = "%02d-%s.html" % (i, s)
        io.open(os.path.join(outdir, fn), "w", encoding="utf-8").write(out)
        links.append((fn, s))
        print("OK", fn)
    rows = "\n".join('      <li><a href="%s">%s</a></li>' % (fn, s) for fn, s in links)
    io.open(os.path.join(outdir, "index.html"), "w", encoding="utf-8").write(
        PICKER_TEMPLATE.format(rows=rows))
    print("OK schools/index.html（%d 校）" % len(SCHOOLS))

if __name__ == "__main__":
    main()
