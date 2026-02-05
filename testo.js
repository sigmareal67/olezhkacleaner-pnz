// Управление модальными окнами
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal-window');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Закрытие модального окна при нажатии Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-window');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Управление списком задач
document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.querySelector('.task-input');
    const addButton = document.querySelector('.add-button');
    const tasksDisplay = document.querySelector('.tasks-display');
    const tasksCount = document.querySelector('.tasks-count');
    
    let tasksArray = [];
    
    // Загрузка задач из localStorage
    if (localStorage.getItem('tasks') !== null) {
        tasksArray = JSON.parse(localStorage.getItem('tasks'));
        tasksArray.forEach(task => {
            createTaskElement(task);
        });
        updateTasksCount();
    }
    
    // Добавление новой задачи
    addButton.addEventListener('click', function() {
        if (taskInput.value.trim() === '') return;
        
        const taskText = taskInput.value.trim();
        createTaskElement(taskText);
        tasksArray.push(taskText);
        localStorage.setItem('tasks', JSON.stringify(tasksArray));
        
        taskInput.value = '';
        updateTasksCount();
    });
    
    // Функция создания элемента задачи
    function createTaskElement(taskText) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        
        const textElement = document.createElement('p');
        textElement.className = 'task-text';
        textElement.textContent = taskText;
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '✓ Выполнено';
        
        deleteButton.addEventListener('click', function() {
            const index = tasksArray.indexOf(taskText);
            if (index > -1) {
                tasksArray.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasksArray));
            }
            
            taskItem.remove();
            updateTasksCount();
        });
        
        taskItem.appendChild(textElement);
        taskItem.appendChild(deleteButton);
        tasksDisplay.appendChild(taskItem);
    }
    
    // Обновление счетчика задач
    function updateTasksCount() {
        const tasksNumber = tasksDisplay.children.length;
        let word = 'заданий';
        
        if (tasksNumber === 1) {
            word = 'задание';
        } else if (tasksNumber >= 2 && tasksNumber <= 4) {
            word = 'задания';
        }
        
        tasksCount.textContent = `На сегодня ${tasksNumber} ${word}`;
    }
    
    // Инициализация свайпера
    setTimeout(function() {
        if (typeof Swiper === 'undefined') {
            console.error('Swiper не загружен!');
            return;
        }
        
        const contestsSlider = new Swiper('.contests-slider', {
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    }, 500);
});