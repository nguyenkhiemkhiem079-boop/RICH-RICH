import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { GoogleGeminiEffect } from "./gemini-effect";
import "./style.css";

const disclaimer = "Kết quả xổ số là ngẫu nhiên. Thống kê quá khứ không giúp dự đoán kỳ quay sau. Trang này chỉ mang tính tham khảo và giải trí, không liên kết với Vietlott. Chỉ dành cho người từ 18 tuổi trở lên. Hãy chơi có trách nhiệm.";
const nav = ["Trang chủ", "Mega 6/45", "Power 6/55", "Lotto 5/35", "Max 3D", "Max 3D Pro", "Bộ số tham khảo", "Máy tính Bao", "Backtest", "Kiến thức", "Nguồn dữ liệu & phương pháp"];
type Draw = { draw_id: number; draw_date: string; numbers: number[]; special?: number | null };

function App() {
  const [page, setPage] = useState(decodeURIComponent(location.hash.slice(1) || "Trang chủ"));
  const eligible = localStorage.getItem("vl-18-plus") === "yes";
  useEffect(() => { const update = () => setPage(decodeURIComponent(location.hash.slice(1) || "Trang chủ")); addEventListener("hashchange", update); return () => removeEventListener("hashchange", update); }, []);
  return <>{!eligible && <section className="gate"><h1>Xác nhận độ tuổi</h1><p>Nội dung chỉ dành cho người từ 18 tuổi trở lên.</p><button onClick={() => { localStorage.setItem("vl-18-plus", "yes"); location.reload(); }}>Tôi từ 18 tuổi trở lên</button></section>}
    <header><p className="eyebrow">VIETLOTT LAB · DỮ LIỆU CÓ THỂ KIỂM TRA</p><h1>Nhìn rõ lịch sử.<br /><em>Hiểu đúng xác suất.</em></h1><p>Kho lưu trữ kết quả và thống kê trung tính cho các bộ số Vietlott.</p><nav>{nav.map((item) => <a href={`#${item}`} key={item}>{item}</a>)}</nav></header>
    {page === "Trang chủ" && <section className="hero-effect"><GoogleGeminiEffect /><div className="hero-copy"><span>THỐNG KÊ · PHƯƠNG PHÁP · MINH BẠCH</span><h2>Không dự đoán.<br />Chỉ cung cấp bằng chứng.</h2></div></section>}
    <main><Page page={page} /></main><footer>{disclaimer}</footer></>;
}

function Page({ page }: { page: string }) {
  const games = ["Mega 6/45", "Power 6/55", "Lotto 5/35"];
  if (page === "Trang chủ") return <><section className="game-grid">{games.map((game, i) => <article className="game-card" key={game}><span>0{i + 1}</span><h2>{game}</h2><p>Kết quả kỳ quay · tần suất · xác suất</p><a href={`#${game}`}>Xem dữ liệu →</a></article>)}</section><section className="info"><h2>Nguyên tắc của Lab</h2><p>Các kỳ quay là độc lập. Thống kê quá khứ không làm thay đổi xác suất của bộ số tiếp theo.</p></section></>;
  if (games.includes(page)) return <GamePage game={page} />;
  if (page === "Bộ số tham khảo") return <Generator />;
  if (page === "Máy tính Bao") return <Bao />;
  if (page === "Kiến thức") return <section className="info"><h2>Kiến thức</h2><p>Các kỳ quay độc lập. Sai lầm con bạc không làm thay đổi xác suất kỳ sau.</p></section>;
  if (page === "Backtest") return <section className="info"><h2>Backtest</h2><p>Kết quả walk-forward sẽ hiển thị cùng seed, khoảng tin cậy và hiệu chỉnh Holm khi dữ liệu hợp lệ.</p></section>;
  return <section className="info"><h2>{page}</h2><p>Nguồn ưu tiên là trang chính thức; dữ liệu được cache và kiểm tra schema trước khi công bố.</p></section>;
}

function GamePage({ game }: { game: string }) {
  const file = game === "Mega 6/45" ? "mega" : game === "Power 6/55" ? "power" : "lotto535";
  const [draws, setDraws] = useState<Draw[]>([]); const [error, setError] = useState("");
  useEffect(() => { fetch(`${import.meta.env.BASE_URL}data/${file}.json`).then((r) => r.ok ? r.json() : Promise.reject(new Error("Không tải được dữ liệu"))).then(setDraws).catch((e) => setError(e.message)); }, [file]);
  return <section className="info"><p className="eyebrow">DỮ LIỆU CURATED</p><h2>{game}</h2>{error && <p className="notice">{error}</p>}{!error && !draws.length && <p>Đang tải dữ liệu…</p>}{draws.length > 0 && <><p>{draws.length.toLocaleString("vi-VN")} kỳ · mới nhất #{String(draws[draws.length - 1].draw_id).padStart(5, "0")}</p><div className="table-wrap"><table><thead><tr><th>Kỳ</th><th>Ngày</th><th>Bộ số</th><th>ĐB</th></tr></thead><tbody>{draws.slice(-25).reverse().map((d) => <tr key={d.draw_id}><td>#{String(d.draw_id).padStart(5, "0")}</td><td>{d.draw_date}</td><td>{d.numbers.map((n) => String(n).padStart(2, "0")).join(" · ")}</td><td>{d.special ? String(d.special).padStart(2, "0") : "—"}</td></tr>)}</tbody></table></div></>}</section>;
}

function Generator() { const [numbers, setNumbers] = useState<number[]>([]); const make = () => setNumbers([...Array.from({ length: 45 }, (_, i) => i + 1).sort(() => Math.random() - .5).slice(0, 6)].sort((a, b) => a - b)); return <section className="info"><h2>Bộ số tham khảo</h2><p>Mọi bộ Mega 6/45 có xác suất thật như nhau: 1 / 8.145.060.</p><button onClick={make}>Tạo bộ số</button><output className="number-output">{numbers.map((n) => String(n).padStart(2, "0")).join(" · ")}</output></section>; }
function Bao() { const [n, setN] = useState(7); let tickets = 1; for (let i = 1; i <= 6; i++) tickets = tickets * (n - 6 + i) / i; return <section className="info"><h2>Máy tính Bao Mega 6/45</h2><label>Số số chọn <input type="number" min="6" max="18" value={n} onChange={(e) => setN(Number(e.target.value))} /></label><p>{tickets.toLocaleString("vi-VN")} vé tổ hợp · chi phí tham khảo {(tickets * 10000).toLocaleString("vi-VN")} VNĐ.</p><p>Xác suất Jackpot: 1 / 8.145.060 cho mỗi bộ cơ sở. EV phụ thuộc Jackpot và số người cùng trúng.</p></section>; }

createRoot(document.querySelector("#app")!).render(<App />);
