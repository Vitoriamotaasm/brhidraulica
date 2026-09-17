# Monta as páginas HTML a partir dos parciais em _partials/
# Uso:  powershell -ExecutionPolicy Bypass -File build.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$p    = Join-Path $root '_partials'
$utf8 = New-Object System.Text.UTF8Encoding($false)   # UTF-8 sem BOM

function Read-Utf8($path)        { [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8) }
function Write-Utf8($path, $txt) { [System.IO.File]::WriteAllText($path, $txt, $utf8) }

$head   = Read-Utf8 (Join-Path $p 'head.html')
$header = Read-Utf8 (Join-Path $p 'header.html')
$footer = Read-Utf8 (Join-Path $p 'footer.html')

$pages = @(
  @{ file='quem-somos.html'; body='body-quem-somos.html';
     title='Quem Somos | BR Hidráulica';
     desc='Há 20 anos a BR Hidráulica une agilidade, precisão e confiabilidade em hidráulica, pneumática e usinagem. Conheça nossa missão, visão, valores e diferenciais.' },
  @{ file='servicos.html'; body='body-servicos.html';
     title='Serviços | Usinagem, Cilindros, Manutenção e Mangueiras | BR Hidráulica';
     desc='Usinagem, fabricação de cilindros, manutenção industrial, montagem de mangueiras, controle de contaminação e projetos hidráulicos no Ceará.' },
  @{ file='produtos.html'; body='body-produtos.html';
     title='Produtos | Mangueiras Hidráulicas, CEJN e PNEUMAX | BR Hidráulica';
     desc='Mangueiras hidráulicas, industriais e especiais, conexões, engates rápidos CEJN e componentes pneumáticos PNEUMAX. Distribuidor autorizado no Ceará.' },
  @{ file='contato.html'; body='body-contato.html';
     title='Contato | BR Hidráulica — Caucaia (Pecém) e Fortaleza';
     desc='Fale com a BR Hidráulica. Matriz na Estrada do Pecém, Caucaia/CE e filial no Mondubim, Fortaleza/CE. Atendimento técnico 24 horas.' }
)

foreach ($pg in $pages) {
  $body = Read-Utf8 (Join-Path $p $pg.body)
  $html = $head.Replace('{{TITLE}}', $pg.title).Replace('{{DESC}}', $pg.desc)
  $html = $html + "`r`n" + $header + "`r`n" + $body + "`r`n" + $footer
  Write-Utf8 (Join-Path $root $pg.file) $html
  Write-Host ("gerado: " + $pg.file)
}
Write-Host 'OK'
