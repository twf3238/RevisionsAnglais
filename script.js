document.addEventListener('DOMContentLoaded', () => {
    const manageSection = document.getElementById('manageSection');
    const reviewSection = document.getElementById('reviewSection');
    const manageBtn = document.getElementById('manageBtn');
    const reviewBtn = document.getElementById('reviewBtn');

    // Airtable API Base ID and Table Name
    const AIRTABLE_BASE_ID = 'appu2zFKRQzZkCUkC'; // Remplacez par votre Base ID
    const AIRTABLE_TABLE_NAME = 'Exercices'; // Nom de votre table
    const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

    // Load lessons and exercises
    const lessonsContainer = document.getElementById('lessons-container');
    const reviewContainer = document.getElementById('review-container');

    async function fetchAirtableData() {
        try {
            const response = await fetch(AIRTABLE_URL, {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}` // Jeton d'accès sécurisé
                }
            });
            if (!response.ok) {
                throw new Error(`Erreur de l'API Airtable : ${response.statusText}`);
            }
            const data = await response.json();
            renderLessons(data.records);
        } catch (error) {
            console.error('Erreur de chargement des données :', error);
        }
    }

    function renderLessons(records) {
        const lessons = {};

        // Group exercises by lesson
        records.forEach(record => {
            const { fields } = record;
            const lessonName = fields.Lesson || 'Sans leçon';
            if (!lessons[lessonName]) lessons[lessonName] = [];
            lessons[lessonName].push(record);
        });

        // Render cards for each lesson
        lessonsContainer.innerHTML = '';
        reviewContainer.innerHTML = '';
        for (const [lessonName, exercises] of Object.entries(lessons)) {
            const lessonCard = createLessonCard(lessonName, exercises);
            lessonsContainer.appendChild(lessonCard);
            reviewContainer.appendChild(lessonCard.cloneNode(true));
        }
    }

    function createLessonCard(lessonName, exercises) {
        const card = document.createElement('div');
        card.className = 'card';

        const lessonTitle = document.createElement('h3');
        lessonTitle.textContent = lessonName;

        const details = document.createElement('div');
        details.className = 'details';
        details.innerHTML = exercises
            .map(
                exercise => `
                <div>
                    <strong>${exercise.fields.ID}. ${exercise.fields.Title}</strong>
                    <div>${exercise.fields.Competence} - ${exercise.fields.Theme}</div>
                    <div class="lesson-name">${exercise.fields.Lesson || 'Sans leçon'}</div>
                    <div class="last-modified">Modifié le : ${exercise.fields.Modified || 'Inconnue'}</div>
                </div>`
            )
            .join('');

        card.appendChild(lessonTitle);
        card.appendChild(details);
        return card;
    }

    // Navigation between sections
    manageBtn.addEventListener('click', () => {
        manageBtn.classList.add('active');
        reviewBtn.classList.remove('active');
        manageSection.style.display = 'block';
        reviewSection.style.display = 'none';
    });

    reviewBtn.addEventListener('click', () => {
        reviewBtn.classList.add('active');
        manageBtn.classList.remove('active');
        reviewSection.style.display = 'block';
        manageSection.style.display = 'none';
    });

    // Fetch data on load
    fetchAirtableData();
});