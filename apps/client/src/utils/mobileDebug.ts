// add to apps/client/indext.html for local mobile debugging
window.onerror = (a, b, c, d, e) => {
  alert(`${a} source: ${b} lineno: ${c} colno: ${d} error: ${e}`)
  return true
}

window.onunhandledrejection = (event: PromiseRejectionEvent) => {
  alert(event.reason)
}
