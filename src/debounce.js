function debounce(fn, delay) {
  let timeout = null;
  return function debouncer(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => { fn.apply(this, args); }, delay); // eslint-disable-line no-invalid-this
  };
}

function debounceDirective(el, binding) {
  if (binding.value === binding.oldValue) return;
  el.oninput = debounce(() => {
    el.dispatchEvent(new Event('change'));
  }, parseInt(binding.value) || 500);
}

debounceDirective.debounce = debounce;
module.exports = debounceDirective;
