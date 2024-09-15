 // Fetch productId from URL
 const urlParams = new URLSearchParams(window.location.search);
 const productId = urlParams.get("productId");

 // Function to fetch product details
 async function fetchProductDetails() {
   try {
     let data = await fetch(
       `https://fakestoreapi.com/products/${productId}`
     );
     if (!data.ok) {
       throw new Error(`HTTP error! status: ${data.status}`);
     }
     let product = await data.json();

     // Update the page with product details
     document.getElementById("product-title").textContent = product.title;
     document.getElementById("product-image").src = product.image;
     document.getElementById("product-description").textContent =
       product.description;
     document.getElementById(
       "product-price"
     ).textContent = `$${product.price}`;
     document.getElementById("product-rating").innerHTML =
       generateStarRating(product.rating.rate);
   } catch (error) {
     console.error("Error fetching product details:", error);
   }
 }

 document.addEventListener("DOMContentLoaded", function () {
   const urlParams = new URLSearchParams(window.location.search);
   const productId = urlParams.get("productId");

   // Function to fetch product details
   async function fetchProductDetails() {
     try {
       let data = await fetch(
         `https://fakestoreapi.com/products/${productId}`
       );
       if (!data.ok) {
         throw new Error(`HTTP error! status: ${data.status}`);
       }
       let product = await data.json();

       // Update the page with product details
       document.getElementById("product-title").textContent =
         product.title;
       document.getElementById("product-image").src = product.image;
       document.getElementById("product-description").textContent =
         product.description;
       document.getElementById(
         "product-price"
       ).textContent = `$${product.price}`;
     } catch (error) {
       console.error("Error fetching product details:", error);
     }
   }

   if (productId) {
     fetchProductDetails();
     fetchProducts();
   }

   // Function to fetch and display products
   async function fetchProducts() {
     try {
       let data = await fetch("https://fakestoreapi.com/products");
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
     const productsContainer = document.querySelector(".products");
     let productsHTML = "";
     productsArray.forEach((product) => {
       // Truncate the description to 100 characters
       let truncatedDescription =
         product.description.length > 100
           ? product.description.substring(0, 100) + "..."
           : product.description;

       productsHTML += `
               <div class="product">
                   <a href="product.html?productId=${
                     product.id
                   }" class="product-link">
                       <img src="${product.image}" alt="${
         product.title
       }" class="product-img">
                       <h2 class="product-title">${product.title}</h2>
                       </a>
                       <div class="product-rating">
                           ${generateStarRating(product.rating.rate)}
                           <div class="count">(${
                             product.rating.count
                           })</div>
                           </div>
                           <div class="product-price-container">
                               <h3 class="product-price">$${
                                 product.price
                               }</h3>
                               </div>
                               <p class="product-description">${truncatedDescription}</p>
                               </div>
                               `;
     });
     productsContainer.innerHTML = productsHTML;
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
     starsHTML += "</div>";
     return starsHTML;
   }

   // Fetch product details and products on page load
 });
 fetchProductDetails();

let tlCart = gsap.timeline({ paused: true });

// Define the cart animation
tlCart.to(".cart", {
  right: "0%",
  duration: 0.8,
  ease: "power2.out",
});

let cart = document.querySelector(".cart-icon");

cart.addEventListener("click", () => {
  tlCart.play();
});

let close = document.querySelector("#close-cart");

// Add event listener to close the cart when the close button is clicked
close.addEventListener("click", function() {
    tlCart.reverse();
});

// Show add to cart animation
    function showAddToCartAnimation() {
        const animation = cartIcon.querySelector('img');
        animation.classList.add('added-to-cart');
        setTimeout(() => {
            animation.classList.remove('added-to-cart');
        }, 500);
    }

    // Event listener for removing items from cart
    cartContent.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart')) {
            const productId = event.target.dataset.productid;
            removeFromCart(productId);
        }
    });

    // Remove product from cart
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