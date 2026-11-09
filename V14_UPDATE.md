# V14：12/10 回程執行（schemaVersion 1.3）

這是既有 App 的完整更新包。解壓縮後，將此資料夾內的檔案及 assets、icons、cloud、tests、tools 資料夾上傳到原 GitHub repository 根目錄，覆蓋同名程式檔；不要把外層資料夾本身上傳成另一層。維持原 GitHub Pages 網址，不需要重建 Supabase 或執行新 SQL。

## 使用

開啟「12/10 回程執行」，預設租車自駕。上方可選普通電車＋兩台計程車或普通電車＋機場巴士。每方案各自保留時間軸與待辦。切換方案不會取消租車或向業者預約。

輸入日本時間的實際金澤站到站時間，會以20分鐘準備緩衝推薦提供班表內的下一班普通電車。計程車需分別輸入兩車預約狀態、報價、電話、集合時間及地點。巴士會計算轉乘分鐘、低於30分鐘風險，以及是否晚於16:05目標。航班18:35與所有交通時間均為參考，當天請重新查官方資訊。

費用未填顯示「待報價」。已知項目小計不代表完整總價；步行前往金澤站時可自行將該段費用填0。未填的項目不會自動當成0。

## 資料保留與範圍

回程紀錄存於 `hokuriku2026.day8.state.v1_3`，與12/3的 `hokuriku_dayone_20261203_v1` 完全分開。12/3三個程式／資料／樣式檔案與V13逐位元相同。主行程、餐廳、購物及既有雲端同步不變。回程執行頁的勾選、實際時間與預訂資料目前僅存本機，不加入三裝置雲端同步。

升級會讀取 `hokuriku2026.day8.` 開頭的舊紀錄，保留原 key 原文不刪除；另在新紀錄保留原文快照。舊 local_train_and_taxi 合併至兩台計程車方案，可沿用資料放入第一車，第二車預設未預約、未知報價。private_transfer 不再顯示為可選方案，舊內容保留在頁面底部「升級前原始資料」及下載備份。不存在的舊方案選擇會回到租車。

程式無法讀取的新紀錄會停止寫入，避免覆蓋。頁底可下載完整回程紀錄（可能含預訂號碼，請私人保管）。更新前也建議使用原 App 的備份功能。不要清除 Safari 網站資料或 localStorage。

## GitHub 更新後

等待 GitHub Actions 的 Pages deployment 成功，關閉所有舊版 App／同網站分頁，再開啟原網址並重新整理，讓V14離線快取啟用。沒有新分頁時先確認 repository 根目錄 index.html、app.js、sw.js 與四個 return 檔案均已更新。不要刪除網站資料排除快取。

## 驗證

使用 Node 24 執行 `node --test tests/*.test.cjs`：63項通過，涵蓋方案切換、轉乘與航班緩衝、費用、勾選與重載、舊資料遷移、主App九分頁整合、既有雲端同步與12/3資料未變。

已透過官方網頁核對機場巴士PDF的14:25→14:49、15:50→16:14、16:40→17:04與6號站牌、富山交通電話、普通電車成人票價1290及相關官方查詢連結。列車候選時刻依提供JSON呈現為參考，並非即時列車查詢。聯絡按鈕格式為 tel，日文複製使用 Clipboard API（HTTPS）。

本環境未完成真實 iPhone／iPad／Edge 的觸控與視覺實機測試；自動化測試是在Node VM執行實際App事件與計算程式。更新後請在裝置切換三方案、勾一項待辦並重新開啟，確認樣式與持久保存。

官方來源：
- 普通電車車站／票價：https://www.ishikawa-railway.jp/station/kanazawa/
- 官方金澤站班表：https://www.ishikawa-railway.jp/ishi-train/station/kanazawa/
- 機場巴士／票價／付款與座位規則：https://www.chitetsu.co.jp/?page_id=733
- 官方冬季PDF：https://www.chitetsu.co.jp/wp-content/uploads/2026/10/9bb299687ec3e71f11ea7db7b48c9512-2.pdf
- 富山站乘車處：https://www.chitetsu.co.jp/wp-content/themes/custom2/pdf/stationbusstop.pdf
- 富山交通：https://www.tomitaku.co.jp/taxi/
- 當天航班：https://www.toyama-airport.co.jp/getonboard/flight-information
