const assert = require('node:assert/strict');
const test = require('node:test');
const { score } = require('../avaliacao/avaliar.cjs');

test('trata diferenças de formatação como equivalentes sem perder o horário', () => {
  const expected = [{ product: 'Cartões de visita', quantity: '1.500', size: '9 x 5 cm', printing: 'Só na frente', deadline: 'para sexta às 9h30' }];
  const equivalent = [{ product: 'cartão de visita', quantity: '1500', size: '90mm x 50mm', printing: 'Frente', deadline: 'sexta-feira 09:30' }];

  assert.equal(score(expected, equivalent).fichaExata, true);
  const withoutTime = [{ ...equivalent[0], deadline: 'sexta-feira' }];
  assert.equal(score(expected, withoutTime).incorretos, 1);
});

test('distingue campos omitidos, incorretos e sem apoio', () => {
  const expected = [{ product: 'Banner', quantity: '1', deadline: 'pra hoje' }];
  const actual = [{ product: 'Banner', quantity: '2', size: 'A4' }];
  const result = score(expected, actual);

  assert.equal(result.corretos, 1);
  assert.equal(result.omitidos, 1);
  assert.equal(result.incorretos, 1);
  assert.equal(result.semApoio, 1);
  assert.equal(result.fichaExata, false);
});

test('uma linha vazia extra ou faltante impede uma ficha exata', () => {
  assert.equal(score([{}], []).itensFaltantes, 1);
  const result = score([{}], [{}, {}]);
  assert.equal(result.itensExtras, 1);
  assert.equal(result.fichaExata, false);
});
