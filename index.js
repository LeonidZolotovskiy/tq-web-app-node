const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

const token = "5958249365:AAG3aF5ErFwqjlE0pXy82tDdNApYfT6rgc8";
const bot = new TelegramBot(token, { polling: true });

const url = "https://strong-alpaca-62f05e.netlify.app";
const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Доброе утро ", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "BestOfTheBestofthe", web_app: { url: url } }],
        ],
      },
    });
  }
  if (text === "/start") {
    await bot.sendMessage(chatId, "Доброе утро ", {
      reply_markup: {
        keyboard: [
          [{ text: "BestOfTheBestofthe", web_app: { url: url + "/form" } }],
        ],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);

      await bot.sendMessage(chatId, "Спасибо за обратную связь ");
      await bot.sendMessage(chatId, "Ваша страна " + data?.country);
      await bot.sendMessage(chatId, "Ваша улица " + data?.street);

      setTimeout(async () => {
        await bot.sendMessage(chatId, "Всю информацию вы получите в этом чате");
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
});
app.post("/web-data", async (req, res) => {
  const { queryId, products, totalPrice } = req.body;
  try {
    await bot.answerWebQurry(queryId,{
      type:'article',
      id: queryId,
      title: 'Успешная покупка',
      input_message_content: {
       message_text:'Поздраляю с покупкойб вы приобрели товар на сумму' + totalPrice
      }
    });
    return res.status(200).json({});
  } catch (e) { 
    await bot.answerWebQurry(queryId,{
    type:'article',
    id: queryId,
    title: 'Не удалось приобрести товар',
    input_message_content: {
     message_text:'Не удалось приобрести товар'
    }
  });
    return res.status(500).json({});
  }
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log("Server started " + PORT);
});
