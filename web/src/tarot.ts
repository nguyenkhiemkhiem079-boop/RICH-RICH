export type TarotCard = { id: string; name: string; arcana: "Ẩn chính" | "Ẩn phụ"; suit?: string; symbol: string; upright: string; reversed: string; actionUpright: string; actionReversed: string; reflection: string };
export type TarotPosition = { title: string; lens: string };

/** Position meanings are reflective prompts, not claims about a fixed timeline. */
export const tarotPositions: Record<"single" | "three", TarotPosition[]> = {
  single: [{ title: "Thông điệp để suy ngẫm", lens: "Đọc lá này như một lăng kính cho câu hỏi, không phải câu trả lời thay bạn quyết định." }],
  three: [
    { title: "Quá khứ · điều dẫn đến đây", lens: "Gợi một trải nghiệm, điều kiện hoặc cách nhìn trước đó có thể liên quan; không khẳng định nguyên nhân duy nhất." },
    { title: "Hiện tại · điều đang nổi bật", lens: "Gợi chủ đề bạn có thể quan sát trong hoàn cảnh hiện tại; hãy đối chiếu với sự kiện và cảm nhận thực tế." },
    { title: "Hướng đi · điều cần cân nhắc", lens: "Đưa ra một khả năng hoặc câu hỏi cho bước tiếp theo, không phải dự báo điều chắc chắn sẽ xảy ra." },
  ],
};

export function tarotReadingLens(topic: string): string {
  switch (topic) {
    case "Tình cảm": return "Ưu tiên giao tiếp rõ ràng, sự đồng thuận, ranh giới và trải nghiệm của tất cả những người liên quan.";
    case "Công việc / học tập": return "Đối chiếu với mục tiêu, nguồn lực, thông tin kiểm chứng được và những lựa chọn thực tế.";
    case "Phát triển bản thân": return "Tập trung vào điều bạn có thể quan sát, lựa chọn hoặc thực hành; tránh xem lá bài như nhãn cố định về bản thân.";
    default: return "Đặt biểu tượng cạnh hoàn cảnh cụ thể của bạn và cân nhắc cả những cách giải thích khác.";
  }
}

export function explainTarotPull(card: TarotCard, reversed: boolean, position: TarotPosition, topic: string): string {
  const cardMeaning = reversed ? card.reversed : card.upright;
  return `${position.title}: ${position.lens} Với ${topic.toLocaleLowerCase("vi-VN")}, hãy chú ý đến ${tarotReadingLens(topic)} Trong bối cảnh đó, ${card.name} ${reversed ? "ngược" : "xuôi"} gợi rằng: ${cardMeaning} Hãy đối chiếu cách đọc này với điều bạn thực sự biết về hoàn cảnh của mình.`;
}

const positionActions = [
  "Nhìn lại một tình huống cụ thể đã qua: điều gì hữu ích, điều gì bạn muốn làm khác lần tới? Tách điều mình kiểm soát được khỏi điều nằm ngoài tầm tay.",
  "Ghi lại một sự kiện gần đây khiến chủ đề này nổi bật. Nêu một nhu cầu hoặc vấn đề bằng câu cụ thể, rồi xác định thông tin nào còn thiếu.",
  "Chọn một bước nhỏ, an toàn và có thể kiểm chứng trong 24–48 giờ; đặt tiêu chí để biết nó có giúp ích không. Tránh quyết định lớn chỉ dựa trên lá bài.",
];

const topicActions: Record<string, string> = {
  "Tình cảm": "Nếu liên quan đến người khác, hãy hỏi thay vì suy đoán; nói rõ mong muốn và ranh giới, đồng thời tôn trọng sự đồng thuận của cả hai.",
  "Công việc / học tập": "Chuyển gợi ý thành một thử nghiệm nhỏ có thời hạn; kiểm tra nguồn lực, deadline và tiêu chí hoàn thành trước khi cam kết.",
  "Phát triển bản thân": "Chọn một thói quen quan sát được để thử trong vài ngày; ghi nhận trải nghiệm thay vì gắn nhãn cố định cho bản thân.",
  "Tổng quan": "Chọn phần gợi suy nghĩ nhất, đối chiếu với sự kiện bạn biết và cân nhắc ít nhất một cách giải thích khác.",
};

