// მენიუს მასივი ზუსტი კოორდინატებით შენი ფოტოდან
        const menuData = [
            { id: 1, name: "ჰამბურგერი", burgerPrice: 5.50, comboPrice: 9.95, bgY: '14.5%' },
            { id: 2, name: "ჩიზბურგერი", burgerPrice: 5.95, comboPrice: 10.50, bgY: '24.2%' },
            { id: 3, name: "ქრანჩ X1", burgerPrice: 9.95, comboPrice: 14.95, bgY: '33.8%' },
            { id: 4, name: "ოკლაჰომა", burgerPrice: 12.95, comboPrice: 17.95, bgY: '43.5%' },
            { id: 5, name: "ჰალაპენიო X1", burgerPrice: 12.95, comboPrice: 17.95, bgY: '53.1%' },
            { id: 6, name: "ბეკონ X1", burgerPrice: 12.95, comboPrice: 17.95, bgY: '62.8%' },
            { id: 7, name: "როიალ ჩიზბურგერი X2", burgerPrice: 14.95, comboPrice: 18.95, bgY: '72.5%' },
            { id: 8, name: "ქრანჩ X2", burgerPrice: 15.95, comboPrice: 20.50, bgY: '82.2%' },
            { id: 9, name: "მექსიკური X2", burgerPrice: 16.95, comboPrice: 20.95, bgY: '14.5%', isRightCol: true },
            { id: 10, name: "ჰალაპენიო X2", burgerPrice: 16.95, comboPrice: 20.95, bgY: '24.2%', isRightCol: true },
            { id: 11, name: "ქრანჩ X3", burgerPrice: 19.95, comboPrice: 23.50, bgY: '33.8%', isRightCol: true },
            { id: 12, name: "როიალ ჩიზბურგერი X3", burgerPrice: 19.95, comboPrice: 23.50, bgY: '43.5%', isRightCol: true },
            { id: 13, name: "ბეკონ X2", burgerPrice: 19.95, comboPrice: 23.50, bgY: '54.5%', isRightCol: true }
        ];

        let cart = [];
        let selectedOptions = {};

        const cartSidebar = document.getElementById('cartSidebar');
        const openCartBtn = document.getElementById('openCartBtn');
        const closeCartBtn = document.getElementById('closeCartBtn');
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const menuToggleBtn = document.getElementById('menuToggleBtn');
        const navLinks = document.getElementById('navLinks');
        const checkoutModal = document.getElementById('checkoutModal');
        const menuGrid = document.getElementById('menuGrid');

        menuData.forEach(item => {
            selectedOptions[item.id] = { type: 'სტანდარტი', price: item.burgerPrice };
            const card = document.createElement('div');
            card.classList.add('card');
            
            // არეგულირებს მარცხენა და მარჯვენა სვეტების პოზიციას დიდი სურათიდან
            const xPos = item.isRightCol ? '72%' : '15%';

            card.innerHTML = `
                <div>
                    <div class="card-header-box">
                        <div class="burger-number">${item.id}</div>
                        <div class="card-title-text">${item.name}</div>
                    </div>
                    <div class="card-img-box">
                        <div style="width: 140px; height: 140px; background: url('587582870_844939638282724_4990718774626240448_n.jpg') no-repeat ${xPos} ${item.bgY}; background-size: 530px auto; border-radius: 50%; border: 3px solid var(--primary); box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>
                    </div>
                    <div class="price-container">
                        <div class="price-option selected" id="opt-single-${item.id}" onclick="selectPriceOption(${item.id}, 'single', ${item.burgerPrice})">
                            <span class="price-label">სტანდარტი</span>
                            <span class="price-val">${item.burgerPrice.toFixed(2)} ₾</span>
                        </div>
                        <div class="price-option" id="opt-combo-${item.id}" onclick="selectPriceOption(${item.id}, 'combo', ${item.comboPrice})">
                            <span class="price-label">კომბო მენიუ</span>
                            <span class="price-val">${item.comboPrice.toFixed(2)} ₾</span>
                        </div>
                    </div>
                </div>
                <button class="btn-order" onclick="triggerAddToCart(${item.id}, '${item.name}')">კალათაში დამატება</button>
            `;
            menuGrid.appendChild(card);
        });

        function selectPriceOption(id, choice, price) {
            document.getElementById(`opt-single-${id}`).classList.remove('selected');
            document.getElementById(`opt-combo-${id}`).classList.remove('selected');
            if(choice === 'single') {
                document.getElementById(`opt-single-${id}`).classList.add('selected');
                selectedOptions[id] = { type: 'სტანდარტი', price: price };
            } else {
                document.getElementById(`opt-combo-${id}`).classList.add('selected');
                selectedOptions[id] = { type: 'კომბო', price: price };
            }
        }

        function triggerAddToCart(id, name) {
            const currentSelection = selectedOptions[id];
            addToCart(`${name} (${currentSelection.type})`, currentSelection.price);
        }

        openCartBtn.addEventListener('click', () => cartSidebar.classList.add('open'));
        closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));

        function addToCart(name, price) {
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) { existingItem.quantity += 1; } 
            else { cart.push({ name, price, quantity: 1 }); }
            updateCartUI();
            cartSidebar.classList.add('open');
        }

        function changeQuantity(name, delta) {
            const item = cart.find(item => item.name === name);
            if (item) {
                item.quantity += delta;
                if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
            }
            updateCartUI();
        }

        function removeItem(name) {
            cart = cart.filter(item => item.name !== name);
            updateCartUI();
        }

        function updateCartUI() {
            cartItemsContainer.innerHTML = '';
            let total = 0, count = 0;
            cart.forEach(item => {
                total += item.price * item.quantity;
                count += item.quantity;
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="cart-item-details"><h4>${item.name}</h4><p>${(item.price * item.quantity).toFixed(2)} ₾</p></div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="changeQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
                        <button class="remove-item" onclick="removeItem('${item.name}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
            cartCount.innerText = count;
            cartTotal.innerText = total.toFixed(2) + ' ₾';
        }

        function openCheckoutModal() {
            if (cart.length === 0) { alert('კალათა ცარიელია!'); return; }
            checkoutModal.style.display = 'flex';
        }
        function closeCheckoutModal() { checkoutModal.style.display = 'none'; }

        async function submitOrder(event) {
            event.preventDefault();
            const name = document.getElementById('clientName').value;
            const phone = document.getElementById('clientPhone').value;
            const address = document.getElementById('clientAddress').value;
            const isCard = document.getElementById('payCard').checked;
            const submitBtn = document.getElementById('submitOrderBtn');

            if (isCard) {
                submitBtn.innerText = "გადამისამართება...";
                submitBtn.disabled = true;

                try {
                    const response = await fetch('/create-checkout-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            cartItems: cart,
                            clientInfo: { name, phone, address }
                        })
                    });

                    const session = await response.json();
                    
                    if (session.id) {
                        const stripe = Stripe('pk_test_51P...შენი_პუბლიკაციური_გასაღები...'); 
                        await stripe.redirectToCheckout({ sessionId: session.id });
                    } else {
                        alert('შეცდომა გადახდის სესიის შექმნისას.');
                        submitBtn.innerText = "დასტური";
                        submitBtn.disabled = false;
                    }
                } catch (err) {
                    console.error(err);
                    alert('სერვერთან კავშირი ვერ დამყარდა.');
                    submitBtn.innerText = "დასტური";
                    submitBtn.disabled = false;
                }
            } else {
                alert(`🎉 მადლობა შეკვეთისთვის, ${name}!\nთანხას გადაიხდით კურიერთან.\nმისამართი: ${address}`);
                cart = [];
                updateCartUI();
                closeCheckoutModal();
                cartSidebar.classList.remove('open');
                document.getElementById('orderForm').reset();
            }
        }require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();

