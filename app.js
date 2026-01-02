// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'VaxiTrack Tchad',
    VERSION: '2.0.0',
    SYNC_ENDPOINT: 'https://api.mocky.io/api/v1/sync',
    
    // ✅ LISTE COMPLÈTE DES VILLES ET VILLAGES DU TCHAD
    DEFAULT_VILLAGES: [
        // Région du Mandoul
        'Sarh', 'Koumra', 'Bédjondo', 'Béboto', 'Békamba', 'Békourou', 'Bessada',
        'Bouna', 'Dembo', 'Dindjebo', 'Djéké Djéké', 'Goundi', 'Kaba', 'Kouka',
        'Mbikou', 'Mbouma', 'Mongo', 'Mouraye', 'Ngangara', 'Ngama', 'Sido',
        
        // Région du Logone Occidental
        'Moundou', 'Bébédjia', 'Béboro', 'Bédi', 'Békourou', 'Béladjia', 'Bénoye',
        'Béré', 'Béti', 'Donia', 'Gagal', 'Gam', 'Gounou Gaya', 'Krim Krim',
        'Laï', 'Ngam', 'Tapol',
        
        // Région du Logone Oriental
        'Doba', 'Béboto', 'Bédigui', 'Békamba', 'Békourou', 'Béladjia', 'Béré',
        'Bessao', 'Bouna', 'Donanga', 'Gagal', 'Gam', 'Goundi', 'Kaba',
        'Kélo', 'Kouka', 'Koyom', 'Mbikou', 'Mongo', 'Mouraye', 'Ngangara',
        
        // Région du Moyen-Chari
        'Sarh (Moyen-Chari)', 'Bédjondo', 'Békamba', 'Békourou', 'Béladjia',
        'Béré', 'Bessao', 'Bouna', 'Dembo', 'Dindjebo', 'Djéké Djéké',
        'Gagal', 'Goundi', 'Kaba', 'Kouka', 'Koyom', 'Mbikou', 'Mongo',
        
        // Région de la Tandjilé
        'Laï', 'Bédigui', 'Békourou', 'Béladjia', 'Béré', 'Bessao', 'Bouna',
        'Donanga', 'Gagal', 'Gam', 'Goundi', 'Kaba', 'Kélo', 'Kouka',
        'Koyom', 'Mbikou', 'Mongo', 'Ngangara',
        
        // Région du Guéra
        'Mongo (Guéra)', 'Bitkine', 'Melfi', 'Mongo', 'Mangalmé', 'Baro',
        'Béré', 'Gama', 'Mouraye', 'Ngangara', 'Ngama', 'Sido',
        
        // Région du Salamat
        'Am Timan', 'Abou Deïa', 'Haraze', 'Mangueigne', 'Moussafoyo',
        
        // Région du Sila
        'Goz Beïda', 'Adé', 'Am Dam', 'Am Zoer', 'Moura', 'Tissi',
        
        // Région du Ouaddaï
        'Abéché', 'Adré', 'Am Dam', 'Am Zoer', 'Goz Beïda', 'Foré',
        'Iriba', 'Moura', 'Tissi',
        
        // Région du Wadi Fira
        'Biltine', 'Guéréda', 'Iriba', 'Matadjana', 'Mélé', 'Mogroum',
        'Niala', 'Tina',
        
        // Région du Batha
        'Ati', 'Djedaa', 'Am Sack', 'Assinet', 'Bourmataguil',
        'Mogroum', 'Mongororo', 'Oum Hadjer',
        
        // Région du Hadjer-Lamis
        'Massakory', 'Dagana', 'Karal', 'Mano', 'Massaguet', 'N\'Djaména (quartiers)',
        
        // N'Djaména (capitale)
        'N\'Djaména 1er Arrondissement',
        'N\'Djaména 2e Arrondissement',
        'N\'Djaména 3e Arrondissement',
        'N\'Djaména 4e Arrondissement',
        'N\'Djaména 5e Arrondissement',
        'N\'Djaména 6e Arrondissement',
        'N\'Djaména 7e Arrondissement',
        'N\'Djaména 8e Arrondissement',
        'N\'Djaména 9e Arrondissement',
        'N\'Djaména 10e Arrondissement',
        
        // Région du Chari-Baguirmi
        'Bousso', 'Baguirmi', 'Bol', 'Dourbali', 'Loumia', 'Massenya',
        'N\'Djaména Périphérie',
        
        // Région du Kanem
        'Mao', 'Moussoro', 'Nokou', 'Rig-Rig', 'Ziguey',
        
        // Région du Lac
        'Bol', 'Baga-Sola', 'Daboua', 'Kalia', 'Kangalam', 'Kouloudia',
        'Liwa', 'Ngouri', 'Tchoukoutalia',
        
        // Autres localités importantes
        'Faya-Largeau', 'Fada', 'Bardai', 'Zouar', 'Aouzou',
        'Koro Toro', 'Ounianga Kébir', 'Ounianga Sérir'
    ],
    
    VACCINES: [
        {id: 'BCG', name: 'BCG (Tuberculose)'},
        {id: 'VPO', name: 'VPO (Polio oral)'},
        {id: 'VPI', name: 'VPI (Polio injectable)'},
        {id: 'PENTA', name: 'PENTA (Diphtérie, Tétanos, Coqueluche...)'},
        {id: 'VAR', name: 'Rougeole'},
        {id: 'VAA', name: 'VAA (Vitamine A)'},
        {id: 'COVID', name: 'COVID-19'}
    ]
};
console.log('=== VaxiTrack Tchad v2.0.0 - ' + new Date().toISOString() + ' ===');

