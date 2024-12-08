// script.js

document.addEventListener('DOMContentLoaded', async () => {
    const revisionSection = document.querySelector('#revision-section');
    const manageSection = document.querySelector('#manage-section');
    const revisionButton = document.querySelector('#revision-btn');
    const manageButton = document.querySelector('#manage-btn');

    // Initialize the application with the "Gérer les Exercices" section
    manageSection.style.display = 'block';
    revisionSection.style.display = 'none';

    // Event Listeners for menu buttons
    revisionButton.addEventListener('click', () => {
        manageSection.style.display = 'none';
        revisionSection.style.display = 'block';
    });

    manageButton.addEventListener('click', () => {
        revisionSection.style.display = 'none';
        manageSection.style.display = 'block';
    });

    // Fetch and display data from Airtable
    try {
        const exercices = await fetchExercices();
        displayExercices(exercices);
    } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
    }
});

// Fetch data from Netlify function
const fetchExercices = async () => {
    try {
        const response = await fetch('/.netlify/functions/fetchAirtable');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des exercices :', error);
        throw error;
    }
};

// Display exercices in cards grouped by lesson
const displayExercices = (exercices) => {
    const manageContainer = document.querySelector('#manage-container');
    const revisionContainer = document.querySelector('#revision-container');

    const lessons = groupByLesson(exercices);

    manageContainer.innerHTML = '';
    revisionContainer.innerHTML = '';

    for (const [lessonName, exercices] of Object.entries(lessons)) {
        const lessonCard = createLessonCard(lessonName, exercices);
        manageContainer.appendChild(lessonCard.cloneNode(true)); // Clone for "Manage" section
        revisionContainer.appendChild(lessonCard); // Original for "Revision" section
    }
};

// Group exercices by lesson
const groupByLesson = (exercices) => {
    return exercices.reduce((grouped, exercise) => {
        const lessonName = exercise.fields.Lesson || 'Sans Titre';
        if (!grouped[lessonName]) {
            grouped[lessonName] = [];
        }
        grouped[lessonName].push(exercise);
        return grouped;
    }, {});
};

// Create a lesson card with collapsible exercices
const createLessonCard = (lessonName, exercices) => {
    const lessonCard = document.createElement('div');
    lessonCard.className = 'lesson-card';

    const header = document.createElement('div');
    header.className = 'lesson-header';

    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggle-btn';
    toggleButton.textContent = '>';
    toggleButton.addEventListener('click', () => {
        toggleButton.classList.toggle('expanded');
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });

    const lessonTitle = document.createElement('h3');
    lessonTitle.textContent = lessonName;

    header.appendChild(toggleButton);
    header.appendChild(lessonTitle);
    lessonCard.appendChild(header);

    const content = document.createElement('div');
    content.className = 'lesson-content';
    content.style.display = 'none'; // Collapsed by default

    exercices.forEach((exercise) => {
        const exerciseCard = document.createElement('div');
        exerciseCard.className = 'exercise-card';

        const title = document.createElement('strong');
        title.textContent = `${exercise.fields.ID}. ${exercise.fields.Title}`;

        const meta = document.createElement('p');
        meta.innerHTML = `${exercise.fields.Competence} - ${exercise.fields.Theme}<br><em>${exercise.fields.Lesson}</em>`;

        const date = document.createElement('small');
        date.innerHTML = `<em>Modifié le : ${new Date(exercise.fields.Modified).toLocaleDateString()}</em>`;

        exerciseCard.appendChild(title);
        exerciseCard.appendChild(meta);
        exerciseCard.appendChild(date);

        content.appendChild(exerciseCard);
    });

    lessonCard.appendChild(content);
    return lessonCard;
};

async function fetchExercises() {
    const response = await fetch('/.netlify/functions/fetchAirtable');
    const data = await response.json();
    console.log("Données reçues :", data); // Vérifiez que les données sont correctes
    return data;
}
