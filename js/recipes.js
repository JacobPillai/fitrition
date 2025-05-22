// Recipe Category Tabs Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get all category tabs and content 
  const categoryTabs = document.querySelectorAll('.category-tab');
  const categoryContents = document.querySelectorAll('.category-content');

  // Add click event to each tab
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      
      // Remove active class from all tabs and contents
      categoryTabs.forEach(t => t.classList.remove('active'));
      categoryContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content 
      tab.classList.add('active');
      document.querySelector(`[data-content="${category}"]`).classList.add('active');
    });
  });

  // Recipe Cards - Add functionality for filtering recipes 
  // This would be extended with actual data once the backend is connected
  const recipeCards = document.querySelectorAll('.recipe-card');
  
  // Example function to filter recipes by category (would be connected to backend)
  function filterRecipes(category, value) {
    // This is a placeholder - in a real implementation, you would fetch filtered data
    // from the backend or filter existing data in the frontend
    console.log(`Filtering recipes by ${category}: ${value}`);
    
    // Sample code for frontend filtering (for demonstration)
    recipeCards.forEach(card => {
      // Get the badge text or other attribute to filter by
      const badgeText = card.querySelector('.recipe-badge')?.textContent.toLowerCase();
      const shouldShow = !value || badgeText === value.toLowerCase();
      
      // Toggle visibility based on filter (for demonstration)
      if (shouldShow) { //if the recipe should be shown
        //show the recipe
        card.style.display = 'block';
      } else { //if the recipe should not be shown
        //hide the recipe
        card.style.display = 'none';
      }
    });
  }

  // This would be connected to filter buttons or dropdown menus
  // Example: document.querySelector('#meal-filter').addEventListener('change', (e) => {
  //   filterRecipes('meal-time', e.target.value);
  // });
});

// This could be expanded to include recipe detail view functionality
// and favoriting/saving recipes for registered users 