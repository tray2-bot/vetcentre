document.addEventListener("DOMContentLoaded", () => {
  /* --------- SLIDER --------- */
  const slides = document.querySelectorAll('.slide');
  let slideIndex = 0;

  function showNextSlide() {
    if (slides.length === 0) return;
    slides.forEach(slide => slide.classList.remove('active'));
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
  }

  setInterval(showNextSlide, 5000);

  /* -- DEV animation replay on phone click -- */
  const phone = document.querySelector('.chat');
  if (phone) {
    phone.addEventListener('click', () => {
      phone.classList.remove('animate');
      void phone.offsetWidth; // trigger reflow
      phone.classList.add('animate');
    });
  }

  /* --------- MOBILE MENU --------- */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      if (mobileMenu.style.left === '0px') {
        mobileMenu.style.left = '-260px';
      } else {
        mobileMenu.style.left = '0px';
      }
    });
  }

  document.querySelectorAll('.mobile-dropdown button').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.classList.toggle('open');
    });
  });

  /* --------- TABS --------- */
  const tabs = document.querySelectorAll('.petstab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetSelector = tab.dataset.target;
      if (targetSelector) {
        const targetContent = document.querySelector(targetSelector);
        if (targetContent) targetContent.classList.add('active');
      }
    });
  });

  /* --------- REGISTER FORM --------- */
  const petGender = document.getElementById('petGender');
  const pregnantSection = document.getElementById('pregnantSection');
  const petForm = document.getElementById('petForm');
  const successMessage = document.getElementById('successMessage');

  if (petGender && pregnantSection) {
    petGender.addEventListener('change', () => {
      if (petGender.value === 'female') {
        pregnantSection.classList.remove('hidden');
      } else {
        pregnantSection.classList.add('hidden');
      }
    });
  }

  if (petForm && successMessage && pregnantSection) {
    petForm.addEventListener('submit', e => {
      e.preventDefault();
      successMessage.classList.remove('hidden');
      successMessage.scrollIntoView({ behavior: 'smooth' });
      petForm.reset();
      pregnantSection.classList.add('hidden');

      setTimeout(() => {
        successMessage.classList.add('hidden');
      }, 4000);
    });
  }

  /* --------- PET BREEDS --------- */
  const petType = document.getElementById('petType');
  const petBreed = document.getElementById('petBreed');

  const petBreeds = {
    Dog: ["Labrador Retriever", "German Shepherd", "Bulldog", "Poodle", "Golden Retriever", "Beagle", "Rottweiler", "Chihuahua", "Dachshund", "Shih Tzu"],
    Cat: ["Persian", "Maine Coon", "Siamese", "Bengal", "Sphynx", "British Shorthair", "Ragdoll", "Abyssinian", "Scottish Fold", "Oriental"],
    Turtle: ["Red-Eared Slider", "Painted Turtle", "Box Turtle", "Map Turtle", "Snapping Turtle"],
    Hamster: ["Syrian", "Dwarf Campbell Russian", "Winter White", "Chinese", "Roborovski"],
    Rabbit: ["Netherland Dwarf", "Holland Lop", "Lionhead", "Mini Rex", "Flemish Giant"],
    Bird: ["Parrot", "Canary", "Cockatiel", "Lovebird", "Budgerigar"],
    Fish: ["Goldfish", "Betta", "Guppy", "Molly", "Tetra", "Angelfish"],
    Lizard: ["Gecko", "Iguana", "Chameleon", "Bearded Dragon", "Anole"],
    Other: ["Mixed Breed", "Unknown", "Exotic"]
  };

  if (petType && petBreed) {
    petType.addEventListener('change', () => {
      const breeds = petBreeds[petType.value] || [];
      petBreed.innerHTML = '<option value="">Select Pet Breed</option>';
      breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed;
        option.textContent = breed;
        petBreed.appendChild(option);
      });
    });
  }

  /* --------- CART --------- */

  const cartIcon = document.getElementById('cartIcon');
  const cartPanel = document.getElementById('cartPanel');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartCloseBtn = document.getElementById('cartClose');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const panelItemCount = document.getElementById('panelItemCount');
  const subtotalAmount = document.getElementById('subtotalAmount');

  // Load cart from localStorage or init empty
  let cart = {};
  const savedCart = localStorage.getItem('myCart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch {
      cart = {};
    }
  }

  function formatNaira(n) {
    return '₦' + Number(n).toLocaleString();
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  }

  function recalcUI() {
    const ids = Object.keys(cart);
    const totalQty = ids.reduce((sum, id) => sum + cart[id].qty, 0);
    const subtotal = ids.reduce((sum, id) => sum + cart[id].price * cart[id].qty, 0);

    if (cartCount) cartCount.textContent = totalQty;
    if (panelItemCount) panelItemCount.textContent = totalQty;
    if (subtotalAmount) subtotalAmount.textContent = formatNaira(subtotal);

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    if (ids.length === 0) {
      cartItemsContainer.innerHTML = '<p style="color:#777">Your cart is empty.</p>';
      return;
    }

    ids.forEach(id => {
      const it = cart[id];
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.dataset.id = id;
      itemEl.innerHTML = `
        <img class="cart-img" src="${it.img}" alt="${escapeHtml(it.title)}" />
        <div class="cart-details">
          <div class="cart-title">${escapeHtml(it.title)}</div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
            <div class="qty-control">
              <button class="qty-decr" data-id="${id}">-</button>
              <span class="qty-num">${it.qty}</span>
              <button class="qty-incr" data-id="${id}">+</button>
            </div>
            <div style="text-align:right;">
              <div class="cart-price">${formatNaira(it.price * it.qty)}</div>
            </div>
          </div>
        </div>
        <div>
          <button class="remove-item" data-id="${id}" title="Remove">×</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    // Attach qty decrement buttons
    cartItemsContainer.querySelectorAll('.qty-decr').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        if (!cart[id]) return;
        cart[id].qty = Math.max(1, cart[id].qty - 1);
        recalcUI();
      });
    });

    // Attach qty increment buttons
    cartItemsContainer.querySelectorAll('.qty-incr').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        if (!cart[id]) return;
        cart[id].qty += 1;
        recalcUI();
      });
    });

    // Attach remove item buttons
    cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        if (!cart[id]) return;
        delete cart[id];
        recalcUI();
      });
    });

    // Save cart to localStorage after every UI update
    localStorage.setItem('myCart', JSON.stringify(cart));
  }

  function openCart() {
    if (cartPanel) {
      cartPanel.classList.add('open');
      cartPanel.setAttribute('aria-hidden', 'false');
    }
    if (cartOverlay) {
      cartOverlay.classList.add('visible');
    }
  }

  function closeCart() {
    if (cartPanel) {
      cartPanel.classList.remove('open');
      cartPanel.setAttribute('aria-hidden', 'true');
    }
    if (cartOverlay) {
      cartOverlay.classList.remove('visible');
    }
  }

  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      recalcUI();
      openCart();
    });
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  // Add to cart buttons
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      const card = e.currentTarget.closest('.wet-product');
      if (!card) return;

      const id = card.dataset.id || (Math.random() + '').slice(2);
      const title = card.dataset.title || card.querySelector('.wet-title')?.innerText || 'Product';
      const priceText = card.dataset.price || card.querySelector('.price')?.innerText || '0';
      const price = Number(priceText.toString().replace(/[^0-9]/g, '')) || 0;
      const img = card.querySelector('img')?.src || '';

      if (cart[id]) {
        cart[id].qty += 1;
      } else {
        cart[id] = { id, title, price, qty: 1, img };
      }

      recalcUI();
      openCart();
    });
  });

  // Initialize cart UI on page load
  recalcUI();
});