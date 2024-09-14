document.addEventListener("DOMContentLoaded", function() {
    let products = document.querySelector(".products");
    let priceFilter = document.getElementById("price-filter");
    let ratingFilter = document.getElementById("rating-filter");
    let categoryFilter = document.getElementById("category-filter");

    async function fetchData(url) {
        try {
            let data = await fetch(url);
            if (!data.ok) {
                // Handle 404 error specifically
                if (data.status === 404) {
                    displayErrorPage(data.status);
                    return;
                }
                throw new Error(`HTTP error! status: ${data.status}`);
            }
            let response = await data.json();
            console.log(response);

            // Populate category filter
            let categories = [...new Set(response.map(product => product.category))];
            categories.forEach(category => {
                let option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });

            displayProducts(response);

            // Add event listeners for filters
            priceFilter.addEventListener("change", () => filterProducts(response));
            ratingFilter.addEventListener("change", () => filterProducts(response));
            categoryFilter.addEventListener("change", () => filterProducts(response));
        } catch (error) {
            console.error("Error fetching data:", error);
            displayErrorPage(); // Display general error message
        }
    }

    function displayProducts(productsArray) {
        let productsHTML = '';
        productsArray.forEach(product => {
            let description = product.description;
            let truncatedDescription = description.length > 50 ? description.substring(0, 50) + '....more' : description;
            productsHTML += `
            <div class="product">
                <img src="${product.image}" alt="" class="product-img">
                <h2 class="product-title">${product.title}</h2>
                <div class="product-rating">
                    ${generateStarRating(product.rating.rate)}
                    <div class="count">(${product.rating.count})</div>
                </div>
                <p class="product-description">${truncatedDescription}</p>
                <div class="product-price-container">
                    <h3 class="product-price">$${product.price}</h3>
                    <a href="#" data-productID="${product.id}" class="add-to-cart">Add to Cart</a>
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

    function filterProducts(productsArray) {
        let filteredProducts = [...productsArray];

        // Filter by category
        let selectedCategory = categoryFilter.value;
        if (selectedCategory !== "all") {
            filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
        }

        // Filter by rating
        let selectedRating = ratingFilter.value;
        if (selectedRating !== "all") {
            filteredProducts = filteredProducts.filter(product => product.rating.rate >= selectedRating);
        }

        // Sort by price
        let selectedPrice = priceFilter.value;
        if (selectedPrice === "low") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (selectedPrice === "high") {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        displayProducts(filteredProducts);
    }

    function displayErrorPage(statusCode) {
        products.innerHTML = `
            <div class="error-page">
                <h1>Error ${statusCode || ''}</h1>
                <p>${statusCode === 404 ? 'Page not found.' : 'Failed to load products. Please try again later.'}</p>
            </div>
        `;
    }

    fetchData("https://fakestoreapi.com/products");

    // Animation using GSAP
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
        stagger: 0.1
    });  

    function BreakText() {
        let headings = document.querySelectorAll(".welcome-box h1");

        headings.forEach(heading => {
            let h1Text = heading.textContent;
            let splitText = h1Text.split("");
            let clutter = "";

            splitText.forEach(function (letter) {
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
        stagger: 0.01
    });

    gsap.to(".logo-SI .logo img", {
        scrollTrigger: {
            trigger: ".page2",
            scroller: "body",
            start: "top 45%",
        },
        width: "4rem",
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
        zIndex: -1,
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

    // Cart animation
    let cart = document.querySelector(".cart-icon");
    let cartContent = document.querySelector(".cart");

    let tlCart = gsap.timeline({
        paused: true 
    });

    tlCart.to(".cart", {
        right: 0,
        duration: 0.6,
        ease: "power2.out",
    })
    .to(".cart", {
        right: "-100%",
        duration: 0.6,
        ease: "power2.in",
        paused: true,
    });

    // Toggle cart visibility
    cart.addEventListener("click", (event) => {
        event.preventDefault();
        if (tlCart.reversed()) {
            tlCart.play();
        } else {
            tlCart.reverse();
        }
    });
});

