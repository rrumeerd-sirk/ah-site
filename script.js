// Minimal JS: no external functionality requested. Keep interactive hooks for future.
document.addEventListener('DOMContentLoaded', () => {
  const voucher = document.querySelector('.voucher-cta');
  if (voucher) {
    voucher.addEventListener('click', () => {
      // For demo: show a short visual feedback
      voucher.style.transform = 'scale(0.98)';
      setTimeout(() => voucher.style.transform = '', 180);
    });
  }
});