const suitFocus: Record<string, string> = {
  Gậy: "động lực và cách bạn biến ý tưởng thành hành động",
  Cốc: "cảm xúc, nhu cầu và sự kết nối",
  Kiếm: "cách suy nghĩ, trao đổi và đưa ra lựa chọn",
  Tiền: "nguồn lực, sự ổn định và những bước thực tế",
};

export function recommendTarotAction(card: TarotCard, reversed: boolean, positionIndex: number, topic: string): string {
  const cardAction = reversed ? card.actionReversed : card.actionUpright;
  const positionAction = positionActions[Math.min(Math.max(positionIndex, 0), positionActions.length - 1)];
  return `${cardAction} ${positionAction} ${topicActions[topic] ?? topicActions["Tổng quan"]}`;
}

export function synthesizeTarotSpread(pulls: Array<{ card: TarotCard; reversed: boolean }>, topic: string): string {
  if (pulls.length < 2) return "Với trải một lá, hãy dùng ý nghĩa và gợi ý hành động của lá như một điểm bắt đầu; bạn là người quyết định điều phù hợp với mình.";
  const [past, present, direction] = pulls;
  const pastMeaning = past.reversed ? past.card.reversed : past.card.upright;
  const presentMeaning = present.reversed ? present.card.reversed : present.card.upright;
  const directionMeaning = direction.reversed ? direction.card.reversed : direction.card.upright;
  const suits = pulls.map(pull => pull.card.suit).filter((suit): suit is string => Boolean(suit));
  const repeatedSuit = [...new Set(suits)].find(suit => suits.filter(item => item === suit).length >= 2);
  const pattern = repeatedSuit
    ? `Có ${suits.filter(suit => suit === repeatedSuit).length} lá thuộc bộ ${repeatedSuit}, nên chủ đề ${suitFocus[repeatedSuit] ?? "này"} xuất hiện lặp lại trong trải bài.`
    : "Không có bộ Ẩn phụ nào lặp lại; hãy đọc từng lá theo vị trí thay vì ép chúng thành một kết luận duy nhất.";
  return `Quá khứ — ${past.card.name}: ${pastMeaning} Hiện tại — ${present.card.name}: ${presentMeaning} Hướng đi — ${direction.card.name}: ${directionMeaning} ${pattern} Với chủ đề ${topic.toLocaleLowerCase("vi-VN")}, đây là ba góc nhìn để bạn tự đối chiếu; thứ tự này không chứng minh quan hệ nhân quả và không dự báo điều chắc chắn sẽ xảy ra.`;
}

