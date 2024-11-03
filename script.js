function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class "tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class "tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab and add an "active" class to the button that opened the tab
    const currentTab = document.getElementById(tabName);
    currentTab.style.display = "block";
    evt.currentTarget.className += " active";

    // Handle iframe height adjustment
    const iframe = currentTab.querySelector('iframe');
    if (iframe) {
        const resizeIframe = () => {
            try {
                // Get the full content height including margins
                const contentHeight = Math.max(
                    iframe.contentWindow.document.documentElement.scrollHeight,
                    iframe.contentWindow.document.body.scrollHeight
                );
                // Add extra padding to ensure no content is cut off
                const height = contentHeight;
                iframe.style.height = `${height}px`;
                // Remove scrollbars but keep content visible
                iframe.style.overflow = 'visible';
                iframe.contentWindow.document.body.style.overflow = 'visible';
            } catch (e) {
                console.warn('Cannot access iframe content - possible cross-origin restriction');
            }
        };
        resizeIframe();
        // Add resize observer to handle dynamic content changes
        const observer = new ResizeObserver(resizeIframe);
        observer.observe(iframe.contentWindow.document.body);
    };
}


// Optionally, open the first tab by default
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.tablinks').click();
});