// ==================== ÉTAT DE L'APPLICATION ====================
let appState = {
    vaccinations: [],
    pendingSync: [],
    isOnline: navigator.onLine,
    agentName: 'Agent UNICEF',
    lastSync: null
};

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} initialisation...`);
    
    // 1. Charger les données sauvegardées
    loadSavedData();
    
    // 2. Initialiser l'interface
    initializeUI();
    
    // 3. Configurer les écouteurs d'événements
    setupEventListeners();
    
    // 4. Vérifier la connexion
    updateConnectionStatus();
    
    // 5. Mettre à jour l'affichage
    updateDashboard();
    populateVillageSelect();
    
    console.log('Application prête. Mode:', appState.isOnline ? 'En ligne' : 'Hors ligne');
});

// ==================== FONCTIONS PRINCIPALES ====================

// Charge les données depuis le localStorage
function loadSavedData() {
    try {
        const saved = localStorage.getItem('vaxitrack_vaccinations');
        if (saved) {
            appState.vaccinations = JSON.parse(saved);
            console.log(`${appState.vaccinations.length} vaccinations chargées`);
        }
        
        const pending = localStorage.getItem('vaxitrack_pending');
        if (pending) {
            appState.pendingSync = JSON.parse(pending);
        }
        
        const agent = localStorage.getItem('vaxitrack_agent');
        if (agent) {
            appState.agentName = agent;
        }
        
        const lastSync = localStorage.getItem('vaxitrack_lastSync');
        if (lastSync) {
            appState.lastSync = new Date(lastSync);
        }
    } catch (error) {
        console.error('Erreur chargement données:', error);
        showNotification('⚠️ Erreur chargement données locales', 'warning');
    }
}

// Sauvegarde les données dans le localStorage
function saveData() {
    try {
        localStorage.setItem('vaxitrack_vaccinations', JSON.stringify(appState.vaccinations));
        localStorage.setItem('vaxitrack_pending', JSON.stringify(appState.pendingSync));
        localStorage.setItem('vaxitrack_agent', appState.agentName);
        if (appState.lastSync) {
            localStorage.setItem('vaxitrack_lastSync', appState.lastSync.toISOString());
        }
        console.log('Données sauvegardées localement');
    } catch (error) {
        console.error('Erreur sauvegarde:', error);
        showNotification('⚠️ Erreur sauvegarde locale', 'warning');
    }
}

// Enregistre une nouvelle vaccination
function recordVaccination(formData) {
    const vaccination = {
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        childName: formData.childName,
        childAge: parseInt(formData.childAge),
        childSex: formData.childSex,
        village: formData.village,
        vaccine: formData.vaccine,
        vaccineDate: formData.vaccineDate,
        vaccineDose: formData.vaccineDose,
        notes: formData.notes,
        agent: appState.agentName,
        recordedAt: new Date().toISOString(),
        synced: false
    };
    
    // Ajouter aux listes
    appState.vaccinations.unshift(vaccination);
    appState.pendingSync.push(vaccination);
    
    // Sauvegarder
    saveData();
    
    // Mettre à jour l'affichage
    updateDashboard();
    if (document.getElementById('liste').classList.contains('active')) {
        displayVaccinationsList();
    }
    
    // Synchroniser si en ligne
    if (appState.isOnline && appState.pendingSync.length > 0) {
        attemptSync();
    }
    
    return vaccination;
}

// Tente de synchroniser avec le serveur
async function attemptSync() {
    if (!appState.isOnline || appState.pendingSync.length === 0) {
        return { success: false, message: 'Pas de données à synchroniser ou hors ligne' };
    }
    
    const syncButton = document.getElementById('btn-sync-now');
    syncButton.disabled = true;
    syncButton.innerHTML = '🔄 Synchronisation...';
    
    try {
        // Simulation d'envoi au serveur
        console.log(`Tentative de sync de ${appState.pendingSync.length} enregistrements...`);
        
        // ICI : Remplacer par un vrai appel API
        // const response = await fetch(CONFIG.SYNC_ENDPOINT, {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({ vaccinations: appState.pendingSync })
        // });
        
        // Simulation de délai réseau
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulation de succès (90% de chance)
        const success = Math.random() > 0.1;
        
        if (success) {
            // Marquer comme synchronisé
            const syncedIds = appState.pendingSync.map(v => v.id);
            appState.vaccinations.forEach(v => {
                if (syncedIds.includes(v.id)) v.synced = true;
            });
            
            appState.pendingSync = [];
            appState.lastSync = new Date();
            
            saveData();
            updateDashboard();
            
            showNotification(`✅ ${syncedIds.length} données synchronisées avec succès`, 'success');
            
            syncButton.innerHTML = '🔄 Synchronisé';
            setTimeout(() => {
                syncButton.innerHTML = '🔄 Synchroniser';
                syncButton.disabled = false;
            }, 2000);
            
            return { success: true, count: syncedIds.length };
        } else {
            throw new Error('Échec simulation serveur');
        }
        
    } catch (error) {
        console.error('Erreur synchronisation:', error);
        showNotification('⚠️ Échec synchronisation. Réessayez plus tard.', 'danger');
        
        syncButton.innerHTML = '🔄 Échec - Réessayer';
        setTimeout(() => {
            syncButton.disabled = false;
            syncButton.innerHTML = '🔄 Synchroniser';
        }, 3000);
        
        return { success: false, error: error.message };
    }
}

// Génère un rapport CSV
function generateCSV() {
    if (appState.vaccinations.length === 0) {
        showNotification('Aucune donnée à exporter', 'warning');
        return;
    }
    
    const headers = ['Nom enfant', 'Âge (mois)', 'Sexe', 'Village', 'Vaccin', 'Date', 'Dose', 'Agent', 'Date enregistrement'];
    
    const csvRows = [
        headers.join(','),
        ...appState.vaccinations.map(v => [
            `"${v.childName}"`,
            v.childAge,
            v.childSex,
            `"${v.village}"`,
            v.vaccine,
            v.vaccineDate,
            v.vaccineDose,
            `"${v.agent}"`,
            v.recordedAt
        ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `vaxitrack_rapport_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('📥 Fichier CSV généré et téléchargé', 'success');
}