const majorActions: Array<[string, string]> = [
  ["Cho phép mình thử điều mới, nhưng chuẩn bị trước những rủi ro có thể tránh.", "Thu hẹp lựa chọn và kiểm tra các điều kiện cơ bản trước khi bắt đầu."],
  ["Chọn một nguồn lực bạn đã có và biến ý tưởng thành bước làm cụ thể hôm nay.", "Tập trung lại vào một việc; xác minh thông tin và tránh hứa điều chưa thể làm."],
  ["Dành thời gian lắng nghe mình, đồng thời tìm dữ kiện còn thiếu trước khi kết luận.", "Hỏi thẳng điều chưa rõ thay vì để im lặng hoặc giả định kéo dài."],
  ["Nuôi dưỡng một dự án hoặc mối quan hệ bằng sự chăm sóc đều đặn.", "Đặt giới hạn cho việc cho đi và dành thời gian đáp ứng nhu cầu của chính mình."],
  ["Thiết lập một kế hoạch, ranh giới và trách nhiệm rõ ràng.", "Mời thêm góc nhìn; điều chỉnh quy tắc nếu chúng đang cản trở hợp tác."],
  ["Tìm lời khuyên từ người đáng tin, rồi tự đối chiếu với giá trị của mình.", "Xem lại niềm tin đang làm theo: điều gì còn hữu ích, điều gì cần cập nhật?"],
  ["Làm rõ giá trị và mong muốn của mỗi bên trước một lựa chọn quan trọng.", "Tạm dừng để xác nhận sự đồng thuận và thành thật với điều mình thực sự muốn."],
  ["Chọn một mục tiêu ưu tiên và chia thành các bước có thể theo dõi.", "Giảm tốc để xử lý xung đột ưu tiên trước khi cố tiến nhanh hơn."],
  ["Tiếp cận khó khăn bằng sự kiên nhẫn; nghỉ ngơi cũng là một phần của sức bền.", "Nhận diện cảm xúc thay vì kìm nén; xin hỗ trợ nếu đang quá tải."],
  ["Tạo khoảng lặng có chủ đích rồi ghi lại điều mình đã hiểu rõ hơn.", "Liên hệ một người đáng tin nếu việc tự xoay xở khiến bạn bị cô lập."],
  ["Tập trung vào phần mình có thể tác động và chuẩn bị linh hoạt cho thay đổi.", "Đừng phó mặc cho may rủi; rà soát một lựa chọn thực tế bạn vẫn kiểm soát được."],
  ["Cân nhắc dữ kiện và hệ quả với mọi bên trước khi quyết định.", "Tìm góc nhìn còn thiếu và chịu trách nhiệm cho phần mình có thể sửa."],
  ["Thử nhìn vấn đề từ phía khác trong thời gian giới hạn, rồi chọn bước tiếp theo.", "Đặt giới hạn cho việc chờ đợi hoặc hy sinh; xác định điều gì cần hành động."],
  ["Khép lại một việc đã hoàn tất và dành chỗ cho giai đoạn mới.", "Thừa nhận điều đã thay đổi; tìm hỗ trợ nếu buông bỏ đang khó khăn."],
  ["Điều chỉnh nhịp độ để các nhu cầu có thể cùng tồn tại bền vững.", "Chọn một điểm mất cân bằng dễ sửa nhất và thay đổi từ từ."],
  ["Nhận diện thói quen đang hạn chế lựa chọn và tìm một cách thay thế an toàn.", "Chia sẻ với người đáng tin hoặc chuyên gia nếu một ràng buộc gây hại, khó tự tháo gỡ."],
  ["Ưu tiên an toàn, kiểm chứng điều đang xảy ra và xây lại trên dữ kiện thật.", "Đừng trì hoãn vấn đề quan trọng; tìm sự hỗ trợ phù hợp để xử lý từng phần."],
  ["Ghi nhận điều đang giúp bạn hồi phục và duy trì một nguồn nâng đỡ.", "Cho mình thời gian; chọn một việc chăm sóc bản thân nhỏ thay vì ép phải lạc quan."],
  ["Phân biệt điều đã biết với điều đang lo; xác minh trước khi hành động.", "Nếu sự việc đã rõ hơn, cập nhật niềm tin và xử lý nỗi lo còn lại từng bước."],
  ["Chia sẻ thành quả và tận hưởng điều tốt đang hiện diện mà không tự gây áp lực.", "Giảm kỳ vọng hoàn hảo; tìm một nguồn vui nhỏ và thực tế trong hôm nay."],
  ["Rút ra một bài học cụ thể từ quá khứ và chọn cách áp dụng nó hiện tại.", "Thay tự trách bằng việc xác định một điều có thể sửa hoặc làm khác."],
  ["Đánh dấu điều đã hoàn tất, ghi nhận công sức và chọn mục tiêu kế tiếp.", "Hoàn thành hoặc bàn giao một việc còn mở trước khi nhận thêm cam kết mới."],
];

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
const rankActions: Array<[string, string]> = [
  ["Viết ra một ý tưởng mới và xác định phiên bản nhỏ nhất bạn có thể thử.", "Tạm hoãn cam kết lớn; kiểm tra xem điều gì còn thiếu để bắt đầu an toàn."],
  ["So sánh hai lựa chọn theo nhu cầu và giới hạn thực tế của bạn.", "Đừng cố giữ mọi khả năng cùng lúc; chọn điều cần ưu tiên trước."],
  ["Chủ động xin phản hồi hoặc cùng ai đó hoàn thành một phần việc.", "Làm rõ vai trò và kỳ vọng trước khi tiếp tục phối hợp."],
  ["Bảo vệ thời gian nghỉ và củng cố một nền nếp đang giúp bạn.", "Nhận diện chỗ đang quá cứng hoặc trì trệ, rồi điều chỉnh một việc nhỏ."],
  ["Gọi tên khó khăn cụ thể và chọn một nguồn hỗ trợ phù hợp.", "Đừng xem bất đồng hay trở ngại là thất bại; tách vấn đề thành phần xử lý được."],
  ["Ghi nhận sự giúp đỡ đang có và nói rõ bạn cần hỗ trợ gì tiếp theo.", "Kiểm tra xem việc cho–nhận có cân bằng và có đồng thuận không."],
  ["Kiên nhẫn với tiến độ; đặt một mốc rà soát thay vì đòi câu trả lời ngay.", "Đánh giá xem sự chờ đợi còn hữu ích không; hỏi thêm dữ kiện nếu cần."],
  ["Chia mục tiêu thành buổi thực hành ngắn và tập trung vào một kỹ năng.", "Giảm việc làm cùng lúc; chọn một ưu tiên và hoàn thành trước."],
  ["Ghi lại điều bạn đã vượt qua và nghỉ ngơi trước khi nhận thêm việc.", "Xin giúp đỡ hoặc giảm tải nếu đang cố gồng vượt quá sức."],
  ["Khép lại việc còn dang dở bằng một danh sách ngắn, không ôm thêm mục tiêu.", "Chọn điều cần kết thúc hoặc bàn giao để không kéo dài quá sức."],
  ["Đặt một câu hỏi, tìm hiểu điều mới và ghi lại điều bạn học được.", "Kiểm chứng thông tin trước khi tin hoặc chia sẻ; bắt đầu lại từ căn bản."],
  ["Chọn một hành động cụ thể và kiểm tra tác động trước khi tăng tốc.", "Giảm tốc, xem lại hướng đi và tránh quyết định khi đang bị thúc ép."],
  ["Chăm sóc một nhu cầu của mình và thể hiện sự quan tâm bằng cách cụ thể.", "Đặt ranh giới cho việc chăm sóc người khác; đừng bỏ quên nhu cầu bản thân."],
  ["Lập kế hoạch với trách nhiệm, thời hạn và ranh giới rõ ràng.", "Chia sẻ quyền quyết định; kiểm tra xem quy tắc có đang quá cứng không."],
];
const suits = [
  { name:"Gậy",symbol:"♧",theme:"sáng tạo, động lực và những dự định", action:"Chọn một ý tưởng và thử nó ở quy mô nhỏ; ghi lại điều tạo động lực hoặc làm bạn chùn bước." },
  { name:"Cốc",symbol:"♡",theme:"cảm xúc, kết nối và đời sống nội tâm", action:"Gọi tên cảm xúc và nhu cầu của mình; nếu có người liên quan, trao đổi trực tiếp và tôn trọng ranh giới." },
  { name:"Kiếm",symbol:"⚔",theme:"tư duy, giao tiếp và quyết định", action:"Tách dữ kiện khỏi suy đoán, viết các lựa chọn cùng hệ quả rồi hỏi rõ điều còn chưa chắc." },
  { name:"Tiền",symbol:"◇",theme:"nguồn lực, công việc và điều hữu hình", action:"Kiểm tra thời gian, ngân sách hoặc nguồn lực thật có; chọn bước khả thi thay vì dựa vào kỳ vọng." },
];
export const tarotDeck: TarotCard[] = [
  ...majors.map(([name,symbol,upright,reversed,reflection],i)=>({id:`major-${i}`,name,arcana:"Ẩn chính" as const,symbol,upright,reversed,actionUpright:majorActions[i][0],actionReversed:majorActions[i][1],reflection})),
  ...suits.flatMap((suit,suitIndex)=>ranks.map((rank,rankIndex)=>({
    id:`minor-${suitIndex}-${rankIndex}`,name:`${rank} ${suit.name}`,arcana:"Ẩn phụ" as const,suit:suit.name,symbol:suit.symbol,
    upright:`${rankThemes[rankIndex]} trong ${suit.theme}. Khi lá xuôi, có thể xem đây là lời mời nhận diện phần đang phát triển và chủ động nuôi dưỡng nó.`,
    reversed:`${rankThemes[rankIndex]} trong ${suit.theme} có thể đang bị chậm lại, quá đà hoặc cần xem xét từ góc khác; hãy kiểm tra điều nào thật sự đúng với trải nghiệm của bạn.`,
    actionUpright:`${rankActions[rankIndex][0]} ${suit.action}`,
    actionReversed:`${rankActions[rankIndex][1]} ${suit.action}`,
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
