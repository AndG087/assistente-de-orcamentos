# Avaliação de extração de pedidos

Em 16 de novembro de 2026, comparei as regras da demo com o `llama3.2:1b` no Ollama 0.40.12. O teste avalia somente a extração de produto, quantidade, tamanho, impressão, arte e prazo.

## Resultados

| Pedidos | Abordagem | Fichas exatas | Campos preenchidos corretos | Omitidos | Incorretos | Sem apoio |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 15 casos de regressão | Regras | 15/15 | 68/68 | 0 | 0 | 0 |
| 15 casos de regressão | Llama 3.2 1B | 0/15 | 32/68 | 6 | 30 | 36 |
| 8 pedidos novos | Regras | 2/8 | 35/41 | 5 | 1 | 1 |
| 8 pedidos novos | Llama 3.2 1B | 0/8 | 22/41 | 4 | 15 | 8 |

Nos pedidos novos, as regras deixaram escapar a quantidade em “Panfletos: 350”, mantiveram sexta quando o cliente corrigiu o prazo para segunda às 10h e escolheram A5 quando o cliente ainda estava entre A5 e A6. O modelo reconheceu “cartoes de visita” sem acento e extraiu a quantidade, mas trocou “para terça” por uma data de 2023. Em um pedido de banner com a arte pronta, a única divergência do modelo foi preencher a impressão com “frente e verso” sem que a mensagem dissesse isso.

Eu manteria as regras na demo e corrigiria primeiro a troca de prazo e a escolha de um formato que o cliente ainda está decidindo. Esses erros podem passar despercebidos na revisão porque o campo aparece preenchido.

## Método

- Os [15 casos de regressão](../tests/casos-de-pedido.json) já eram usados para verificar as regras. Os [8 pedidos novos](casos-novos.json) foram definidos antes da rodada para exercitar outras formas de escrever pedidos e possíveis ambiguidades. Todos são fictícios.
- O [script da avaliação](avaliar.cjs) enviou ao modelo uma mensagem por chamada, sem as respostas esperadas nem histórico de outros pedidos. A rodada usou JSON com esquema fixo, temperatura `0`, semente `42` e a versão quantizada `Q8_0` do modelo, identificada pelo digest `baf6a787fdff`. [Documentação da saída estruturada do Ollama](https://docs.ollama.com/capabilities/structured-outputs)
- A comparação alinha os itens pela ordem informada e normaliza diferenças como `1.500` e `1500`, `9h30` e `09:30`, ou medidas equivalentes. Uma ficha exata exige o número correto de itens, todos os campos informados corretos e os demais vazios. **Omitido** é um campo esperado que ficou em branco. **Incorreto** é um campo esperado preenchido com outro valor. **Sem apoio** é um campo preenchido quando deveria ficar em branco.
- O modelo devolveu JSON válido nos 23 pedidos. Nos casos de regressão, deixou dois itens de fora e acrescentou um que a ficha esperada não tinha. O [resultado por pedido](llama3.2-1b.json) guarda as saídas e divergências.

Os pedidos novos foram escolhidos para investigar problemas específicos. Esta rodada pequena, com um modelo local de 1B e um único prompt, não estima o desempenho em pedidos reais nem o de outros modelos. O rascunho de WhatsApp e o tempo economizado na gráfica ficam para o piloto.

## Como repetir

Na raiz do repositório, com Node.js 22 ou superior, rode a avaliação das regras:

```sh
node avaliacao/avaliar.cjs
```

Com Ollama rodando localmente e o modelo instalado, gere a comparação em JSON:

```sh
node avaliacao/avaliar.cjs llama3.2:1b > resultado-local.json
```
