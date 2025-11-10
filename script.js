// ==== DATA ====
const products = [
    { id: 1, name: "Wireless Headphones", price: 79.99, category: "Electronics", description: "Premium over-ear headphones with active noise cancellation.", image: "https://picsum.photos/seed/headphones/400/400", reviews: [{user:"Alex", rating:5, text:"Amazing sound!"}] },
    { id: 2, name: "Smartphone Pro", price: 899.99, category: "Electronics", description: "Latest flagship phone with triple camera.", image: "https://picsum.photos/seed/phone/400/400", reviews: [{user:"Sam", rating:4, text:"Great performance."}] },
    { id: 3, name: "Gaming Laptop", price: 1499.99, category: "Electronics", description: "RTX 4080, 16GB RAM, perfect for gaming.", image: "https://picsum.photos/seed/laptop/400/400", reviews: [] },
    { id: 4, name: "Smartwatch Fit", price: 249.99, category: "Electronics", description: "Track fitness, heart rate, sleep.", image: "https://picsum.photos/seed/watch/400/400", reviews: [] },
    { id: 5, name: "Cotton T-Shirt", price: 19.99, category: "Clothing", description: "Soft, breathable 100% cotton tee.", image: "https://picsum.photos/seed/tshirt/400/400", reviews: [] },
    { id: 6, name: "Slim Jeans", price: 59.99, category: "Clothing", description: "Comfortable stretch denim.", image: "https://picsum.photos/seed/jeans/400/400", reviews: [] },
    { id: 7, name: "Running Sneakers", price: 89.99, category: "Clothing", description: "Lightweight, cushioned soles.", image: "https://picsum.photos/seed/sneakers/400/400", reviews: [] },
    { id: 8, name: "Leather Jacket", price: 149.99, category: "Clothing", description: "Classic biker style genuine leather.", image: "https://picsum.photos/seed/jacket/400/400", reviews: [] },
    { id: 9, name: "Coffee Maker", price: 69.99, category: "Home", description: "Programmable drip coffee maker.", image: "https://picsum.photos/seed/coffee/400/400", reviews: [] },
    { id: 10, name: "Blender Pro", price: 49.99, category: "Home", description: "1000W motor, perfect for smoothies.", image: "https://picsum.photos/seed/blender/400/400", reviews: [] },
    { id: 11, name: "Robot Vacuum", price: 299.99, category: "Home", description: "Smart mapping, app control.", image: "https://picsum.photos/seed/vacuum/400/400", reviews: [] },
    { id: 12, name: "LED Desk Lamp", price: 34.99, category: "Home", description: "Touch control, 5 brightness levels.", image: "https://picsum.photos/seed/lamp/400/400", reviews: [] }
];

let currentProduct = null;

// ==== STORAGE ====
const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
const saveCart = (cart) => { localStorage.setItem('cart', JSON.stringify(cart)); updateCartBadge(); };
const getWishlist = () => JSON.parse(localStorage.getItem('wishlist') || '[]');
const saveWishlist = (wish) => { localStorage.setItem('wishlist', JSON.stringify(wish)); updateWishlistBadge(); };
const getRecentlyViewed = () => JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
const saveRecentlyViewed = (arr) => localStorage.setItem('recentlyViewed', JSON.stringify(arr));

// ==== BADGES ====
const updateCartBadge = () => document.getElementById('cart-count').textContent = getCart().reduce((s,i)=>s+i.qty,0);
const updateWishlistBadge = () => document.getElementById('wishlist-count').textContent = getWishlist().length;

// ==== RENDER CARD ====
const renderProductCard = (p) => {
    const inWish = getWishlist().includes(p.id);
    return `
        <div class="product-card fade-in" onclick="showProduct(${p.id})">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="price">$${p.price.toFixed(2)}</p>
                <div class="product-actions">
                    <i class="fas fa-shopping-cart" onclick="event.stopPropagation(); addToCart(${p.id})"></i>
                    <i class="${inWish ? 'fas' : 'far'} fa-heart" onclick="event.stopPropagation(); toggleWishlist(${p.id})"></i>
                </div>
            </div>
        </div>
    `;
};

// ==== NAVIGATION ====
const showSection = (sec) => {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sec).classList.add('active');
    if (sec === 'home') loadHome();
    if (sec === 'shop') loadShop();
    if (sec === 'cart') loadCart();
    if (sec === 'wishlist') loadWishlist();
    window.scrollTo(0, 0);
};

// ==== HOME ====
const loadHome = () => {
    const featured = products.slice(0, 8);
    document.getElementById('featured-products').innerHTML = featured.map(renderProductCard).join('');
};

// ==== SHOP ====
const loadShop = () => applyFilters();
const applyFilters = () => {
    const cat = document.getElementById('category-filter').value;
    const search = document.getElementById('search-input').value.toLowerCase();
    let filtered = products;
    if (cat) filtered = filtered.filter(p => p.category === cat);
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
    document.getElementById('all-products').innerHTML = filtered.map(renderProductCard).join('');
};
const filterCategory = (cat) => {
    showSection('shop');
    document.getElementById('category-filter').value = cat;
    applyFilters();
};

