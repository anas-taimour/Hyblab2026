/**
 * 1. CLASSES ET DONNÉES
 */
class Entreprise {
    constructor(nom, secteur, taille, tags, coords, ville, phrase) {
        this.nom = nom;
        this.secteur = secteur; // agriculture, art, commerce, industrie, sante, tech
        this.taille = taille;   // independant, pme, grande
        this.tags = tags;
        this.coords = coords;
        this.ville = ville;
        this.phrase = phrase;
    }
}

const catalogueEntreprises = [
    new Entreprise("Les Vergers de la Wapi", "agriculture", "pme", ["Affaire de famille"], { top: "25%", left: "30%" }, "Ath", "Le goût authentique des fruits de notre terroir"),
    new Entreprise("Ferme du Grand Chêne", "agriculture", "independant", ["Surprise me"], { top: "42%", left: "15%" }, "Tournai", "Une agriculture raisonnée au service du local"),
    new Entreprise("Coopérative Bio-Semeur", "agriculture", "grande", ["Jobs pas comme les autres"], { top: "15%", left: "45%" }, "Lessines", "Semer aujourd'hui les solutions durables de demain"),
    new Entreprise("Pixel & Co", "tech", "pme", ["Plot twist"], { top: "55%", left: "58%" }, "Tournai", "L'agence créative qui bouscule les codes du web"),
    new Entreprise("DataWapi Solutions", "tech", "grande", ["Jobs pas comme les autres"], { top: "68%", left: "75%" }, "Mouscron", "L'intelligence artificielle au service des PME"),
    new Entreprise("Neo-Soft Lab", "tech", "independant", ["Surprise me", "Plot twist"], { top: "30%", left: "62%" }, "Enghien", "Le code artisanal pour des applications uniques"),
    new Entreprise("Métal-Wapi Industrie", "industrie", "grande", ["Jobs pas comme les autres"], { top: "20%", left: "75%" }, "Leuze-en-Hainaut", "L'acier de haute précision exporté partout en Europe"),
    new Entreprise("Ateliers Méca-Flash", "industrie", "pme", ["Affaire de famille"], { top: "75%", left: "45%" }, "Antoing", "La mécanique de précision, une passion transmise"),
    new Entreprise("Usinage du Tournaisis", "industrie", "pme", ["Jobs pas comme les autres"], { top: "50%", left: "80%" }, "Tournai", "Façonner l'avenir pièce par pièce"),
    new Entreprise("Boutique L'Artisan Vert", "commerce", "independant", ["Affaire de famille", "Surprise me"], { top: "35%", left: "25%" }, "Ath", "Des produits naturels sélectionnés avec soin"),
    new Entreprise("Wapi-Market", "commerce", "grande", ["Plot twist"], { top: "62%", left: "20%" }, "Mouscron", "La proximité d'un grand réseau, l'esprit de quartier"),
    new Entreprise("Logistique Express", "commerce", "pme", ["Jobs pas comme les autres"], { top: "80%", left: "65%" }, "Tournai", "Vos colis arrivent à bon port, plus vite que l'éclair"),
    new Entreprise("Centre Soins & Nature", "sante", "pme", ["Surprise me"], { top: "48%", left: "42%" }, "Beloeil", "Le bien-être global accessible à tous"),
    new Entreprise("Wapi-Pharma", "sante", "grande", ["Jobs pas comme les autres"], { top: "12%", left: "60%" }, "Lessines", "L'excellence pharmaceutique au cœur de la région"),
    new Entreprise("La Galerie Ephémère", "art", "independant", ["Plot twist", "Surprise me"], { top: "55%", left: "35%" }, "Tournai", "L'art contemporain s'invite là où on ne l'attend pas")
];

/**
 * 2. LOGIQUE GLOBALE
 */
