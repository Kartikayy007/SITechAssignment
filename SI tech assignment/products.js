document.addEventListener("DOMContentLoaded", function() {
    let products = document.querySelector(".products");
    let priceFilter = document.getElementById("price-filter");
    let ratingFilter = document.getElementById("rating-filter");
    let categoryFilter = document.getElementById("category-filter");
    let cartItems = [];
    let cartIcon = document.querySelector(".cart-icon");
    let cartContent = document.querySelector(".cart");

    async function fetchData(url) {
        try {
            let data = await fetch(url);
            if (!data.ok) {         
                throw new Error(`HTTP error! status: ${data.status}`);
            }
            console.log(data);
            let response = await data.json();
            console.log(response);

            let categories = [...new Set(response.map(product => product.category))];
            categories.forEach(category => {
                let option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });

            displayProducts(response);

            priceFilter.addEventListener("change", () => filterProducts(response));
            ratingFilter.addEventListener("change", () => filterProducts(response));
            categoryFilter.addEventListener("change", () => filterProducts(response));

            products.addEventListener("click", (event) => {
                if (event.target.classList.contains("add-to-cart")) {
                    event.preventDefault();
                    const productId = event.target.dataset.productid;
                    const product = response.find(p => p.id == productId);
                    addToCart(product);
                }
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            display404Screen();
        }
    }

    function display404Screen() {
        let errorHTML = `
        <div class="dim"></div>
        <div class="error-container">
            <h1>404</h1>
            <h2>Oops! Something went wrong</h2>
            <p>We couldn't fetch the products at the moment. Please try again later.</p>
            <button onclick="location.reload()">Retry</button>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
    }

    function displayProducts(productsArray) {
        let productsHTML = '';
        productsArray.forEach(product => {
            let description = product.description;
            let small = description.length > 50 ? description.substring(0, 50) + '....more' : description;
            productsHTML += `
            <div class="product">
                <a href="product.html?productId=${product.id}" class="product-link">
                    <img src="${product.image}" alt="" class="product-img">
                    <h2 class="product-title">${product.title}</h2>
                </a>
                <div class="product-rating">
                    ${generateStarRating(product.rating.rate)}
                    <div class="count">(${product.rating.count})</div>
                </div>
                <p class="product-description">${small}</p>
                <div class="product-price-container">
                    <h3 class="product-price">$${product.price}</h3>
                    <a href="#" data-productid="${product.id}" class="add-to-cart">Add to Cart</a>
                </div>
            </div>
            `;
        });
        products.innerHTML = productsHTML;
    }

    function generateStarRating(rating) {
        let starsHTML = '<div class="star-rating">';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += '<span class="star filled">&#9733;</span>';
            } else {
                starsHTML += '<span class="star">&#9733;</span>';
            }
        }
        starsHTML += '</div>';
        return starsHTML;
    }

    function addToCart(product) {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({...product, quantity: 1});
        }
        updateCartDisplay();
        showAddToCartAnimation();

        if (tlCart.progress() === 0) {
            tlCart.play();
        }
    }

    function updateCartDisplay() {
        let cartHTML = `
            <button id="close-cart" class="close-cart-btn">&times;</button>
            <h2>Your Cart</h2>
        `;
        let total = 0;
        cartItems.forEach(item => {
            cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" width="50">
                <div>
                    <h3>${item.title}</h3>
                    <p>$${item.price} X ${item.quantity}</p>
                </div>
                <button class="remove-from-cart" data-productid="${item.id}">Remove</button>
            </div>
            `;
            total += item.price * item.quantity;
        });
        cartHTML += `<div class="cart-total">Total: $${total.toFixed(2)}</div>`;
        cartContent.innerHTML = cartHTML;

        cartIcon.querySelector('span').textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        document.getElementById("close-cart").addEventListener("click", closeCart);
    }

    function closeCart() {
        tlCart.reverse();
    }

    cartIcon.addEventListener("click", (event) => {
        event.preventDefault();
        if (tlCart.progress() === 0) {
            tlCart.play();
        } else {
            tlCart.reverse();
        }
    });

    function filterProducts(productsArray) {
        let filteredProducts = [...productsArray];

        let selectedCategory = categoryFilter.value;
        if (selectedCategory !== "all") {
            filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
        }

        let selectedRating = ratingFilter.value;
        if (selectedRating !== "all") {
            filteredProducts = filteredProducts.filter(product => product.rating.rate >= selectedRating);
        }

        let selectedPrice = priceFilter.value;
        if (selectedPrice === "low") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (selectedPrice === "high") {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        displayProducts(filteredProducts);
    }

    function showAddToCartAnimation() {
        const animation = cartIcon.querySelector('img');
        animation.classList.add('added-to-cart');
        setTimeout(() => {
            animation.classList.remove('added-to-cart');
        }, 500);
    }

    cartContent.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart')) {
            const productId = event.target.dataset.productid;
            removeFromCart(productId);
        }
    });

    function removeFromCart(productId) {
        const index = cartItems.findIndex(item => item.id == productId);
        if (index !== -1) {
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity -= 1;
            } else {
                cartItems.splice(index, 1);
            }
            updateCartDisplay();
        }
    }

    fetchData("https://fakestoreapi.com/products");
});

let close = document.querySelector("#close-cart");