// ==================== FONCTIONS UI ====================

// Initialise l'interface utilisateur
function initializeUI() {
    // Définir la date d'aujourd'hui comme valeur par défaut
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('vaccine-date').value = today;
    
    // Afficher le nom de l'agent
    document.getElementById('agent-name').innerHTML = `Agent: <strong>${appState.agentName}</strong> | <span id="sync-status">${appState.isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}</span>`;
    
    // Afficher dernière synchronisation
    if (appState.lastSync) {
        const formatted = appState.lastSync.toLocaleDateString('fr-FR') + ' ' + 
                         appState.lastSync.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
        document.querySelector('.timestamp').textContent = formatted;
    }
}

// ✅ MODIFIÉ : Remplit la liste des villages avec tri alphabétique
function populateVillageSelect() {
    const select = document.getElementById('child-village');
    const filterSelect = document.getElementById('filter-village');
    
    // Garder la sélection actuelle
    const currentValue = select.value;
    const currentFilter = filterSelect.value;
    
    // Vider les options
    select.innerHTML = '<option value="">Sélectionner un village</option>';
    filterSelect.innerHTML = '<option value="">Tous les villages</option>';
    
    // ✅ TRIER LES VILLAGES PAR ORDRE ALPHABÉTIQUE
    const sortedVillages = [...CONFIG.DEFAULT_VILLAGES].sort((a, b) => 
        a.localeCompare(b, 'fr', {sensitivity: 'base'})
    );
    
    // Ajouter les villages
    sortedVillages.forEach(village => {
        const option = document.createElement('option');
        option.value = village;
        option.textContent = village;
        select.appendChild(option);
        
        const filterOption = document.createElement('option');
        filterOption.value = village;
        filterOption.textContent = village;
        filterSelect.appendChild(filterOption);
    });
    
    // Restaurer les sélections
    select.value = currentValue;
    filterSelect.value = currentFilter;
}