(function(){
    document.addEventListener('DOMContentLoaded', () => {
        initialiserPins();
        setupInteractions();
    });

    /**
     * Initialisation des pins sur la carte
     */
    function initialiserPins() {
        const layer = document.querySelector('.icons-layer');
        if (!layer) return;
        
        catalogueEntreprises.forEach(ent => {
            const pinWrapper = document.createElement('div');
            pinWrapper.className = 'map-icon hidden';
            pinWrapper.style.top = ent.coords.top;
            pinWrapper.style.left = ent.coords.left;
            
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
        });

        // --- GESTION DE LA FERMETURE ---
        const modalOverlay = document.getElementById('company-modal');
        const closeBtn = document.querySelector('.close-modal');

        const fermerTout = () => {
            modalOverlay.style.display = 'none';
            document.querySelectorAll('.map-icon').forEach(p => p.classList.remove('focused'));
            document.querySelector('.fullscreen-hero').classList.remove('hero-blurred');
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
        document.getElementById('m-ville').textContent = ent.ville;
        document.getElementById('m-taille').textContent = ent.taille.toUpperCase();
        document.getElementById('m-description').textContent = ent.phrase;
        document.getElementById('m-secteur-label').textContent = ent.secteur;

        // 2. Focus Visuel (Z-index élevé et flou du fond)
        document.querySelectorAll('.map-icon').forEach(p => p.classList.remove('focused'));
        pinElement.classList.add('focused');
        document.querySelector('.fullscreen-hero').classList.add('hero-blurred');

        // 3. Affichage
        modal.style.display = 'block';

        // 4. Calcul de position Anti-Débordement
        const rect = pinElement.getBoundingClientRect();
        const cardWidth = 380; // Largeur définie dans le CSS
        const cardHeight = card.offsetHeight || 300;
        const margin = 20;

        // Position par défaut (à droite du picto)
        let left = rect.left + margin;
        let top = rect.top - (cardHeight / 2);

        // Correction si dépasse à DROITE
        if (left + cardWidth > window.innerWidth) {
            left = rect.left - cardWidth - margin;
        }

        // Correction si dépasse à GAUCHE
        if (left < margin) left = margin;

        // Correction si dépasse en BAS
        if (top + cardHeight > window.innerHeight) {
            top = window.innerHeight - cardHeight - margin;
        }

        // Correction si dépasse en HAUT
        if (top < margin) top = margin;

        card.style.left = `${left}px`;
        card.style.top = `${top}px`;
    }

    /**
     * Logique de filtrage
     */
    function filtrerMap() {
        const secteurs = Array.from(document.querySelectorAll('.dropdown[data-name="secteurs"] li.selected')).map(li => li.dataset.value);
        const tailles = Array.from(document.querySelectorAll('.dropdown[data-name="taille"] li.selected')).map(li => li.dataset.value);
        const tags = Array.from(document.querySelectorAll('.filters-bottom .pill.active')).map(btn => btn.textContent.trim());

        const auMoinsUnFiltre = secteurs.length > 0 || tailles.length > 0 || tags.length > 0;
        const pins = document.querySelectorAll('.map-icon');

        pins.forEach(pin => {
            if (!auMoinsUnFiltre) {
                pin.classList.replace('visible', 'hidden');
                return;
            }

            const pSecteur = pin.dataset.secteur;
            const pTaille = pin.dataset.taille;
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
        // Dropdowns
        document.querySelectorAll('.dropdown').forEach(dd => {
            const btn = dd.querySelector('.dropdown-toggle');
            const items = dd.querySelectorAll('li');

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = dd.classList.toggle('open');
                // Fermer les autres dropdowns
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

        // Pills (Tags du bas)
        document.querySelectorAll('.filters-bottom .pill').forEach(p => {
            p.addEventListener('click', () => {
                p.classList.toggle('active');
                filtrerMap();
            });
        });

        // Clic n'importe où pour fermer les dropdowns
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown').forEach(dd => dd.classList.remove('open'));
        });
    }
})();