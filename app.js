console.log(`Bienvenido al administrador de tareas`);

const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskInput = document.getElementById('task-input');
    const taskInputValue = taskInput.value;

    if (!validateTaskValue(taskInputValue)) return;

    taskList.prepend(createTaskElement(taskInputValue));

    taskInput.value = '';
});

function createTaskElement(task) {
    const liElement = document.createElement('li');
    const spanElement = document.createElement('span');
    spanElement.className = 'w-full';
    spanElement.textContent = task;
    const divElement = document.createElement('div');
    divElement.className = 'w-[80px] flex justify-between';
    const btnEdit = createSpanAction('✏️', 'Editar', 'btn-edit');
    const btnDelete = createSpanAction('🗑️', 'Eliminar', 'btn-delete');
    
    divElement.append(btnEdit);
    divElement.append(btnDelete);

    liElement.append(spanElement);
    liElement.append(divElement);

    return liElement;
}
function createSpanAction(content, title, classes) {
    const spanElement = document.createElement('span');
    spanElement.textContent = content;
    spanElement.title = title;
    spanElement.className = classes;
    return spanElement;
}
function validateTaskValue(task) {
    if (typeof task !== 'string') {
        console.error(`Ingresaste un ${typeof task}, debes ingresar un valor de tipo '${typeof task}'`);
        return false;
    }
    if (typeof task === 'string' && !task) {
        console.warn(`Ingresa un valor para agregar tarea`);
        return false;
    }
    return true;
}