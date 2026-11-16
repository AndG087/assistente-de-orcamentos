const message = document.getElementById('message');
const draft = document.getElementById('draft');
const inputStatus = document.getElementById('input-status');
const outputStatus = document.getElementById('output-status');
const result = document.getElementById('result');
const empty = document.getElementById('empty');
const orderItems = document.getElementById('order-items');
const itemTemplate = document.getElementById('item-template');
const copyDraft = document.getElementById('copy-draft');

async function copy(text, status) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const active = document.activeElement;
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(helper);
    helper.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Show the manual copy option below. */ }
    helper.remove();
    active?.focus();
    if (!copied) {
      window.prompt('Selecione o texto e copie manualmente.', text);
      status.textContent = 'A cópia automática está indisponível neste navegador.';
      return;
    }
  }
  status.textContent = 'Copiado.';
}

function resetResult() {
  inputStatus.textContent = '';
  outputStatus.textContent = '';
  result.hidden = true;
  empty.hidden = false;
}

function labelItems() {
  const items = Array.from(orderItems.children);
  items.forEach((item, index) => {
    item.querySelector('legend').textContent = `Item ${index + 1}`;
    const remove = item.querySelector('.remove-item');
    remove.hidden = items.length === 1;
    remove.setAttribute('aria-label', `Remover item ${index + 1}`);
  });
}

function addItem(values) {
  const item = itemTemplate.content.firstElementChild.cloneNode(true);
  for (const input of item.querySelectorAll('input')) {
    input.value = values[input.name] || '';
  }
  orderItems.append(item);
  return item;
}

function markReplyOutdated() {
  copyDraft.disabled = true;
  outputStatus.textContent = 'A ficha mudou. Atualize a resposta para copiar a nova versão.';
}

function updateReply() {
  const items = Array.from(orderItems.children, (item) => Object.fromEntries(
    Array.from(item.querySelectorAll('input'), (input) => [input.name, input.value.trim()])
  ));
  const { questions, reply } = prepareReply(items);
  const visibleQuestions = questions.length ? questions : ['Nenhuma pergunta adicional sugerida.'];
  document.getElementById('questions').replaceChildren(...visibleQuestions.map((question) => {
    const item = document.createElement('li');
    item.textContent = question;
    return item;
  }));
  draft.value = reply;
  copyDraft.disabled = false;
}

document.querySelectorAll('[data-example]').forEach((button) => {
  button.addEventListener('click', () => {
    message.value = button.value;
    resetResult();
    message.focus();
  });
});

message.addEventListener('input', resetResult);
document.getElementById('order-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const order = message.value.trim();
  if (!order) {
    inputStatus.textContent = 'Digite uma mensagem ou escolha um exemplo.';
    message.focus();
    return;
  }

  orderItems.replaceChildren();
  analyzeOrder(order).forEach(addItem);
  labelItems();
  updateReply();
  inputStatus.textContent = '';
  outputStatus.textContent = '';
  empty.hidden = true;
  result.hidden = false;
  document.getElementById('output-title').focus();
});

orderItems.addEventListener('input', markReplyOutdated);
orderItems.addEventListener('click', (event) => {
  if (!event.target.matches('.remove-item')) return;
  const item = event.target.closest('.order-item');
  const neighbor = item.nextElementSibling || item.previousElementSibling;
  item.remove();
  labelItems();
  markReplyOutdated();
  neighbor.querySelector('input').focus();
});

document.getElementById('add-item').addEventListener('click', () => {
  const item = addItem({});
  labelItems();
  markReplyOutdated();
  item.querySelector('input').focus();
});

document.getElementById('update-reply').addEventListener('click', () => {
  updateReply();
  outputStatus.textContent = 'Resposta atualizada.';
});

document.getElementById('copy-prompt').addEventListener('click', () => {
  copy(makePrompt(message.value.trim() || '[Cole aqui a mensagem do cliente]'), inputStatus);
});
copyDraft.addEventListener('click', () => {
  if (!draft.value.trim()) {
    outputStatus.textContent = 'Escreva uma resposta antes de copiar.';
    draft.focus();
    return;
  }
  copy(draft.value, outputStatus);
});
