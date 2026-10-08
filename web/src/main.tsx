import { createRoot } from "react-dom/client";
import { GoogleGeminiEffect } from "./gemini-effect";
import "./style.css";

const disclaimer = "Kết quả xổ số là ngẫu nhiên. Thống kê quá khứ không giúp dự đoán kỳ quay sau. Trang này chỉ mang tính tham khảo và giải trí, không liên kết với Vietlott. Chỉ dành cho người từ 18 tuổi trở lên. Hãy chơi có trách nhiệm.";
const nav = ["Trang chủ", "Mega 6/45", "Power 6/55", "Lotto 5/35", "Max 3D", "Max 3D Pro", "Bộ số tham khảo", "Máy tính Bao", "Backtest", "Kiến thức", "Nguồn dữ liệu & phương pháp"];

function App() {
  const eligible = localStorage.getItem("vl-18-plus") === "yes";
  return <>{!eligible && <section className="gate"><h1>Xác nhận độ tuổi</h1><p>Nội dung chỉ dành cho người từ 18 tuổi trở lên.</p><button onClick={() => { localStorage.setItem("vl-18-plus", "yes"); location.reload(); }}>Tôi từ 18 tuổi trở lên</button></section>}
    <header><p className="eyebrow">VIETLOTT LAB · DỮ LIỆU CÓ THỂ KIỂM TRA</p><h1>Nhìn rõ lịch sử.<br /><em>Hiểu đúng xác suất.</em></h1><p>Kho lưu trữ kết quả và thống kê trung tính cho các bộ số Vietlott.</p><nav>{nav.map((item) => <a href={`#${item}`} key={item}>{item}</a>)}</nav></header>
    <section className="hero-effect"><GoogleGeminiEffect /><div className="hero-copy"><span>THỐNG KÊ · PHƯƠNG PHÁP · MINH BẠCH</span><h2>Không dự đoán.<br />Chỉ cung cấp bằng chứng.</h2></div></section>
    <main><section className="game-grid">{["Mega 6/45", "Power 6/55", "Lotto 5/35"].map((game, i) => <article className="game-card" key={game}><span>0{i + 1}</span><h2>{game}</h2><p>Kết quả kỳ quay · tần suất · xác suất</p><a href={`#${game}`}>Xem dữ liệu →</a></article>)}</section><section className="info"><h2>Nguyên tắc của Lab</h2><p>Các kỳ quay là độc lập. Thống kê quá khứ không làm thay đổi xác suất của bộ số tiếp theo.</p></section></main><footer>{disclaimer}</footer></>;
}

createRoot(document.querySelector("#app")!).render(<App />);
