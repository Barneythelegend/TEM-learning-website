# TEM Insight Lab

**穿透式電子顯微鏡（TEM／STEM）與材料分析｜互動式教學網站**

本站以中興大學 2026 年 (S)TEM 課程的教學主線為基礎，依照「技術概覽 → 訊號與偵測器 → 電子繞射與成像流程 → 電子光學 → 試片製作 → 繞射 → 成像 → 化學分析 → 案例與練習」編排。

## 網站內容

- **技術概覽：**電子槍、入射電子束、薄片、電子／X 光／能量損失訊號，以及各偵測器典型位置和材料分析用途。
- **電子繞射與成像完整流程：**電子為什麼在晶格中繞射、直射束與不同繞射束、物鏡後焦平面（方向）與像平面（位置）、物鏡光闌選束、底部相機如何讀到電子強度；可切換明場、兩道暗場、繞射圖並調整晶粒傾角。實空間與倒空間有晶面間距滑桿可直接比較。
- **電子光學：**電子槍、透鏡、光闌、相機、電子波長和像差。
- **試片製備：**FIB、PIPS、滴樣與超薄切片，搭配試片損傷與假象。
- **電子繞射：**互動式 SAED、晶面間距、區軸、選擇定則與 Si(002) 禁制反射。
- **影像判讀：**TEM 明場／暗場、HRTEM、FFT、晶格缺陷。
- **掃描穿透與分析：**STEM、ADF／HAADF、EDS、EELS 及 Z-contrast 的限制。
- **練習系統：**62 題 PBL 問答、隨機抽題、熟悉度、進度與個人筆記匯出。

## 發布到 GitHub Pages

將本 ZIP **解壓縮**後，直接把 `index.html`、`styles.css`、`app.js` 和 `README.md` 上傳到 GitHub Repository 的**根目錄**，並按 **Commit changes**。

若已經發布 GitHub Pages，不必新建 Repository；將上述檔案覆蓋舊版並提交即可。若是首次發布，請至 **Settings → Pages → Build and deployment**，設定 `Deploy from a branch`、`main`、`/ (root)`。

發布後，Repository 位址和網站網址不同。一般 GitHub Pages 的網站網址是：

`https://<github-username>.github.io/<repository-name>/`

實際地址以 GitHub Pages 頁面提供的連結為準。

## 離線使用

另外提供單一 HTML 檔，將 HTML、CSS 與 JavaScript 合併在一起。無需網路與伺服器即可開啟，適合課堂展示備份。

網站不連接 AI 服務、帳號系統或後端資料庫。練習進度保存在每位使用者的本機瀏覽器；不同裝置之間不會自動同步。

## 模擬與分析限制

所有物理模擬均為**教學用途的定性示意**；SAED 幾何僅使用理想晶格與小角度近似。HRTEM、BF／DF、HAADF、EDS、EELS 不代表完整的實驗數據模擬。不同儀器型號的偵測器位置與配置可能有所不同。

對外公開時，請勿上傳未獲授權的投影片原圖、未公開實驗結果或個人資料。

## 主要參考

- 國立中興大學 2026 年課堂講義，《(Scanning) Transmission Electron Microscope》（吳建霆研究員，TSRI）。
- Thermo Fisher Scientific：Transmission Electron Microscopy Techniques、Electron Energy-Loss Spectroscopy。
- JEOL TEM 操作說明，以及新加坡南洋理工大學 TEM／STEM 技術資料。

網站為獨立編寫之教學內容，非儀器製造商的正式操作手冊。

## 球面像差互動說明

儀器構造與電子光學章節加入「球面像差（Spherical Aberration）」、簡易電子束示意圖與孔徑角／Cs 互動示範；估算值用來理解趨勢，不是實際 TEM 性能規格。對應課堂 slide 5。

## 球面像差互動修正
- 現在半會聚角、Cs 兩個滑桿會同步更新數值、外側電子束路徑、焦點位置、示意像差模糊範圍。
- 左側光路採可視化放大，不是實際電子光學射線追蹤；右側僅提供簡化趨勢估算。
- 重新上傳與覆蓋 index.html、app.js、styles.css、README.md 並 Commit；HTML 中的 app.js 使用版本參數避免載入舊快取。


## 電子訊號、倒空間與明暗場入門模組

此版將前導概念按下列順序呈現：電子波與晶體的週期性電位互相作用 → 建設性干涉造成不同方向的繞射束 → 物鏡後焦平面把方向分開 → 物鏡光闌選擇直射束（明場）或特定繞射束（暗場）→ 物鏡像平面與投影透鏡將各區域成像至底部相機；亦可切至繞射模式投影角度分布。不同晶粒及不同選束所得亮暗使用定性模型，不代表真實動力學繞射計算。

**延伸區別：**在常規 TEM，物鏡光闌選束，由透鏡成像；在 STEM，細聚焦探針逐點掃描，依偵測角與掃描位置建立像素。真正 SAED 是直接投影繞射平面；HRTEM 的 FFT 是影像處理，不等同 SAED。

**新增參考：** ETH Zürich ScopeM, "TEM – Imaging and Diffraction": https://scopem.ethz.ch/education/EM-ken/basics_theory/TEM_image-formation/TEM-imag-diff.html 。
