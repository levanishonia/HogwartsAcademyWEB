// HOGWARTS/Scripts/styles/backToTop.js

// 300px-ის ჩასქროლვის შემდეგ გამოჩნდება
const SCROLL_THRESHOLD = 300; 

// ზემოთ ასქროლვის ფუნქცია (smooth scroll)
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.getElementById('backToTopBtn');
    
    // ღილაკის გამოჩენა/დამალვის ლოგიკა
    if (backToTopButton) {
        window.onscroll = function() {
            // თუ HTML/BODY ელემენტები ჩასქროლილია 300px-ზე მეტად
            if (document.body.scrollTop > SCROLL_THRESHOLD || document.documentElement.scrollTop > SCROLL_THRESHOLD) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        };
        
        // ღილაკზე დაჭერის ფუნქციის მიბმა
        backToTopButton.addEventListener('click', scrollToTop);
    }
});