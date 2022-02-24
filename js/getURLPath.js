
export function getURLPath(extension) {
  return window.location.protocol + '//' + window.location.host + window.location.pathname + extension;
}