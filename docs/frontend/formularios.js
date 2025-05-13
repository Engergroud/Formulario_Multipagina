let records = [];
let formData = {
    persona: {},
    familiares: [],
    condiciones: [],
    internamientos: []
};
let currentEditIndex = null;
let modalHistory = [];
let lastId = 0;

//Funcion para cargar los datos desde el JSON server
async function loadRecords() {
    try {
        const response = await fetch('https://torch-tangible-gaura.glitch.me/records');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        records = await response.json();
        lastId = records.length > 0 ? records.length : 0;
        displayRecords();
    } catch (error) {
        console.error('Error loading JSON data:', error);
    }
}

//Abrir el primer Modal y cargar el numero siguiente a agregar
function openModal(modalId) {
    lastId++;
    $('#' + modalId).modal('show');
    modalHistory.push(modalId);
    updateModalInputs(modalId);
}

//Funcion para abrir el Modal proximo al hacer click al siguiente y validamos que Nombre no este vacio
function nextModal(nextModalId) {
    const Nombre=document.getElementById('nombre').value
    if(Nombre==''){
        alert("Es necesario llenar el Nombre para Continuar")
    }else{
    $('#' + nextModalId).modal('show');
    modalHistory.push(nextModalId);
    if (nextModalId === 'familiaresModal') {
        formData.persona = {
            nombre: document.getElementById('nombre').value
        };
        const familiarlabel=document.getElementById('familiaresModalLabel');
        familiarlabel.innerHTML=`Familiares del paciente(${formData.persona.nombre})`
    }else if(nextModalId === 'condicionesModal'){
        const familiarlabel=document.getElementById('condicionesModalLabel');
        familiarlabel.innerHTML=`Condiciones Pre-Existentes del paciente (${formData.persona.nombre})`
    }else if(nextModalId === 'internamientosModal'){
        const familiarlabel=document.getElementById('internamientosModalLabel');
        familiarlabel.innerHTML=`Internamientos Realizados al paciente (${formData.persona.nombre})`
    }
    $('.modal').modal('hide');
    
    }
}

//Funcion para regresar al anterior Modal
function previousModal() {
    modalHistory.pop();
    if (modalHistory.length > 0) {
        const previousModal = modalHistory[modalHistory.length - 1];
        $('#' + previousModal).modal('show');
        updateModalInputs(previousModal);
    }
    $('.modal').modal('hide');
}

//Funcion que limpiara todos los inputs al cerrar un Modal haciendo un registro
function Cerrar_Modal(){
    const familiaresContainer = document.getElementById('familiares-list');
    formData = { persona: {}, familiares: [], condiciones: [], internamientos: [] };
    lastId--;
    clearInputs('datosPersonalesModal');
    clearInputs('familiaresModal');
    clearInputs('condicionesModal');
    clearInputs('internamientosModal');
    familiaresContainer.innerHTML='';
}

//funcion para mostrar los registros que se han realizado
function updateModalInputs(modalId) {
    if (modalId === 'familiaresModal') {
        document.getElementById('nombre').value = formData.persona.nombre || '';
    } else if (modalId === 'condicionesModal') {
        displayFamiliares();
    } else if (modalId === 'internamientosModal') {
        displayCondiciones();
    }
}

//Funcion para agregar un Familiar al registro
function addFamiliar() {
    const familiar = {
        nombre: document.getElementById('nombre-familiar').value,
        parentesco: document.getElementById('parentesco').value,
        edad: document.getElementById('edad').value
    };
    formData.familiares.push(familiar);
    clearInputs('familiares-container');
    displayFamiliares();
}

///Funcion para editar el registro de un familiar realizado en el proceso
function editarFamiliar(i) {
    // Obtener los elementos de entrada correspondientes al familiar seleccionado
    const nombreInput = document.getElementById(`N-${i}`);
    const parentescoInput = document.getElementById(`P-${i}`);
    const edadInput = document.getElementById(`E-${i}`);
    const guardarButton = document.getElementById(`guardar-${i}`);

    // Verificar si los campos están deshabilitados (modo de visualización)
    if (nombreInput.disabled) {
        // Habilitar los campos de entrada para edición
        nombreInput.disabled = false;
        parentescoInput.disabled = false;
        edadInput.disabled = false;

        // Cambiar el texto del botón a "Guardar"
        guardarButton.textContent = 'Guardar';
    } else {
        // Deshabilitar los campos de entrada para visualización
        nombreInput.disabled = true;
        parentescoInput.disabled = true;
        edadInput.disabled = true;

        // Actualizar el objeto familiar con los nuevos valores
        const familiar = {
            nombre: nombreInput.value,
            parentesco: parentescoInput.value,
            edad: edadInput.value
        };
        formData.familiares[i] = familiar;

        // Cambiar el texto del botón a "Editar"
        guardarButton.textContent = 'Editar';
    }
}