// Met à jour le tableau de bord
function updateDashboard() {
    // Totaux
    document.getElementById('total-vaccinations').textContent = appState.vaccinations.length;
    document.getElementById('pending-sync').textContent = appState.pendingSync.length;
    
    // Bouton synchronisation
    const syncBtn = document.getElementById('btn-sync-now');
    syncBtn.disabled = !appState.isOnline || appState.pendingSync.length === 0;
    
    // Rapports
    document.getElementById('report-total').textContent = appState.vaccinations.length;
    
    const villages = [...new Set(appState.vaccinations.map(v => v.village))];
    document.getElementById('report-villages').textContent = villages.length;
    
    const girls = appState.vaccinations.filter(v => v.childSex === 'F').length;
    const boys = appState.vaccinations.filter(v => v.childSex === 'M').length;
    document.getElementById('report-girls').textContent = girls;
    document.getElementById('report-boys').textContent = boys;
    
    // Stockage utilisé (approximatif)
    const used = JSON.stringify(appState).length / 1024;
    document.querySelector('#app-storage span').textContent = `${used.toFixed(1)} KB`;
}

// Affiche la liste des vaccinations
function displayVaccinationsList() {
    const container = document.getElementById('vaccinations-list');
    const searchTerm = document.getElementById('search-list').value.toLowerCase();
    const filterVillage = document.getElementById('filter-village').value;
    
    // Filtrer
    let filtered = appState.vaccinations;
    
    if (searchTerm) {
        filtered = filtered.filter(v => 
            v.childName.toLowerCase().includes(searchTerm) ||
            v.village.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filterVillage) {
        filtered = filtered.filter(v => v.village === filterVillage);
    }
    
    // Afficher
    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-state">Aucune vaccination ne correspond aux critères</p>';
        return;
    }
    
    container.innerHTML = filtered.map(v => `
        <div class="vaccination-item" data-id="${v.id}">
            <div class="vaccination-header">
                <span class="vaccination-name">${v.childName}</span>
                <span class="vaccination-village">${v.village}</span>
            </div>
            <div class="vaccination-details">
                <div>
                    <div class="detail-label">Âge/Sexe</div>
                    <div>${v.childAge} mois (${v.childSex === 'M' ? 'Garçon' : 'Fille'})</div>
                </div>
                <div>
                    <div class="detail-label">Vaccin</div>
                    <div>${v.vaccine} - ${v.vaccineDose}</div>
                </div>
                <div>
                    <div class="detail-label">Date</div>
                    <div>${new Date(v.vaccineDate).toLocaleDateString('fr-FR')}</div>
                </div>
                <div>
                    <div class="detail-label">Statut</div>
                    <div>${v.synced ? '✅ Synchronisé' : '⏳ En attente'}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Affiche une notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Met à jour le statut de connexion
function updateConnectionStatus() {
    const statusEl = document.getElementById('sync-status');
    const syncBtn = document.getElementById('btn-sync-now');
    
    if (appState.isOnline) {
        statusEl.innerHTML = '🟢 En ligne';
        syncBtn.disabled = appState.pendingSync.length === 0;
    } else {
        statusEl.innerHTML = '🔴 Hors ligne';
        syncBtn.disabled = true;
    }
}

// ==================== GESTION DES ÉVÉNEMENTS ====================

function setupEventListeners() {
    // Onglets
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Désactiver tous les onglets
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            
            // Activer l'onglet sélectionné
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Mettre à jour le contenu spécifique
            if (tabId === 'liste') {
                displayVaccinationsList();
            }
        });
    });
    
    // Formulaire d'enregistrement
    const form = document.getElementById('vaccination-form');
    const saveBtn = document.getElementById('btn-save-offline');
    
    saveBtn.addEventListener('click', function() {
        // Validation basique
        const childName = document.getElementById('child-name').value.trim();
        const childAge = document.getElementById('child-age').value;
        const childSex = document.getElementById('child-sex').value;
        const village = document.getElementById('child-village').value;
        const vaccine = document.getElementById('vaccine-type').value;
        const vaccineDate = document.getElementById('vaccine-date').value;
        
        if (!childName || !childAge || !childSex || !village || !vaccine || !vaccineDate) {
            showNotification('⚠️ Veuillez remplir tous les champs obligatoires (*)', 'warning');
            return;
        }
        
        // Enregistrer
        const vaccination = recordVaccination({
            childName,
            childAge,
            childSex,
            village,
            vaccine,
            vaccineDate,
            vaccineDose: document.getElementById('vaccine-dose').value,
            notes: document.getElementById('agent-notes').value.trim()
        });
        
        // Confirmation
        const confirmation = document.getElementById('save-confirmation');
        confirmation.style.display = 'block';
        confirmation.querySelector('p').innerHTML = `✅ <strong>${vaccination.childName}</strong> enregistré(e) localement !`;
        
        // Réinitialiser le formulaire
        form.reset();
        document.getElementById('vaccine-date').value = new Date().toISOString().split('T')[0];
        
        // Cacher la confirmation après 5s
        setTimeout(() => {
            confirmation.style.display = 'none';
        }, 5000);
        
        showNotification(`Vaccination de ${childName} enregistrée (${vaccine})`, 'success');
    });
    
    // Synchronisation manuelle
    document.getElementById('btn-sync-now').addEventListener('click', attemptSync);
    
    // Recherche dans la liste
    document.getElementById('search-list').addEventListener('input', displayVaccinationsList);
    document.getElementById('filter-village').addEventListener('change', displayVaccinationsList);
    
    // Export CSV
    document.getElementById('btn-export-csv').addEventListener('click', generateCSV);
    
    document.getElementById('btn-generate-report').addEventListener('click', function() {
        if (appState.vaccinations.length === 0) {
            showNotification('Aucune donnée pour générer un rapport', 'warning');
            return;
        }
        
        showNotification('📄 Génération du rapport PDF en cours...', 'info');
        
        // Utiliser jsPDF pour créer un vrai PDF
        const { jsPDF } = window.jspdf;
        
        // Créer nouveau document PDF
        const doc = new jsPDF();
        const today = new Date().toLocaleDateString('fr-FR');
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // ===== 1. EN-TÊTE =====
        doc.setFillColor(0, 119, 200); // Bleu UNICEF
        doc.rect(0, 0, pageWidth, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('RAPPORT DE VACCINATION', pageWidth / 2, 15, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text('UNICEF Tchad - VaxiTrack', pageWidth / 2, 23, { align: 'center' });
        
        // ===== 2. INFORMATIONS DE BASE =====
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        let yPosition = 45;
        
        doc.text(`Date du rapport: ${today}`, 20, yPosition);
        doc.text(`Agent: ${appState.agentName}`, 20, yPosition + 8);
        doc.text(`Total vaccinations: ${appState.vaccinations.length}`, 20, yPosition + 16);
        doc.text(`Données en attente de sync: ${appState.pendingSync.length}`, 20, yPosition + 24);
        
        // ===== 3. STATISTIQUES PAR VACCIN =====
        yPosition = 85;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('STATISTIQUES PAR VACCIN', 20, yPosition);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        // Calculer les pourcentages
        const vaccineStats = {};
        appState.vaccinations.forEach(v => {
            vaccineStats[v.vaccine] = (vaccineStats[v.vaccine] || 0) + 1;
        });
        
        yPosition += 10;
        Object.entries(vaccineStats).forEach(([vaccine, count], index) => {
            const percentage = ((count / appState.vaccinations.length) * 100).toFixed(1);
            doc.text(`• ${vaccine}: ${count} vaccinations (${percentage}%)`, 25, yPosition);
            yPosition += 6;
        });
        
        // ===== 4. VILLAGES COUVERTS =====
        yPosition += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('VILLAGES COUVERTS', 20, yPosition);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        const villages = [...new Set(appState.vaccinations.map(v => v.village))];
        yPosition += 10;
        
        // Afficher les villages sur plusieurs colonnes si nécessaire
        let col = 0;
        const colWidth = 60;
        villages.forEach((village, index) => {
            const x = 25 + (col * colWidth);
            doc.text(`• ${village}`, x, yPosition);
            
            if ((index + 1) % 3 === 0) {
                col = 0;
                yPosition += 6;
            } else {
                col++;
            }
        });
        
        // ===== 5. DERNIÈRES VACCINATIONS (tableau) =====
        yPosition += 15;
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('10 DERNIÈRES VACCINATIONS', 20, yPosition);
        
        // En-tête du tableau
        yPosition += 8;
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
        
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text('Date', 25, yPosition + 5);
        doc.text('Enfant', 45, yPosition + 5);
        doc.text('Âge', 85, yPosition + 5);
        doc.text('Vaccin', 100, yPosition + 5);
        doc.text('Village', 140, yPosition + 5);
        
        // Données du tableau
        yPosition += 10;
        doc.setTextColor(0, 0, 0);
        
        appState.vaccinations.slice(0, 10).forEach(vaccination => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            
            const date = new Date(vaccination.vaccineDate).toLocaleDateString('fr-FR');
            doc.text(date, 25, yPosition);
            doc.text(vaccination.childName.substring(0, 15), 45, yPosition);
            doc.text(`${vaccination.childAge} mois`, 85, yPosition);
            doc.text(vaccination.vaccine, 100, yPosition);
            doc.text(vaccination.village.substring(0, 12), 140, yPosition);
            
            yPosition += 7;
        });
        
        // ===== 6. PIED DE PAGE =====
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Généré automatiquement par VaxiTrack Tchad • Application offline pour agents de santé UNICEF', 
                 pageWidth / 2, 285, { align: 'center' });
        
        // ===== 7. SAUVEGARDER LE PDF =====
        const filename = `rapport_vaccination_${today.replace(/\//g, '-')}.pdf`;
        doc.save(filename);
        
        // ===== 8. NOTIFICATION ET ACTIVATION EMAIL =====
        showNotification(`✅ PDF généré : ${filename}`, 'success');
        document.getElementById('btn-email-report').disabled = false;
    });
    
    document.getElementById('btn-email-report').addEventListener('click', async function() {
        showNotification('📧 Préparation de l\'envoi...', 'info');
        
        // 1. Créer un résumé pour le corps de l'email
        const today = new Date().toLocaleDateString('fr-FR');
        const total = appState.vaccinations.length;
        const pending = appState.pendingSync.length;
        const villages = [...new Set(appState.vaccinations.map(v => v.village))];
        
        const emailBody = `
Bonjour,

Voici le rapport de vaccination du ${today} :

• Agent: ${appState.agentName}
• Total vaccinations enregistrées: ${total}
• Villages couverts: ${villages.length}
• Données en attente de synchronisation: ${pending}
• Liste des villages: ${villages.join(', ')}

Les données détaillées sont en pièce jointe.

Cordialement,
VaxiTrack Tchad - Système de suivi vaccinal offline
        `.trim();
        
        // 2. Option A: Ouvrir le client mail (SIMPLE)
        const subject = `Rapport Vaccination ${today} - ${appState.agentName}`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        window.location.href = mailtoLink;
        
        showNotification('✅ Rapport prêt à être envoyé', 'success');
    });
    
    // Synchronisation manuelle depuis paramètres
    document.getElementById('btn-manual-sync').addEventListener('click', attemptSync);
    
    // Effacer données locales
    document.getElementById('btn-clear-data').addEventListener('click', function() {
        if (confirm('⚠️ Voulez-vous vraiment effacer TOUTES les données locales ? Cette action est irréversible.')) {
            localStorage.clear();
            appState.vaccinations = [];
            appState.pendingSync = [];
            
            updateDashboard();
            displayVaccinationsList();
            
            showNotification('🗑️ Toutes les données locales ont été effacées', 'danger');
        }
    });
    
    // Mise à jour nom agent
    document.getElementById('setting-agent-name').addEventListener('change', function() {
        appState.agentName = this.value || 'Agent UNICEF';
        localStorage.setItem('vaxitrack_agent', appState.agentName);
        document.getElementById('agent-name').innerHTML = `Agent: <strong>${appState.agentName}</strong> | <span id="sync-status">${appState.isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}</span>`;
        showNotification('Nom agent mis à jour', 'success');
    });
    
    // Événements de connexion/déconnexion
    window.addEventListener('online', function() {
        appState.isOnline = true;
        updateConnectionStatus();
        showNotification('Connexion internet rétablie', 'success');
        
        // Tenter une synchronisation automatique
        if (appState.pendingSync.length > 0) {
            setTimeout(attemptSync, 1000);
        }
    });
    
    window.addEventListener('offline', function() {
        appState.isOnline = false;
        updateConnectionStatus();
        showNotification('Vous êtes hors ligne. Les données sont sauvegardées localement.', 'warning');
    });
}

// ==================== SERVICE WORKER COMMUNICATION ====================

// Exposer certaines fonctions globalement si nécessaire
window.VaxiTrack = {
    recordVaccination,
    attemptSync,
    generateCSV,
    getStats: () => ({
        total: appState.vaccinations.length,
        pending: appState.pendingSync.length,
        lastSync: appState.lastSync
    })
};

// ==================== VÉRIFICATION OFFLINE ====================

function checkOfflineCapabilities() {
    console.log('=== VÉRIFICATION OFFLINE ===');
    
    // 1. Vérifie Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(reg => {
            if (reg) {
                console.log('✅ Service Worker enregistré:', reg.scope);
                console.log('✅ Service Worker actif:', reg.active ? 'OUI' : 'NON');
                
                // Vérifie le cache
                caches.has('vaxitrack-v2.0-cache').then(hasCache => {
                    console.log('✅ Cache disponible:', hasCache ? 'OUI' : 'NON');
                    
                    if (hasCache) {
                        showNotification('✅ Mode offline activé', 'success');
                    } else {
                        showNotification('⚠️ Cache non disponible', 'warning');
                    }
                });
            } else {
                console.log('❌ Service Worker non enregistré');
                showNotification('⚠️ Mode offline non disponible', 'warning');
            }
        });
    } else {
        console.log('❌ Service Worker non supporté');
        showNotification('⚠️ Navigateur incompatible avec mode offline', 'warning');
    }
    
    // 2. Vérifie stockage
    if ('localStorage' in window) {
        console.log('✅ localStorage disponible');
    }
    
    if ('indexedDB' in window) {
        console.log('✅ IndexedDB disponible');
    }
    
    // 3. Vérifie connexion
    console.log('🌐 Connexion internet:', navigator.onLine ? 'OUI' : 'NON');
    
    if (!navigator.onLine) {
        showNotification('📴 Mode offline - Les données sont sauvegardées localement', 'info');
    }
}

