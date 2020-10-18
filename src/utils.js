export function updateUI(value, el) {
  let stringVal;
  if (typeof value === 'number') {
    stringVal = `${parseInt(value).toFixed()}`;
  } else {
    stringVal = value;
  }
  el.innerText = value;
}
