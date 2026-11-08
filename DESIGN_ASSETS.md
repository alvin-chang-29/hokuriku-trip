# 設計素材記錄

雙人動畫採用使用者確認的 `mii-running-preview-v2` 八格影格，以內建 image_gen 依 Mii 造型參考生成。本版原樣內嵌並以 CSS 逐格播放，沒有再重新生成人物。人物服裝與配件參考使用者提供的截圖，未使用截圖中的 Email、帳號 ID、等級、步數或地圖位置。

花海背景以內建 image_gen 製作，最終提示詞如下：

> Generate only the flower meadow ENVIRONMENT BACKGROUND inspired by the attached approved app mockup. No people, NO Mii characters, NO Pikmin characters, NO creatures, no signs, no text, no UI, no badges, no frames. A bright cheerful game-like 3D illustrated meadow with tiny white daisies, yellow and pink wildflowers, soft rolling green grass, clear cyan sky fading lighter at horizon. Wide landscape composition 1536x1024. Upper half calm clean blue sky and distant horizon; lower half vivid green meadow, small flowers clustered mostly on far left and right edges, the lower center is a quiet patch of green grass reserved for separately composited running avatars. Soft morning sunlight, friendly Pikmin Bloom-like miniature garden aesthetic, subtle depth of field, not photorealistic. Preserve the cheerful fresh cyan/green/white/pink/yellow color palette of the reference. Absolutely no characters, no flowers oversized relative to the scene, no text or logos. This will be the header background and subtle page backdrop for a real mobile PWA; keep central area uncluttered.

原始設計素材位於 `assets/mii-running-sprites.png` 與 `assets/flower-meadow.png`。實際頁面使用 hero.css 內嵌副本，執行時不向外部素材網站發出請求。此包為旅行工具程式與素材，沒有使用者目前的瀏覽器資料或雲端資料庫匯出內容。