// Exécute la vérification au démarrage
setTimeout(checkOfflineCapabilities, 1000);

// ==================== GÉNÉRATION EXCEL ====================

// Fonction pour créer un fichier Excel
function generateExcel(data, sheetName, fileName) {
    // Créer un nouveau workbook
    const workbook = XLSX.utils.book_new();
    
    // Convertir les données en worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Ajouter le worksheet au workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Générer le fichier Excel
    XLSX.writeFile(workbook, fileName);
    
    showNotification(`✅ Fichier téléchargé : ${fileName}`, 'success');
}

// 1. RAPPORT AGENT : Toutes ses données
function generateAgentReport() {
    if (appState.vaccinations.length === 0) {
        showNotification('Aucune donnée à exporter', 'warning');
        return;
    }
    
    // Formater les données pour Excel
    const excelData = appState.vaccinations.map(v => ({
        'Date': new Date(v.vaccineDate).toLocaleDateString('fr-FR'),
        'Enfant': v.childName,
        'Âge (mois)': v.childAge,
        'Sexe': v.childSex === 'M' ? 'Garçon' : 'Fille',
        'Village': v.village,
        'Vaccin': v.vaccine,
        'Dose': v.vaccineDose,
        'Agent': v.agent,
        'Enregistré le': new Date(v.recordedAt).toLocaleDateString('fr-FR')
    }));
    
    const fileName = `mes_vaccinations_${new Date().toISOString().split('T')[0]}.xlsx`;
    generateExcel(excelData, 'Mes Vaccinations', fileName);
}