close.addEventListener("click", function() {
    tlCart.reverse();
});

let cart = document.querySelector(".cart-icon");
let cartContent = document.querySelector(".cart");

let tlCart = gsap.timeline({ paused: true });

tlCart.to(".cart", {
    right: 0,
    duration: 0.6,
    ease: "power2.out",
});

let tl = gsap.timeline();

tl.from(".welcome-box", {
    duration: 0.4,
    opacity: 0,
    y: 30,
});

gsap.to(".welcome-box", {
    scrollTrigger: {
        trigger: ".welcome-box",
        scroller: "body",
        start: "top%",
        scrub: 1,
    },
    scale: 0.8,
    borderRadius: "7rem",
});

tl.to(".welcome-box h1", {
    scrollTrigger: {
        trigger: ".welcome-box h1",
        scroller: "body",
        start: "top%",
        scrub: 1,
    },
    scale: 0.8,
    duration: 0.2,
    opacity: 0,
    y: 30,
});

gsap.to(".welcome-box img", {
    scrollTrigger: {
        trigger: ".welcome-box img",
        scroller: "body",
        start: "top% 1%",
        scrub: 1,
    },
    filter: "blur(10px)",
});

tl.from(".logo", {
    duration: 0.2,
    opacity: 0,
    x: -30,
}, "together");

tl.from(".SI-logo", {
    duration: 0.2,
    opacity: 0,
    x: 30,
}, "together");

tl.from("nav ul li", {
    duration: 0.2,
    opacity: 0,
    y: 30,
    stagger: 0.1,
});

function BreakText() {
    let headings = document.querySelectorAll(".welcome-box h1");

    headings.forEach(heading => {
        let h1Text = heading.textContent;
        let splitText = h1Text.split("");
        let clutter = "";

        splitText.forEach(function(letter) {
            clutter += `<span>${letter}</span>`;
        });

        heading.innerHTML = clutter;
    });
}

BreakText();

tl.from(".welcome-box h1 span", {
    duration: 0.2,
    opacity: 0,
    y: 30,
    stagger: 0.01,
});

gsap.to(".logo-SI .logo img", {
    scrollTrigger: {
        trigger: ".page2",
        scroller: "body",
        start: "top 45%",
    },
    width: "4.3rem",
    duration: 1,
});

gsap.to(".bg", {
    scrollTrigger: {
        trigger: ".page2",
        scroller: "body",
        start: "top 45%",
    },
    opacity: 1,
});

gsap.to(".logo-SI .SI-logo", {
    scrollTrigger: {
        trigger: ".page2",
        scroller: "body",
        start: "top 45%",
    },
    duration: 1,
    ease: "power2.out",
    opacity: 0,
    width: 0,
    height: 0,
});

gsap.to("nav ul", {
    scrollTrigger: {
        trigger: ".page2",
        scroller: "body",
        start: "top 45%",
    },
    gap: "5rem",
    x: "30vw",
    y: "-20vh",
    duration: 1,
    zindex: -1,
});

gsap.to(".logo", {
    scrollTrigger: {
        trigger: ".page2",
        scroller: "body",
        start: "top 45%",
        onEnter: () => {
            gsap.set(".logo", {
                position: "fixed",
                top: "10px",
                left: "10px",
                color: "white",
            });
        },
    },
    duration: 1,
});

gsap.to("nav", {
    scrollTrigger: {
        trigger: ".page2",
        scroller: "body",
        start: "top 45%",
        end: "top -300%",
        delay: 2,
        onEnter: () => {
            gsap.set("ul", {
                position: "fixed",
                top: "21%",
                right: "9px",
                width: "100%",
                ease: "power2.out",
                duration: 2,
                color: "white",
            });
            gsap.set("nav ul li a", {
                color: "white",
            });
        },
    },
    duration: 2,
});

gsap.to(".page2 h1", {
    transform: "translateX(-85%)",
    height: "100vh",
    position: "fixed",
    scrollTrigger: {
        trigger: ".page2",
        scroller: "body",
        start: "top 0%",
        end: "top -400%",
        scrub: 1.5,
        pin: true,
    },
});

window.addEventListener("wheel", function(event) {
    if (event.deltaY > 0) {
        gsap.to(".marque", {
            transform: "translateX(-200%)",
            duration: 4,
            repeat: -1,
            ease: "none",
        });

        gsap.to(".marque img", {
            rotate: 180,
            ease: "none",
        });
    } else {
        gsap.to(".marque", {
            transform: "translateX(0%)",
            duration: 4,
            repeat: -1,
            ease: "none",
        });

        gsap.to(".marque img", {
            rotate: 0,
            ease: "none",
        });
    }
});

let path = `M 0 100 Q 250 100 2000 100`;
let final = `M 0 100 Q 250 100 2000 100`;
let string = document.querySelector(".string svg");

string.addEventListener("mousemove", function(e) {
    path = `M 0 100 Q ${e.x} ${e.y} 2000 100`;
    gsap.to("svg path", {
        attr: { d: path },
        duration: 1,
        ease: "power3.out",
    });
});

string.addEventListener("mouseleave", function() {
    gsap.to("svg path", {
        attr: { d: final },
        duration: 1.5,
        ease: "elastic.out(1,0.2)",
    });
});
