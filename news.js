require("dotenv").config();

const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const moment = require("moment-timezone");
const Discord = require("discord.js");

let date = moment().toISOString();
let articles;

module.exports = async () => {
  await newsapi.v2
    .everything({
      sources: "the-hindu,the-times-of-india",
      to: date,
      language: "en",
      sortBy: "relevancy",
      page: 2,
    })
    .then((response) => {
      articleEmbeds = response.articles.map((article) =>
        new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle(article.title)
          .setURL(article.url)
          .setAuthor(article.source.name)
          .setThumbnail(article.urlToImage)
          .setDescription(`${article.description.slice(0, 56)} ...`)
          .setTimestamp()
          .setFooter("The Senate Bot")
      );
    })
    .catch((e) => console.log(error));

  return articleEmbeds;
};
