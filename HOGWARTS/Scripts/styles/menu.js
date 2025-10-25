document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.hamburger-menu-toggle');
    const navMenu = document.querySelector('#main-navigation');
    const body = document.body; // დაემატა body ელემენტი

    if (toggleButton && navMenu) {
        // 1. ღილაკზე დაჭერით მენიუს გახსნა/დახურვა
        toggleButton.addEventListener('click', (event) => {
            event.stopPropagation(); // თავიდან აიცილებს დაწკაპუნების გავრცელებას body-ზე
            // "active" კლასის დამატება/მოშორება
            navMenu.classList.toggle('active');
            // body-ზე კლასის დამატება/მოშორება
            body.classList.toggle('menu-open');
        });

        // 2. მენიუს დახურვა მენიუს გარეთ დაჭერისას
        document.addEventListener('click', (event) => {
            // შემოწმება: თუ მენიუ ღიაა AND დაჭერა არ არის ნავიგაციის შიგნით
            const isClickInsideNav = navMenu.contains(event.target);
            const isNavOpen = navMenu.classList.contains('active');
            
            if (isNavOpen && !isClickInsideNav) {
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
        
        // დახურვა, თუ მენიუს ბმულზე დაჭერით ხდება
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    }
});
