document.addEventListener('DOMContentLoaded', () => {
    let subjectsData = {};
    let currentSubject = null;
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
            li.addEventListener('click', () => startQuiz(index));
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

    // Mélanger les questions à l'intérieur de chaque exercice
    function shuffleExercises(subject) {
        subject.exercises.forEach(exercise => {
            shuffleQuestions(exercise.questions);
        });
    }

    // Commencer le quiz pour un sujet donné
    function startQuiz(index) {
        currentSubject = subjectsData.subjects[index];
        currentExerciseIndex = 0;
        currentQuestionIndex = 0;
        errorCount = 0; // Réinitialiser le nombre d'erreurs
        shuffleExercises(currentSubject); // Mélanger les questions à l'intérieur des exercices
        document.getElementById('subjectList').style.display = 'none';
        document.getElementById('quizSection').style.display = 'block';
        showExercise();
    }

    // Afficher les exercices
    function showExercise() {
        const exercise = currentSubject.exercises[currentExerciseIndex];
        document.getElementById('instruction').textContent = exercise.instruction;
        showQuestion();
    }

    // Afficher la question en cours
    function showQuestion() {
        const exercise = currentSubject.exercises[currentExerciseIndex];
        const question = exercise.questions[currentQuestionIndex];
        document.getElementById('question').textContent = question.sentence;
        document.getElementById('answer').value = '';
        document.getElementById('feedback').textContent = '';
    }

    // Valider la réponse avec le bouton ou la touche Entrée
    function submitAnswer() {
        const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
        const correctAnswer = currentSubject.exercises[currentExerciseIndex].questions[currentQuestionIndex].answer.toLowerCase();
        const feedback = document.getElementById('feedback');

        if (userAnswer === correctAnswer) {
            feedback.textContent = "Bravo ! Réponse correcte.";
            feedback.style.color = "green";
            errorCount = 0; // Réinitialiser le compteur d'erreurs
            currentQuestionIndex++;
            if (currentQuestionIndex < currentSubject.exercises[currentExerciseIndex].questions.length) {
                showQuestion();
            } else {
                currentExerciseIndex++;
                currentQuestionIndex = 0;
                if (currentExerciseIndex < currentSubject.exercises.length) {
                    showExercise();
                } else {
                    feedback.textContent = "Vous avez terminé ce sujet !";
                    feedback.style.color = "green";
                    setTimeout(() => {
                        // Retourner à la liste des sujets après 2 secondes
                        document.getElementById('quizSection').style.display = 'none';
                        document.getElementById('subjectList').style.display = 'block';
                    }, 2000);
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

    // Écouter la touche Entrée pour soumettre la réponse
    document.getElementById('answer').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });

    // Écouter le clic sur le bouton pour soumettre la réponse
    document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
});