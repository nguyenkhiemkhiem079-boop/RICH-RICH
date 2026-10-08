import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { GoogleGeminiEffect } from "./gemini-effect";
import "./style.css";
import "./analysis.css";
import "./polish.css";
import "./profile.css";
import { calculateNumerology } from "./numerology";
import { personalNumbers } from "./personal-numbers";
import { calculatePlacements, calculateAspects, calculateChartAngles, findHouse, localBirthToUtc, type ChartAngles, type Placement, type Aspect } from "./astrology";
import { vietnameseLunar } from "./lunar";
import { calculateDailyGuidance, dateFromKey } from "./daily-guidance";
import { analyzeTuvi, summarizeTuvi } from "./tuvi-analysis";
import { astro } from "iztro";
import { bundleJackpotOdds, choose, jackpotOdds, matchDistribution, probabilityFraction } from "./probability";
import { shuffleTarot, tarotDeck, type TarotCard } from "./tarot";

const disclaimer = "Kết quả xổ số là ngẫu nhiên. Thống kê quá khứ không giúp dự đoán kỳ quay sau. Trang này chỉ mang tính tham khảo và giải trí, không liên kết với Vietlott. Chỉ dành cho người từ 18 tuổi trở lên. Hãy chơi có trách nhiệm.";
const navigationGroups = [
  { title: "Kết quả", links: ["Mega 6/45", "Power 6/55", "Lotto 5/35"] },
  { title: "Phân tích dữ liệu", links: ["Thống kê", "Cấu trúc dữ liệu", "Bản đồ số", "Lọc lịch sử", "Backtest"] },
  { title: "Công cụ số", links: ["Bộ số tham khảo", "Kiểm tra bộ số", "Máy tính Bao"] },
  { title: "Khám phá", links: ["Tarot", "Tử vi", "Bản đồ sao", "Khám phá bản thân", "Năng lượng hôm nay"] },
  { title: "Trợ giúp", links: ["Kiến thức", "Nguồn dữ liệu & phương pháp"] },
];
type Draw = { draw_id: number; draw_date: string; numbers: number[]; special?: number | null };

function App() {
  const [page, setPage] = useState(decodeURIComponent(location.hash.slice(1) || "Trang chủ"));
  const eligible = localStorage.getItem("vl-18-plus") === "yes";
  useEffect(() => { const update = () => { setPage(decodeURIComponent(location.hash.slice(1) || "Trang chủ")); document.querySelectorAll("header nav details[open]").forEach(menu => menu.removeAttribute("open")); }; addEventListener("hashchange", update); return () => removeEventListener("hashchange", update); }, []);
  return <>{!eligible && <section className="gate"><h1>Xác nhận độ tuổi</h1><p>Nội dung chỉ dành cho người từ 18 tuổi trở lên.</p><button onClick={() => { localStorage.setItem("vl-18-plus", "yes"); location.reload(); }}>Tôi từ 18 tuổi trở lên</button></section>}
    <header><div className="topline"><a className="brand-mark" href="#Trang chủ"><span>V</span><span>VIETLOTT LAB<small>DATA · INSIGHT · REFLECTION</small></span></a><span className="live-pill">● LIVE DATA</span></div><div className="header-copy"><p className="eyebrow">DỮ LIỆU · XÁC SUẤT · KHÁM PHÁ</p><h1>Nhìn rõ lịch sử.<br /><em>Hiểu đúng xác suất.</em></h1><p>Tra cứu kết quả, đọc dữ liệu và khám phá các công cụ biểu tượng trong cùng một không gian.</p></div><nav aria-label="Điều hướng chính"><a className={page==="Trang chủ"?"is-current":""} href="#Trang chủ" aria-current={page==="Trang chủ"?"page":undefined}>Tổng quan</a>{navigationGroups.map(group=><details className="nav-group" key={group.title}><summary>{group.title}<span>⌄</span></summary><div className="nav-popover">{group.links.map(item=><a className={page===item?"is-current":""} href={`#${item}`} key={item} aria-current={page===item?"page":undefined}>{item}</a>)}</div></details>)}</nav></header>
    {page === "Trang chủ" && <section className="hero-effect hero-compact"><GoogleGeminiEffect /><div className="hero-copy"><span>THỐNG KÊ · PHƯƠNG PHÁP · MINH BẠCH</span><h2>Không dự đoán.<br />Chỉ cung cấp bằng chứng.</h2></div></section>}
    <main><Page page={page} /></main><footer>{disclaimer}</footer></>;
}

function Page({ page }: { page: string }) {
  const games = ["Mega 6/45", "Power 6/55", "Lotto 5/35"];
  if (page === "Trang chủ") return <HomeDashboard games={games}/>;
  if (games.includes(page)) return <GamePage game={page} />;
  if (page === "Bộ số tham khảo") return <Generator />;
  if (page === "Khám phá bản thân") return <ExpandedNumerologyProfile />;
  if (page === "Năng lượng hôm nay") return <DailyGuidancePage />;
  if (page === "Bản đồ sao") return <NatalChartProfile />;
  if (page === "Tarot") return <TarotPage />;
  if (page === "Tử vi") return <TuviProfile />;
  if (page === "Bản đồ số") return <NumberMap />;
  if (page === "Cấu trúc dữ liệu") return <Structure />;
  if (page === "Lọc lịch sử") return <History />;
  if (page === "Kiểm tra bộ số") return <Checker />;
  if (page === "Thống kê") return <Stats />;
  if (page === "Máy tính Bao") return <Bao />;
  if (page === "Kiến thức") return <section className="info"><h2>Kiến thức</h2><p>Các kỳ quay độc lập. Sai lầm con bạc không làm thay đổi xác suất kỳ sau.</p></section>;
  if (page === "Backtest") return <section className="info"><h2>Backtest</h2><p>Kết quả walk-forward sẽ hiển thị cùng seed, khoảng tin cậy và hiệu chỉnh Holm khi dữ liệu hợp lệ.</p></section>;
  return <section className="info"><h2>{page}</h2><p>Nguồn ưu tiên là trang chính thức; dữ liệu được cache và kiểm tra schema trước khi công bố.</p></section>;
}

function HomeDashboard({games}:{games:string[]}) {
  const groups=[
    {icon:"◉",title:"Kết quả Vietlott",description:"Xem kỳ quay mới nhất và lịch sử theo từng trò chơi.",links:games,action:"Mở kết quả"},
    {icon:"⌁",title:"Phân tích dữ liệu",description:"Tần suất, cấu trúc dãy số, lịch sử và kiểm định mô tả.",links:["Thống kê","Cấu trúc dữ liệu","Lọc lịch sử","Backtest","Bản đồ số"],action:"Khám phá dữ liệu"},
    {icon:"✧",title:"Tarot & khám phá",description:"Một không gian suy ngẫm với Tarot, Tử Vi, bản đồ sao và thần số học.",links:["Tarot","Tử vi","Bản đồ sao","Khám phá bản thân","Năng lượng hôm nay"],action:"Mở không gian khám phá"},
    {icon:"⟡",title:"Công cụ bộ số",description:"Tạo bộ tham khảo, kiểm tra vé và xem xác suất tổ hợp.",links:["Bộ số tham khảo","Kiểm tra bộ số","Máy tính Bao"],action:"Mở công cụ"},
  ];
  return <><section className="home-intro"><p className="eyebrow">CHỌN ĐIỀU BẠN MUỐN LÀM</p><h2>Một nơi. Bốn lối đi.</h2><p>Thay vì dàn trải từng tính năng, bắt đầu theo mục tiêu của bạn.</p></section><section className="home-dashboard">{groups.map((group,index)=><article className={`home-feature home-feature-${index+1}`} key={group.title}><span className="home-feature-icon">{group.icon}</span><small>0{index+1} / KHÔNG GIAN</small><h3>{group.title}</h3><p>{group.description}</p><div className="home-feature-links">{group.links.map(item=><a href={`#${item}`} key={item}>{item}<span>↗</span></a>)}</div><a className="home-feature-action" href={`#${group.links[0]}`}>{group.action} <span>→</span></a></article>)}</section><section className="info home-principle"><p className="eyebrow">NGUYÊN TẮC CỦA LAB</p><h3>Kết quả ngẫu nhiên. Dữ liệu minh bạch.</h3><p>Các kỳ quay độc lập; thống kê lịch sử không làm thay đổi xác suất kỳ tiếp theo. Công cụ cá nhân hóa và Tarot chỉ để tham khảo, không hứa hẹn dự đoán.</p></section></>;
}

