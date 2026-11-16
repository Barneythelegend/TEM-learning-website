# TEM Insight Lab｜穿透式電子顯微鏡互動教室

這是一個完全前端的繁體中文 TEM／STEM 互動教學網站，依 2026/10/19 中興大學課堂《(Scanning) Transmission Electron Microscope》之內容脈絡整理，適合光電檢測技術 PBL 討論。

## v1.1 小幅更新（2026-11-17）

- 改成米白、霧藍、低飽和青綠色的舒適淺色介面，更適合課堂投影與長時間閱讀。
- 科學模擬畫布保留必要的深色背景，改善繞射點、FFT 點位辨識。
- SAED 材料標籤、BF／DF 晶粒名稱、EDS／EELS 峰名移到獨立標題／圖例區，避免蓋住線條與訊號。
- 修正首頁光學柱註解區與個別圖示文字位置，並檢查手機版、題庫與滑桿互動。
- 保留既有 62 題與本機學習進度；localStorage 鍵名不變。

## 包含內容

- TEM 電子槍、透鏡、光闌、相機長度及電子波長計算
- FIB／PIPS／滴樣／超薄切片原理與製樣假象
- 互動 SAED：Si / Cu / α-Fe、[110]/[001]、camera length、beam voltage、(hkl)、d-spacing、禁制反射
- 互動 TEM-BF／DF：objective aperture、晶粒傾角及繞射對比
- HRTEM／FFT 概念互動，以及 Stacking Fault、Twin、Dislocation
- STEM-BF／ADF／HAADF 與 Z-contrast 限制
- EDS／EELS 光譜概念比較
- 62 題有標準回答、常見誤區和延伸追問的 PBL 題庫
- 章節打卡、儲存作答、個人進度與 TXT 筆記匯出

## 最簡單的分享方法：單檔版

除了這個網站資料夾以外，另有 `TEM_互動式教學網站_v1.1_舒適版.html`。該檔案把 CSS、JS 全部包在一起，**離線雙擊即能開啟**，也可以直接丟給同學。若瀏覽器不允許本機儲存，網站仍可操作，只是關閉後未必能保留學習進度；可以透過「匯出我的複習筆記」保存。

## 部署 GitHub Pages（可分享網址）

1. 建立一個公開 GitHub repository，例如 `tem-insight-lab`。
2. 把 **本 ZIP 解壓縮後的 `index.html`、`styles.css`、`app.js`** 上傳到 repository 的**根目錄**。請勿只上傳 `index.html`，否則互動功能與版面樣式會缺失。
3. 到 GitHub repository **Settings → Pages → Build and deployment**，選 **Deploy from a branch**，branch 選 `main`，folder 選 `/ (root)`，儲存設定。
4. 等 GitHub Pages 顯示網址（例如 `https://<account>.github.io/tem-insight-lab/`）後，即可分享到班級群組。這裡的網址只是格式範例，不代表已部署。

本站不需要 API key、資料庫、CDN、網路字型或後端程式。

## 內容如何使用

建議先跑：繞射模擬器 → BF／DF → HRTEM／FFT → STEM／EDS／EELS，再回頭讀電子光學與製樣。口試題庫可按主題、難度、關鍵詞過濾，作答後點「顯示標準回答」，最後按「我會了」或「還不會」。

## 教學模型與限制

- 圖形為**原創示意**；沒有將原課堂授課投影片整頁複製到可分享網站。網站會標明對應 slide 範圍。
- SAED spots 使用理想立方晶格、zone axis、運動學選擇規則與近軸 `R ≈ Lλ/d` 計算；不包含 Ewald 球精細激發誤差、多束動力學或強度定量。
- BF/DF、HRTEM、HAADF 和 EDS/EELS 光譜互動屬**定性概念模型**，不是設備軟體或定量 multislice 模擬器。不能用於研究數據擬合或實驗參數校正。
- 私人學習進度保存在瀏覽器本機 localStorage；不同設備與瀏覽器不會自動同步，也不會上傳到 GitHub。
- 不要在公開版本放入未公開論文、實驗照片、未授權課堂原圖或私人資料。

## 資料與延伸參考

- 課堂主線：吳建霆（TSRI），《(S)TEM》教學投影片，國立中興大學，2026/10/19（學習者提供）。
- Thermo Fisher — Transmission Electron Microscopy Techniques: https://www.thermofisher.com/us/en/home/electron-microscopy/products/transmission-electron-microscopes/techniques/materials-science.html
- JEOL TEM BF/DF operation guide: https://www.i2at.msstate.edu/equipment/docs/Jeol-2100_Manual.pdf
- Thermo Fisher — Electron Energy Loss Spectroscopy: https://www.thermofisher.com/us/en/home/materials-science/eels.html
- NTU Singapore — TEM techniques & applications: https://www.ntu.edu.sg/facts/facilities/tem-cluster/tem-instrumentation-techniques-application

## 自行修改

網站原始檔只有 `index.html`、`styles.css`、`app.js`。口試題庫位於 `app.js` 的 `rawQ` 陣列，術語表則是 `glossary` 陣列。修改題目後可以重新分享／重新部署。
