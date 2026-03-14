function updateGlobalNavbar(user) {
    const greeting = document.getElementById('greeting');
    const navLinks = document.querySelector('.nav-links');

    if (!user) {
        if (greeting) {
            greeting.style.display = 'none';
            greeting.innerHTML = '';
        }
        const adminItem = document.getElementById('admin-nav-item');
        if (adminItem) adminItem.remove();
        return;
    }

    const db = firebase.firestore();
    db.collection('users').doc(user.uid).get().then((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            
            if (greeting) {
                const displayName = userData.name || user.displayName || user.email;
                greeting.style.display = 'inline-block';
                greeting.innerHTML = 'Hello, ' + displayName;
            }

            if (userData.role === 'admin') {
                if (navLinks && !document.getElementById('admin-nav-item')) {
                    const adminLi = document.createElement('li');
                    adminLi.id = 'admin-nav-item';
                    adminLi.innerHTML = `
                        <a href="admin.html" style="
                            color: #ff8fab; 
                            font-weight: 800; 
                            text-transform: uppercase; 
                            border: 2px solid #ff8fab; 
                            padding: 5px 10px; 
                            border-radius: 15px;
                        ">Admin Panel</a>`;
                    navLinks.appendChild(adminLi);
                }
            }
        }
    }).catch(err => console.error("Error updating navbar:", err));
}

function showCuteAlert(message, title = "Cake Crumbs!") {
    const overlay = document.createElement('div');
    overlay.className = 'cute-alert-overlay';
    const box = document.createElement('div');
    box.className = 'cute-alert-box';
    box.innerHTML = `
        <h3>${title}</h3>
        <p>${message}</p>
        <button class="button" onclick="this.parentElement.parentElement.remove()">Got it!</button>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

function setupCakeFilter() {
    const searchInput = document.getElementById('search');
    const filterDropdown = document.getElementById('filter');
    const cakeItems = document.querySelectorAll('.cake-item');
    if (!searchInput || !filterDropdown) return;

    function filterCakes() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = filterDropdown.value;
        cakeItems.forEach(cake => {
            const cakeName = cake.querySelector('h2').innerText.toLowerCase();
            let cakeCategory = 'flavored'; 
            if (cakeName.match(/(strawberry|mango|peach|cherry|grape|blueberry|berries|lemon|banana)/)) {
                cakeCategory = 'fruit';
            } else if (cakeName.match(/(pumpkin|carrot)/)) {
                cakeCategory = 'spiced';
            }
            const matchesSearch = cakeName.includes(searchTerm);
            const matchesCategory = (selectedCategory === 'all' || selectedCategory === cakeCategory);
            cake.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
        });
    }
    searchInput.addEventListener('input', filterCakes);
    filterDropdown.addEventListener('change', filterCakes);
}

function setupAddToCart() {
    const addToCartLinks = document.querySelectorAll('.cake-item a');
    if (addToCartLinks.length === 0) return;

    addToCartLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const user = firebase.auth().currentUser;
            if (!user) {
                showCuteAlert("You need an account to order cakes. Please log in first!", "Hold on!");
                return;
            }

            const cakeItem = event.target.closest('.cake-item');
            const name = cakeItem.querySelector('h2').innerText;
            const imageUrl = cakeItem.querySelector('img').src;
            const description = cakeItem.querySelectorAll('p')[0].innerText;
            const priceTextElement = Array.from(cakeItem.querySelectorAll('p')).find(p => p.innerText.includes('$'));
            const price = parseFloat(priceTextElement.innerText.replace('$', '').trim());

            const newCake = {
                name: name,
                image: imageUrl, 
                description: description,
                price: price
            };

            const db = firebase.firestore();
            db.collection("carts").doc(user.uid).set({
                cakes: firebase.firestore.FieldValue.arrayUnion(newCake)
            }, { merge: true })
            .then(() => showCuteAlert(`${name} has been added to your cart!`, "Yum!"))
            .catch((error) => showCuteAlert(error.message, "Database Error"));
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupCakeFilter();
    setupAddToCart();    
    
    firebase.auth().onAuthStateChanged((user) => {
        updateGlobalNavbar(user);
    });
});