const products = {
  '8711600837094': { name: 'Banaan', price: 1.79 },
  '8718307002415': { name: 'Yoghurt', price: 2.49 },
  '8718452503178': { name: 'Melk', price: 1.99 },
  '8712565007314': { name: 'Appels', price: 2.29 },
  '8712000372080': { name: 'Koffie', price: 4.99 },
  '8722700411813': { name: 'Pasta', price: 1.69 },
  '8711200630896': { name: 'Brood', price: 2.19 },
  '8711200101311': { name: 'Tomaten', price: 2.89 },
};

const discountMap = {
  AH10: 0.1,
  SPRING: 0.15,
  WELKOM: 0.05,
};

const state = {
  cart: {},
  discount: 0,
};

const barcodeInput = document.getElementById('barcodeInput');
const scanButton = document.getElementById('scanButton');
const statusMessage = document.getElementById('statusMessage');
const cartList = document.getElementById('cartList');
const itemCount = document.getElementById('itemCount');
const subtotalEl = document.getElementById('subtotal');
const discountEl = document.getElementById('discount');
const totalEl = document.getElementById('total');
const promoCodeInput = document.getElementById('promoCode');
const applyPromoButton = document.getElementById('applyPromo');
const checkoutButton = document.getElementById('checkoutButton');

function formatMoney(value) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

function showStatus(message, type = '') {
  statusMessage.textContent = message;
  statusMessage.className = 'status-message';
  if (type) {
    statusMessage.classList.add(type);
  }
}

function updateSummary() {
  const itemValues = Object.values(state.cart);
  const subtotal = itemValues.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(subtotal - state.discount, 0);

  subtotalEl.textContent = formatMoney(subtotal);
  discountEl.textContent = `-${formatMoney(state.discount)}`;
  totalEl.textContent = formatMoney(total);
  itemCount.textContent = `${itemValues.reduce((sum, item) => sum + item.quantity, 0)} items`;
}

function renderCart() {
  const items = Object.values(state.cart);

  if (!items.length) {
    cartList.innerHTML = `
      <li class="empty-state">
        <div>
          <strong>Je winkelmand is leeg</strong><br />
          Scan een product om te beginnen.
        </div>
      </li>
    `;
    updateSummary();
    return;
  }

  cartList.innerHTML = items
    .map(
      (item) => `
        <li class="cart-item">
          <div class="item-info">
            <span class="item-name">${item.name}</span>
            <span class="item-meta">${item.quantity} x ${formatMoney(item.price)}</span>
          </div>
          <span class="item-price">${formatMoney(item.price * item.quantity)}</span>
          <button class="remove-btn" type="button" data-code="${item.code}" aria-label="Verwijder ${item.name}">×</button>
        </li>
      `
    )
    .join('');

  document.querySelectorAll('.remove-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const code = event.currentTarget.dataset.code;
      if (!state.cart[code]) return;

      if (state.cart[code].quantity > 1) {
        state.cart[code].quantity -= 1;
      } else {
        delete state.cart[code];
      }

      renderCart();
      showStatus('Product verwijderd uit de winkelmand.', 'success');
    });
  });

  updateSummary();
}

function addProduct(code) {
  const normalizedCode = String(code).trim();

  if (!normalizedCode) {
    showStatus('Voer eerst een barcode in.', 'error');
    return;
  }

  const product = products[normalizedCode];

  if (!product) {
    showStatus('Product niet gevonden. Probeer een andere barcode.', 'error');
    return;
  }

  if (!state.cart[normalizedCode]) {
    state.cart[normalizedCode] = { ...product, code: normalizedCode, quantity: 0 };
  }

  state.cart[normalizedCode].quantity += 1;
  renderCart();
  barcodeInput.value = '';
  barcodeInput.focus();
  showStatus(`${product.name} toegevoegd aan je boodschappen.`, 'success');
}

function applyPromo() {
  const code = promoCodeInput.value.trim().toUpperCase();

  if (!code) {
    showStatus('Voer een kortingscode in.', 'error');
    return;
  }

  const discountRate = discountMap[code];

  if (!discountRate) {
    showStatus('Deze kortingscode is niet geldig.', 'error');
    return;
  }

  const subtotal = Object.values(state.cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  state.discount = subtotal * discountRate;
  updateSummary();
  showStatus(`Kortingscode ${code} toegepast.`, 'success');
}

scanButton.addEventListener('click', () => addProduct(barcodeInput.value));
barcodeInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addProduct(barcodeInput.value);
  }
});

applyPromoButton.addEventListener('click', applyPromo);
promoCodeInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    applyPromo();
  }
});

document.querySelectorAll('.chip').forEach((button) => {
  button.addEventListener('click', () => {
    addProduct(button.dataset.code);
  });
});

checkoutButton.addEventListener('click', () => {
  if (!Object.keys(state.cart).length) {
    showStatus('Voeg eerst producten toe voordat je betaalt.', 'error');
    return;
  }

  showStatus('Betaling gestart. Bedankt voor je AH winkelbezoek!', 'success');
});

renderCart();
showStatus('Scanner ready. Scan je eerste product.', 'success');
