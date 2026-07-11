// Datos oficiales de las sedes (Extraídos de 508dentist-analisis-completo.md)
const locationData = {
    "swansea": {
        value: "swansea",
        name: "Swansea Office",
        phoneText: "(508) 570-2332",
        phoneHref: "tel:+15085702332",
        address: "1010 Grand Army of the Republic Hwy Ste 10, Swansea, MA 02777",
        whatsapp: "https://wa.me/15085702332?text=Hola%2C%20quiero%20agendar%20una%20cita%20en%20la%20sede%20Swansea.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2979.799790514068!2d-71.1895697!3d41.778841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e45bebe69752d5%3A0xe54199c0d45b74c5!2s508%20Dentist%20-%20Swansea!5e0!3m2!1sen!2sus!4v1720640000000!5m2!1sen!2sus",
        mapLink: "https://maps.app.goo.gl/1S6p8v3TjD2oA4bX8"
    },
    "north-attleborough": {
        value: "north-attleborough",
        name: "North Attleborough Office",
        phoneText: "(508) 301-9909",
        phoneHref: "tel:+15083019909",
        address: "865 E Washington St, North Attleborough, MA 02760",
        whatsapp: "https://wa.me/15083019909?text=Hola%2C%20quiero%20agendar%20una%20cita%20en%20la%20sede%20North%20Attleborough.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2966.5292437648354!2d-71.3197607!3d41.967406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e46244fcd61195%3A0x7d01878d46a48fbe!2s508%20Dentist%20-%20North%20Attleborough!5e0!3m2!1sen!2sus!4v1720640000000!5m2!1sen!2sus",
        mapLink: "https://maps.app.goo.gl/9xZk7B1B6t9N4bX8"
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
    // Obtener la sede guardada o usar swansea por defecto
    const savedLocation = localStorage.getItem('selectedLocation') || 'swansea';
    
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
