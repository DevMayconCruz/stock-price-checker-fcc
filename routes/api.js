'use strict';

const fetch = require('node-fetch'); // Importa o node-fetch

// Objeto para simular um banco de dados de likes em memória.
const stockLikes = {};

// Função auxiliar para obter dados de uma única ação (MOCADO)
async function getStockData(stockSymbol) {
  const mockData = {
    'GOOG': { symbol: 'GOOG', latestPrice: 175.50 },
    'MSFT': { symbol: 'MSFT', latestPrice: 430.25 },
    'AAPL': { symbol: 'AAPL', latestPrice: 215.70 }
  };

  await new Promise(resolve => setTimeout(resolve, 100)); // Simula atraso

  const data = mockData[stockSymbol.toUpperCase()];
  if (data) {
    return {
      stock: data.symbol,
      price: data.latestPrice,
    };
  }
  return null;
} // <--- ESTE '}' ESTAVA FALTANDO!

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      let stocks = req.query.stock;
      let like = req.query.like === 'true';
      let clientIp = req.ip;

      if (!stocks) {
        return res.json({ error: 'no stock provided' });
      }

      if (!Array.isArray(stocks)) {
        stocks = [stocks];
      }

      if (stocks.length > 2) {
        return res.json({ error: 'too many stocks provided' });
      }

      const stockDataPromises = stocks.map(async (symbol) => {
        const data = await getStockData(symbol);
        if (data) {
          if (!stockLikes[symbol]) {
            stockLikes[symbol] = { likes: 0, ips: new Set() };
          }

          if (like && !stockLikes[symbol].ips.has(clientIp)) {
            stockLikes[symbol].likes++;
            stockLikes[symbol].ips.add(clientIp);
          }

          return {
            stock: data.stock,
            price: data.price,
            likes: stockLikes[symbol].likes,
          };
        }
        return null;
      });

      const results = await Promise.all(stockDataPromises);

      const validResults = results.filter(result => result !== null);

      if (validResults.length === 0) {
        return res.json({ error: 'invalid stock(s)' });
      }

      if (validResults.length === 1) {
        res.json({ stockData: validResults[0] });
      } else {
        const stock1 = validResults[0];
        const stock2 = validResults[1];

        if (!stock1 || !stock2) {
            return res.json({ error: 'invalid stock(s)' });
        }

        const relLikes1 = stock1.likes - stock2.likes;
        const relLikes2 = stock2.likes - stock1.likes;

        res.json({
          stockData: [
            { stock: stock1.stock, price: stock1.price, rel_likes: relLikes1 },
            { stock: stock2.stock, price: stock2.price, rel_likes: relLikes2 }
          ]
        });
      }
    });
};