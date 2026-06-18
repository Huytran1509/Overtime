// ============================================================
// Tạo "Bản tin thể thao" hằng ngày bằng Claude API (có web search).
// Chạy tự động bởi GitHub Actions. Không cần cài thêm thư viện gì.
// ============================================================

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("❌ Thiếu ANTHROPIC_API_KEY. Bạn đã thêm Secret trên GitHub chưa?");
  process.exit(1);
}

// Thư mục chứa bài viết của blog (LƯU Ý: tên thư mục có dấu cách!)
const CONTENT_DIR = "overtime 4/src/content";

// Tính ngày theo giờ Việt Nam (UTC+7)
const nowVN = new Date(Date.now() + 7 * 60 * 60 * 1000);
const y = nowVN.getUTCFullYear();
const m = String(nowVN.getUTCMonth() + 1).padStart(2, "0");
const d = String(nowVN.getUTCDate()).padStart(2, "0");
const iso = `${y}-${m}-${d}`;        // 2026-06-18
const dateVN = `${d}/${m}/${y}`;     // 18/06/2026

const prompt = `Hôm nay là ngày ${iso}. Hãy tìm trên web những tin THỂ THAO nổi bật nhất trong khoảng 24 giờ qua (ưu tiên bóng đá, kèm thêm quần vợt, điền kinh, bóng rổ và các môn khác nếu có tin đáng chú ý).

Viết một bản tin tổng hợp bằng TIẾNG VIỆT, khoảng 300–450 từ, văn phong báo thể thao gọn gàng, gồm 4–6 mục tin ngắn. Mỗi mục bắt đầu bằng một tiêu đề phụ in đậm (dùng **...**), sau đó là 2–4 câu tóm tắt.

QUY TẮC BẮT BUỘC:
- Chỉ TÓM TẮT bằng lời văn của bạn. TUYỆT ĐỐI không chép nguyên văn câu chữ từ bài báo gốc.
- Mỗi mục tin kèm ít nhất 1 link nguồn dạng markdown, ví dụ: [Nguồn](https://...).
- Nếu không tìm thấy tin thể thao đáng kể nào, hãy nói thẳng điều đó — không được bịa tin.
- CHỈ trả về phần nội dung markdown của thân bài. KHÔNG kèm tiêu đề lớn (dòng bắt đầu bằng #), KHÔNG kèm frontmatter, KHÔNG viết câu mở đầu kiểu "Đây là bản tin...".`;

const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 6,
        user_location: {
          type: "approximate",
          country: "VN",
          timezone: "Asia/Ho_Chi_Minh",
        },
      },
    ],
  }),
});

if (!res.ok) {
  console.error("❌ Lỗi gọi Claude API. Mã:", res.status);
  console.error(await res.text());
  process.exit(1);
}

const data = await res.json();

// Gom tất cả các khối văn bản mà Claude trả về
const body = (data.content || [])
  .filter((b) => b.type === "text")
  .map((b) => b.text)
  .join("\n")
  .trim();

if (!body) {
  console.error("❌ Claude trả về nội dung rỗng. Bỏ qua hôm nay.");
  process.exit(1);
}

// Ghép frontmatter (phần thông tin bài viết) + lời cảnh báo + nội dung
const frontmatter = `---
title: Bản tin thể thao ${dateVN}
slug: ban-tin-the-thao-${iso}
category: Culture
excerpt: Tổng hợp nhanh những tin thể thao nổi bật ngày ${dateVN}, do AI biên soạn và dẫn nguồn.
author: Overtime AI
date: ${iso}
cover: https://images.unsplash.com/photo-1745997645080-941f962f1392?q=70&w=1600&auto=format&fit=crop
readingTime: 4
---

> ⚠️ Bản tin này do AI tự động tổng hợp từ Internet. Vui lòng bấm vào nguồn để kiểm chứng trước khi tin tưởng hoàn toàn.

`;

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
if (!existsSync(CONTENT_DIR)) mkdirSync(CONTENT_DIR, { recursive: true });

const file = `${CONTENT_DIR}/ban-tin-the-thao-${iso}.md`;
writeFileSync(file, frontmatter + body + "\n", "utf8");
console.log("✅ Đã tạo bài:", file);
