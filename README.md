# BR Hidráulica — site institucional

Site estático (HTML + CSS + JS puro, sem dependências ou build de terceiros).
Conteúdo, imagens e vídeo extraídos do site atual `brhidraulica.com.br`;
linguagem visual inspirada em `globalhp.com.br` (base escura industrial,
tipografia condensada Kanit, cor de destaque forte), com a identidade verde
`#02381A` + amarelo `#EDCD1F` da própria BR.

## Estrutura

```
index.html          Home
quem-somos.html     História, missão/visão/valores, diferenciais
servicos.html       Os 6 serviços + FAQ
produtos.html       Mangueiras, conexões, CEJN, PNEUMAX
contato.html        Formulário, unidades e mapas

assets/css/style.css   Design system completo
assets/js/main.js      Interações
assets/img/            Imagens do site atual (otimizadas)
assets/video/          Vídeo institucional

_partials/          Fontes das páginas internas (head/header/footer/body-*)
build.ps1           Gera as 4 páginas internas a partir de _partials/
```

## Como rodar

Abrir `index.html` direto no navegador funciona, mas para os mapas e o vídeo
carregarem corretamente, sirva por HTTP:

```bash
python -m http.server 5173
```

Depois acesse `http://localhost:5173`.

## Como editar

- **Home**: editar `index.html` diretamente.
- **Páginas internas**: editar os arquivos em `_partials/` e rodar o build:

```bash
powershell -ExecutionPolicy Bypass -File build.ps1
```

> O cabeçalho e o rodapé de `index.html` são a fonte da verdade. Se você alterá-los
> lá, reextraia os parciais antes de rodar o build (ver bloco no fim deste arquivo).

- **Cores, fontes, espaçamentos**: variáveis no topo de `assets/css/style.css`.

## Interações implementadas

| Recurso | Onde |
|---|---|
| Slider do hero (3 slides, Ken Burns, dots) | Home |
| Barra de progresso de rolagem | Todas |
| Header que encolhe ao rolar | Todas |
| Mega menu de Serviços e Produtos | Todas (desktop) |
| Menu lateral mobile | Todas |
| Contadores animados | Home, Quem Somos |
| Reveal on scroll (IntersectionObserver) | Todas |
| Cards de serviço com descrição em hover | Home |
| Abas de produtos | Home |
| Marquee de clientes | Home |
| Acordeão de FAQ | Serviços |
| Vídeo institucional com play customizado | Home |
| Formulário que monta a mensagem e abre o WhatsApp | Contato |
| Botão flutuante de WhatsApp e voltar ao topo | Todas |

Há fallbacks: se o `IntersectionObserver` não disparar, tudo aparece após 3s;
sem JavaScript, o `<noscript>` desliga as animações e mostra todo o conteúdo.

## Dados usados (do site atual)

- Matriz: Estrada do Pecém, km 19, nº 4730 — Matões, Caucaia/CE, CEP 61.680-990
  · (85) 3368-3081 · WhatsApp (85) 98956-8914
- Filial: Av. Benjamim Brasil, nº 280 — Mondubim, Fortaleza/CE, CEP 60.711-442
  · (85) 3512-5280
- RH: rh@brhidraulica.com.br
- Distribuidor autorizado: GATES, CEJN, PNEUMAX, ALFAGOMMA (+ Polyhose nas mangueiras)

## Pendências / o que checar antes de publicar

- Um logo de cliente (`assets/img/cli-01.png`) não teve a marca identificada com
  certeza — está com `alt` genérico. Confirmar o nome com a BR.
- O formulário de contato envia via WhatsApp (não há backend). Se quiser envio por
  e-mail, é preciso um endpoint/serviço de formulário.
- A newsletter do rodapé é apenas visual — precisa ser ligada a uma ferramenta.
- Os textos de blog/"Conteúdo" apontam para o blog do site atual.

### Reextrair header/footer depois de editar `index.html`

```powershell
$root = "."; $utf8 = New-Object System.Text.UTF8Encoding($false)
$c = [IO.File]::ReadAllText("$root\index.html", [Text.Encoding]::UTF8)
$a = $c.IndexOf('<div class="progressbar">')
$b = $c.IndexOf('<!-- ================= HERO')
$f = $c.IndexOf('<!-- ================= FOOTER')
[IO.File]::WriteAllText("$root\_partials\header.html", $c.Substring($a, $b-$a), $utf8)
[IO.File]::WriteAllText("$root\_partials\footer.html", $c.Substring($f), $utf8)
```
# brhidraulica
