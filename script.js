const products = {
    home: [
        {name:"Mixer", price:2500, img:"Images/Mixer.jpg", caption: "Essential Home Appliances"},
        {name:"Washing Machine", price:15000, img:"Images/Washing Machine.jpg", caption: "Powerful Cleaning Solutions"},
        {name:"AC", price:35000, img:"Images/AC.jpg", caption: "Cool Off This Summer"},
        {name:"Fan", price:1500, img:"Images/Fan.jpg", caption: "Cooling Fan Deals"},
        {name:"Water Heater", price:4000, img:"Images/Water Heater.jpg", caption: "Instant Hot Water"}
    ],
    men: [
        {name:"Cotton pant", price:800, img:"Images/Cotton pant.jpg", caption: "Comfortable Men's Cotton"},
        {name:"Jean pant", price:900, img:"Images/Jean pant.jpg", caption: "Durable Denim Jeans"},
        {name:"T shirt", price:400, img:"Images/T shirt.jpg", caption: "Casual T-Shirts"},
        {name:"Shirt", price:500, img:"Images/Shirt.jpg", caption: "Formal and Casual Shirts"},
        {name:"Night pant", price:600, img:"Images/Night pant.jpg", caption: "Sleepwear Collection"}
    ],
    women: [
        {name:"Top", price:900, img:"Images/Top.jpg", caption: "Trendy Tops for Women"},
        {name:"Saree", price:2500, img:"Images/Saree.jpg", caption: "Traditional Indian Sarees"},
        {name:"Lehanga", price:3500, img:"Images/Lehanga.jpg", caption: "Designer Lehengas"},
        {name:"Top & Bottom", price:1200, img:"Images/Top & Bottom.jpg", caption: "Coordinated Sets"},
        {name:"Full top", price:1800, img:"Images/Full top.jpg", caption: "Elegant Full Tops"} 
    ],
    food: [
        {name:"Biriyani", price:300, img:"Images/Biriyani.jpg", caption: "All + Anytime favourite"},
        {name:"Parota", price:300, img:"Images/Parota.jpg", caption: "Flaky, layered perfection!"},
        {name:"Mushroom 65", price:300, img:"Images/Mushroom 65.jpg", caption: "Spicy, crispy, and totally addictive"},
        {name:"Fish fry", price:300, img:"Images/Fish fry.jpg", caption: "Crispy on the outside, tender on the inside"},
        {name:"Vegetable salad", price:150, img:"Images/Vegetable salad.jpg", caption: "Fresh, vibrant, and crunchy"}
    ],
    books: [
        {name:"The psychology of Money", price:250, img:"Images/The psychology of Money.jpg", caption: "Money"},
        {name:"Front end", price:250, img:"Images/Front end.jpg", caption: "Knowledge of Front-end"},
        {name:"Backend development", price:250, img:"Images/Backend development.jpg", caption: "Backend and development"},
        {name:"Database management", price:250, img:"Images/Database management.jpg", caption: "Database with knowledge"},
        {name:"Homeprakash", price:400, img:"Images/Homeprakash.jpg", caption: "Biography and me"}
    ]
};

let cart = [];
let currentSlide = 0;
let slideInterval;
let allCarouselItems = []; 

function generateCarouselItems() {
    let innerHTML = '';
    for (const key in products) {
        products[key].forEach(p => {
            innerHTML += `
                <div class="carousel-item">
                    <img src="${p.img}" alt="${p.name}">
                    <div class="carousel-caption">
                        <h2>${p.caption || p.name}</h2>
                        <p>Check out our amazing deals!</p>
                    </div>
                </div>
            `;
            allCarouselItems.push(p);
        });
    }
    document.querySelector('.carousel-inner').innerHTML = innerHTML;
}

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const inner = document.querySelector('.carousel-inner');
    if (!inner || slides.length === 0) return;
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;
    inner.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function moveSlide(n) {
    showSlide(currentSlide + n);
    resetAutoAdvance();
}

function startAutoAdvance() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => moveSlide(1), 4000); 
}

function resetAutoAdvance() {
    clearInterval(slideInterval);
    startAutoAdvance();
}

function showCarousel(show) {
    const carousel = document.getElementById("imageCarousel");
    if (carousel) {
        carousel.style.display = show ? 'flex' : 'none'; 
        if (show) startAutoAdvance(); 
        else clearInterval(slideInterval); 
    }
}

function getUserFromCookie() {
    const cookies = document.cookie.split("; ");
    for (let c of cookies) {
        if (c.startsWith("username=")) {
            return decodeURIComponent(c.substring("username=".length));
        }
    }
    return null;
}

function setUsernameCookie(username) {
    document.cookie = `username=${encodeURIComponent(username)}; path=/`; 
}

function setUser(productName, productPrice) {
    let user = prompt("Welcome to MyShoppingCart! Please enter your name to continue shopping.");
    if (user && user.trim() !== "") {
        const username = user.trim();
        setUsernameCookie(username);
        document.getElementById("welcomeUser").innerText = "Welcome " + username;
        if (productName && productPrice) _addItemToCart(productName, productPrice);
    }
}

function initialUserCheck() {
    const welcomeEl = document.getElementById("welcomeUser");
    let savedUser = getUserFromCookie();
    if (savedUser && savedUser !== "null" && savedUser !== "") {
        welcomeEl.innerText = "Welcome " + savedUser;
    } else {
        welcomeEl.innerText = "Welcome Guest";
    }
}

