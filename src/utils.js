export function updateUI(value, el) {
  if (typeof value === 'number') {
    const trimNumber = parseInt(value).toFixed();
    el.innerText = `${trimNumber}`;
    return el;
  }
  if (typeof value === 'string') {
    el.innerText = value;
    return el;
  }
  return el;
}
