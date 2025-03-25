console.log(`Bienvenido al administrador de tareas`);

const TIPOMENSAJE = {
    info: 'Información',
    warning: 'Advertencia',
    success: 'Éxito',
    error: 'Error',
    info: 'Información',
    question: 'Pregunta'
}
const mensaje = (mensaje = 'Mensaje por defecto', tipoIcon = 'info', timer = 3000) => {
    if (!Object.keys(TIPOMENSAJE).includes(tipoIcon)) return console.error('Ingrese un tipoIcon valido...');

    Swal.fire({
        title: TIPOMENSAJE[tipoIcon],
        text: mensaje,
        icon: tipoIcon,
        timer, // Se cierra en 3000ms (3 segundos)
        showConfirmButton: false // Oculta el botón de confirmación
    });
}
const createTaskElement = (task) => {
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
const createSpanAction = (content, title, classes) => {
    const spanElement = document.createElement('span');
    spanElement.textContent = content;
    spanElement.title = title;
    spanElement.className = classes;
    return spanElement;
}
const validateTaskValue = (task, action = 'agregar') => {
    if (typeof task !== 'string') {
        console.error(`Ingresaste un ${typeof task}, debes ingresar un valor de tipo '${typeof task}'`);
        mensaje('Debes ingresar un valor valido', 'error')
        return false;
    }
    if (typeof task === 'string' && !task) {
        console.warn(`Ingresa un valor para ${action} tarea`);
        mensaje('Debes ingresar un valor', 'warning');
        return false;
    }
    return true;
}

const ConfirmDeletetask = (task) => {
    const textContent = task.children[0].textContent;
    const text = textContent.length > 25 ? `${textContent.slice(0, 25)}...` : textContent.slice(0, 25);

    Swal.fire({
        title: `¿Estás seguro? de eliminar la tarea "${text}"`,
        text: "No podrás revertir esto.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            console.log("El usuario confirmó");
            task.remove();
            removeTaskLocalStorage(textContent);
        }
    });
}
const editTask = (task) => {
    Swal.fire({
        title: "Ingresa tu nombre",
        input: "text",
        inputValue: task.children[0].textContent,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            if (validateTaskValue(result.value, 'editar')) {
                updateTaskLocalStorage(task.children[0].textContent, result.value);
                task.children[0].textContent = result.value;
                mensaje(`Tarea se actualizo correctamente`, 'success')
            } else {
                mensaje(`Ingrese un valor para editar tarea`, 'warning')
            }
        }
    });
}
const storeTaskInLocalStorage = (task) => {
    const itemTasksLocalStorage = JSON.parse(localStorage.getItem('tasks') || "[]");
    itemTasksLocalStorage.push(task);
    localStorage.setItem('tasks', JSON.stringify(itemTasksLocalStorage));
}
const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    if (tasks.length > 0) {
        tasks.forEach(task => {
            taskList.prepend(createTaskElement(task));
        });
    } else {
        mensaje('Aún no hay tareas guardadas', 'info', 1500)
    }
}
const removeTaskLocalStorage = (task) => {
    const itemTasksLocalStorage = JSON.parse(localStorage.getItem('tasks') || "[]");
    const index = itemTasksLocalStorage.indexOf(task);
    itemTasksLocalStorage.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(itemTasksLocalStorage));
}
const updateTaskLocalStorage = (task, newValue) => {
    const itemTasksLocalStorage = JSON.parse(localStorage.getItem('tasks') || "[]");
    const index = itemTasksLocalStorage.indexOf(task);
    itemTasksLocalStorage[index] = newValue;
    localStorage.setItem('tasks', JSON.stringify(itemTasksLocalStorage));
}

const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const inputForm = form.tarea;
const buttonForm = form.querySelector('button');
const btnDarkMode = document.getElementById('btn-dark-mode');

loadTasks();

inputForm.addEventListener('input', () => {
    buttonForm.disabled = inputForm.value.trim() === '';
})

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskInput = document.getElementById('task-input');
    const taskInputValue = taskInput.value.trim();

    if (!validateTaskValue(taskInputValue)) return;

    taskList.prepend(createTaskElement(taskInputValue));
    storeTaskInLocalStorage(taskInputValue);
    buttonForm.disabled = true;

    mensaje('Tarea se agrego correctamente', 'success')

    taskInput.value = '';
});

taskList.addEventListener('click', (event) => {
    // Editar tareas
    const actionEdit = event.target.closest('span.btn-edit');
    if (event.target.classList.contains('btn-edit')) {
        editTask(actionEdit.closest('li'));
    }

    // Eliminar tareas
    const actionDelete = event.target.closest('span.btn-delete'); // captura el elemento de lo contrarío devuelve null
    // if (actionDelete !== null) actionDelete.closest('li').remove();

    if (event.target.classList.contains('btn-delete')) {
        ConfirmDeletetask(actionDelete.closest('li'));
    }
});

btnDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('bg-dark');
    document.querySelectorAll('.boton').forEach(boton => boton.classList.toggle('boton-dark'));
    const theme = document.body.classList.contains('bg-dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('bg-dark');
    document.querySelectorAll('.boton').forEach(boton => boton.classList.add('boton-dark'));
}
