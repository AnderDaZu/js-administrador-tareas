console.log(`Bienvenido al administrador de tareas`);

const TIPOMENSAJE = {
    info: 'Información',
    warning: 'Advertencia',
    success: 'Éxito',
    error: 'Error',
    info: 'Información',
    question: 'Pregunta'
}
const mensaje = (mensaje = 'Mensaje por defecto', tipoIcon = 'info') => {
    if (!Object.keys(TIPOMENSAJE).includes(tipoIcon)) return console.error('Ingrese un tipoIcon valido...');

    Swal.fire({
        title: TIPOMENSAJE[tipoIcon],
        text: mensaje,
        icon: tipoIcon,
        timer: 3000, // Se cierra en 3000ms (3 segundos)
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
                task.children[0].textContent = result.value;
                mensaje(`Tarea se actualizo correctamente`, 'success')
            } else {
                mensaje(`Ingrese un valor para editar tarea`, 'warning')
            }
        }
    });
}

const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const inputForm = form.tarea;
const buttonForm = form.querySelector('button');

inputForm.addEventListener('input', () => {
    buttonForm.disabled = inputForm.value.trim() === '';
})

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskInput = document.getElementById('task-input');
    const taskInputValue = taskInput.value.trim();

    if (!validateTaskValue(taskInputValue)) return;

    taskList.prepend(createTaskElement(taskInputValue));

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

