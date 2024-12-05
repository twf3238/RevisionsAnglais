document.addEventListener('DOMContentLoaded', () => {
    let subjectsData = {};
    let currentSubject = null;
    let currentLessonIndex = 0;
    let currentExerciseIndex = 0;
    let currentQuestionIndex = 0;
    let errorCount = 0; // Nombre d'erreurs

    // Charger les sujets depuis le fichier JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            subjectsData = data;
            loadSubjects();
        });

    // Charger la liste des sujets dans l'interface
    function loadSubjects() {
        const subjectsList = document.getElementById('subjects');
        subjectsList.innerHTML = '';
        subjectsData.subjects.forEach((subject, index) => {
            const li = document.createElement('li');
            li.textContent = subject.name;
            li.addEventListener('click', () => startSubject(index));
            subjectsList.appendChild(li);
        });
    }

    // Mélanger les questions d'un exercice
    function shuffleQuestions(questions) {
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]]; // Échange des questions
        }
    }

    // Mélanger les exercices dans chaque leçon
    function shuffleExercises(lesson) {
        lesson.exercises.forEach(exercise => {
            shuffleQuestions(exercise.questions);
        });
    }

    // Commencer un sujet
    function startSubject(index) {
        currentSubject = subjectsData.subjects[index];
        currentLessonIndex = 0;
        currentExerciseIndex = 0;
        currentQuestionIndex = 0;
        errorCount = 0; // Réinitialiser le nombre d'erreurs
        loadLessons();
    }

    // Charger les leçons d'un sujet
    function loadLessons() {
        const lessonsList = document.getElementById('lessons');
        lessonsList.innerHTML = '';
        currentSubject.lessons.forEach((lesson, index) => {
            const li = document.createElement('li');
            li.textContent = lesson.lessonName;
            li.addEventListener('click', () => startLesson(index));
            lessonsList.appendChild(li);
        });
        document.getElementById('subjectList').style.display = 'none';
        document.getElementById('lessonList').style.display = 'block';
        document.getElementById('backToSubjects').addEventListener('click', () => {
            document.getElementById('lessonList').style.display = 'none';
            document.getElementById('subjectList').style.display = 'block';
        });
    }

    // Commencer une leçon
    function startLesson(index) {
        const lesson = currentSubject.lessons[index];
        console.log(`Démarrage de la leçon : ${lesson.lessonName}`);
        shuffleExercises(lesson); // Mélanger les exercices de la leçon
        currentLessonIndex = index; // Enregistrer l'index de la leçon
        currentExerciseIndex = 0; // Réinitialiser l'index de l'exercice
        currentQuestionIndex = 0; // Réinitialiser l'index de la question
    
        // Afficher uniquement la section des exercices
        document.getElementById('subjectList').style.display = 'none';
        document.getElementById('lessonList').style.display = 'none';
        document.getElementById('quizSection').style.display = 'block';
    
        loadExercise(); // Charger le premier exercice
    }

    // Afficher un exercice
    function loadExercise() {
        const lesson = currentSubject.lessons[currentLessonIndex];
        const exercise = lesson.exercises[currentExerciseIndex];
        document.getElementById('instruction').textContent = exercise.instruction;
        showQuestion();
    }

    // Afficher la question actuelle
    function showQuestion() {
        const lesson = currentSubject.lessons[currentLessonIndex];
        const exercise = lesson.exercises[currentExerciseIndex];
        const question = exercise.questions[currentQuestionIndex];
        document.getElementById('question').textContent = question.sentence;
        document.getElementById('answer').value = '';
        document.getElementById('feedback').textContent = '';
    }

    // Valider la réponse avec le bouton ou la touche Entrée
    function submitAnswer() {
        const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
        const correctAnswer = currentSubject.lessons[currentLessonIndex].exercises[currentExerciseIndex].questions[currentQuestionIndex].answer.toLowerCase();
        const feedback = document.getElementById('feedback');

        if (userAnswer === correctAnswer) {
            feedback.textContent = "Bravo ! Réponse correcte.";
            feedback.style.color = "green";
            errorCount = 0; // Réinitialiser le compteur d'erreurs
            currentQuestionIndex++;
            if (currentQuestionIndex < currentSubject.lessons[currentLessonIndex].exercises[currentExerciseIndex].questions.length) {
                showQuestion();
            } else {
                currentExerciseIndex++;
                currentQuestionIndex = 0;
                if (currentExerciseIndex < currentSubject.lessons[currentLessonIndex].exercises.length) {
                    loadExercise();
                } else {
                    feedback.textContent = "Vous avez terminé cette leçon !";
                    feedback.style.color = "green";
                    setTimeout(endExercise, 2000); // Revenir à la liste des leçons après 2 secondes
                }
            }
        } else {
            errorCount++;
            if (errorCount < 2) {
                feedback.textContent = "Mauvaise réponse. Essayez encore.";
                feedback.style.color = "red";
            } else {
                feedback.textContent = `La bonne réponse est : ${correctAnswer}.`;
                feedback.style.color = "blue";
            }
        }
    }
    
    function endExercise() {
        console.log("Fin de l'exercice");
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('lessonList').style.display = 'block';
    }

    // Écouter la touche Entrée pour soumettre la réponse
    document.getElementById('answer').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });

    // Écouter le clic sur le bouton pour soumettre la réponse
    document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
});