//Funcion para eliminar un familiar Registrado en el Proceso
function eliminarFamiliar(i){
    const nombre = document.getElementById(`N-${i}`).value;

    formData.familiares = formData.familiares.filter(familiar => familiar.nombre != nombre);
    displayFamiliares();
    
}

//Funcion para ver los familiares registrados recientemente
function displayFamiliares() {
    const familiaresContainer = document.getElementById('familiares-list');
    familiaresContainer.innerHTML =  `
        <div class="Editar_Familiar">
        ${formData.familiares.map((f, i) =>`
            <div style="border-top: solid 1px; margin-top: 3px;">
            <label>Familiar ${i + 1}:</label><br>
            Nombre: <input type="text" id="N-${i}" class="form-control" value="${f.nombre}" placeholder="Nombre" disabled>
            Parentesco: <input type="text" id="P-${i}" class="form-control" value="${f.parentesco}" placeholder="Parentesco" disabled>
            Edad: <input type="number" id="E-${i}" class="form-control" value="${f.edad}" placeholder="Edad" disabled>
            <button type="button" id="guardar-${i}" class="btn btn-secondary" onclick="editarFamiliar(${i})">Editar</button>
            <button type="button" class="btn btn-primary" onclick="eliminarFamiliar(${i})">Eliminar</button>
            </div>
            `).join('')}
        </div>`
}
    
//Funcion para agregarle condicion a la persona
function addCondicion() {
    const condicion = {
        enfermedad: document.getElementById('enfermedad').value,
        tiempo: document.getElementById('tiempo').value
    };
    formData.condiciones.push(condicion);
    clearInputs('condiciones-container');
    displayCondiciones();
}

//FUncion para mostrar las condiciones agregadas
function displayCondiciones() {
    const condicionesContainer = document.getElementById('condiciones-list');
    condicionesContainer.innerHTML =  `
        <div class="Editar_Condicion">
        ${formData.condiciones.map((c, i) =>`
            <div style="border-top: solid 1px; margin-top: 3px;">
            <label>Condición ${i + 1}:</label>
            <input type="text" id="Ed-${i}" class="form-control" value="${c.enfermedad}" placeholder="Enfermedad" disabled>
            <input type="text" id="T-${i}" class="form-control" value="${c.tiempo}" placeholder="Tiempo" disabled>
            <button type="button" id="guardarC-${i}" class="btn btn-secondary" onclick="editarCondicion(${i})">Editar</button>
            <button type="button" class="btn btn-primary" onclick="eliminarCondicion(${i})">Eliminar</button>
            </div>
            `).join('')}
        </div>`
}

//funcion para editar una condicion agregada por la persona
function editarCondicion(i) {
    // Obtener los elementos de entrada correspondientes a la condicion seleccionada
    const EnfermedadInput = document.getElementById(`Ed-${i}`);
    const TiempoInput = document.getElementById(`T-${i}`);
    const guardarButton = document.getElementById(`guardarC-${i}`);

    // Verificar si los campos están deshabilitados (modo de visualización)
    if (EnfermedadInput.disabled) {
        // Habilitar los campos de entrada para edición
        EnfermedadInput.disabled = false;
        TiempoInput.disabled = false;

        // Cambiar el texto del botón a "Guardar"
        guardarButton.textContent = 'Guardar';
    } else {
        // Deshabilitar los campos de entrada para visualización
        EnfermedadInput.disabled = true;
        TiempoInput.disabled = true;

        // Actualizar el objeto familiar con los nuevos valores
        const Condicion = {
            enfermedad: EnfermedadInput.value,
            tiempo: TiempoInput.value,
        };
        formData.condiciones[i] = Condicion;

        // Cambiar el texto del botón a "Editar"
        guardarButton.textContent = 'Editar';
    }
}

//Funcion para eliminar una condicion Registrado por la persona
function eliminarCondicion(i){
    const enfermedad = document.getElementById(`E-${i}`).value;

    formData.condiciones = formData.condiciones.filter(condicion => condicion.enfermedad != enfermedad);
    displayCondiciones();
    
}

