export type TarotCard = { id: string; name: string; arcana: "Ẩn chính" | "Ẩn phụ"; suit?: string; symbol: string; upright: string; reversed: string; reflection: string };

const majors: Array<[string,string,string,string,string]> = [
  ["Kẻ Khờ","✧","Khởi đầu mới, cởi mở và can đảm bước vào điều chưa biết.","Thiếu chuẩn bị hoặc vội tin vào một khởi đầu.","Bạn muốn thử điều gì nhưng vẫn đang ngần ngại?"],
  ["Nhà Ảo Thuật","☿","Tập trung nguồn lực và biến ý tưởng thành hành động cụ thể.","Phân tán năng lượng hoặc chưa dùng hết khả năng sẵn có.","Một bước nhỏ nào nằm trong tầm tay bạn ngay lúc này?"],
  ["Nữ Tư Tế","☾","Lắng nghe trực giác, kiên nhẫn quan sát điều chưa được nói ra.","Bỏ qua cảm nhận của mình hoặc để sự mơ hồ dẫn dắt.","Bạn cần thêm thông tin gì trước khi quyết định?"],
  ["Hoàng Hậu","♧","Nuôi dưỡng sáng tạo, sự đủ đầy và những điều đang lớn lên.","Cho đi quá mức hoặc quên chăm sóc nhu cầu của chính mình.","Điều gì cần được bạn chăm sóc thêm?"],
  ["Hoàng Đế","♜","Tạo cấu trúc, ranh giới và một nền tảng ổn định.","Quá cứng nhắc hoặc muốn kiểm soát mọi thứ.","Ranh giới lành mạnh nào sẽ giúp bạn yên tâm hơn?"],
  ["Giáo Hoàng","⚯","Học hỏi từ truyền thống, cố vấn hoặc cộng đồng đáng tin.","Một khuôn mẫu cũ có thể không còn phù hợp với bạn.","Bạn muốn giữ lại giá trị nào và thay đổi điều gì?"],
  ["Tình Nhân","♡","Kết nối chân thành và lựa chọn dựa trên giá trị cốt lõi.","Thiếu đồng thuận hoặc chưa thành thật với điều mình muốn.","Lựa chọn nào gần nhất với giá trị của bạn?"],
  ["Cỗ Xe","➤","Tiến lên với kỷ luật và định hướng rõ ràng.","Mất phương hướng hoặc cố thúc ép khi chưa cân bằng.","Hai ưu tiên nào cần được đưa về cùng một hướng?"],
  ["Sức Mạnh","♌","Kiên nhẫn, lòng trắc ẩn và sự vững vàng bên trong.","Tự nghi ngờ hoặc cố kìm nén cảm xúc.","Bạn có thể đối xử dịu dàng hơn với mình ở đâu?"],
  ["Ẩn Sĩ","✦","Dành khoảng lặng để tìm câu trả lời của riêng mình.","Thu mình quá lâu hoặc né tránh sự giúp đỡ.","Khoảng lặng nào sẽ giúp bạn sáng rõ hơn?"],
  ["Bánh Xe Số Phận","◉","Một chu kỳ đang chuyển động; linh hoạt trước thay đổi.","Kháng cự điều đang đổi thay hoặc trông chờ may rủi.","Điều gì bạn có thể chủ động dù hoàn cảnh thay đổi?"],
  ["Công Lý","⚖","Nhìn sự việc cân bằng và chịu trách nhiệm với lựa chọn.","Thiếu góc nhìn hoặc né tránh hệ quả.","Dữ kiện nào giúp bạn nhìn tình huống công bằng hơn?"],
  ["Người Treo Ngược","⟡","Tạm dừng để thử một góc nhìn mới.","Chờ đợi thụ động hoặc hy sinh không cần thiết.","Nếu đổi góc nhìn, bạn nhận ra điều gì?"],
  ["Cái Chết","♧","Khép lại một giai đoạn để nhường chỗ cho chuyển hóa.","Bám víu vào điều đã đến lúc cần thay đổi.","Bạn sẵn sàng buông điều gì để tạo chỗ cho điều mới?"],
  ["Tiết Chế","≈","Điều hòa các nhu cầu và tìm nhịp điệu bền vững.","Thiếu kiên nhẫn hoặc các phần trong cuộc sống mất cân bằng.","Một điều chỉnh nhỏ nào giúp nhịp sống cân bằng hơn?"],
  ["Ác Quỷ","⛓","Nhận diện thói quen hay ràng buộc đang ảnh hưởng lựa chọn.","Bắt đầu nhận ra lối thoát khỏi một khuôn mẫu.","Điều gì đang có quyền lực lớn hơn mức bạn mong muốn?"],
  ["Tòa Tháp","⚡","Một niềm tin cũ bị thử thách; tạo nền tảng chân thực hơn.","Trì hoãn thay đổi cần thiết hoặc sợ xáo trộn.","Điều gì cần được nhìn nhận thẳng thắn?"],
  ["Ngôi Sao","☆","Hy vọng, hồi phục và trở lại với điều có ý nghĩa.","Khó nhìn thấy triển vọng hoặc cần thời gian hồi phục.","Điều gì giúp bạn cảm thấy được tiếp sức?"],
  ["Mặt Trăng","☾","Khám phá cảm xúc và sự bất định trước khi kết luận.","Sương mù đang tan; kiểm chứng điều mình lo lắng.","Bạn biết chắc điều gì, và phần nào vẫn là giả định?"],
  ["Mặt Trời","☼","Sự sáng rõ, niềm vui và năng lượng để thể hiện bản thân.","Niềm vui bị che khuất hoặc kỳ vọng quá cao.","Điều gì đang diễn ra tốt mà bạn có thể ghi nhận?"],
  ["Phán Xét","♧","Nhìn lại, học từ quá khứ và trả lời tiếng gọi mới.","Tự phán xét hoặc ngần ngại trước một quyết định.","Bài học nào từ trải nghiệm cũ đáng mang theo?"],
  ["Thế Giới","◎","Hoàn tất một chặng đường và ghi nhận thành quả.","Một việc còn dang dở cần khép lại trước khi tiến tiếp.","Bạn muốn đánh dấu sự hoàn thành nào của mình?"]
];

