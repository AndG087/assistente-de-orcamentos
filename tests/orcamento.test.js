const assert = require('node:assert/strict');
const test = require('node:test');
const { analyzeOrder, makePrompt } = require('../js/orcamento');

test('extrai o pedido e pergunta o que falta nos cartões de visita', () => {
  const order = analyzeOrder('Oi, preciso de 200 cartões de visita pra sexta. Vocês fazem?');

  assert.equal(order.product, 'Cartões de visita');
  assert.equal(order.quantity, '200');
  assert.equal(order.deadline, 'pra sexta');
  assert.deepEqual(order.questions, [
    'A impressão é só na frente ou frente e verso?',
    'Você já tem a arte pronta para impressão?'
  ]);
});

test('preserva a quantidade com separador de milhar e reconhece especificações', () => {
  const order = analyzeOrder('Preciso de 1.500 panfletos A5, frente e verso, até 25/11. A arte está pronta.');

  assert.equal(order.product, 'Panfletos');
  assert.equal(order.quantity, '1.500');
  assert.equal(order.deadline, 'até 25/11');
  assert.deepEqual(order.questions, []);
  assert.match(order.reply, /conferir o orçamento e a disponibilidade/u);
});

test('identifica dimensões e prazo urgente no pedido de banner', () => {
  const order = analyzeOrder('Preciso de 1 banner de 80 x 120 cm pra hoje. Quanto fica?');

  assert.equal(order.product, 'Banner');
  assert.equal(order.quantity, '1');
  assert.equal(order.deadline, 'pra hoje');
  assert.deepEqual(order.questions, ['Você já tem a arte pronta para impressão?']);
});

test('pede confirmação em vez de atribuir uma quantidade a vários produtos', () => {
  const order = analyzeOrder('Preciso de 100 panfletos e 3 banners para amanhã.');

  assert.equal(order.product, 'Panfletos e Banner');
  assert.equal(order.quantity, 'A confirmar');
  assert.match(order.questions[0], /de cada produto/u);
});

test('sinaliza campos desconhecidos em pedidos fora da prévia', () => {
  const order = analyzeOrder('Vamos conversar sobre impressão?');

  assert.equal(order.product, 'A confirmar');
  assert.equal(order.quantity, 'A confirmar');
  assert.equal(order.deadline, 'A confirmar');
  assert.match(order.questions[0], /produto/u);
});

test('inclui a mensagem original e as instruções de revisão no prompt', () => {
  const message = 'Quero dois banners.\nPosso retirar amanhã?';
  const prompt = makePrompt(message);

  assert.ok(prompt.endsWith(message));
  assert.match(prompt, /Nunca invente preços nem confirme disponibilidade ou prazo/u);
});