// 2. RAPPORT VILLAGE : Statistiques par village
function generateVillageReport() {
    if (appState.vaccinations.length === 0) {
        showNotification('Aucune donnée à exporter', 'warning');
        return;
    }
    
    // Calculer les statistiques par village
    const villageStats = {};
    
    appState.vaccinations.forEach(v => {
        if (!villageStats[v.village]) {
            villageStats[v.village] = {
                total: 0,
                filles: 0,
                garcons: 0
            };
        }
        
        villageStats[v.village].total++;
        if (v.childSex === 'F') {
            villageStats[v.village].filles++;
        } else {
            villageStats[v.village].garcons++;
        }
    });
    
    // Convertir en format Excel
    const excelData = Object.entries(villageStats).map(([village, stats]) => ({
        'Village': village,
        'Total vaccinations': stats.total,
        'Filles': stats.filles,
        'Garçons': stats.garcons,
        '% Filles': stats.total > 0 ? ((stats.filles / stats.total) * 100).toFixed(1) + '%' : '0%',
        '% Garçons': stats.total > 0 ? ((stats.garcons / stats.total) * 100).toFixed(1) + '%' : '0%'
    }));
    
    const fileName = `stats_villages_${new Date().toISOString().split('T')[0]}.xlsx`;
    generateExcel(excelData, 'Par Village', fileName);
}