function updateCartCount() {
    let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById("cartCount").innerText = totalItems;
}

function hideAllPages() {
    document.getElementById("productSection").style.display = "none";
    document.getElementById("cartPage").style.display = "none";
    document.getElementById("paymentPage").style.display = "none";
    document.getElementById("successPage").style.display = "none";
    showCarousel(false);
}

function showHomePage() {
    hideAllPages();
    document.getElementById("productSection").style.display = 'none'; 
    showCarousel(true); 
}

function showCategory(cat) {
    hideAllPages();
    let section = document.getElementById("productSection");
    let title = cat.charAt(0).toUpperCase() + cat.slice(1);
    section.innerHTML = `<h2 style="grid-column: 1 / -1; text-align: center; margin: 20px 0;">Products in ${title}</h2>`;
    section.style.display = 'grid';

    products[cat].forEach(p => {
        section.innerHTML += `
        <div class="product">
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>Price: ₹${p.price.toLocaleString('en-IN')}</p>
            <button onclick="addToCart('${p.name}', ${p.price})"><i class="bi bi-bag-plus"></i> Add to Cart</button>
        </div>`;
    });
}

function addToCart(name, price) {
    const userName = getUserFromCookie();
    if (!userName) setUser(name, price); 
    else _addItemToCart(name, price);
}

function _addItemToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) existingItem.qty += 1;
    else cart.push({name, price, qty: 1});
    updateCartCount();
    alert(name + " added to cart!");
}

function removeItem(index) {
    if (confirm(`Do you want to remove ${cart[index].name} from the cart?`)) {
        cart.splice(index, 1);
        updateCartCount();
        openCart(); 
    }
}

function updateQuantity(index, inputElement) {
    let newQty = parseInt(inputElement.value);
    if (isNaN(newQty) || newQty < 1) newQty = 1;
    cart[index].qty = newQty;
    updateCartCount();
    openCart();
}

function openCart() {
    hideAllPages();
    document.getElementById("cartPage").style.display = "block";

    let table = document.getElementById("cartTable");
    table.innerHTML = `
        <tr>
            <th>Product</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Action</th>
        </tr>
    `;

    let grandTotal = 0;
    
    if (cart.length === 0) {
        table.innerHTML += `<tr><td colspan="5" style="padding: 30px; color: #6c757d;">Your cart is empty.</td></tr>`;
    } else {
        cart.forEach((item, index) => {
            const subtotal = item.price * item.qty;
            grandTotal += subtotal;

            table.innerHTML += `
                <tr>
                    <td style="text-align: left;">${item.name}</td>
                    <td>₹${item.price.toLocaleString('en-IN')}</td>
                    <td>
                        <input type="number" min="1" value="${item.qty}" class="qty-input" onchange="updateQuantity(${index}, this)"> 
                    </td>
                    <td>₹${subtotal.toLocaleString('en-IN')}</td>
                    <td><button class="remove-btn" onclick="removeItem(${index})"><i class="bi bi-trash"></i> Remove</button></td>
                </tr>`;
        });

        table.innerHTML += `
            <tr class="total-row">
                <td colspan="3" style="text-align:right;"><strong>Grand Total:</strong></td>
                <td colspan="2"><strong>₹${grandTotal.toLocaleString('en-IN')}</strong></td>
            </tr>
        `;
    }
    updateCartCount();
}

function renderPaymentFields(selection) {
    const inputContainer = document.getElementById("paymentInputContainer");
    if (!inputContainer) return; 
    inputContainer.innerHTML = ''; 

    if (selection === 'Card') {
        inputContainer.innerHTML = `
            <input type="text" id="cardNumber" placeholder="16-digit Card Number" maxlength="16" required>
            <div style="display: flex; gap: 10px;">
                <input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5" required style="width: 50%;">
                <input type="password" id="cardCVV" placeholder="CVV" maxlength="4" required style="width: 50%;">
            </div>
        `;
        document.getElementById('cardExpiry').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); 
            if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
            e.target.value = value;
        });
    } else if (selection === 'Wallet') {
        inputContainer.innerHTML = `<input type="tel" id="walletMobile" placeholder="Enter Mobile Number" maxlength="10" required>`;
    } else if (selection === 'UPI') {
        inputContainer.innerHTML = `<input type="text" id="upiId" placeholder="Enter UPI ID (e.g., user@bankname)" required>`;
    }
}

function updatePaymentInputPlaceholder() {
    const selection = document.getElementById("paymentSelect").value;
    renderPaymentFields(selection);
}

function proceedToPayment() {
    if (cart.length === 0) return alert("Your cart is empty.");
    hideAllPages();
    document.getElementById("paymentPage").style.display = "block";
    document.getElementById("paymentSelect").value = "";
    renderPaymentFields(""); 
}

function processPayment() {
    const selection = document.getElementById("paymentSelect").value;
    if (!selection) return alert("Please select a payment method.");
    
    let grandTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    alert(`Payment of ₹${grandTotal.toLocaleString('en-IN')} complete.`);
    paymentSuccess();
}

function paymentSuccess() {
    cart = [];
    updateCartCount(); 
    hideAllPages();
    document.getElementById("successPage").style.display = "block";
    setTimeout(() => { showHomePage(); }, 2000); 
}

function initializeSite() {
    initialUserCheck();
    generateCarouselItems();
    showHomePage(); 
    updateCartCount();
}