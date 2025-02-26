
let money = 1000;
const properties = [
    { id: 1, name: "Apartamento 1", price: 500, rentBase: 100, rented: false, occupied: false, level: 1 },
    { id: 2, name: "Apartamento 2", price: 700, rentBase: 150, rented: false, occupied: false, level: 1 },
    { id: 3, name: "Apartamento 3", price: 1000, rentBase: 200, rented: false, occupied: false, level: 1 },
];
const myProperties = [];

// Costo captar un inquilino
const INQUILINO_COST = 100;

// Costo de subir de nivel
const LEVEL_UP_COST = 200;


const moneyElement = document.getElementById("money");
const propertiesList = document.getElementById("properties-list");
const myPropertiesList = document.getElementById("my-properties-list");

// Mostrar propiedades disponibles
function renderProperties() {
    propertiesList.innerHTML = "";
    properties.forEach(property => {
        if (!property.rented) {
            const li = document.createElement("li");
            li.innerHTML = `
                ${property.name} - Precio: $${property.price} - Alquiler: $${property.rentBase * property.level}
                <button onclick="buyProperty(${property.id})">Comprar</button>
            `;
            propertiesList.appendChild(li);
        }
    });
}

// Mostrar mis propiedades
function renderMyProperties() {
    myPropertiesList.innerHTML = "";
    myProperties.forEach(property => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${property.name} - <span class="property-level">Nivel: ${property.level}</span> - Alquiler: $${property.rentBase * property.level} - 
            ${property.occupied ? "Ocupado" : "Vacío"}
            ${!property.occupied ? `<button onclick="captarInquilino(${property.id})">Captar Inquilino</button>` : ""}
            <button onclick="subirNivel(${property.id})">Subir Nivel ($${LEVEL_UP_COST * property.level})</button>
        `;
        myPropertiesList.appendChild(li);
    });
}

// Comprar una propiedad
function buyProperty(id) {
    const property = properties.find(p => p.id === id);
    if (money >= property.price) {
        money -= property.price;
        property.rented = true;
        myProperties.push(property);
        updateMoney();
        renderProperties();
        renderMyProperties();
        alert(`Has comprado ${property.name}. Ahora debes captar un inquilino.`);
    } else {
        alert("No tienes suficiente dinero para comprar esta propiedad.");
    }
}

// Captar un inquilino
function captarInquilino(id) {
    const property = myProperties.find(p => p.id === id);
    if (money >= INQUILINO_COST) {
        money -= INQUILINO_COST;
        property.occupied = true;
        updateMoney();
        renderMyProperties();
        alert(`Has captado un inquilino para ${property.name}.`);
    } else {
        alert("No tienes suficiente dinero para captar un inquilino.");
    }
}

// Subir de nivel un apartamento
function subirNivel(id) {
    const property = myProperties.find(p => p.id === id);
    const cost = LEVEL_UP_COST * property.level;
    if (money >= cost) {
        money -= cost;
        property.level += 1;
        updateMoney();
        renderMyProperties();

        // Aplicar animación al nivel
        const levelElement = document.querySelector(`#my-properties-list li:nth-child(${myProperties.indexOf(property) + 1}) .property-level`);
        levelElement.classList.add("level-up-animation");

        // Mostrar notificación
        showNotification(`¡${property.name} ha subido al nivel ${property.level}!`);

        // Eliminar la clase de animación después de que termine
        setTimeout(() => {
            levelElement.classList.remove("level-up-animation");
        }, 500); // Duración de la animación
    } else {
        alert(`No tienes suficiente dinero para subir de nivel. Necesitas $${cost}.`);
    }
}
// Cobrar alquiler automáticamente cada 1:00 minuto
setInterval(() => {
    if (myProperties.length > 0) {
        let totalRent = 0;
        myProperties.forEach(property => {
            if (property.occupied) {
                totalRent += property.rentBase * property.level;
            }
        });
        if (totalRent > 0) {
            money += totalRent;
            updateMoney();
            alert(`Se ha cobrado el alquiler. Has recibido $${totalRent}.`);
        }
    }
}, 60000); 

// Actualizar el dinero en la interfaz
function updateMoney() {
    moneyElement.textContent = money;
}




// Mostrar notificación
function showNotification(message) {
    const notificationContainer = document.getElementById("notification-container");
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}


// Inicializar el juego
renderProperties();
renderMyProperties();
updateMoney();