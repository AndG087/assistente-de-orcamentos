const examples = {
  cards: 'Oi, preciso de 200 cartões de visita pra sexta. Vocês fazem?',
  flyers: 'Bom dia! Gostaria de orçamento para 500 panfletos A5, frente e verso, papel couchê 115 g. A arte está pronta. Preciso até 25/11.',
  banner: 'Boa tarde! Preciso de 1 banner de 80 x 120 cm pra hoje. Quanto fica?'
};

const message = document.getElementById('message');
const draft = document.getElementById('draft');
const inputStatus = document.getElementById('input-status');
const outputStatus = document.getElementById('output-status');
const result = document.getElementById('result');
const empty = document.getElementById('empty');

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

document.querySelectorAll('[data-example]').forEach((button) => {
  button.addEventListener('click', () => {
    message.value = examples[button.dataset.example];
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

  const analysis = analyzeOrder(order);
  for (const field of ['product', 'quantity', 'deadline']) {
    document.getElementById(field).textContent = analysis[field];
  }
  const questions = analysis.questions.length ? analysis.questions : ['Nenhuma pergunta adicional sugerida.'];
  document.getElementById('questions').replaceChildren(...questions.map((question) => {
    const item = document.createElement('li');
    item.textContent = question;
    return item;
  }));
  draft.value = analysis.reply;
  inputStatus.textContent = '';
  outputStatus.textContent = '';
  empty.hidden = true;
  result.hidden = false;
  document.getElementById('output-title').focus();
});

document.getElementById('copy-prompt').addEventListener('click', () => {
  copy(makePrompt(message.value.trim() || '[Cole aqui a mensagem do cliente]'), inputStatus);
});
document.getElementById('copy-draft').addEventListener('click', () => {
  if (!draft.value.trim()) {
    outputStatus.textContent = 'Escreva uma resposta antes de copiar.';
    draft.focus();
    return;
  }
  copy(draft.value, outputStatus);
});