const ranks = ["Át","Hai","Ba","Bốn","Năm","Sáu","Bảy","Tám","Chín","Mười","Tiểu Đồng","Kỵ Sĩ","Hoàng Hậu","Hoàng Đế"];
const rankThemes = ["một hạt giống mới và tiềm năng bắt đầu","sự cân nhắc và phối hợp hai lựa chọn","đà phát triển qua hợp tác và biểu đạt","nền tảng ổn định cùng nhu cầu nghỉ ngơi","thử thách giúp nhận ra điều cần điều chỉnh","hỗ trợ, trao đổi và tiến triển hài hòa","kiên trì trước một giai đoạn cần suy ngẫm","chủ động rèn luyện và tập trung","nhìn lại chặng đường và nội lực","khép lại một chu kỳ và tích hợp trải nghiệm","sự tò mò và bài học mới","chuyển động, động lực và thử nghiệm","sự chăm sóc, thấu cảm và nuôi dưỡng","lãnh đạo, cấu trúc và trách nhiệm"];
const suits = [
  { name:"Gậy",symbol:"♧",theme:"sáng tạo, động lực và những dự định" },
  { name:"Cốc",symbol:"♡",theme:"cảm xúc, kết nối và đời sống nội tâm" },
  { name:"Kiếm",symbol:"⚔",theme:"tư duy, giao tiếp và quyết định" },
  { name:"Tiền",symbol:"◇",theme:"nguồn lực, công việc và điều hữu hình" },
];
export const tarotDeck: TarotCard[] = [
  ...majors.map(([name,symbol,upright,reversed,reflection],i)=>({id:`major-${i}`,name,arcana:"Ẩn chính" as const,symbol,upright,reversed,reflection})),
  ...suits.flatMap((suit,suitIndex)=>ranks.map((rank,rankIndex)=>({
    id:`minor-${suitIndex}-${rankIndex}`,name:`${rank} ${suit.name}`,arcana:"Ẩn phụ" as const,suit:suit.name,symbol:suit.symbol,
    upright:`Trong biểu tượng Tarot, lá này gợi ${rankThemes[rankIndex]} trong lĩnh vực ${suit.theme}. Hãy xem đây là một lăng kính để suy ngẫm, không phải lời tiên đoán.`,
    reversed:`Chủ đề ${rankThemes[rankIndex]} trong lĩnh vực ${suit.theme} có thể đang cần thêm thời gian, cân bằng hoặc một cách tiếp cận khác.`,
    reflection:`Trong ${suit.theme}, biểu hiện nào của chủ đề “${rankThemes[rankIndex]}” đang gần với trải nghiệm của bạn?`
  })))
];

/** Fisher–Yates shuffle with browser cryptographic randomness where available. */
export function shuffleTarot(deck: TarotCard[] = tarotDeck): TarotCard[] {
  const result=[...deck];
  for(let i=result.length-1;i>0;i--){
    const random=new Uint32Array(1);
    const value=globalThis.crypto?.getRandomValues ? (globalThis.crypto.getRandomValues(random), random[0]/4294967296) : Math.random();
    const j=Math.floor(value*(i+1));[result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}
