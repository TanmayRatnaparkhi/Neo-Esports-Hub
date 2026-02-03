document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Function to handle tab switching
    const switchTab = (tabId) => {
        // 1. Deactivate all buttons and contents
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });

        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // 2. Activate the selected button and content
        const selectedButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);

        if (selectedButton && selectedContent) {
            selectedButton.classList.add('active');
            selectedContent.classList.add('active');
        }
    };

    // Add event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Initialize the page by showing the 'stats' tab (default active)
    // This is useful if the HTML doesn't explicitly set the 'active' class
    // switchTab('stats'); // We already set 'active' in HTML, but this is good practice
});