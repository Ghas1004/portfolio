$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefix = "http://127.0.0.1:8080/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "Serving $root at $prefix"
$mimes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $path = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath)
  if ($path -eq "/") { $path = "/index.html" }
  $full = Join-Path $root ($path.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar))
  if (Test-Path $full -PathType Leaf) {
    $bytes = [IO.File]::ReadAllBytes($full)
    $ext = [IO.Path]::GetExtension($full).ToLower()
    $context.Response.ContentType = $mimes[$ext]
    if (-not $context.Response.ContentType) { $context.Response.ContentType = "application/octet-stream" }
    $context.Response.StatusCode = 200
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $msg = [Text.Encoding]::UTF8.GetBytes("Not found")
    $context.Response.StatusCode = 404
    $context.Response.OutputStream.Write($msg, 0, $msg.Length)
  }
  $context.Response.Close()
}
