// Datos oficiales de las sedes
const locationData = {
    "lima": {
        value: "lima",
        name: "Clínica Dental Ramos - SMP",
        phoneText: "(+51) 967-959-557",
        phoneHref: "tel:+51967959557",
        address: "Calle Sta. Mercedes con Alfredo Mendiola, SMP",
        whatsapp: "https://wa.me/51967959557?text=Hola%2C%20quiero%20agendar%20una%20cita%20en%20la%20sede%20SMP.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1951.178087951101!2d-77.06175166174741!3d-12.018982373639592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2spe!4v1783820654628!5m2!1ses-419!2spe",
        mapLink: "https://www.google.com/maps/dir/?api=1&destination=-12.018982,-77.061752"
    }
};

// Función para actualizar todos los elementos del DOM basados en la sede activa
function updatePageLocation(selectedBranch) {
    const data = locationData[selectedBranch];
    if (!data) return;

    // Guardar selección en localStorage
    localStorage.setItem('selectedLocation', selectedBranch);

    // 1. Actualizar selectores en el Header/Menús
    document.querySelectorAll('[data-location-selector]').forEach(select => {
        select.value = selectedBranch;
    });

    // 2. Actualizar enlaces de teléfono (del header/barra utilidades y footer)
    document.querySelectorAll('[data-location-phone]').forEach(el => {
        el.href = data.phoneHref;
        // Si el elemento contiene solo texto o un enlace directo, actualizamos el texto del teléfono
        const textNode = el.querySelector('[data-phone-text]') || el;
        if (textNode) {
            // Preservamos el icono si lo hubiera
            const icon = el.querySelector('.material-symbols-outlined');
            if (icon) {
                textNode.innerHTML = '';
                textNode.appendChild(icon);
                textNode.appendChild(document.createTextNode(' ' + data.phoneText));
            } else {
                textNode.textContent = data.phoneText;
            }
        }
    });

    // 3. Actualizar textos de dirección
    document.querySelectorAll('[data-location-address]').forEach(el => {
        el.textContent = data.address;
    });

    // 4. Actualizar enlaces de WhatsApp
    document.querySelectorAll('[data-location-whatsapp]').forEach(el => {
        el.href = data.whatsapp;
    });

    // 5. Actualizar mapas e iframes
    document.querySelectorAll('[data-location-map]').forEach(iframe => {
        iframe.src = data.mapEmbed;
    });
    document.querySelectorAll('[data-location-map-link]').forEach(el => {
        el.href = data.mapLink;
    });

    // Dispatch event para otros scripts que requieran saber el cambio
    window.dispatchEvent(new CustomEvent('locationChanged', { detail: data }));
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Obtener la sede guardada o usar Lima por defecto
    const savedLocation = localStorage.getItem('selectedLocation') || 'lima';
    
    // Configurar listeners en los selectores
    document.querySelectorAll('[data-location-selector]').forEach(select => {
        select.value = savedLocation;
        select.addEventListener('change', (e) => {
            updatePageLocation(e.target.value);
        });
    });

    // Primera actualización
    updatePageLocation(savedLocation);

    // Configurar listeners para el menú móvil
    const menuBtn = document.getElementById('mobile-menu-trigger');
    const closeBtn = document.getElementById('close-drawer');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');

    function toggleDrawer(isOpen) {
        if (!drawer || !overlay) return;
        if (isOpen) {
            drawer.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        } else {
            drawer.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    }

    if (menuBtn && closeBtn && drawer && overlay) {
        menuBtn.addEventListener('click', () => toggleDrawer(true));
        closeBtn.addEventListener('click', () => toggleDrawer(false));
        overlay.addEventListener('click', () => toggleDrawer(false));
    }
});
