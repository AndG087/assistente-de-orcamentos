# Assistente de orçamentos para gráficas

Protótipo para gráficas rápidas que recebem pedidos pelo WhatsApp. A página transforma a mensagem em uma ficha com um item por produto e prepara uma resposta que a equipe pode revisar e copiar.

[**Experimentar a demo**](https://andg087.github.io/assistente-de-orcamentos/)

![Ficha editável de um pedido com 1.000 panfletos e 200 cartões de visita, com rascunho para WhatsApp](assets/demo.png)

## Experimente

1. Escolha **Pedido com dois produtos** ou cole uma mensagem de exemplo.
2. Clique em **Montar ficha** e confira produto, quantidade, tamanho, impressão, arte e prazo de cada item.
3. Corrija os campos ou adicione itens manualmente. Clique em **Atualizar resposta** para incorporar as mudanças.
4. Revise o rascunho e clique em **Copiar resposta**.

## Como funciona

A prévia usa regras de texto para identificar cartões de visita, panfletos e banners no navegador. As regras cobrem exemplos como correções de quantidade, prazos com horário e prazos explicitamente compartilhados com expressões como “tudo pra sexta”. Campos vazios aparecem como **A confirmar**. Pedidos fora dos formatos reconhecidos podem exigir correção manual. A equipe continua responsável por preço, disponibilidade e envio da resposta.

O botão **Copiar prompt para IA** prepara o mesmo pedido para testar em um chat de IA externo. A página não faz chamadas a modelos nem envia a mensagem do cliente. Para testes em um chat externo, use exemplos fictícios ou anonimizados.

## Rode no seu computador

Baixe ou clone o repositório e abra `index.html` no navegador. A página usa HTML, CSS e JavaScript, sem instalação de dependências.

```text
index.html          Interface do assistente
assets/styles.css   Estilos da página
js/orcamento.js     Regras de extração e prompt para IA
js/app.js           Interações da interface e cópia do texto
tests/              Casos de referência e testes das regras
```

Para rodar os testes, use Node.js 22 ou superior:

```sh
node --test
```

## Avaliação e piloto

Os [15 pedidos fictícios de referência](tests/casos-de-pedido.json) incluem vários produtos, abreviações, correções e campos ambíguos. Cada pedido tem uma ficha esperada. Campos omitidos no arquivo representam informações a confirmar. Para comparar com um modelo de IA, use os mesmos pedidos e conte acertos, omissões e informações sem suporte na mensagem. Registre o modelo e a data do teste junto aos resultados.

Em um piloto com uma gráfica, meça quanto tempo leva para preparar a resposta manualmente e quanto tempo leva para revisar a ficha e o rascunho. Registre os campos e as perguntas que precisaram de correção.