//Funcion para agregar si alguna vez fue internado el paciente
function addInternamiento() {
    const inter = {
        fecha: document.getElementById('fecha').value,
        centroMedico: document.getElementById('centro-medico').value,
        diagnostico: document.getElementById('diagnostico').value
    };
    formData.internamientos.push(inter);
    clearInputs('internamientos-container');
    displayInternamientos();
}

function displayInternamientos() {
    const internamientosContainer = document.getElementById('internamientos-list');
    internamientosContainer.innerHTML = `
        <div class="Editar_Internamiento">
        ${formData.internamientos.map((I, i) =>`
            <div style="border-top: solid 1px; margin-top: 3px;">
            <label>Internamiento ${i + 1}:</label>
            <input type="date" id="F-${i}" class="form-control" value="${I.fecha}" placeholder="Fecha" disabled>
            <input type="text" id="C-${i}" class="form-control" value="${I.centroMedico}" placeholder="Centro Médico" disabled>
            <input type="text" id="D-${i}" class="form-control" value="${I.diagnostico}" placeholder="Diagnóstico" disabled>
            <button type="button" id="guardarI-${i}" class="btn btn-secondary" onclick="Editar_Internamiento(${i})">Editar</button>
            <button type="button" class="btn btn-primary" onclick="eliminarInternamiento(${i})">Eliminar</button>
            </div>
            `).join('')}
        </div>`
}

//funcion para editar una condicion agregada por la persona
function Editar_Internamiento(i) {
    // Obtener los elementos de entrada correspondientes a la condicion seleccionada
    const FechaInput = document.getElementById(`F-${i}`);
    const CentroMedicoInput = document.getElementById(`C-${i}`);
    const DiagnosticoInput = document.getElementById(`D-${i}`);
    const guardarButton = document.getElementById(`guardarI-${i}`);

    // Verificar si los campos están deshabilitados (modo de visualización)
    if (CentroMedicoInput.disabled) {
        // Habilitar los campos de entrada para edición
        CentroMedicoInput.disabled = false;
        DiagnosticoInput.disabled = false;
        FechaInput.disabled=false;

        // Cambiar el texto del botón a "Guardar"
        guardarButton.textContent = 'Guardar';
    } else {
        // Deshabilitar los campos de entrada para visualización
        CentroMedicoInput.disabled = true;
        DiagnosticoInput.disabled = true;
        FechaInput.disabled=true;

        // Actualizar el objeto familiar con los nuevos valores
        const internamiento = {
        fecha: FechaInput,
        centroMedico: centroMedico,
        diagnostico: DiagnosticoInput
        };
        formData.internamientos[i] = internamiento;

        // Cambiar el texto del botón a "Editar"
        guardarButton.textContent = 'Editar';
    }
}

//Funcion para eliminar una condicion Registrado por la persona
function eliminarCondicion(i){
    const centroMedicoo = document.getElementById(`C-${i}`).value;

    formData.internamientos = formData.internamientos.filter(inter => inter.centroMedico != centroMedicoo);
    displayInternamientos();
    
}

function clearInputs(containerId) {
    const container = document.getElementById(containerId);
    container.querySelectorAll('input').forEach(input => input.value = '');
}

