const disclaimer = "Kết quả xổ số là ngẫu nhiên. Thống kê quá khứ không giúp dự đoán kỳ quay sau. Trang này chỉ mang tính tham khảo và giải trí, không liên kết với Vietlott. Chỉ dành cho người từ 18 tuổi trở lên. Hãy chơi có trách nhiệm.";
const app = document.querySelector<HTMLDivElement>("#app")!;
const nav = ["Trang chủ", "Mega 6/45", "Power 6/55", "Lotto 5/35", "Max 3D", "Max 3D Pro", "Bộ số tham khảo", "Máy tính Bao", "Backtest", "Kiến thức", "Nguồn dữ liệu & phương pháp"];
const eligible = localStorage.getItem("vl-18-plus") === "yes";
const gate = !eligible ? `<section class="gate"><h1>Xác nhận độ tuổi</h1><p>Nội dung chỉ dành cho người từ 18 tuổi trở lên.</p><button id="enter">Tôi từ 18 tuổi trở lên</button></section>` : "";
app.innerHTML = `${gate}<header><h1>Vietlott Lab</h1><p>Kho lưu trữ và thống kê minh bạch</p><nav>${nav.map((x) => `<a href="#${x}">${x}</a>`).join("")}</nav></header><main id="content"></main><footer>${disclaimer}</footer>`;
document.querySelector("#enter")?.addEventListener("click", () => { localStorage.setItem("vl-18-plus", "yes"); location.reload(); });
const content = document.querySelector<HTMLDivElement>("#content")!;
function render() {
  const page = decodeURIComponent(location.hash.slice(1) || "Trang chủ");
  if (page === "Máy tính Bao") {
    content.innerHTML = `<h2>Máy tính Bao</h2><label>Số số chọn <input id="n" type="number" value="7" min="6" max="18"></label><p id="bao"></p>`;
    const update = () => { const n = Number((document.querySelector("#n") as HTMLInputElement).value); let tickets = 1; for (let i = 1; i <= 6; i++) tickets = tickets * (n - 6 + i) / i; document.querySelector("#bao")!.textContent = `Số vé tổ hợp: ${tickets.toLocaleString("vi-VN")}. Xác suất Jackpot: 1 / 8.145.060 cho mỗi bộ Mega 6/45. EV phụ thuộc Jackpot và số người cùng trúng.`; }; document.querySelector("#n")!.addEventListener("input", update); update();
  } else if (page === "Bộ số tham khảo") content.innerHTML = `<h2>Bộ số tham khảo</h2><p>Bộ số được tạo ngẫu nhiên để tham khảo. Mọi bộ số Mega 6/45 có xác suất thật như nhau: 1 / 8.145.060.</p><button id="generate">Tạo bộ số</button><output id="numbers"></output>`;
  else if (["Mega 6/45", "Power 6/55", "Lotto 5/35", "Max 3D", "Max 3D Pro"].includes(page)) content.innerHTML = `<h2>${page}</h2><p>Lịch sử kỳ quay, thống kê và ngày dữ liệu sẽ hiển thị tại đây.</p><p class="notice">Chưa có kết luận dự đoán; dữ liệu chỉ dùng để tham khảo lịch sử.</p>`;
  else if (page === "Kiến thức") content.innerHTML = `<h2>Kiến thức</h2><p>Các kỳ quay độc lập. Sai lầm con bạc là nhầm việc một số chưa xuất hiện gần đây với nghĩa vụ phải xuất hiện tiếp theo. Xác suất được tính từ tổ hợp, không thay đổi vì tần suất quá khứ.</p>`;
  else if (page === "Nguồn dữ liệu & phương pháp") content.innerHTML = `<h2>Nguồn dữ liệu & phương pháp</h2><p>Nguồn ưu tiên là trang chính thức; response được cache, kiểm tra schema và báo cáo giới hạn. Không liên kết với Vietlott.</p>`;
  else if (page === "Backtest") content.innerHTML = `<h2>Backtest</h2><p>Kết quả walk-forward và baseline Monte Carlo sẽ được công bố cùng seed, khoảng tin cậy và hiệu chỉnh Holm.</p>`;
  else content.innerHTML = `<h2>Trang chủ</h2><p>Kết quả mới nhất, thống kê lịch sử và phương pháp có thể kiểm tra.</p>`;
}
window.addEventListener("hashchange", render); render();
