// script.js

document.addEventListener('DOMContentLoaded', () => {
    // A variável 'birthdayData' é lida diretamente do script incorporado no index.html
    if (typeof birthdayData!== 'undefined') {
        const upcomingBirthdays = getUpcomingBirthdays(birthdayData, 30);
        renderBirthdays(upcomingBirthdays);
    } else {
        const container = document.getElementById('birthday-container');
        container.innerHTML = '<p class="error">Os dados dos aniversariantes não foram encontrados.</p>';
        console.error('A variável birthdayData não está definida.');
    }
});

function getUpcomingBirthdays(people, days) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliza para o início do dia

    const upcoming = people.map(person => {
        const birthDate = new Date(person.birthdate + 'T00:00:00'); // Assume o fuso horário local
        const birthDay = birthDate.getDate();
        const birthMonth = birthDate.getMonth();
        
        let nextBirthday = new Date(today.getFullYear(), birthMonth, birthDay);

        // Se o aniversário deste ano já passou, verifica o do próximo ano
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        
        // Calcula a diferença em dias
        const diffTime = nextBirthday.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {...person, nextBirthday, diffDays };
    })
.filter(person => person.diffDays >= 0 && person.diffDays <= days) // Filtra para aniversários futuros dentro da janela
.sort((a, b) => a.nextBirthday - b.nextBirthday); // Ordena pela data mais próxima

    return upcoming;
}

function renderBirthdays(birthdays) {
    const container = document.getElementById('birthday-container');
    container.innerHTML = ''; // Limpa o conteúdo anterior

    if (birthdays.length === 0) {
        container.innerHTML = '<p class="no-birthdays">Nenhum aniversário nos próximos 30 dias.</p>';
        return;
    }

    birthdays.forEach(person => {
        const card = document.createElement('div');
        card.className = 'card';

        const birthDate = new Date(person.birthdate + 'T00:00:00');
        const formattedDate = birthDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

        card.innerHTML = `
            <div class="card-content">
                <h3 class="name">${person.name}</h3>
                <p class="role">${person.role}</p>
                <p class="date">${formattedDate}</p>
            </div>
        `;
        container.appendChild(card);
    });
}
