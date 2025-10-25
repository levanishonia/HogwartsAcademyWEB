// HOGWARTS/Scripts/styles/secretCode.js

function checkCode() {
    const input = document.getElementById('houseCode');
    const message = document.getElementById('code-message');
    const code = input.value.trim().toUpperCase();

    // ლოგიკა კოდის შესამოწმებლად
    switch (code) {
        case 'LUKA':
            message.textContent = 'წარმატება! გრიფინდორის ოთახი იხსნება...';
            setTimeout(() => {
                window.location.href = 'gryffindor.html';
            }, 1000);
            break;
        case 'SLYTHERIN':
            message.textContent = 'წარმატება! სლიზერინის ოთახი იხსნება...';
            setTimeout(() => {
                window.location.href = 'slytherin.html';
            }, 1000);
            break;
        case 'HUFFLEPUF':
            message.textContent = 'წარმატება! ჰაფლფაფის ოთახი იხსნება...';
            setTimeout(() => {
                window.location.href = 'hufflepuff.html';
            }, 1000);
            break;
        case 'RAVENCLAW':
            message.textContent = 'წარმატება! რეივენქლოს ოთახი იხსნება...';
            setTimeout(() => {
                window.location.href = 'ravenclaw.html';
            }, 1000);
            break;
        default:
            message.textContent = 'შეცდომა: კოდი არასწორია. სცადეთ კიდევ.';
            input.value = ''; // ველის გასუფთავება
            break;
    }
}