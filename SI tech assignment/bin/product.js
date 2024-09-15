
        // Fetch productId from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('productId');

        // Function to fetch product details
        async function fetchProductDetails() {
            try {
                let data = await fetch(`https://fakestoreapi.com/products/${productId}`);
                if (!data.ok) {
                    throw new Error(`HTTP error! status: ${data.status}`);
                }
                let product = await data.json();

                // Update the page with product details
                document.getElementById('product-title').textContent = product.title;
                document.getElementById('product-image').src = product.image;
                document.getElementById('product-description').textContent = product.description;
                document.getElementById('product-price').textContent = `$${product.price}`;
                document.getElementById('product-rating').innerHTML = generateStarRating(product.rating.rate);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        }

        document.addEventListener("DOMContentLoaded", function() {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('productId');
        
            // Function to fetch product details
            async function fetchProductDetails() {
                try {
                    let data = await fetch(`https://fakestoreapi.com/products/${productId}`);
                    if (!data.ok) {
                        throw new Error(`HTTP error! status: ${data.status}`);
                    }
                    let product = await data.json();
        
                    // Update the page with product details
                    document.getElementById('product-title').textContent = product.title;
                    document.getElementById('product-image').src = product.image;
                    document.getElementById('product-description').textContent = product.description;
                    document.getElementById('product-price').textContent = `$${product.price}`;
                } catch (error) {
                    console.error("Error fetching product details:", error);
                }
            }
        
            // Function to fetch and display products
            async function fetchProducts() {
                try {
                    let data = await fetch('https://fakestoreapi.com/products');
                    if (!data.ok) {
                        throw new Error(`HTTP error! status: ${data.status}`);
                    }
                    let products = await data.json();
                    displayProducts(products);
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            }
        
            // Function to display products
            function displayProducts(productsArray) {
                const productsContainer = document.querySelector('.products');
                let productsHTML = '';
                productsArray.forEach(product => {
                    productsHTML += `
                    <div class="product">
                        <a href="product.html?productId=${product.id}" class="product-link">
                            <img src="${product.image}" alt="${product.title}" class="product-img">
                            <h2 class="product-title">${product.title}</h2>
                        </a>
                        <div class="product-rating">
                            ${generateStarRating(product.rating.rate)}
                            <div class="count">(${product.rating.count})</div>
                        </div>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price-container">
                            <h3 class="product-price">$${product.price}</h3>
                            <a href="#" data-productid="${product.id}" class="add-to-cart">Add to Cart</a>
                        </div>
                    </div>
                    `;
                });
                productsContainer.innerHTML = productsHTML;
        
                // Add event listeners to "Add to Cart" buttons
                document.querySelectorAll(".add-to-cart").forEach(button => {
                    button.addEventListener("click", function(event) {
                        event.preventDefault();
                        const product = {
                            id: this.dataset.productid,
                            title: this.dataset.producttitle,
                            price: parseFloat(this.dataset.productprice),
                            image: this.dataset.productimage
                        };
                        addToCart(product);
                    });
                });
            }
        
            // Function to generate star rating
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
        
            // Fetch product details and products on page load
            if (productId) {
                fetchProductDetails();
                fetchProducts();
            }
        });
    fetchProductDetails();
