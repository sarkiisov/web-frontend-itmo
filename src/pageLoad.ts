export default (function () {
  const loadTimeValue = document.querySelector('.load-time__value');
  const startTime = (new Date()).getTime();

  window.addEventListener('load', () => {
    const duration = ((new Date()).getTime() - startTime) / 1000;
    loadTimeValue.textContent = duration.toString();
  });
}());