// ფრონტენდ ფაილების სტატიკურად მიწოდება public საქაღალდიდან
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// გადახდის სესიის შექმნის ენდპოინტი
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { cartItems, clientInfo } = req.body;

        // კალათის პროდუქტების გარდაქმნა Stripe-ის ფორმატში
        const lineItems = cartItems.map(item => {
            // Stripe-ს ფასი გადაეცემა თეთრებში (მაგ: 5.50 ლარი = 550 თეთრი)
            const priceInTetri = Math.round(item.price * 100); 
            
            return {
                price_data: {
                    currency: 'gel', // ქართული ლარი
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: priceInTetri,
                },
                quantity: item.quantity,
            };
        });

        // Stripe Checkout სესიის შექმნა
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            // გადახდის დასრულების შემდეგ მომხმარებელი ბრუნდება ამ ლინკებზე
            success_url: `http://localhost:3000/?success=true`,
            cancel_url: `http://localhost:3000/?canceled=true`,
            // მომხმარებლის მიერ შევსებული ინფორმაციის მიბმა შეკვეთაზე
            metadata: {
                client_name: clientInfo.name,
                client_phone: clientInfo.phone,
                client_address: clientInfo.address
            }
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// სერვერის პორტი
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 სერვერი ჩაირთო ლინკზე: http://localhost:${PORT}`));