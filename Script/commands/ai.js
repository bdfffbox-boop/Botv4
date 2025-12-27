const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    version: "2.0.0",
    credit: "—͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "Smart Messenger AI Chat Bot",
    cooldowns: 0,
    hasPermssion: 0,
    commandCategory: "ai",
    usages: {
      en: "{pn} <message> | reply to message"
    }
  },

  run: async ({ api, args, event }) => {
    try {
      const userInput = args.join(" ");
      let prompt = "";

      // 🔁 যদি মেসেজ রিপ্লাই করা হয়
      if (event.type === "message_reply") {
        const replyText = event.messageReply.body || "";
        prompt = `User replied to this message:\n"${replyText}"\n\nUser says:\n"${userInput || "Explain / respond properly"}"`;
      } else {
        if (!userInput) {
          return api.sendMessage(
            "🤖 Hi! আমি AI Bot\nযেকোনো প্রশ্ন করো বা কোনো মেসেজে reply দিয়ে কথা বলো 🙂",
            event.threadID,
            event.messageID
          );
        }
        prompt = userInput;
      }

      // 🔐 API CONFIG (OpenAI compatible)
      const API_KEY = process.env.OPENAI_API_KEY || "YOUR_API_KEY_HERE";

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful, smart Messenger chat bot. Reply in a friendly and clear way."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`
          }
        }
      );

      const aiReply =
        response.data.choices?.[0]?.message?.content ||
        "🤖 Sorry, আমি ঠিক বুঝতে পারিনি।";

      api.sendMessage(aiReply, event.threadID, event.messageID);
    } catch (error) {
      console.error("AI Error:", error.response?.data || error.message);
      api.sendMessage(
        "⚠️ AI এখন ব্যস্ত আছে, একটু পরে আবার চেষ্টা করো।",
        event.threadID,
        event.messageID
      );
    }
  }
};