function GamePage({ game }: { game: string }) {
  const file = game === "Mega 6/45" ? "mega" : game === "Power 6/55" ? "power" : "lotto535";
  const [draws, setDraws] = useState<Draw[]>([]); const [error, setError] = useState("");
  const load = () => fetch(`${import.meta.env.BASE_URL}data/${file}.json?ts=${Date.now()}`).then((r) => r.ok ? r.json() : Promise.reject(new Error("Không tải được dữ liệu"))).then(setDraws).catch((e) => setError(e.message));
  useEffect(() => { load(); const timer = window.setInterval(load, 300000); return () => window.clearInterval(timer); }, [file]);
  return <section className="info"><p className="eyebrow">DỮ LIỆU TỰ ĐỘNG CẬP NHẬT · MỖI 5 PHÚT</p><h2>{game}</h2>{error && <p className="notice">{error} · đang giữ dữ liệu lần trước nếu có.</p>}{!error && !draws.length && <p>Đang tải dữ liệu…</p>}{draws.length > 0 && <><p>{draws.length.toLocaleString("vi-VN")} kỳ · mới nhất #{String(draws[draws.length - 1].draw_id).padStart(5, "0")} · kiểm tra lúc {new Date().toLocaleTimeString("vi-VN")}</p><div className="table-wrap"><table><thead><tr><th>Kỳ</th><th>Ngày</th><th>Bộ số</th><th>ĐB</th></tr></thead><tbody>{draws.slice(-25).reverse().map((d) => <tr key={d.draw_id}><td>#{String(d.draw_id).padStart(5, "0")}</td><td>{d.draw_date}</td><td>{d.numbers.map((n) => String(n).padStart(2, "0")).join(" · ")}</td><td>{d.special ? String(d.special).padStart(2, "0") : "—"}</td></tr>)}</tbody></table></div></>}</section>;
}

function Generator() {
  const [game, setGame] = useState("Mega 6/45"); const [count, setCount] = useState(3); const [seed, setSeed] = useState("20261008"); const [strategy, setStrategy] = useState("balanced"); const [sets, setSets] = useState<number[][]>([]); const [scoreInfo, setScoreInfo] = useState(""); const [draws, setDraws] = useState<Draw[]>([]);
  useEffect(() => { fetch(`${import.meta.env.BASE_URL}data/${game === "Mega 6/45" ? "mega" : "power"}.json`).then(r => r.json()).then(setDraws).catch(() => setDraws([])); }, [game]);
  const make = () => { let state = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7); const next = () => { state = (1664525 * state + 1013904223) >>> 0; return state / 4294967296; }; const max = game === "Mega 6/45" ? 45 : 55; const freq = Array(max + 1).fill(0); draws.forEach(d => d.numbers.forEach(n => { if (n <= max) freq[n]++; })); const maxFreq = Math.max(1, ...freq); const lastSeen = Array(max + 1).fill(draws.length); draws.forEach((d, i) => d.numbers.forEach(n => { if (lastSeen[n] === draws.length) lastSeen[n] = draws.length - i; })); const score = (row: number[]) => { const evens = row.filter(n => n % 2 === 0).length; const sum = row.reduce((a,n) => a+n,0); const balance = evens >= 2 && evens <= 4 ? 1 : 0; const sumScore = sum >= max * .35 && sum <= max * .75 ? 1 : 0; const frequency = row.reduce((a,n) => a + freq[n] / maxFreq, 0) / 6; const gap = row.reduce((a,n) => a + Math.min(lastSeen[n], 40) / 40, 0) / 6; if (strategy === "frequency") return frequency + balance * .15; if (strategy === "gap") return gap + balance * .15; if (strategy === "balanced") return balance + sumScore * .2 + frequency * .1; return next(); }; const candidates: {row:number[];score:number}[] = []; for (let i = 0; i < 1200; i++) { const pool = Array.from({ length: max }, (_, j) => j + 1); const row: number[] = []; while (row.length < 6) { const n = Math.floor(next() * pool.length); row.push(pool.splice(n, 1)[0]); } row.sort((a,b)=>a-b); candidates.push({row, score:score(row)}); } candidates.sort((a,b)=>b.score-a.score); const chosen: number[][] = []; for (const c of candidates) { if (!chosen.some(r => r.filter(n => c.row.includes(n)).length >= 5)) chosen.push(c.row); if (chosen.length >= count) break; } setSets(chosen); setScoreInfo(draws.length ? `Đã chấm ${candidates.length.toLocaleString("vi-VN")} ứng viên từ ${draws.length.toLocaleString("vi-VN")} kỳ lịch sử; tiêu chí mô tả không làm tăng cơ hội trúng.` : "Chưa có dữ liệu lịch sử, đang dùng random baseline."); };
  useEffect(() => { make(); }, [game, count, seed, strategy]);
  const odds = jackpotOdds(game as "Mega 6/45" | "Power 6/55"); const max=game==="Mega 6/45"?45:55; const distribution=matchDistribution(max,6); const powerTwo=game==="Power 6/55"?{favorable:6n,total:choose(55,6)*49n}:null;
  return <section className="info"><p className="eyebrow">XÁC SUẤT TỔ HỢP · CÔNG KHAI CÔNG THỨC</p><h2>Đề xuất bộ số tham khảo</h2><p>Mỗi bộ 6 số hợp lệ có cơ hội Jackpot như nhau: <strong>1 / {odds.total.toLocaleString("vi-VN")}</strong>. Số nóng/lạnh, tổng dãy hay tiêu chí cân bằng không dự đoán được kỳ kế tiếp.</p><div className="generator-controls"><label>Game <select value={game} onChange={(e) => setGame(e.target.value)}><option>Mega 6/45</option><option>Power 6/55</option></select></label><label>Số bộ <input type="number" min="1" max="10" value={count} onChange={(e) => setCount(Math.max(1, Math.min(10, Number(e.target.value))))} /></label><label>Seed <input value={seed} onChange={(e) => setSeed(e.target.value)} /></label><label>Chiến lược <select value={strategy} onChange={(e) => setStrategy(e.target.value)}><option value="balanced">Cân bằng (mô tả)</option><option value="frequency">Tần suất lịch sử (mô tả)</option><option value="gap">Khoảng cách (mô tả)</option><option value="random">Random baseline</option></select></label></div><button onClick={make}>Đề xuất bộ số</button>{scoreInfo && <p className="success">{scoreInfo}</p>}{sets.map((row, i) => <output className="number-output" key={i}>#{i + 1} · {row.map((n) => String(n).padStart(2, "0")).join(" · ")} <button className="copy-button" onClick={() => navigator.clipboard?.writeText(row.join(" - "))}>Sao chép</button></output>)}<h3>Xác suất khớp đúng k số chính (một vé)</h3><div className="probability-grid">{distribution.map(row=><div key={row.matched}><span>Khớp {row.matched}/6</span><strong>{probabilityFraction(row.favorable,row.total)}</strong><small>{(Number(row.favorable*1000000n/row.total)/10000).toFixed(4)}%</small></div>)}</div>{powerTwo&&<p className="method-note">Power Jackpot 2 (khớp đúng 5 số chính + số đặc biệt): {probabilityFraction(powerTwo.favorable,powerTwo.total)} ≈ 1 / {Number(powerTwo.total/powerTwo.favorable).toLocaleString("vi-VN")} cho một vé, theo giả định số đặc biệt được rút từ 49 số còn lại.</p>}<p className="method-note">Phân phối siêu bội chính xác: C(6,k) × C(N−6,6−k) / C(N,6). Không phải dự báo kết quả.</p></section>;
}

function Checker() { const [value, setValue] = useState(""); const [game, setGame] = useState("Mega 6/45"); const max = game === "Mega 6/45" ? 45 : 55; const nums = value.split(/[,\s-]+/).map(Number).filter(Boolean); const valid = nums.length === 6 && new Set(nums).size === 6 && nums.every(n => n >= 1 && n <= max); return <section className="info"><p className="eyebrow">KIỂM TRA ĐỊNH DẠNG</p><h2>Kiểm tra bộ số</h2><p>Nhập sáu số để kiểm tra tính hợp lệ trước khi lưu hoặc tham khảo.</p><div className="generator-controls"><label>Game <select value={game} onChange={e => setGame(e.target.value)}><option>Mega 6/45</option><option>Power 6/55</option></select></label><label>Bộ số <input className="wide-input" value={value} onChange={e => setValue(e.target.value)} placeholder="Ví dụ: 03 12 18 27 33 45" /></label></div>{value && <p className={valid ? "success" : "notice"}>{valid ? "Bộ số hợp lệ: đủ 6 số khác nhau và đúng phạm vi." : `Chưa hợp lệ: cần đúng 6 số khác nhau trong khoảng 1–${max}.`}</p>}</section>; }

function Stats() { const [draws,setDraws]=useState<Draw[]>([]); const [updated,setUpdated]=useState(""); const [windowSize,setWindowSize]=useState(50); const load=()=>fetch(`${import.meta.env.BASE_URL}data/mega.json?ts=${Date.now()}`).then(r=>r.json()).then(d=>{setDraws(d);setUpdated(new Date().toLocaleTimeString("vi-VN"));}); useEffect(()=>{load();const t=window.setInterval(load,300000);return()=>window.clearInterval(t);},[]); const recent=draws.slice(-windowSize); const rows=Array.from({length:45},(_,i)=>{const n=i+1;const all=draws.filter(d=>d.numbers.includes(n)).length;const recentCount=recent.filter(d=>d.numbers.includes(n)).length;const lastIndex=[...draws].reverse().findIndex(d=>d.numbers.includes(n));const gap=lastIndex<0?"—":lastIndex;const expected=draws.length*6/45;const rate=recent.length?recentCount/recent.length*100:0;const z=draws.length?((all-expected)/Math.sqrt(Math.max(.01,draws.length*(6/45)*(39/45)))):0;return {n,all,recentCount,rate,gap,expected,z};}).sort((a,b)=>b.recentCount-a.recentCount); return <section className="info"><div className="section-heading"><div><p className="eyebrow">PHÂN TÍCH ĐỊNH LƯỢNG · TỰ LÀM MỚI 5 PHÚT</p><h2>Thống kê & phân tích số</h2><p>{draws.length.toLocaleString("vi-VN")} kỳ · dữ liệu tải lúc {updated||"đang tải…"}.</p></div><div className="toolbar"><label>Cửa sổ <select value={windowSize} onChange={e=>setWindowSize(Number(e.target.value))}><option value="25">25 kỳ</option><option value="50">50 kỳ</option><option value="100">100 kỳ</option><option value={draws.length||1572}>Toàn bộ</option></select></label><button onClick={load}>Làm mới</button></div></div><div className="method-note"><strong>Cách đọc:</strong> Tần suất kỳ vọng = số kỳ × 6/45. Z-score chỉ đo độ lệch mô tả so với baseline; không phải xác suất dự đoán kỳ sau.</div><div className="table-wrap analysis-table"><table><thead><tr><th>Số</th><th>{windowSize} kỳ gần nhất</th><th>Tất cả kỳ</th><th>Tỷ lệ gần đây</th><th>Cách kỳ gần nhất</th><th>Baseline kỳ vọng</th><th>Z-score</th></tr></thead><tbody>{rows.map(x=><tr key={x.n}><td><strong className="number-chip">{String(x.n).padStart(2,"0")}</strong></td><td>{x.recentCount}</td><td>{x.all}</td><td>{x.rate.toFixed(1)}%</td><td>{x.gap}</td><td>{x.expected.toFixed(1)}</td><td className={Math.abs(x.z)>=2?"highlight":""}>{x.z.toFixed(2)}</td></tr>)}</tbody></table></div><p className="muted">Cập nhật tự động không đồng nghĩa với dự báo chính xác. Mọi bộ số hợp lệ vẫn có xác suất toán học như nhau.</p></section>; }

function useMegaDraws() { const [draws,setDraws]=useState<Draw[]>([]); useEffect(()=>{const load=()=>fetch(`${import.meta.env.BASE_URL}data/mega.json?ts=${Date.now()}`).then(r=>r.json()).then(setDraws); load(); const t=window.setInterval(load,300000); return()=>window.clearInterval(t);},[]); return draws; }
function NumberMap() { const draws=useMegaDraws(); const counts=Array.from({length:45},(_,i)=>({n:i+1,c:draws.reduce((a,d)=>a+(d.numbers.includes(i+1)?1:0),0)})); const max=Math.max(1,...counts.map(x=>x.c)); return <section className="info"><p className="eyebrow">NGHIÊN CỨU DỮ LIỆU VIETLOTT</p><h2>Bản đồ các con số</h2><p>{draws.length.toLocaleString("vi-VN")} kỳ quay · màu đậm hơn nghĩa là xuất hiện nhiều hơn trong dữ liệu đã tải.</p><div className="number-map">{counts.map(x=><div className="map-cell" style={{backgroundColor:`rgba(138,215,200,${.12+.75*x.c/max})`}} key={x.n}><strong>{String(x.n).padStart(2,"0")}</strong><small>{x.c} lần</small></div>)}</div></section>; }
function Structure() { const draws=useMegaDraws(); const rows=draws.map(d=>{const odd=d.numbers.filter(n=>n%2).length; const low=d.numbers.filter(n=>n<=22).length; const sum=d.numbers.reduce((a,n)=>a+n,0); const consecutive=d.numbers.slice(1).filter((n,i)=>n-d.numbers[i]===1).length; return {odd,low,sum,consecutive};}); const avg=(key:keyof typeof rows[number])=>rows.length?(rows.reduce((a,r)=>a+Number(r[key]),0)/rows.length).toFixed(2):"—"; return <section className="info"><p className="eyebrow">CẤU TRÚC DÃY SỐ</p><h2>Tìm hiểu cấu trúc dữ liệu</h2><p>Trung bình trên {draws.length.toLocaleString("vi-VN")} kỳ · thống kê mô tả, không phải dự đoán.</p><div className="metric-grid"><div><span>Tổng trung bình</span><strong>{avg("sum")}</strong></div><div><span>Số lẻ trung bình</span><strong>{avg("odd")}</strong></div><div><span>Số thấp trung bình</span><strong>{avg("low")}</strong></div><div><span>Số liên tiếp TB</span><strong>{avg("consecutive")}</strong></div></div><h3>Phân bố chẵn/lẻ</h3><div className="structure-bars">{[0,1,2,3,4,5,6].map(odd=><div key={odd}><span>{odd}-{6-odd}</span><i style={{height:`${Math.max(4,rows.filter(r=>r.odd===odd).length/(Math.max(1,rows.length)*.5)*100)}%`}} /></div>)}</div></section>; }
function History() { const draws=useMegaDraws(); const [query,setQuery]=useState(""); const [number,setNumber]=useState(""); const filtered=draws.filter(d=>(!query||String(d.draw_id).includes(query)||d.draw_date.includes(query))&&(!number||d.numbers.includes(Number(number)))); return <section className="info"><p className="eyebrow">BỘ LỌC LỊCH SỬ · TỰ CẬP NHẬT</p><h2>Tra cứu kỳ quay</h2><p>{draws.length.toLocaleString("vi-VN")} kỳ quay được lưu</p><div className="generator-controls"><label>Ngày hoặc mã kỳ <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ví dụ: 01570 hoặc 2026-10" /></label><label>Có chứa số <input type="number" min="1" max="45" value={number} onChange={e=>setNumber(e.target.value)} placeholder="01–45" /></label></div><div className="history-list">{filtered.slice(-30).reverse().map(d=><div className="history-row" key={d.draw_id}><span><strong>{d.draw_date}</strong><small>Kỳ #{String(d.draw_id).padStart(5,"0")}</small></span><b>{d.numbers.map(n=>String(n).padStart(2,"0")).join(" · ")}</b></div>)}</div></section>; }
function PersonalProfile(){const [name,setName]=useState("");const [date,setDate]=useState("");const [game,setGame]=useState("Mega 6/45");const [year,setYear]=useState(new Date().getFullYear());const [chart,setChart]=useState<ReturnType<typeof calculateNumerology>|null>(null);const [error,setError]=useState("");const submit=()=>{try{if(!name||!date)throw new Error("Nhập họ tên và ngày sinh.");const [y,m,d]=date.split("-").map(Number);const birth=new Date(y,m-1,d,12);setChart(calculateNumerology(name,birth,year));setError("");}catch(e){setChart(null);setError(e instanceof Error?e.message:"Không thể tính hồ sơ.");}};const [y,m,d]=date?date.split("-").map(Number):[0,0,0];const birth=date?new Date(y,m-1,d,12):new Date(Number.NaN);const numbers=chart?personalNumbers(chart,birth,game==="Mega 6/45"?45:55):[];return <section className="info"><p className="eyebrow">THẦN SỐ HỌC · CÔNG THỨC HIỂN THỊ</p><h2>Hồ sơ cá nhân & con số mang ý nghĩa cá nhân</h2><p>Nhập tên và ngày sinh. Bảng chữ cái dùng hệ Pythagoras Latin, quy đổi tên tiếng Việt bằng cách bỏ dấu và Đ → D; các trường phái có thể quy ước khác nhau.</p><div className="generator-controls"><label>Họ tên khai sinh <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nguyễn Văn A" /></label><label>Ngày sinh dương lịch <input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label><label>Năm cá nhân <input type="number" min="1" max="9999" value={year} onChange={e=>setYear(Number(e.target.value))} /></label><label>Game <select value={game} onChange={e=>setGame(e.target.value)}><option>Mega 6/45</option><option>Power 6/55</option></select></label></div><button onClick={submit}>Tính hồ sơ</button>{error&&<p className="notice">{error}</p>}{chart&&<><div className="numerology-grid">{[["Đường đời",chart.lifePath],["Ngày sinh",chart.birthday],["Biểu đạt",chart.expression],["Linh hồn",chart.soulUrge],["Nhân cách",chart.personality],["Trưởng thành",chart.maturity],["Năm cá nhân",chart.personalYear]].map(([label,n])=><div key={String(label)}><span>{label}</span><strong>{n}</strong><small>{chart.steps[String(label)==="Đường đời"?"lifePath":String(label)==="Năm cá nhân"?"personalYear":"birthday"]}</small></div>)}</div><h3>Bộ số cá nhân hóa cho {game}</h3><div className="personal-number-list">{numbers.map(item=><div key={item.value}><strong>{String(item.value).padStart(2,"0")}</strong><span>{item.sources.join(" · ")}</span></div>)}</div><p className="method-note">Các số được ánh xạ vào phạm vi trò chơi, số thiếu được bổ sung ổn định theo seed hồ sơ. Đây là quy tắc cá nhân hóa để giải trí, không phải hệ thống tử vi/thần số học có giá trị khoa học đã được xác nhận, và không làm tăng xác suất trúng.</p></>}</section>;}
function ExpandedNumerologyProfile() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());
  const [game, setGame] = useState("Mega 6/45");
  const [chart, setChart] = useState<ReturnType<typeof calculateNumerology> | null>(null);
  const [error, setError] = useState("");
  const submit = () => {
    try {
      if (!name.trim() || !date) throw new Error("Nhập họ tên và ngày sinh dương lịch.");
      const [y, m, d] = date.split("-").map(Number);
      const birth = new Date(y, m - 1, d, 12);
      if (birth.getFullYear() !== y || birth.getMonth() !== m - 1 || birth.getDate() !== d) throw new Error("Ngày sinh không hợp lệ.");
      setChart(calculateNumerology(name, birth, targetYear));
      setError("");
    } catch (e) {
      setChart(null);
      setError(e instanceof Error ? e.message : "Không thể tính hồ sơ.");
    }
  };
  const [y, m, d] = date ? date.split("-").map(Number) : [0, 0, 0];
  const birth = date ? new Date(y, m - 1, d, 12) : new Date(Number.NaN);
  const numbers = chart ? personalNumbers(chart, birth, game === "Mega 6/45" ? 45 : 55) : [];
  const metrics = chart ? [
    ["Đường đời", chart.lifePath, chart.steps.lifePath], ["Ngày sinh", chart.birthday, chart.steps.birthday],
    ["Sứ mệnh / Biểu đạt", chart.expression, chart.steps.expression], ["Linh hồn", chart.soulUrge, chart.steps.soulUrge],
    ["Nhân cách", chart.personality, chart.steps.personality], ["Trưởng thành", chart.maturity, chart.steps.maturity],
    ["Thái độ", chart.attitude, chart.steps.attitude], ["Năm cá nhân", chart.personalYear, chart.steps.personalYear],
    ["Cân bằng", chart.balance, chart.steps.balance],
  ] as const : [];
  return <section className="info numerology-report">
    <p className="eyebrow">THẦN SỐ HỌC · CÔNG THỨC MINH BẠCH · TÍNH TRÊN TRÌNH DUYỆT</p>
    <h2>Báo cáo thần số học cá nhân</h2>
    <p>Nhập tên khai sinh và ngày sinh. Bảng chữ cái dùng quy ước Pythagoras Latin (A=1… I=9 lặp), bỏ dấu tiếng Việt và chuyển Đ→D. Các trường phái có thể quy ước khác nhau; kết quả chỉ phục vụ tự khám phá, không phải đánh giá khoa học về tính cách hay tương lai.</p>
    <div className="generator-controls">
      <label>Họ tên khai sinh <input value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn A" /></label>
      <label>Ngày sinh dương lịch <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
      <label>Năm cần xem <input type="number" min="1" max="9999" value={targetYear} onChange={e => setTargetYear(Number(e.target.value))} /></label>
      <label>Game gợi ý <select value={game} onChange={e => setGame(e.target.value)}><option>Mega 6/45</option><option>Power 6/55</option></select></label>
    </div>
    <button onClick={submit}>Tính báo cáo</button>
    {error && <p className="notice">{error}</p>}
    {chart && <>
      <h3>Nhóm chỉ số chính</h3>
      <div className="numerology-grid">{metrics.map(([label, value, formula]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{formula}</small></article>)}</div>
      <div className="numerology-panels">
        <article><h3>Bài học theo tên</h3><p>{chart.karmicLessons.length ? `Các số chưa xuất hiện trong bảng chữ cái của tên: ${chart.karmicLessons.join(", ")}.` : "Tên có đại diện cho đủ các số 1–9 theo quy ước chữ cái đang dùng."}</p><small>Phép tính: lập tập số từ từng chữ cái tên đã chuẩn hóa; tìm số 1–9 còn thiếu. Đây là cách đọc Pitago phổ biến, không phải chẩn đoán thiếu sót cá nhân.</small></article>
        <article><h3>Số nợ bài học (quy ước)</h3><p>{chart.karmicDebt.length ? chart.karmicDebt.join(" · ") : "Không phát hiện số 13, 14, 16 hoặc 19 ở các tổng trung gian đã kiểm tra."}</p><small>Chỉ rà các tổng trước khi rút gọn ở Đường đời, tên và Thái độ/Năm cá nhân. Phạm vi kiểm tra giới hạn; trường phái khác có thể tính khác.</small></article>
        <article><h3>Cầu nối chỉ số</h3><p>Đường đời ↔ Ngày sinh: <strong>{chart.lifePathBridge}</strong> · Biểu đạt ↔ Đường đời: <strong>{chart.expressionBridge}</strong></p><small>Công thức lấy hiệu tuyệt đối giữa hai chỉ số đã rút về một chữ số.</small></article>
      </div>
      <h3>Mũi tên ngày sinh (lưới 1–9)</h3>
      <p className="method-note">Mỗi trục gồm ba số. Trục hiện diện khi cả ba số xuất hiện trong các chữ số ngày sinh (bỏ số 0); “thiếu” chỉ mô tả lưới, không hàm ý khuyết điểm con người.</p>
      <div className="arrow-grid">{chart.arrows.map(arrow => <article className={arrow.present ? "arrow-present" : "arrow-empty"} key={arrow.name}><strong>{arrow.name}</strong><span>{arrow.digits.join(" · ")}</span><small>{arrow.meaning}</small></article>)}</div>
      <h3>Đỉnh cao & thử thách theo chu kỳ</h3>
      <p className="method-note">Dùng công thức Pitago phổ biến: các đỉnh lần lượt là tháng+ngày, ngày+năm, tổng hai đỉnh đầu, tháng+năm; thử thách dùng hiệu tuyệt đối. Mốc tuổi đầu lấy 36 trừ Đường đời đã rút về một chữ số.</p>
      <div className="pinnacle-grid">{chart.pinnacles.map(item => <article key={item.index}><span>Đỉnh {item.index}</span><strong>{item.number}</strong><small>Thử thách {item.challenge}</small><small>Tuổi {item.startAge}–{item.endAge === 99 ? "về sau" : item.endAge}</small><small>{item.formula}</small></article>)}</div>
      <h3>Chu kỳ 9 năm · {targetYear}</h3>
      <div className="year-cycle">{chart.yearCycle.map(item => <article className={item.year === targetYear ? "current-year" : ""} key={item.year}><span>{item.year}</span><strong>{item.number}</strong></article>)}</div>
      <p className="method-note">Năm cá nhân được tính bằng tháng sinh + ngày sinh + năm dương lịch, rút về 1–9; chu kỳ hiển thị bốn năm trước và sau năm đang chọn. Chủ đề chu kỳ là diễn giải biểu tượng, không phải dự báo sự kiện.</p>
      <h3>Bộ số cá nhân hóa tham khảo cho {game}</h3>
      <div className="personal-number-list">{numbers.map(item => <article key={item.value}><strong>{String(item.value).padStart(2, "0")}</strong><span>{item.sources.join(" · ")}</span></article>)}</div>
      <p className="method-note">Các chỉ số được ánh xạ vào khoảng số của game; số còn thiếu được bổ sung bằng seed hồ sơ để tạo dãy duy nhất và tái lập được. Đây chỉ là lựa chọn cá nhân hóa/giải trí, không làm tăng xác suất trúng Vietlott.</p>
    </>}
  </section>;
}

function DailyGuidancePage() {
  const todayInVietnam = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const [date, setDate] = useState(todayInVietnam);
  const [showOtherDate, setShowOtherDate] = useState(false);
  const [birth, setBirth] = useState("");
  const [game, setGame] = useState("Mega 6/45");
  const [guidance, setGuidance] = useState<ReturnType<typeof calculateDailyGuidance> | null>(null);
  const [latestDraw, setLatestDraw] = useState<Draw | null>(null);
  const [error, setError] = useState("");
  const max = game === "Mega 6/45" ? 45 : 55;
  const birthDate = birth ? new Date(`${birth}T12:00:00`) : null;
  const chart = guidance ? {
    lifePath: guidance.dayNumber,
    birthday: guidance.luckyNumbers[0],
    expression: guidance.personalDay ?? guidance.dayNumber,
    soulUrge: guidance.luckyNumbers[1] ?? guidance.dayNumber,
    personality: guidance.luckyNumbers[2] ?? guidance.dayNumber,
    maturity: guidance.dayNumber,
    personalYear: guidance.personalDay ?? guidance.dayNumber,
    steps: {},
  } : null;
  const recommendations = guidance && chart
    ? personalNumbers(chart, birthDate ?? new Date(`${date}T12:00:00`), max, 6)
    : [];
  useEffect(() => {
    let alive = true;
    const load = async () => {
      const files = game === "Mega 6/45" ? ["mega"] : ["power"];
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/${files[0]}.json?ts=${Date.now()}`);
        if (!response.ok) return;
        const rows = await response.json() as Draw[];
        if (alive) setLatestDraw(rows.at(-1) ?? null);
      } catch { if (alive) setLatestDraw(null); }
    };
    void load();
    const timer = window.setInterval(load, 300000);
    return () => { alive = false; window.clearInterval(timer); };
  }, [game]);
  const generate = () => {
    try {
      if (birthDate && Number.isNaN(birthDate.getTime())) throw new Error("Ngày sinh không hợp lệ.");
      const targetDate = showOtherDate ? date : todayInVietnam();
      setDate(targetDate);
      setGuidance(calculateDailyGuidance(targetDate, birthDate ?? undefined));
      setError("");
    } catch (e) {
      setGuidance(null);
      setError(e instanceof Error ? e.message : "Không thể tính thông tin ngày.");
    }
  };
  return <section className="info">
    <p className="eyebrow">THẦN SỐ HỌC · CHIÊM TINH · THAM KHẢO HẰNG NGÀY</p>
    <h2>Năng lượng hôm nay</h2>
    <p>Ngày xem tự lấy theo giờ Việt Nam, không cần chọn. Web tải kết quả quay mới nhất của game đang chọn và làm mới định kỳ; phần số biểu tượng được tính riêng theo ngày, không suy ra từ kết quả xổ số. Chiêm tinh dùng kinh độ địa tâm lúc 12:00 UTC.</p>
    <div className="generator-controls">
      <span className="today-badge">HÔM NAY · {date}</span>
      <span className="today-badge">{latestDraw ? `KỲ MỚI NHẤT ${game} · #${String(latestDraw.draw_id).padStart(5, "0")} · ${latestDraw.draw_date}` : `ĐANG TẢI KẾT QUẢ ${game}…`}</span>
      {showOtherDate && <label>Ngày tra cứu <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>}
      <label>Ngày sinh (không bắt buộc) <input type="date" value={birth} onChange={e => setBirth(e.target.value)} /></label>
      <label>Game <select value={game} onChange={e => setGame(e.target.value)}><option>Mega 6/45</option><option>Power 6/55</option></select></label>
    </div>
    <div className="daily-actions"><button onClick={generate}>Cập nhật hôm nay & gợi ý số</button><button className="secondary-button" onClick={() => setShowOtherDate(value => !value)}>{showOtherDate ? "Ẩn tra cứu ngày khác" : "Tra cứu ngày khác"}</button></div>
    {error && <p className="notice">{error}</p>}
    {guidance && <>
    <p className="method-note">Ngày áp dụng: {dateFromKey(guidance.dateKey).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "full" })} (Asia/Ho_Chi_Minh).</p>
      <div className="metric-grid">
        <div><span>Ngày số chung</span><strong>{guidance.dayNumber}</strong></div>
        <div><span>Ngày cá nhân</span><strong>{guidance.personalDay ?? "Nhập ngày sinh"}</strong></div>
        <div><span>Hành tinh thứ</span><strong>{guidance.planetaryDay}</strong></div>
        <div><span>Mặt Trăng</span><strong>{guidance.placements.find(p => p.name === "Mặt Trăng")?.sign}</strong></div>
      </div>
      <ul className="daily-themes">{guidance.themes.map((item, i) => <li key={i}>{item}</li>)}</ul>
      <h3>Chữ số may mắn theo quy ước biểu tượng</h3>
      <p className="lucky-digits">{guidance.luckyNumbers.map(n => <b key={n}>{n}</b>)}</p>
      <h3>Bộ {game} gợi ý</h3>
      <div className="personal-number-list">{recommendations.map(item => <div key={item.value}><strong>{String(item.value).padStart(2, "0")}</strong><span>{item.sources.join(" · ")}</span></div>)}</div>
      <p className="method-note">{guidance.note} Gợi ý này được tạo ổn định theo ngày/hồ sơ; không phải dự báo kết quả quay và không làm tăng xác suất trúng. Ngày khác có thể cho chủ đề và chữ số khác.</p>
      <button onClick={() => navigator.clipboard?.writeText(recommendations.map(n => String(n.value).padStart(2, "0")).join(" - "))}>Sao chép bộ số</button>
    </>}
  </section>;
}

type TarotPull = { card: TarotCard; reversed: boolean };
function TarotCardBack({ className = "" }: { className?: string }) { return <div className={`tarot-card-face tarot-card-back ${className}`}><span className="tarot-back-mark">✧</span><span className="tarot-back-name">VIETLOTT LAB<br/><small>ARCANA · 78</small></span></div>; }
function TarotCardFront({ pull }: { pull: TarotPull }) { return <div className={`tarot-card-face tarot-card-front${pull.reversed ? " is-reversed" : ""}`}><small>{pull.card.arcana}</small><span className="tarot-card-symbol">{pull.card.symbol}</span><strong>{pull.card.name}</strong><small>{pull.reversed ? "NGƯỢC" : "XUÔI"}</small></div>; }
function TarotPage() {
  const [question,setQuestion]=useState("");const [spread,setSpread]=useState<"single"|"three">("three");const [phase,setPhase]=useState<"welcome"|"shuffling"|"pick"|"reading">("welcome");
  const [cards,setCards]=useState<TarotPull[]>([]);const [selected,setSelected]=useState<number[]>([]);const [error,setError]=useState("");const shuffleTimer=useRef<number|undefined>(undefined);const required=spread==="three"?3:1;
  useEffect(()=>()=>{if(shuffleTimer.current!==undefined)window.clearTimeout(shuffleTimer.current);},[]);
  const start=()=>{if(question.trim().length>200){setError("Câu hỏi tối đa 200 ký tự.");return;}setError("");setSelected([]);setPhase("shuffling");const pulled=shuffleTarot().slice(0,12).map(card=>({card,reversed:Math.random()<.5}));setCards(pulled);shuffleTimer.current=window.setTimeout(()=>setPhase("pick"),1150);};
  const toggle=(index:number)=>{setSelected(current=>current.includes(index)?current.filter(i=>i!==index):current.length<required?[...current,index]:current);};
  const positions=spread==="three"?["Quá khứ · điều dẫn đến đây","Hiện tại · điều đang nổi bật","Hướng đi · điều cần cân nhắc"]:["Thông điệp để suy ngẫm"];
  const reset=()=>{if(shuffleTimer.current!==undefined)window.clearTimeout(shuffleTimer.current);setPhase("welcome");setCards([]);setSelected([]);setError("");};
  return <section className="info tarot-page"><div className="tarot-sky"><div className="tarot-orbit orbit-one"/><div className="tarot-orbit orbit-two"/><span className="tarot-kicker">TAROT · TRẢI BÀI TƯƠNG TÁC</span><h2>Một khoảng lặng.<br/><em>Một góc nhìn mới.</em></h2><p>Đặt câu hỏi, xáo bộ bài 78 lá và tự chọn lá. Dùng trải bài như gợi ý để suy ngẫm — không phải lời tiên tri hay lời khuyên chuyên môn.</p></div>
    {phase==="welcome"&&<div className="tarot-setup"><label className="tarot-question">Câu hỏi của bạn <span>{question.length}/200</span><textarea maxLength={200} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ví dụ: Mình có thể tập trung vào điều gì trong giai đoạn này?" rows={3}/></label><fieldset className="tarot-spreads"><legend>Chọn kiểu trải bài</legend><label className={spread==="single"?"is-active":""}><input type="radio" checked={spread==="single"} onChange={()=>setSpread("single")}/><span>✦</span><strong>Một lá</strong><small>Một chủ đề để chiêm nghiệm</small></label><label className={spread==="three"?"is-active":""}><input type="radio" checked={spread==="three"} onChange={()=>setSpread("three")}/><span>☽ · ☼ · ☾</span><strong>Dòng chảy thời gian</strong><small>Quá khứ · hiện tại · hướng đi</small></label></fieldset><button className="tarot-primary" onClick={start}>✧　Xáo bài & bắt đầu</button><p className="tarot-privacy">Không cần đăng nhập. Câu hỏi và lượt trải bài chỉ nằm trong phiên trình duyệt này.</p></div>}
    {phase==="shuffling"&&<div className="tarot-shuffling" aria-live="polite"><div className="shuffle-stack"><TarotCardBack/><TarotCardBack/><TarotCardBack/></div><h3>Đang xáo bài…</h3><p>Giữ câu hỏi trong tâm trí, rồi chọn {required} lá.</p></div>}
    {phase==="pick"&&<div className="tarot-pick"><div className="tarot-section-title"><div><p className="eyebrow">BỘ BÀI WAITE · 78 LÁ</p><h3>Chọn {required} lá bài</h3><p>Đã chọn {selected.length}/{required}{question.trim()?` · Câu hỏi: “${question.trim()}”`:" · Bạn có thể để câu hỏi trống và rút một thông điệp chung."}</p></div><button className="secondary-button" onClick={start}>Xáo lại</button></div><div className="tarot-deck-grid">{cards.map((pull,index)=><button key={pull.card.id} className={`tarot-card-button${selected.includes(index)?" is-selected":""}`} aria-label={`Chọn lá bài úp số ${index+1}`} aria-pressed={selected.includes(index)} onClick={()=>toggle(index)}><span className="tarot-card-inner"><TarotCardBack/><span className="tarot-card-face tarot-card-front tarot-card-front-hidden"><span className="tarot-card-symbol">✧</span></span></span><small className="tarot-card-index">{String(index+1).padStart(2,"0")}</small></button>)}</div><button className="tarot-primary" disabled={selected.length!==required} onClick={()=>setPhase("reading")}>Lật {required} lá đã chọn</button></div>}
    {phase==="reading"&&<div className="tarot-reading"><div className="tarot-section-title"><div><p className="eyebrow">TRẢI BÀI CỦA BẠN</p><h3>Một cách đọc để tự suy ngẫm</h3>{question.trim()&&<p className="tarot-user-question">“{question.trim()}”</p>}</div><button className="secondary-button" onClick={reset}>Trải bài mới</button></div><div className={`tarot-results spread-${spread}`}>{selected.map((index,slot)=>{const pull=cards[index];return <article className="tarot-result" key={pull.card.id}><p className="tarot-position">{positions[slot]}</p><div className="tarot-reveal-card"><div className="tarot-card-inner is-flipped"><TarotCardBack/><TarotCardFront pull={pull}/></div></div><h4>{pull.card.name} <small>{pull.reversed?"· Lá ngược":"· Lá xuôi"}</small></h4><p>{pull.reversed?pull.card.reversed:pull.card.upright}</p><blockquote>{pull.card.reflection}</blockquote></article>;})}</div><aside className="tarot-disclaimer"><strong>Gợi ý đọc bài:</strong> hãy giữ lại điều hữu ích, bỏ qua điều không phù hợp. Tarot là thực hành biểu tượng/giải trí; không dự đoán chắc chắn tương lai và không thay thế tư vấn y tế, pháp lý hay tài chính.</aside><button className="tarot-primary" onClick={reset}>✧　Xào bài cho câu hỏi khác</button></div>}
  </section>;
}

const birthplaces = [{name:"Hà Nội",latitude:21.0285,longitude:105.8542,utcOffset:420},{name:"TP. Hồ Chí Minh",latitude:10.8231,longitude:106.6297,utcOffset:420},{name:"Đà Nẵng",latitude:16.0544,longitude:108.2022,utcOffset:420},{name:"Huế",latitude:16.4637,longitude:107.5909,utcOffset:420},{name:"Cần Thơ",latitude:10.0452,longitude:105.7469,utcOffset:420}];
const zodiacGlyphs = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
const planetGlyphs: Record<string,string> = {"Mặt Trời":"☉","Mặt Trăng":"☽","Sao Thủy":"☿","Sao Kim":"♀","Sao Hỏa":"♂","Sao Mộc":"♃","Sao Thổ":"♄","Sao Thiên Vương":"♅","Sao Hải Vương":"♆","Sao Diêm Vương":"♇"};
function chartPoint(longitude:number,radius:number){const angle=(longitude-90)*Math.PI/180;return {x:180+Math.cos(angle)*radius,y:180+Math.sin(angle)*radius};}
function NatalChartProfile(){
  const [birthTime,setBirthTime]=useState("");const [offset,setOffset]=useState(420);const [place,setPlace]=useState("");const [latitude,setLatitude]=useState("");const [longitude,setLongitude]=useState("");
  const [result,setResult]=useState<{placements:Placement[];angles:ChartAngles;aspects:Aspect[];lunar:ReturnType<typeof vietnameseLunar>}|null>(null);const [error,setError]=useState("");
  const submit=()=>{try{if(!birthTime)throw new Error("Hãy nhập cả ngày và giờ sinh. Nếu chưa biết giờ sinh, cung Mọc và các nhà sẽ không thể tính đáng tin cậy.");if(latitude.trim()===""||longitude.trim()==="")throw new Error("Chọn nơi sinh hoặc nhập cả vĩ độ và kinh độ.");const lat=Number(latitude),lon=Number(longitude);const date=localBirthToUtc(birthTime,offset);const placements=calculatePlacements(date);const angles=calculateChartAngles(date,lat,lon);const localDate=new Date(date.getTime()+offset*60000);setResult({placements,angles,aspects:calculateAspects(placements),lunar:vietnameseLunar(localDate)});setError("");}catch(e){setResult(null);setError(e instanceof Error?e.message:"Không thể lập bản đồ sao.");}};
  const choosePlace=(value:string)=>{setPlace(value);const selected=birthplaces.find(item=>item.name===value);if(selected){setLatitude(String(selected.latitude));setLongitude(String(selected.longitude));setOffset(selected.utcOffset);}else if(value==="custom"){setLatitude("");setLongitude("");}};
  const ascSign=result?zodiacGlyphs[Math.floor(result.angles.ascendant/30)]+" "+["Bạch Dương","Kim Ngưu","Song Tử","Cự Giải","Sư Tử","Xử Nữ","Thiên Bình","Bọ Cạp","Nhân Mã","Ma Kết","Bảo Bình","Song Ngư"][Math.floor(result.angles.ascendant/30)]:"";
  return <section className="info natal-chart"><p className="eyebrow">CHIÊM TINH TÂY · LÁ SỐ CÁ NHÂN</p><h2>Lập bản đồ sao khai sinh</h2><p>Nhập ngày giờ địa phương và tọa độ nơi sinh để tính vị trí thiên thể, cung Mọc, Thiên Đỉnh, 12 nhà và các góc chiếu chính.</p>
    <div className="natal-form"><label>Ngày giờ sinh<input type="datetime-local" value={birthTime} onChange={e=>setBirthTime(e.target.value)}/></label><label>Múi giờ UTC (phút)<input type="number" min="-840" max="840" value={offset} onChange={e=>setOffset(Number(e.target.value))}/><small>Việt Nam hiện dùng UTC+7 = 420 phút. Với ngày lịch sử, hãy nhập đúng múi giờ tại thời điểm sinh.</small></label><label>Nơi sinh<select value={place} onChange={e=>choosePlace(e.target.value)}><option value="">Chọn thành phố hoặc nhập tọa độ</option>{birthplaces.map(item=><option key={item.name}>{item.name}</option>)}<option value="custom">Tự nhập tọa độ</option></select></label><label>Vĩ độ (Bắc + / Nam −)<input type="number" step="0.0001" value={latitude} onChange={e=>{setLatitude(e.target.value);setPlace("custom")}} placeholder="Ví dụ 21.0285"/></label><label>Kinh độ (Đông + / Tây −)<input type="number" step="0.0001" value={longitude} onChange={e=>{setLongitude(e.target.value);setPlace("custom")}} placeholder="Ví dụ 105.8542"/></label><button onClick={submit}>Lập lá số</button></div>
    {error&&<p className="notice">{error}</p>}{result&&<>
      <p className="method-note">Tọa độ {Number(latitude).toFixed(4)}°, {Number(longitude).toFixed(4)}° · UTC{offset>=0?"+":""}{(offset/60).toFixed(offset%60?2:0)} · Hoàng đạo nhiệt đới, địa tâm · hệ nhà Whole Sign. Cung Mọc nhạy với giờ sinh; sai vài phút có thể đổi độ số.</p>
      <div className="natal-highlights"><article><span>Mặt Trời</span><strong>{result.placements[0].sign} {result.placements[0].degree}°</strong></article><article><span>Mặt Trăng</span><strong>{result.placements[1].sign} {result.placements[1].degree}°</strong></article><article><span>Cung Mọc</span><strong>{ascSign} {(result.angles.ascendant%30).toFixed(2)}°</strong></article><article><span>Thiên Đỉnh</span><strong>{zodiacGlyphs[Math.floor(result.angles.midheaven/30)]} {["Bạch Dương","Kim Ngưu","Song Tử","Cự Giải","Sư Tử","Xử Nữ","Thiên Bình","Bọ Cạp","Nhân Mã","Ma Kết","Bảo Bình","Song Ngư"][Math.floor(result.angles.midheaven/30)]} {(result.angles.midheaven%30).toFixed(2)}°</strong></article></div>
      <div className="natal-visual-grid"><div className="natal-wheel-card"><h3>Bánh xe lá số</h3><svg className="natal-wheel" viewBox="0 0 360 360" role="img" aria-label="Bản đồ sao vòng tròn với 12 cung và vị trí các hành tinh"><circle cx="180" cy="180" r="157"/><circle cx="180" cy="180" r="121"/><circle cx="180" cy="180" r="74"/>{Array.from({length:12},(_,i)=>{const p=chartPoint(i*30,157),q=chartPoint(i*30,121),label=chartPoint(i*30+15,139);return <g key={i}><line x1={p.x} y1={p.y} x2={q.x} y2={q.y}/><text className="zodiac-mark" x={label.x} y={label.y}>{zodiacGlyphs[i]}</text></g>})}{result.placements.map((p,i)=>{const point=chartPoint(p.longitude,82+(i%2)*17);return <g key={p.name}><circle className="planet-dot" cx={point.x} cy={point.y} r="2.5"/><text className="planet-mark" x={point.x} y={point.y-5}>{planetGlyphs[p.name]}</text></g>})}{result.angles.houses.map(h=>{const point=chartPoint(h.longitude+15,105);return <text key={h.house} className="house-mark" x={point.x} y={point.y}>{h.house}</text>})}<text className="axis-mark" x={chartPoint(result.angles.ascendant,158).x} y={chartPoint(result.angles.ascendant,158).y}>ASC</text><text className="axis-mark" x={chartPoint(result.angles.midheaven,158).x} y={chartPoint(result.angles.midheaven,158).y}>MC</text></svg><p className="method-note">Biểu đồ minh họa: các hành tinh đặt theo kinh độ hoàng đạo; số nhà theo Whole Sign.</p></div><div className="natal-interpretation"><h3>Tổng quan biểu tượng</h3><p><strong>Mặt Trời ở {result.placements[0].sign}:</strong> trong chiêm tinh Tây phương, vị trí này thường được dùng làm chủ đề suy ngẫm về bản sắc và cách chủ động thể hiện bản thân.</p><p><strong>Mặt Trăng ở {result.placements[1].sign}:</strong> thường được diễn giải như biểu tượng cho nhu cầu an toàn cảm xúc và phản ứng theo thói quen.</p><p><strong>Cung Mọc {ascSign}:</strong> là điểm hoàng đạo đang mọc ở chân trời phía Đông tại giờ và nơi sinh đã nhập; trong truyền thống, nó gắn với cách bắt đầu và tiếp cận trải nghiệm mới.</p><p className="method-note">Đây là cách diễn giải chiêm tinh mang tính văn hóa/giải trí, không phải đánh giá khoa học hay kết luận chắc chắn về con người.</p></div></div>
      <h3>12 nhà · hệ Whole Sign</h3><div className="natal-houses">{result.angles.houses.map(h=><article key={h.house}><span>Nhà {h.house}</span><strong>{zodiacGlyphs[Math.floor(h.longitude/30)]} {h.sign}</strong><small>{result.placements.filter(p=>findHouse(p.longitude,result.angles.houses)===h.house).map(p=>planetGlyphs[p.name]+" "+p.name).join(" · ")||"Không có thiên thể trong nhà"}</small></article>)}</div>
      <h3>Vị trí thiên thể</h3><div className="table-wrap"><table><thead><tr><th>Thiên thể</th><th>Cung</th><th>Độ</th><th>Nhà</th><th>Chuyển động biểu kiến</th></tr></thead><tbody>{result.placements.map(p=><tr key={p.name}><td>{planetGlyphs[p.name]} {p.name}</td><td>{p.sign}</td><td>{p.degree.toFixed(2)}°</td><td>{findHouse(p.longitude,result.angles.houses)}</td><td>{p.retrograde?"Nghịch hành":"Thuận hành"}</td></tr>)}</tbody></table></div>
      <h3>Các góc chiếu chính <small>(orb = sai biệt với góc chính xác)</small></h3><div className="natal-aspects">{result.aspects.length?result.aspects.map((a,i)=><article key={i}><strong>{planetGlyphs[a.first]} {a.first} · {a.type} · {planetGlyphs[a.second]} {a.second}</strong><span>{a.angle}° · orb {a.orb}°</span></article>):<p>Không có góc chiếu nào nằm trong ngưỡng orb đang áp dụng.</p>}</div>
      <p className="method-note">Mặt Trời, Mặt Trăng và các hành tinh được tính từ thư viện Astronomy Engine; cung Mọc/Thiên Đỉnh dùng thời gian thiên văn địa phương, tọa độ và độ nghiêng hoàng đạo. Nhà Whole Sign chia mỗi nhà thành trọn một cung, không tương đương hệ Placidus trên mọi trang tra cứu. Ngày âm lịch tại nơi sinh: {result.lunar.day}/{result.lunar.month}/{result.lunar.year} · {result.lunar.dayName} · năm {result.lunar.yearName}{result.lunar.leap?" · tháng nhuận":""}.</p>
    </>}
  </section>;
}
function TuviProfile() {
  const [date, setDate] = useState("");
  const [hour, setHour] = useState(0);
  const [gender, setGender] = useState("Nữ");
  const [chart, setChart] = useState<ReturnType<typeof astro.bySolar> | null>(null);
  const [error, setError] = useState("");
  const submit = () => {
    try {
      if (!date) throw new Error("Chọn ngày sinh dương lịch.");
      const [y, m, d] = date.split("-").map(Number);
      const result = astro.bySolar(`${y}-${m}-${d}`, hour, gender, true, "vi-VN");
      if (result.palaces.length !== 12) throw new Error("Lá số trả về không đủ 12 cung.");
      setChart(result);
      setError("");
    } catch (e) {
      setChart(null);
      setError(e instanceof Error ? e.message : "Không thể lập lá số.");
    }
  };
  const times = ["Tý sớm (00:00–00:59)", "Sửu (01:00–02:59)", "Dần (03:00–04:59)", "Mão (05:00–06:59)", "Thìn (07:00–08:59)", "Tỵ (09:00–10:59)", "Ngọ (11:00–12:59)", "Mùi (13:00–14:59)", "Thân (15:00–16:59)", "Dậu (17:00–18:59)", "Tuất (19:00–20:59)", "Hợi (21:00–22:59)", "Tý muộn (23:00–23:59)"];
  const insights = chart ? analyzeTuvi(chart) : [];
  const overview = chart ? summarizeTuvi(chart, insights) : [];
  const horoscope = chart?.horoscope(new Date(), new Date().getHours() < 1 ? 0 : Math.min(12, Math.floor((new Date().getHours() + 1) / 2))) ?? null;
  const sections = ["Tổng quan", ...insights.map(item => item.title), "Vận hạn tham khảo"];
  return <section className="info tuvi-page">
    <p className="eyebrow">TỬ VI ĐẨU SỐ · LÁ SỐ & DIỄN GIẢI THEO DỮ LIỆU</p>
    <h2>Lập lá số Tử vi</h2>
    <p>Nhập đúng ngày dương lịch, giờ sinh và giới tính theo quy ước an lá số. Giờ sinh sai có thể làm thay đổi cấu trúc cung. Bản luận giải dưới đây mô tả biểu tượng theo thư viện và không khẳng định tương lai.</p>
    <div className="generator-controls">
      <label>Ngày sinh dương lịch <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
      <label>Giờ sinh <select value={hour} onChange={e => setHour(Number(e.target.value))}>{times.map((value, index) => <option key={index} value={index}>{value}</option>)}</select></label>
      <label>Giới tính dùng khi an lá số <select value={gender} onChange={e => setGender(e.target.value)}><option value="Nữ">Nữ</option><option value="Nam">Nam</option></select></label>
    </div>
    <button onClick={submit}>Lập lá số & xem tổng quan</button>
    {error && <p className="notice">{error}</p>}
    {chart && <>
      <div className="tuvi-summary-grid">
        <div><span>Ngày sinh âm lịch</span><strong>{chart.lunarDate}</strong></div>
        <div><span>Can chi</span><strong>{chart.chineseDate}</strong></div>
        <div><span>Giờ sinh</span><strong>{chart.time} · {chart.timeRange}</strong></div>
        <div><span>Mệnh cục</span><strong>{chart.fiveElementsClass}</strong></div>
        <div><span>Mệnh chủ / Thân chủ</span><strong>{chart.soul} / {chart.body}</strong></div>
        <div><span>Cung Mệnh / cung Thân</span><strong>{chart.earthlyBranchOfSoulPalace} / {chart.earthlyBranchOfBodyPalace}</strong></div>
      </div>
      <nav className="tuvi-toc" aria-label="Mục lục lá số">{sections.map((title, i) => <a key={title} href={`#tuvi-section-${i}`}>{String(i + 1).padStart(2, "0")} · {title}</a>)}</nav>
      <div className="tuvi-chart" aria-label="Bố cục 12 cung Tử vi">
        {chart.palaces.map((palace, i) => <article className={`tuvi-palace ${palace.isBodyPalace ? "is-body" : ""} ${palace.name === "Mệnh" ? "is-life" : ""}`} key={`${palace.name}-${i}`}>
          <header><span>{palace.heavenlyStem}·{palace.earthlyBranch}</span><strong>{palace.name}{palace.isBodyPalace ? " · Thân" : ""}</strong><small>Đại hạn {palace.decadal.range[0]}–{palace.decadal.range[1]}</small></header>
          <div className="tuvi-stars">{palace.majorStars.map((star, j) => <b className="major-star" key={`${star.name}-${j}`}>{star.name}{star.brightness ? ` (${star.brightness})` : ""}{star.mutagen ? ` · Hóa ${star.mutagen}` : ""}</b>)}{palace.minorStars.slice(0, 8).map((star, j) => <span key={`${star.name}-${j}`} className={star.mutagen ? "transformed-star" : ""}>{star.name}{star.mutagen ? ` · Hóa ${star.mutagen}` : ""}</span>)}{!palace.majorStars.length && <small>Không có chính tinh · cần xem đối cung</small>}</div>
          <footer>{palace.changsheng12} · {palace.boshi12}</footer>
        </article>)}
        <aside className="tuvi-chart-center"><span>LÁ SỐ TỬ VI</span><h3>{chart.gender} · {chart.solarDate}</h3><p>{chart.lunarDate} · {chart.chineseDate}</p><p>{chart.time} ({chart.timeRange})</p><strong>{chart.fiveElementsClass}</strong><p>Mệnh chủ: {chart.soul}<br />Thân chủ: {chart.body}</p></aside>
      </div>
      <section id="tuvi-section-0" className="tuvi-reading"><p className="eyebrow">TỔNG HỢP CÁC CUNG & DỮ LIỆU AN SAO</p><h3>Tổng quan lá số</h3>{overview.map((item, i) => <article key={i}><h4>{item.title}</h4><p>{item.text}</p></article>)}<p className="method-note">Cách đọc: lấy sao và độ sáng từ iztro 2.6.1, quy ước an sao mặc định; nội dung diễn giải được ghi rõ là khung biểu tượng, không phải chẩn đoán hay lời tiên tri.</p></section>
      {insights.map((item, i) => <section id={`tuvi-section-${i + 1}`} className={`tuvi-reading tone-${item.tone}`} key={item.title}><p className="eyebrow">LUẬN GIẢI THAM KHẢO · DỰA TRÊN SAO TRONG CUNG</p><h3>{item.title}</h3><p>{item.text}</p><small><strong>Căn cứ trên lá số:</strong> {item.evidence}</small></section>)}
      {horoscope && <section id={`tuvi-section-${sections.length - 1}`} className="tuvi-reading"><p className="eyebrow">LƯU NHẬT · THAM KHẢO THEO NGÀY HIỆN TẠI</p><h3>Vận hạn biểu tượng hôm nay</h3><p>Lưu Nhật an tại cung <strong>{horoscope.daily.name}</strong> ({horoscope.daily.heavenlyStem}{horoscope.daily.earthlyBranch}). Theo cách đọc Tử Vi truyền thống, có thể dùng cung này làm chủ đề tự quan sát trong ngày; không suy ra sự kiện chắc chắn.</p><p>Sao lưu ngày trong cung: {horoscope.daily.stars?.flat().map(star => star.name).join(" · ") || "không ghi nhận"}.</p><small>Ngày máy tính hiện tại: {new Date().toLocaleDateString("vi-VN")} · kết quả thay đổi mỗi ngày. Muốn xem lại ngày cụ thể, có thể dùng mục ngày tra cứu ở trang Năng lượng hôm nay.</small></section>}
      <section className="tuvi-reading responsibility"><h3>Giới hạn & trách nhiệm</h3><p>Lá số được lập theo một cấu hình trường phái cụ thể; các trường phái khác có thể an sao/luận khác. Nội dung không thay thế quyết định y tế, tài chính, pháp lý hay quan hệ cá nhân. Không dùng phần này để khẳng định vận mệnh hoặc chọn số với kỳ vọng tăng xác suất xổ số.</p></section>
    </>}
  </section>;
}
function Bao() { const [n, setN] = useState(7);const safeN=Math.max(6,Math.min(18,n));const odds=bundleJackpotOdds(45,6,safeN);const fraction=probabilityFraction(odds.favorable,odds.total); return <section className="info"><h2>Máy tính Bao Mega 6/45</h2><label>Số số chọn <input type="number" min="6" max="18" value={n} onChange={(e) => setN(Number(e.target.value))} /></label><p>{odds.tickets.toLocaleString("vi-VN")} vé tổ hợp · chi phí tham khảo {(Number(odds.tickets)*10000).toLocaleString("vi-VN")} VNĐ (10.000đ/vé giả định).</p><p>Xác suất Jackpot nếu mua đủ tổ hợp: {fraction} (khoảng 1 / {Number(odds.total/odds.favorable).toLocaleString("vi-VN")}). Cơ hội jackpot tăng theo số vé khác nhau đã mua; không có tổ hợp nào tự nó “nóng” hơn.</p></section>; }

createRoot(document.querySelector("#app")!).render(<App />);
