# v10 iPhone 圖示載入修正

「日」字綠底是加入主畫面時沒有取得圖示的替代顯示。本版將圖示 PNG 同時放在專案根目錄，並在 HTML 指定 180 × 180 的 apple-touch-icon；Manifest 改讀最外層新版圖示路徑。使用獨立檔名避開舊圖示快取，保留標準 apple-touch-icon.png 備援。Service Worker 也修正為不把直接開啟圖片網址當成 App 首頁。

## 上傳及檢查

1. 先在目前使用中的 App 匯出私人 JSON 備份。
2. 把 `hokuriku-japan2026-v10` **裡面的全部檔案及資料夾**上傳到原 GitHub 儲存庫最外層並覆蓋同名檔案，按 Commit changes。
3. 確認儲存庫首頁直接看得到 **apple-touch-icon-v10.png、apple-touch-icon.png、app-icon-192-v10.png、app-icon-512-v10.png**。
4. 等 Pages 部署成功，開啟原 PWA 下載更新，再關閉所有旅行 App／分頁後重開。快取版本為 v10。
5. 用 iPhone Safari 開啟同網站下的 `icon-check-v10.html`，確認兩張圖都顯示粉紅皮克敏坐飛機，並出現「已讀取正確圖示」。
6. 在 Safari 回到 App 首頁，分享 → 加入主畫面。**預覽圖已是飛機圖示時才按新增**。先保留原圖示，確認新圖示可登入並取得共用行程後再整理。

此更新不需要重新建立 Supabase、家庭帳號或行程。沿用現有同步設定與本機儲存鍵。請勿為了換圖示清除 Safari 網站資料。

根目錄 PNG 與明確的 apple-touch-icon 設定參考 [Apple Safari Web Content Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)。尚未在你的 iPhone 真機驗證，圖示檢查頁用來確認部署後的實際圖片可讀取性。
