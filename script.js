document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      button.style.transform = 'translateY(1px) scale(0.98)';
      setTimeout(() => {
        button.style.transform = '';
      }, 140);
    });
  });
});
