let allProducts = [];
let filteredProducts = [];
let currentIndex = 0; // Start at index 0
const itemsPerPage = 10; // Number of items to load per click

fetch('https://fakestoreapi.com/products')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("NETWORK RESPONSE ERROR");
    }
  })
  .then(data => {
    allProducts = data; // Store all products
    filteredProducts = data; // Initialize filtered products
    const loader = document.querySelector(".loader");
    loader.classList.add("loader-hidden");

    // Populate categories
    const CategoryListDiv = document.querySelector(".categoryList");
    const allCat = [];
    data.forEach(user => {
      if (!allCat.includes(user.category)) {
        CategoryListDiv.innerHTML += `
          <label>
            <input type="checkbox" onclick='categoryFilter()' value="${user.category}"> ${user.category}
          </label>`;
        allCat.push(user.category);
      }
    });

    displayProducts(); // Initially display the first 10 products
  })
  .catch(error => console.error("FETCH ERROR:", error));

// Function to display products
function displayProducts() {
  const container = document.getElementById('product-container');
  const productsToDisplay = filteredProducts.slice(currentIndex, currentIndex + itemsPerPage);

  productsToDisplay.forEach(user => {
    const productElement = `
      <div class="box-container">
        <img src="${user.image}" loading="lazy" alt="${user.title}"/>
        <h2>${user.title}</h2>
        <p>Price: $${user.price}</p>
        <span class="icon-container">
          <i class="fa-regular fa-heart"></i>
          <span> Rating: ${user.rating.rate}</span>
        </span>
      </div>`;
    container.insertAdjacentHTML('beforeend', productElement);
  });

  currentIndex += itemsPerPage; // Update current index

  // Hide load more button if no more products
  updateLoadMoreButtonVisibility();
}

// Load more products on button click
document.getElementById('load-more').addEventListener('click', displayProducts);

// Function to update the visibility of the "Load More" button
function updateLoadMoreButtonVisibility() {
  const loadMoreButton = document.getElementById('load-more');
  if (filteredProducts.length <= itemsPerPage || currentIndex >= filteredProducts.length) {
    loadMoreButton.style.display = 'none';
  } else {
    loadMoreButton.style.display = 'block';
  }
}

// Category filter function
window.categoryFilter = () => {
  const checkInput = document.querySelectorAll("input[type='checkbox']");
  const checkdata = [];
  checkInput.forEach(e => {
    if (e.checked) {
      checkdata.push(e.value);
    }
  });

  // Filter products based on checked categories
  filteredProducts = allProducts.filter(user => checkdata.length === 0 || checkdata.includes(user.category));
  currentIndex = 0; // Reset index for filtered results
  document.getElementById('product-container').innerHTML = ''; // Clear previous products
  displayProducts(); // Display first batch of filtered products

  updateLoadMoreButtonVisibility(); // Update button visibility
};

// Sorting function
function sortProducts() {
  const sortValue = document.getElementById("sorting").value;

  switch (sortValue) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating-asc":
      filteredProducts.sort((a, b) => a.rating.rate - b.rating.rate);
      break;
    case "rating-desc":
      filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
    default:
      // Reset to original order if no sorting
      filteredProducts = [...allProducts];
      break; 
  }

  // Reset current index and clear product container
  currentIndex = 0;
  document.getElementById('product-container').innerHTML = '';

  // Display the sorted products
  displayProducts();
}

// Search functionality
const search = () => {
  const searchbox = document.getElementById("searchBar").value.toUpperCase();
  filteredProducts = allProducts.filter(user => 
    user.title.toUpperCase().includes(searchbox)
  );

  currentIndex = 0; // Reset index for search results
  document.getElementById('product-container').innerHTML = ''; // Clear previous products
  displayProducts(); // Display first batch of search results

  // Handle no results found
  const noResultsMessage = document.getElementById('no-results');
  if (filteredProducts.length === 0) {
    noResultsMessage.style.display = 'flex'; // Show message
    document.getElementById('load-more').style.display = 'none'; // Hide load more button
  } else {
    noResultsMessage.style.display = 'none'; // Hide message
    updateLoadMoreButtonVisibility(); // Update button visibility
  }
};

// Mobile view Navigation toggle code
function toggleNav(x) {
  x.classList.toggle("active");
}

function removeActive() {
  var element = document.getElementById("iconToggle");
  element.classList.remove("active");
}