// 3. RAPPORT VACCIN : Répartition par type de vaccin
function generateVaccineReport() {
    if (appState.vaccinations.length === 0) {
        showNotification('Aucune donnée à exporter', 'warning');
        return;
    }
    
    // Calculer par vaccin
    const vaccineStats = {};
    const vaccineByVillage = {};
    
    appState.vaccinations.forEach(v => {
        // Stats globales
        vaccineStats[v.vaccine] = (vaccineStats[v.vaccine] || 0) + 1;
        
        // Stats par village
        if (!vaccineByVillage[v.village]) {
            vaccineByVillage[v.village] = {};
        }
        vaccineByVillage[v.village][v.vaccine] = (vaccineByVillage[v.village][v.vaccine] || 0) + 1;
    });
    
    // Données globales
    const globalData = Object.entries(vaccineStats).map(([vaccin, count]) => ({
        'Vaccin': vaccin,
        'Nombre administré': count,
        'Pourcentage': ((count / appState.vaccinations.length) * 100).toFixed(1) + '%'
    }));
    
    // Données par village
    const villageData = [];
    Object.entries(vaccineByVillage).forEach(([village, vaccines]) => {
        const row = { 'Village': village };
        Object.entries(vaccines).forEach(([vaccin, count]) => {
            row[vaccin] = count;
        });
        villageData.push(row);
    });
    
    // Créer workbook avec DEUX feuilles
    const workbook = XLSX.utils.book_new();
    
    // Feuille 1 : Globale
    const ws1 = XLSX.utils.json_to_sheet(globalData);
    XLSX.utils.book_append_sheet(workbook, ws1, 'Global');
    
    // Feuille 2 : Par village
    const ws2 = XLSX.utils.json_to_sheet(villageData);
    XLSX.utils.book_append_sheet(workbook, ws2, 'Par Village');
    
    // Télécharger
    const fileName = `repartition_vaccins_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    showNotification(`✅ Fichier téléchargé : ${fileName}`, 'success');
}

// ==================== ÉVÉNEMENTS BOUTONS ====================

function setupReportButtons() {
    // Bouton données agent
    document.querySelector('[data-report="agent"]').addEventListener('click', generateAgentReport);
    
    // Bouton stats village
    document.querySelector('[data-report="village"]').addEventListener('click', generateVillageReport);
    
    // Bouton répartition vaccin
    document.querySelector('[data-report="vaccine"]').addEventListener('click', generateVaccineReport);
}

// Initialiser quand l'app est prête
setTimeout(setupReportButtons, 1000);

// Exposer certaines fonctions globalement pour debug
window.appDebug = {
    state: appState,
    reloadData: loadData,
    resetData: window.initializeAppData
};

console.log('App.js v2.0.0 chargé - Prêt à fonctionner!');