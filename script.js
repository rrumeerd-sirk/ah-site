document.addEventListener('DOMContentLoaded', () => {
  const device = document.querySelector('.device');

  device.addEventListener('mousemove', (event) => {
    const rect = device.getBoundingClientRect();
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 3.5;
    const rotateX = (0.5 - (event.clientY - rect.top) / rect.height) * 2.5;
    device.style.transform = `rotate(${rotateX * 0.8 - 2}deg) rotateY(${rotateY}deg)`;
  });

  device.addEventListener('mouseleave', () => {
    device.style.transform = 'rotate(-2deg)';
  });
});