async function saveRecord() {
    try {
        const newRecord = {
            id: `${lastId}`,
            persona: formData.persona,
            familiares: formData.familiares,
            condiciones: formData.condiciones,
            internamientos: formData.internamientos
        };
        const response = await fetch('https://torch-tangible-gaura.glitch.me/records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecord)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        formData = { persona: {}, familiares: [], condiciones: [], internamientos: [] };
        modalHistory = [];
        $('.modal').modal('hide');
        loadRecords();
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

async function updateRecordOnServer(id) {
    try {
        const recordToUpdate = records.find(r => r.id == id);
        const response = await fetch(`https://torch-tangible-gaura.glitch.me/records/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recordToUpdate)
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error ${response.status}: ${errorMessage}`);
        }
        $('.modal').modal('hide');
        loadRecords();
    } catch (error) {
        console.error('Error updating data:', error);
    }
}

function displayRecords() {
    const recordsList = document.getElementById('records-list');
    recordsList.innerHTML = records.map(record => `
        <div class="record card">
            <div class="card-body">
                <h5 class="card-title">Paciente: ${record.persona.nombre}</h5>
                <button type="button" class="btn btn-secondary" onclick="editRecord(${record.id})">Editar</button>
                <button type="button" class="btn btn-danger" onclick="deleteRecord(${record.id})">Eliminar</button>
                <button type="button" class="btn btn-secondary" onclick="showSummary(${record.id})">Ver Resumen</button>
            </div>
        </div>
    `).join('');
}

function editRecord(id) {
    currentEditIndex = records.findIndex(r => r.id == id);
    const record = records[currentEditIndex];
    const editContent = document.getElementById('edit-record-content');
    editContent.innerHTML = `
        <label for="edit-nombre">Nombre:</label>
        <input type="text" id="edit-nombre" class="form-control" value="${record.persona.nombre}">
        <div id="edit-familiares-container">
            ${record.familiares.map((f, i) => `
                <div>
                    <label>Familiar ${i + 1}:</label>
                    <input type="text" class="form-control" value="${f.nombre}" placeholder="Nombre">
                    <input type="text" class="form-control" value="${f.parentesco}" placeholder="Parentesco">
                    <input type="number" class="form-control" value="${f.edad}" placeholder="Edad">
                </div>
            `).join('')}
        </div>
        <div id="edit-condiciones-container">
            ${record.condiciones.map((c, i) => `
                <div>
                    <label>Condición ${i + 1}:</label>
                    <input type="text" class="form-control" value="${c.enfermedad}" placeholder="Enfermedad">
                    <input type="text" class="form-control" value="${c.tiempo}" placeholder="Tiempo">
                </div>
            `).join('')}
        </div>
        <div id="edit-internamientos-container">
            ${record.internamientos.map((i, idx) => `
                <div>
                    <label>Internamiento ${idx + 1}:</label>
                    <input type="date" class="form-control" value="${i.fecha}" placeholder="Fecha">
                    <input type="text" class="form-control" value="${i.centroMedico}" placeholder="Centro Médico">
                    <input type="text" class="form-control" value="${i.diagnostico}" placeholder="Diagnóstico">
                </div>
            `).join('')}
        </div>
    `;
    openModal('editRecordModal');
}

function updateRecord() {
    const editContent = document.getElementById('edit-record-content');
    const nombre = editContent.querySelector('#edit-nombre').value;
    const familiares = Array.from(editContent.querySelectorAll('#edit-familiares-container div')).map(div => {
        const inputs = div.querySelectorAll('input');
        return {
            nombre: inputs[0].value,
            parentesco: inputs[1].value,
            edad: inputs[2].value
        };
    });
    const condiciones = Array.from(editContent.querySelectorAll('#edit-condiciones-container div')).map(div => {
        const inputs = div.querySelectorAll('input');
        return {
            enfermedad: inputs[0].value,
            tiempo: inputs[1].value
        };
    });
    const internamientos = Array.from(editContent.querySelectorAll('#edit-internamientos-container div')).map(div => {
        const inputs = div.querySelectorAll('input');
        return {
            fecha: inputs[0].value,
            centroMedico: inputs[1].value,
            diagnostico: inputs[2].value
        };
    });
    records[currentEditIndex] = {
        id: records[currentEditIndex].id,
        persona: { nombre },
        familiares,
        condiciones,
        internamientos
    };
    updateRecordOnServer(records[currentEditIndex].id);
    $('.modal').modal('hide');
    displayRecords();
}

async function deleteRecord(id) {
    try {
        const response = await fetch(`https://torch-tangible-gaura.glitch.me/records/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        loadRecords();
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}

function showSummary(id) {
    const summaryContent = document.getElementById('summary-content');
    const record = records.find(r => r.id == id);
    summaryContent.innerHTML = `
        <div class="card mb-2">
            <div class="card-body">
                <h6 style="font-size: 20px;"><stron>Paciente</stron></h6>
                <p><strong>Nombre:</strong> ${record.persona.nombre}</p>
                <p><strong>Familiares:</strong></p>
                <ul>
                    ${record.familiares.map(f => `<li>${f.nombre} - ${f.parentesco} - ${f.edad} años</li>`).join('')}
                </ul>
                <p><strong>Condiciones:</strong></p>
                <ul>
                    ${record.condiciones.map(c => `<li>${c.enfermedad} - ${c.tiempo}</li>`).join('')}
                </ul>
                <p><strong>Internamientos:</strong></p>
                <ul>
                    ${record.internamientos.map(i => `<li>${i.fecha} - ${i.centroMedico} - ${i.diagnostico}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    openModal('summaryModal');
}

// Cargar los datos iniciales en la página principal
loadRecords();
