/**
 * 1. CLASSES ET DONNÉES (Basées sur votre CSV LabelEco)
 */
class Entreprise {
    constructor(nom, secteur, taille, tags, coords, ville, phrase) {
        this.nom = nom;
        this.secteur = secteur; 
        this.taille = taille;   
        this.tags = tags;
        this.coords = coords;   
        this.ville = ville;     
        this.phrase = phrase;   
        this.pinElement = null; // Stocke la div HTML pour pouvoir la déplacer
    }
}

// Catalogue mis à jour avec vos vraies données et vos coordonnées E1 à E15
const catalogueEntreprises = [
    new Entreprise("Ecofrost", "food", "pme", [], { left: 50, top: 81.5 }, "Péruwelz", "La frite belge exportée dans le monde"),
    new Entreprise("Red System", "tech", "pme", ["Jobs pas comme les autres"], { left: 39, top: 59 }, "Wapi", "À compléter..."),
    new Entreprise("Storme", "food", "pme", ["Affaire de famille"], { left: 19, top: 21 }, "Wapi", "À compléter..."),
    new Entreprise("Les Glaces d’Élodie", "food", "independant", [], { left: 75, top: 32 }, "Wapi", "À compléter..."),
    new Entreprise("Moulin de Moulbaix", "agriculture", "pme", ["Affaire de famille"], { left: 74, top: 43 }, "Wapi", "À compléter..."),
    new Entreprise("Famiflora", "commerce", "grande", [], { left: 22, top: 19 }, "Wapi", "À compléter..."),
    new Entreprise("Atlantis Security", "art", "pme", ["Jobs pas comme les autres"], { left: 37, top: 62 }, "Wapi", "À compléter..."),
    new Entreprise("Les Camuches", "art", "pme", [], { left: 40, top: 65 }, "Wapi", "À compléter..."),
    new Entreprise("Mother Flower", "agriculture", "independant", ["Boss ladies"], { left: 37, top: 55.5 }, "Wapi", "À compléter..."),
    new Entreprise("Technord", "tech", "pme", [], { left: 35, top: 61 }, "Wapi", "À compléter..."),
    new Entreprise("Six Fumaison", "food", "pme", ["Jobs pas comme les autres"], { left: 19, top: 28 }, "Wapi", "À compléter..."),
    new Entreprise("Domaine Degavre", "agriculture", "pme", ["Jobs pas comme les autres"], { left: 72, top: 53.5 }, "Wapi", "À compléter..."),
    new Entreprise("Doc Phone", "commerce", "independant", ["Jobs pas comme les autres"], { left: 41, top: 55 }, "Wapi", "À compléter..."),
    new Entreprise("MyQM", "tech", "pme", ["Plot twist"], { left: 27, top: 52.5 }, "Wapi", "À compléter..."),
    new Entreprise("Hélène Création", "art", "independant", ["Boss ladies"], { left: 22, top: 30 }, "Wapi", "À compléter...")
];

/**
 * 2. LOGIQUE GLOBALE ET POSITIONNEMENT RESPONSIVE
 */
