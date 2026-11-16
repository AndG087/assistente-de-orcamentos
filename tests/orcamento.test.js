const assert = require('node:assert/strict');
const test = require('node:test');
const cases = require('./casos-de-pedido.json');
const { analyzeOrder, makePrompt, prepareReply } = require('../js/orcamento');

const blankItem = { product: '', quantity: '', size: '', printing: '', artwork: '', deadline: '' };

for (const example of cases) {
  test(example.nome, () => {
    assert.deepEqual(analyzeOrder(example.mensagem), example.itens.map((item) => ({ ...blankItem, ...item })));
  });
}

test('a resposta usa os campos revisados e só pergunta o que falta', () => {
  const items = analyzeOrder('Quero 500 panfletos A5.');
  const initial = prepareReply(items);
  assert.match(initial.reply, /500 un\./u);
  assert.ok(initial.questions.includes('Para quando você precisa do pedido?'));

  const revised = prepareReply([{
    ...items[0], quantity: '600', deadline: 'sexta às 14h', printing: 'Frente e verso', artwork: 'Pronta'
  }]);
  assert.match(revised.reply, /Panfletos — 600 un\. · A5 · Frente e verso · arte: Pronta · prazo solicitado: sexta às 14h/u);
  assert.doesNotMatch(revised.reply, /500 un\./u);
  assert.deepEqual(revised.questions, []);
});

test('a resposta separa produtos e limita perguntas a três', () => {
  const items = analyzeOrder('Quero 100 panfletos e 3 banners.');
  const { reply, questions } = prepareReply(items);
  assert.match(reply, /Panfletos — 100 un\.[\s\S]+Banner — 3 un\./u);
  assert.equal(questions.length, 3);
  assert.ok(questions.every((question) => question.includes('(Panfletos)') || question.includes('(Banner)')));
});

test('inclui a mensagem original e as regras de revisão no prompt', () => {
  const message = 'Quero dois banners.\nPosso retirar amanhã?';
  const prompt = makePrompt(message);
  assert.ok(prompt.endsWith(message));
  assert.match(prompt, /um item por produto/u);
  assert.match(prompt, /Nunca invente preços nem confirme disponibilidade ou prazo/u);
});