// ==== PRODUCT DETAIL ====
const showProduct = (id) => {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;
    document.getElementById('main-image').src = currentProduct.image;
    document.getElementById('product-name').textContent = currentProduct.name;
    document.getElementById('product-price').textContent = '$' + currentProduct.price.toFixed(2);
    document.getElementById('product-description').textContent = currentProduct.description;

    const revHTML = currentProduct.reviews.map(r => `
        <div style="margin:1rem 0;padding:1rem;background:#f8f9fa;border-radius:8px;">
            <p><strong>${r.user}</strong> ${'5 Stars'.substring(0,r.rating)}</p>
            <p>${r.text}</p>
        </div>
    `).join('') || '<p>No reviews yet.</p>';
    document.getElementById('reviews').innerHTML = revHTML;

    const related = products.filter(p => p.category === currentProduct.category && p.id !== id).slice(0,4);
    document.getElementById('related-products').innerHTML = related.map(renderProductCard).join('');

    addToRecentlyViewed(id);
    const recent = getRecentlyViewed().map(rid => products.find(p=>p.id===rid)).filter(Boolean).slice(0,8);
    document.getElementById('recently-viewed').innerHTML = recent.map(renderProductCard).join('');

    showSection('product-detail');
};
const addToRecentlyViewed = (id) => {
    let arr = getRecentlyViewed();
    arr = arr.filter(x => x !== id);
    arr.unshift(id);
    saveRecentlyViewed(arr.slice(0,12));
};

// ==== CART ====
const addToCart = (id) => {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) item.qty++;
    else cart.push({id, qty:1});
    saveCart(cart);
    alert('Added to cart!');
};
const loadCart = () => {
    const cart = getCart();
    if (cart.length === 0) {
        document.getElementById('cart-items').innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('cart-total').textContent = '0.00';
        document.getElementById('recommended-products').innerHTML = '';
        return;
    }
    let html = '', total = 0;
    cart.forEach(item => {
        const p = products.find(pr => pr.id === item.id);
        if (!p) return;
        total += p.price * item.qty;
        html += `
            <div class="cart-item">
                <img src="${p.image}" alt="${p.name}" />
                <div class="cart-item-info">
                    <h4>${p.name}</h4>
                    <p>$${p.price.toFixed(2)} × ${item.qty}</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="changeQty(${p.id}, -1)">–</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${p.id}, 1)">+</button>
                </div>
                <i class="fas fa-trash" style="margin-left:1rem;color:var(--accent);cursor:pointer;" onclick="removeFromCart(${p.id})"></i>
            </div>
        `;
    });
    document.getElementById('cart-items').innerHTML = html;
    document.getElementById('cart-total').textContent = total.toFixed(2);

    const cartCats = [...new Set(cart.map(it => products.find(pr=>pr.id===it.id)?.category).filter(Boolean))];
    const recs = products.filter(p => cartCats.includes(p.category) && !cart.some(it=>it.id===p.id)).sort(()=>0.5-Math.random()).slice(0,4);
    document.getElementById('recommended-products').innerHTML = recs.map(renderProductCard).join('');
};
const changeQty = (id, delta) => {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        saveCart(cart);
        loadCart();
    }
};
const removeFromCart = (id) => {
    saveCart(getCart().filter(i => i.id !== id));
    loadCart();
};

// ==== WISHLIST ====
const toggleWishlist = (id) => {
    let wish = getWishlist();
    if (wish.includes(id)) wish = wish.filter(x => x !== id);
    else wish.push(id);
    saveWishlist(wish);
    if (document.getElementById('product-detail').classList.contains('active')) showProduct(currentProduct.id);
    if (document.getElementById('wishlist').classList.contains('active')) loadWishlist();
    if (document.getElementById('shop').classList.contains('active')) applyFilters();
};
const loadWishlist = () => {
    const wish = getWishlist();
    if (wish.length === 0) {
        document.getElementById('wishlist-items').innerHTML = '<p>Your wishlist is empty.</p>';
        return;
    }
    const items = wish.map(id => products.find(p=>p.id===id)).filter(Boolean);
    document.getElementById('wishlist-items').innerHTML = items.map(renderProductCard).join('');
};

// ==== CHECKOUT ====
const completeCheckout = () => {
    alert('Thank you! Your order is complete. (Demo)');
    localStorage.removeItem('cart');
    updateCartBadge();
    showSection('home');
};

// ==== SEARCH & MENU ====
document.getElementById('search-input').addEventListener('input', () => {
    if (document.getElementById('shop').classList.contains('active')) applyFilters();
    else { showSection('shop'); applyFilters(); }
});
const toggleMenu = () => document.getElementById('nav-menu').classList.toggle('open');

// ==== INIT ====
window.onload = () => {
    updateCartBadge();
    updateWishlistBadge();
    showSection('home');
    document.querySelectorAll('.product-card, .testimonial, .category-card').forEach((el,i) => {
        el.style.animationDelay = `${i*0.1}s`;
    });
};