(function(){
    // Variable globale pour cibler l'image
    let mapImg;

    document.addEventListener('DOMContentLoaded', () => {
        mapImg = document.querySelector('.main-map-img'); 
        initialiserPins();
        setupInteractions();
    });

    // --- LA FONCTION MAGIQUE ADAPTÉE À TOUTES LES TAILLES D'IMAGE ---
    function positionnerPins() {
        if (!mapImg) return;
        
        // On récupère la taille et la position exactes de l'image sur l'écran
        const rect = mapImg.getBoundingClientRect();
        if (rect.width === 0) return; // Sécurité si l'image n'est pas chargée

        // 1. Vos dimensions de référence
        const REF_WIDTH = 1272;
        const REF_HEIGHT = 670;
        const naturalRatio = REF_WIDTH / REF_HEIGHT;

        // 2. Les dimensions réelles de l'élément image sur votre écran
        const containerW = rect.width;
        const containerH = rect.height;
        const containerRatio = containerW / containerH;

        let renderedW, renderedH, offsetX, offsetY;

        // 3. On simule "object-fit: contain" + On ajoute la position (left/top) de l'image
        if (containerRatio > naturalRatio) {
            renderedH = containerH;
            renderedW = renderedH * naturalRatio;
            // rect.left et rect.top permettent aux pictos de suivre l'image si elle est centrée
            offsetX = rect.left + (containerW - renderedW) / 2;
            offsetY = rect.top;
        } else {
            renderedW = containerW;
            renderedH = renderedW / naturalRatio;
            offsetX = rect.left;
            offsetY = rect.top + (containerH - renderedH) / 2;
        }

        // 4. On place les points avec une précision absolue
        catalogueEntreprises.forEach(ent => {
            if (ent.pinElement) {
                const leftVal = parseFloat(ent.coords.left);
                const topVal = parseFloat(ent.coords.top);
                
                const x = offsetX + (leftVal / 100) * renderedW;
                const y = offsetY + (topVal / 100) * renderedH;
                
                ent.pinElement.style.left = `${x}px`;
                ent.pinElement.style.top = `${y}px`;
            }
        });
    }

    /**
     * Initialisation des pins sur la carte
     */
    function initialiserPins() {
        const layer = document.querySelector('.icons-layer');
        if (!layer) return;
        
        catalogueEntreprises.forEach(ent => {
            const pinWrapper = document.createElement('div');
            pinWrapper.className = 'map-icon hidden';
            
            // Stockage des données pour le filtrage
            pinWrapper.dataset.secteur = ent.secteur;
            pinWrapper.dataset.taille = ent.taille;
            pinWrapper.dataset.tags = JSON.stringify(ent.tags);
            
            const img = document.createElement('img');
            img.src = `img/picto/${ent.secteur}.svg`;
            img.alt = ent.nom;
            
            // --- CLIC SUR UN PIN ---
            pinWrapper.addEventListener('click', (e) => {
                e.stopPropagation();
                ouvrirModale(ent, pinWrapper);
            });

            pinWrapper.appendChild(img);
            layer.appendChild(pinWrapper);
            
            // On sauvegarde l'élément HTML dans l'objet pour pouvoir le repositionner
            ent.pinElement = pinWrapper;
        });

        // On positionne les pins immédiatement (si l'image est déjà là) et à chaque redimensionnement
        if (mapImg.complete) {
            positionnerPins();
        }
        mapImg.addEventListener('load', positionnerPins);
        window.addEventListener('resize', positionnerPins);

        // --- GESTION DE LA FERMETURE ---
        const modalOverlay = document.getElementById('company-modal');
        const closeBtn = document.querySelector('.close-modal');

        const fermerTout = () => {
            if(modalOverlay) modalOverlay.style.display = 'none';
            document.querySelectorAll('.map-icon').forEach(p => p.classList.remove('focused'));
            const hero = document.querySelector('.fullscreen-hero');
            if(hero) hero.classList.remove('hero-blurred');
        };

        closeBtn?.addEventListener('click', fermerTout);
        modalOverlay?.addEventListener('click', (e) => {
            if (e.target === modalOverlay) fermerTout();
        });
    }

    /**
     * Remplissage et positionnement de la modale
     */
    function ouvrirModale(ent, pinElement) {
        const modal = document.getElementById('company-modal');
        const card = modal.querySelector('.modal-card');

        // 1. Remplissage des textes
        document.getElementById('m-nom').textContent = ent.nom;
        document.getElementById('m-initial').textContent = ent.nom.charAt(0);
        document.getElementById('m-ville').textContent = ent.ville || "Wapi";
        document.getElementById('m-taille').textContent = ent.taille.toUpperCase();
        document.getElementById('m-description').textContent = ent.phrase || "";
        
        // 2. Formater le label du secteur (ex: "food" -> "Food")
        let secteurLabel = ent.secteur.charAt(0).toUpperCase() + ent.secteur.slice(1);
        if (ent.secteur === 'agriculture') secteurLabel = "Agriculture / Artisanat";
        if (ent.secteur === 'art') secteurLabel = "Art & Culture";
        if (ent.secteur === 'commerce') secteurLabel = "Commerce / Service";
        document.getElementById('m-secteur-label').textContent = secteurLabel;

        // 3. Focus Visuel
        document.querySelectorAll('.map-icon').forEach(p => p.classList.remove('focused'));
        pinElement.classList.add('focused');
        document.querySelector('.fullscreen-hero').classList.add('hero-blurred');

        // 4. Affichage
        modal.style.display = 'block';

        // 5. Calcul de position Anti-Débordement
        const rect = pinElement.getBoundingClientRect();
        const cardWidth = 380; 
        const cardHeight = card.offsetHeight || 300;
        const margin = 20;

        let left = rect.left + margin;
        let top = rect.top - (cardHeight / 2);

        if (left + cardWidth > window.innerWidth) left = rect.left - cardWidth - margin;
        if (left < margin) left = margin;
        if (top + cardHeight > window.innerHeight) top = window.innerHeight - cardHeight - margin;
        if (top < margin) top = margin;

        card.style.left = `${left}px`;
        card.style.top = `${top}px`;
    }

    /**
     * Logique de filtrage
     */
    function filtrerMap() {
        // Force les valeurs en minuscules pour faciliter la comparaison
        const secteurs = Array.from(document.querySelectorAll('.dropdown[data-name="secteurs"] li.selected')).map(li => li.dataset.value.toLowerCase());
        const tailles = Array.from(document.querySelectorAll('.dropdown[data-name="taille"] li.selected')).map(li => li.dataset.value.toLowerCase());
        const tags = Array.from(document.querySelectorAll('.filters-bottom .pill.active')).map(btn => btn.textContent.trim());

        const auMoinsUnFiltre = secteurs.length > 0 || tailles.length > 0 || tags.length > 0;
        const pins = document.querySelectorAll('.map-icon');

        pins.forEach(pin => {
            if (!auMoinsUnFiltre) {
                pin.classList.remove('visible');
                pin.classList.add('hidden');
                return;
            }

            const pSecteur = pin.dataset.secteur.toLowerCase();
            const pTaille = pin.dataset.taille.toLowerCase();
            const pTags = JSON.parse(pin.dataset.tags);

            const matchS = secteurs.length === 0 || secteurs.includes(pSecteur);
            const matchT = tailles.length === 0 || tailles.includes(pTaille);
            const matchTag = tags.length === 0 || tags.some(t => pTags.includes(t));

            if (matchS && matchT && matchTag) {
                pin.classList.remove('hidden');
                pin.classList.add('visible');
            } else {
                pin.classList.remove('visible');
                pin.classList.add('hidden');
            }
        });
    }

    /**
     * Configuration des menus et boutons
     */
    function setupInteractions() {
        document.querySelectorAll('.dropdown').forEach(dd => {
            const btn = dd.querySelector('.dropdown-toggle');
            const items = dd.querySelectorAll('li');

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = dd.classList.toggle('open');
                document.querySelectorAll('.dropdown').forEach(other => {
                    if (other !== dd) other.classList.remove('open');
                });
            });

            items.forEach(li => {
                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    li.classList.toggle('selected');
                    const any = dd.querySelectorAll('li.selected').length > 0;
                    btn.classList.toggle('selected', any);
                    filtrerMap();
                });
            });
        });

        document.querySelectorAll('.filters-bottom .pill').forEach(p => {
            p.addEventListener('click', () => {
                p.classList.toggle('active');
                filtrerMap();
            });
        });

        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown').forEach(dd => dd.classList.remove('open'));
        });
    }
})();