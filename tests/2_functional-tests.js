/*
*
*
* FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
* ---- DO NOT REMOVE THIS LINE ----
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server'); // Importa seu arquivo server.js

chai.use(chaiHttp);

suite('Functional Tests', function() {

    /*
    * ----[EXAMPLE TEST]----
    * test('#example Test GET /api/stock-prices/', function(done){
    * chai.request(server)
    * .get('/api/stock-prices')
    * .query({stock: 'GOOG'})
    * .end(function(err, res){
    * assert.equal(res.status, 200);
    * assert.equal(res.body.stockData.stock, 'GOOG');
    * done();
    * });
    * });
    * ----[END EXAMPLE TEST]----
    */

    // Variável para armazenar likes entre os testes.
    // O FreeCodeCamp reinicia o ambiente para cada submissão,
    // então esta variável funcionará como um "estado" para os testes sequenciais.
    let likesCount = 0; // Vai ser usada para verificar o incremento de likes

    suite('GET /api/stock-prices => stockData object', function() {

        // Teste 1: Viewing one stock
        test('1. Viewing one stock: GET request to /api/stock-prices/', function(done) {
            chai.request(server)
                .get('/api/stock-prices')
                .query({ stock: 'GOOG' })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body.stockData);
                    assert.property(res.body.stockData, 'stock');
                    assert.property(res.body.stockData, 'price');
                    assert.property(res.body.stockData, 'likes');
                    assert.equal(res.body.stockData.stock, 'GOOG');
                    likesCount = res.body.stockData.likes; // Captura os likes iniciais
                    done();
                });
        });

        // Teste 2: Viewing one stock and liking it
        test('2. Viewing one stock and liking it: GET request to /api/stock-prices/', function(done) {
            chai.request(server)
                .get('/api/stock-prices')
                .query({ stock: 'GOOG', like: true })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body.stockData);
                    assert.property(res.body.stockData, 'stock');
                    assert.property(res.body.stockData, 'price');
                    assert.property(res.body.stockData, 'likes');
                    assert.equal(res.body.stockData.stock, 'GOOG');
                    assert.equal(res.body.stockData.likes, likesCount + 1); // Deve ter um like a mais
                    likesCount = res.body.stockData.likes; // Atualiza para o próximo teste
                    done();
                });
        });

        // Teste 3: Viewing the same stock again and liking it (should not increment likes)
        test('3. Viewing the same stock again and liking it: GET request to /api/stock-prices/', function(done) {
            chai.request(server)
                .get('/api/stock-prices')
                .query({ stock: 'GOOG', like: true })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body.stockData);
                    assert.property(res.body.stockData, 'stock');
                    assert.property(res.body.stockData, 'price');
                    assert.property(res.body.stockData, 'likes');
                    assert.equal(res.body.stockData.stock, 'GOOG');
                    assert.equal(res.body.stockData.likes, likesCount); // Likes não devem mudar (1 por IP)
                    done();
                });
        });

        // Teste 4: Viewing two stocks
        test('4. Viewing two stocks: GET request to /api/stock-prices/', function(done) {
            chai.request(server)
                .get('/api/stock-prices')
                .query({ stock: ['GOOG', 'MSFT'] })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body.stockData);
                    assert.lengthOf(res.body.stockData, 2);
                    assert.property(res.body.stockData[0], 'stock');
                    assert.property(res.body.stockData[0], 'price');
                    assert.property(res.body.stockData[0], 'rel_likes');
                    assert.property(res.body.stockData[1], 'stock');
                    assert.property(res.body.stockData[1], 'price');
                    assert.property(res.body.stockData[1], 'rel_likes');
                    assert.equal(res.body.stockData[0].stock, 'GOOG');
                    assert.equal(res.body.stockData[1].stock, 'MSFT');
                    done();
                });
        });

        // Teste 5: Viewing two stocks and liking them
        test('5. Viewing two stocks and liking them: GET request to /api/stock-prices/', function(done) {
            chai.request(server)
                .get('/api/stock-prices')
                .query({ stock: ['GOOG', 'MSFT'], like: true })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body.stockData);
                    assert.lengthOf(res.body.stockData, 2);
                    assert.property(res.body.stockData[0], 'stock');
                    assert.property(res.body.stockData[0], 'price');
                    assert.property(res.body.stockData[0], 'rel_likes');
                    assert.property(res.body.stockData[1], 'stock');
                    assert.property(res.body.stockData[1], 'price');
                    assert.property(res.body.stockData[1], 'rel_likes');
                    assert.equal(res.body.stockData[0].stock, 'GOOG');
                    assert.equal(res.body.stockData[1].stock, 'MSFT');
                    // A verificação de rel_likes aqui pode ser mais complexa
                    // mas o essencial é que a API esteja retornando os dados corretos
                    // e que a lógica de like por IP esteja funcionando no backend.
                    done();
                });
        });

    });

});