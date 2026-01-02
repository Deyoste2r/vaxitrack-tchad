// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'VaxiTrack Tchad',
    VERSION: '2.0.0',
    SYNC_ENDPOINT: 'https://api.mocky.io/api/v1/sync',
    
    // ✅ LISTE COMPLÈTE DES VILLAGES ET VILLAGES DU TCHAD
    DEFAULT_VILLAGES: [
        'Abou Deïa', 'Abéché', 'Adé', 'Adré', 'Am Dam', 'Am Sack', 'Am Timan', 'Am Zoer',
        'Aouzou', 'Assinet', 'Ati', 'Baga-Sola', 'Baguirmi', 'Bardai', 'Baro', 'Bébédjia',
        'Béboro', 'Béboto', 'Bédi', 'Bédigui', 'Bédjondo', 'Békamba', 'Békourou', 'Béladjia',
        'Bénoye', 'Béré', 'Bessada', 'Bessao', 'Béti', 'Biltine', 'Bitkine', 'Bol',
        'Bouna', 'Bourmataguil', 'Bousso', 'Daboua', 'Dagana', 'Dembo', 'Dindjebo',
        'Djéké Djéké', 'Doba', 'Donia', 'Donanga', 'Dourbali', 'Fada', 'Faya-Largeau',
        'Foré', 'Gagal', 'Gam', 'Gama', 'Goz Beïda', 'Goundi', 'Gounou Gaya', 'Guéréda',
        'Haraze', 'Iriba', 'Kaba', 'Kalia', 'Karal', 'Kélo', 'Kouka', 'Kouloudia',
        'Koyom', 'Krim Krim', 'Laï', 'Liwa', 'Loumia', 'Mangalmé', 'Mangueigne',
        'Mano', 'Mao', 'Massaguet', 'Massakory', 'Massenya', 'Matadjana', 'Mbikou',
        'Mbouma', 'Melfi', 'Mélé', 'Mogroum', 'Mongororo', 'Mongo', 'Mongo (Guéra)',
        'Moundou', 'Moura', 'Moussafoyo', 'Moussoro', 'Mouraye', 'N\'Djaména 1er Arrondissement',
        'N\'Djaména 2e Arrondissement', 'N\'Djaména 3e Arrondissement',
        'N\'Djaména 4e Arrondissement', 'N\'Djaména 5e Arrondissement',
        'N\'Djaména 6e Arrondissement', 'N\'Djaména 7e Arrondissement',
        'N\'Djaména 8e Arrondissement', 'N\'Djaména 9e Arrondissement',
        'N\'Djaména 10e Arrondissement', 'N\'Djaména Périphérie',
        'Ngam', 'Ngama', 'Ngangara', 'Ngouri', 'Nokou', 'Oum Hadjer',
        'Ounianga Kébir', 'Ounianga Sérir', 'Rig-Rig', 'Sarh', 'Sarh (Moyen-Chari)',
        'Sido', 'Tapol', 'Tchoukoutalia', 'Tina', 'Tissi', 'Ziguey', 'Zouar'
    ].sort((a, b) => a.localeCompare(b, 'fr', {sensitivity: 'base'})),
    
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
    
    try {
        // 1. Charger les données sauvegardées
        loadSavedData();
        
        // 2. Initialiser l'interface
        initializeUI();
        
        // 3. Configurer les écouteurs d'événements
        setupEventListeners();
        
        // 4. Mettre à jour l'affichage
        updateDashboard();
        
        console.log('✅ Application prête. Mode:', appState.isOnline ? 'En ligne' : 'Hors ligne');
        
        // 5. Vérifier les capacités offline
        setTimeout(checkOfflineCapabilities, 500);
    } catch (error) {
        console.error('❌ Erreur initialisation:', error);
        showNotification('⚠️ Erreur initialisation application', 'danger');
    }
});

// ==================== GESTION DES DONNÉES ====================

function loadSavedData() {
    try {
        const saved = localStorage.getItem('vaxitrack_vaccinations');
        if (saved) {
            appState.vaccinations = JSON.parse(saved);
            console.log(`📂 ${appState.vaccinations.length} vaccinations chargées`);
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
        console.error('❌ Erreur chargement données:', error);
        showNotification('⚠️ Erreur chargement données locales', 'warning');
    }
}

function saveData() {
    try {
        localStorage.setItem('vaxitrack_vaccinations', JSON.stringify(appState.vaccinations));
        localStorage.setItem('vaxitrack_pending', JSON.stringify(appState.pendingSync));
        localStorage.setItem('vaxitrack_agent', appState.agentName);
        
        if (appState.lastSync) {
            localStorage.setItem('vaxitrack_lastSync', appState.lastSync.toISOString());
        }
        
        console.log('💾 Données sauvegardées localement');
        return true;
    } catch (error) {
        console.error('❌ Erreur sauvegarde:', error);
        showNotification('⚠️ Erreur sauvegarde locale', 'warning');
        return false;
    }
}

// ==================== ENREGISTREMENT VACCINATIONS ====================

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
    
    // Afficher dans la liste si l'onglet est actif
    const listeTab = document.getElementById('liste');
    if (listeTab && listeTab.classList.contains('active')) {
        displayVaccinationsList();
    }
    
    // Synchroniser si en ligne
    if (appState.isOnline && appState.pendingSync.length > 0) {
        setTimeout(() => attemptSync(), 1000);
    }
    
    return vaccination;
}

// ==================== SYNCHRONISATION ====================

async function attemptSync() {
    if (!appState.isOnline) {
        showNotification('🔴 Hors ligne - Synchronisation impossible', 'warning');
        return { success: false, message: 'Hors ligne' };
    }
    
    if (appState.pendingSync.length === 0) {
        showNotification('✅ Toutes les données sont déjà synchronisées', 'info');
        return { success: true, message: 'Rien à synchroniser' };
    }
    
    const syncButton = document.getElementById('btn-sync-now');
    if (syncButton) {
        syncButton.disabled = true;
        syncButton.innerHTML = '🔄 Synchronisation...';
    }
    
    try {
        console.log(`📤 Tentative de sync: ${appState.pendingSync.length} enregistrements`);
        showNotification(`🔄 Synchronisation de ${appState.pendingSync.length} données...`, 'info');
        
        // Simulation d'envoi au serveur
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
            
            showNotification(`✅ ${syncedIds.length} données synchronisées`, 'success');
            
            if (syncButton) {
                syncButton.innerHTML = '✅ Synchronisé';
                setTimeout(() => {
                    syncButton.disabled = false;
                    syncButton.innerHTML = '🔄 Synchroniser';
                }, 2000);
            }
            
            return { success: true, count: syncedIds.length };
        } else {
            throw new Error('Échec simulation serveur');
        }
        
    } catch (error) {
        console.error('❌ Erreur synchronisation:', error);
        showNotification('⚠️ Échec synchronisation. Réessayez plus tard.', 'danger');
        
        if (syncButton) {
            syncButton.innerHTML = '🔄 Échec - Réessayer';
            setTimeout(() => {
                syncButton.disabled = false;
                syncButton.innerHTML = '🔄 Synchroniser';
            }, 3000);
        }
        
        return { success: false, error: error.message };
    }
}

// ==================== INTERFACE UTILISATEUR ====================

function initializeUI() {
    try {
        // Définir la date d'aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('vaccine-date');
        if (dateInput) dateInput.value = today;
        
        // Afficher le nom de l'agent
        const agentNameEl = document.getElementById('agent-name');
        if (agentNameEl) {
            agentNameEl.innerHTML = `Agent: <strong>${appState.agentName}</strong> | <span id="sync-status">${appState.isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}</span>`;
        }
        
        // Afficher dernière synchronisation
        if (appState.lastSync) {
            const formatted = appState.lastSync.toLocaleDateString('fr-FR') + ' ' + 
                             appState.lastSync.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
            const timestampEl = document.querySelector('.timestamp');
            if (timestampEl) timestampEl.textContent = formatted;
        }
        
        // Remplir les listes de villages
        populateVillageSelect();
        
        console.log('✅ Interface initialisée');
    } catch (error) {
        console.error('❌ Erreur initialisation UI:', error);
    }
}

function populateVillageSelect() {
    const select = document.getElementById('child-village');
    const filterSelect = document.getElementById('filter-village');
    
    if (!select || !filterSelect) return;
    
    // Garder la sélection actuelle
    const currentValue = select.value;
    const currentFilter = filterSelect.value;
    
    // Vider les options
    select.innerHTML = '<option value="">Sélectionner un village</option>';
    filterSelect.innerHTML = '<option value="">Tous les villages</option>';
    
    // Ajouter les villages triés
    CONFIG.DEFAULT_VILLAGES.forEach(village => {
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
    if (currentValue) select.value = currentValue;
    if (currentFilter) filterSelect.value = currentFilter;
    
    console.log(`🏘️ ${CONFIG.DEFAULT_VILLAGES.length} villages chargés`);
}

function updateDashboard() {
    try {
        // Totaux
        const totalEl = document.getElementById('total-vaccinations');
        const pendingEl = document.getElementById('pending-sync');
        
        if (totalEl) totalEl.textContent = appState.vaccinations.length;
        if (pendingEl) pendingEl.textContent = appState.pendingSync.length;
        
        // Bouton synchronisation
        const syncBtn = document.getElementById('btn-sync-now');
        if (syncBtn) {
            syncBtn.disabled = !appState.isOnline || appState.pendingSync.length === 0;
        }
        
        // Rapports
        const reportTotal = document.getElementById('report-total');
        if (reportTotal) reportTotal.textContent = appState.vaccinations.length;
        
        const villages = [...new Set(appState.vaccinations.map(v => v.village))];
        const reportVillages = document.getElementById('report-villages');
        if (reportVillages) reportVillages.textContent = villages.length;
        
        const girls = appState.vaccinations.filter(v => v.childSex === 'F').length;
        const boys = appState.vaccinations.filter(v => v.childSex === 'M').length;
        
        const reportGirls = document.getElementById('report-girls');
        const reportBoys = document.getElementById('report-boys');
        if (reportGirls) reportGirls.textContent = girls;
        if (reportBoys) reportBoys.textContent = boys;
        
        // Stockage utilisé
        const used = JSON.stringify(appState).length / 1024;
        const storageEl = document.querySelector('#app-storage span');
        if (storageEl) storageEl.textContent = `${used.toFixed(1)} KB`;
        
    } catch (error) {
        console.error('❌ Erreur mise à jour dashboard:', error);
    }
}

function displayVaccinationsList() {
    const container = document.getElementById('vaccinations-list');
    if (!container) return;
    
    const searchTerm = document.getElementById('search-list')?.value.toLowerCase() || '';
    const filterVillage = document.getElementById('filter-village')?.value || '';
    
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

function showNotification(message, type = 'info') {
    try {
        const notification = document.getElementById('notification');
        if (!notification) {
            console.log(`[${type.toUpperCase()}] ${message}`);
            return;
        }
        
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    } catch (error) {
        console.error('❌ Erreur notification:', error);
    }
}

function updateConnectionStatus() {
    const statusEl = document.getElementById('sync-status');
    const syncBtn = document.getElementById('btn-sync-now');
    
    if (statusEl) {
        statusEl.innerHTML = appState.isOnline ? '🟢 En ligne' : '🔴 Hors ligne';
    }
    
    if (syncBtn) {
        syncBtn.disabled = !appState.isOnline || appState.pendingSync.length === 0;
    }
}

// ==================== GESTION DES ÉVÉNEMENTS ====================

function setupEventListeners() {
    console.log('🔧 Configuration des écouteurs d\'événements...');
    
    try {
        // Onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                
                this.classList.add('active');
                const tabPane = document.getElementById(tabId);
                if (tabPane) {
                    tabPane.classList.add('active');
                    
                    if (tabId === 'liste') {
                        displayVaccinationsList();
                    }
                }
            });
        });
        
        // Formulaire d'enregistrement
        const saveBtn = document.getElementById('btn-save-offline');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                // Validation
                const childName = document.getElementById('child-name')?.value.trim() || '';
                const childAge = document.getElementById('child-age')?.value || '';
                const childSex = document.getElementById('child-sex')?.value || '';
                const village = document.getElementById('child-village')?.value || '';
                const vaccine = document.getElementById('vaccine-type')?.value || '';
                const vaccineDate = document.getElementById('vaccine-date')?.value || '';
                
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
                    vaccineDose: document.getElementById('vaccine-dose')?.value || 'Dose 1',
                    notes: document.getElementById('agent-notes')?.value.trim() || ''
                });
                
                // Confirmation
                const confirmation = document.getElementById('save-confirmation');
                if (confirmation) {
                    confirmation.style.display = 'block';
                    const confirmationText = confirmation.querySelector('p');
                    if (confirmationText) {
                        confirmationText.innerHTML = `✅ <strong>${vaccination.childName}</strong> enregistré(e) localement !`;
                    }
                    
                    setTimeout(() => {
                        confirmation.style.display = 'none';
                    }, 5000);
                }
                
                // Réinitialiser le formulaire
                const form = document.getElementById('vaccination-form');
                if (form) {
                    form.reset();
                    const dateInput = document.getElementById('vaccine-date');
                    if (dateInput) {
                        dateInput.value = new Date().toISOString().split('T')[0];
                    }
                }
                
                showNotification(`✅ ${childName} vacciné(e) avec ${vaccine}`, 'success');
            });
        }
        
        // Synchronisation manuelle
        const syncBtn = document.getElementById('btn-sync-now');
        if (syncBtn) {
            syncBtn.addEventListener('click', attemptSync);
        }
        
        // Recherche dans la liste
        const searchInput = document.getElementById('search-list');
        if (searchInput) {
            searchInput.addEventListener('input', displayVaccinationsList);
        }
        
        const filterSelect = document.getElementById('filter-village');
        if (filterSelect) {
            filterSelect.addEventListener('change', displayVaccinationsList);
        }
        
        // Export CSV
        const exportBtn = document.getElementById('btn-export-csv');
        if (exportBtn) {
            exportBtn.addEventListener('click', generateCSV);
        }
        
        // Export Excel (boutons rapports)
        document.querySelectorAll('[data-report]').forEach(btn => {
            btn.addEventListener('click', function() {
                const reportType = this.getAttribute('data-report');
                switch(reportType) {
                    case 'agent':
                        generateAgentReport();
                        break;
                    case 'village':
                        generateVillageReport();
                        break;
                    case 'vaccine':
                        generateVaccineReport();
                        break;
                }
            });
        });
        
        // Synchronisation manuelle (paramètres)
        const manualSyncBtn = document.getElementById('btn-manual-sync');
        if (manualSyncBtn) {
            manualSyncBtn.addEventListener('click', attemptSync);
        }
        
        // Effacer données locales
        const clearBtn = document.getElementById('btn-clear-data');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                if (confirm('⚠️ Voulez-vous vraiment effacer TOUTES les données locales ? Cette action est irréversible.')) {
                    localStorage.clear();
                    appState.vaccinations = [];
                    appState.pendingSync = [];
                    appState.agentName = 'Agent UNICEF';
                    
                    updateDashboard();
                    displayVaccinationsList();
                    
                    // Réinitialiser le nom de l'agent dans l'input
                    const agentInput = document.getElementById('setting-agent-name');
                    if (agentInput) {
                        agentInput.value = 'Agent UNICEF';
                    }
                    
                    showNotification('🗑️ Toutes les données locales ont été effacées', 'danger');
                }
            });
        }
        
        // Mise à jour nom agent
        const agentNameInput = document.getElementById('setting-agent-name');
        if (agentNameInput) {
            // Définir la valeur initiale
            agentNameInput.value = appState.agentName;
            
            // Écouter les changements
            agentNameInput.addEventListener('input', function() {
                const newName = this.value.trim() || 'Agent UNICEF';
                
                // Mettre à jour l'état
                appState.agentName = newName;
                
                // Sauvegarder
                localStorage.setItem('vaxitrack_agent', newName);
                
                // Mettre à jour l'affichage
                const agentNameEl = document.getElementById('agent-name');
                if (agentNameEl) {
                    agentNameEl.innerHTML = `Agent: <strong>${newName}</strong> | <span id="sync-status">${appState.isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}</span>`;
                }
                
                showNotification('👤 Nom agent mis à jour', 'success');
                console.log('Nom agent changé:', newName);
            });
            
            // Écouter aussi le blur (quand on quitte le champ)
            agentNameInput.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.value = 'Agent UNICEF';
                    agentNameInput.dispatchEvent(new Event('input'));
                }
            });
        }
        
        // ID agent (optionnel)
        const agentIdInput = document.getElementById('setting-agent-id');
        if (agentIdInput) {
            const savedId = localStorage.getItem('vaxitrack_agent_id');
            if (savedId) {
                agentIdInput.value = savedId;
            }
            
            agentIdInput.addEventListener('input', function() {
                localStorage.setItem('vaxitrack_agent_id', this.value.trim());
            });
        }
        
        // Événements de connexion/déconnexion
        window.addEventListener('online', function() {
            appState.isOnline = true;
            updateConnectionStatus();
            showNotification('🌐 Connexion internet rétablie', 'success');
            
            if (appState.pendingSync.length > 0) {
                setTimeout(attemptSync, 1000);
            }
        });
        
        window.addEventListener('offline', function() {
            appState.isOnline = false;
            updateConnectionStatus();
            showNotification('📴 Mode offline - Données sauvegardées localement', 'warning');
        });
        
        console.log('✅ Écouteurs d\'événements configurés');
        
    } catch (error) {
        console.error('❌ Erreur configuration écouteurs:', error);
    }
}

// ==================== EXPORT CSV ====================

function generateCSV() {
    if (appState.vaccinations.length === 0) {
        showNotification('Aucune donnée à exporter', 'warning');
        return;
    }
    
    try {
        const headers = ['Nom enfant', 'Âge (mois)', 'Sexe', 'Village', 'Vaccin', 'Date', 'Dose', 'Agent', 'Date enregistrement', 'Statut'];
        
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
                v.recordedAt,
                v.synced ? 'Synchronisé' : 'En attente'
            ].join(','))
        ];
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `vaxitrack_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('📥 Fichier CSV téléchargé', 'success');
        return true;
    } catch (error) {
        console.error('❌ Erreur génération CSV:', error);
        showNotification('⚠️ Erreur génération CSV', 'danger');
        return false;
    }
}

// ==================== GENERATION EXCEL ====================

function generateExcel(data, sheetName, fileName) {
    if (!window.XLSX) {
        showNotification('❌ Bibliothèque Excel non chargée', 'danger');
        console.error('XLSX non disponible');
        return false;
    }
    
    try {
        // Créer un nouveau workbook
        const workbook = XLSX.utils.book_new();
        
        // Convertir les données en worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // Ajouter le worksheet au workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        
        // Générer le fichier Excel
        XLSX.writeFile(workbook, fileName);
        
        showNotification(`✅ Excel téléchargé: ${fileName}`, 'success');
        return true;
    } catch (error) {
        console.error('❌ Erreur génération Excel:', error);
        showNotification('⚠️ Erreur génération Excel', 'danger');
        return false;
    }
}

// 1. RAPPORT AGENT - Toutes les données
function generateAgentReport() {
    if (appState.vaccinations.length === 0) {
        showNotification('Aucune donnée à exporter', 'warning');
        return;
    }
    
    showNotification('📊 Génération du rapport Excel...', 'info');
    
    // Formater les données pour Excel
    const excelData = appState.vaccinations.map(v => ({
        'Date vaccination': new Date(v.vaccineDate).toLocaleDateString('fr-FR'),
        'Enfant': v.childName,
        'Âge (mois)': v.childAge,
        'Sexe': v.childSex === 'M' ? 'Garçon' : 'Fille',
        'Village': v.village,
        'Vaccin': v.vaccine,
        'Dose': v.vaccineDose,
        'Agent': v.agent,
        'Date enregistrement': new Date(v.recordedAt).toLocaleDateString('fr-FR'),
        'Statut': v.synced ? 'Synchronisé' : 'En attente'
    }));
    
    const fileName = `mes_vaccinations_${new Date().toISOString().split('T')[0]}.xlsx`;
    generateExcel(excelData, 'Mes Vaccinations', fileName);
}

// 2. RAPPORT VILLAGE - Statistiques par village
function generateVillageReport() {
    if (appState.vaccinations.length === 0) {
        showNotification('Aucune donnée à exporter', 'warning');
        return;
    }
    
    showNotification('🏘️ Génération statistiques par village...', 'info');
    
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

// 3. RAPPORT VACCIN - Répartition par type de vaccin
function generateVaccineReport() {
    if (appState.vaccinations.length === 0) {
        showNotification('Aucune donnée à exporter', 'warning');
        return;
    }
    
    showNotification('💉 Génération répartition par vaccin...', 'info');
    
    // Calculer par vaccin
    const vaccineStats = {};
    
    appState.vaccinations.forEach(v => {
        vaccineStats[v.vaccine] = (vaccineStats[v.vaccine] || 0) + 1;
    });
    
    // Convertir en format Excel
    const excelData = Object.entries(vaccineStats).map(([vaccin, count]) => ({
        'Vaccin': vaccin,
        'Nombre administré': count,
        'Pourcentage': ((count / appState.vaccinations.length) * 100).toFixed(1) + '%'
    }));
    
    const fileName = `repartition_vaccins_${new Date().toISOString().split('T')[0]}.xlsx`;
    generateExcel(excelData, 'Par Vaccin', fileName);
}

// ==================== VÉRIFICATION OFFLINE ====================

function checkOfflineCapabilities() {
    console.log('🔍 Vérification des capacités offline...');
    
    // localStorage
    if ('localStorage' in window) {
        console.log('✅ localStorage disponible');
        
        // Teste écriture/lecture
        try {
            localStorage.setItem('vaxitrack_test', 'test');
            localStorage.removeItem('vaxitrack_test');
            console.log('✅ localStorage fonctionnel');
        } catch (e) {
            console.error('❌ localStorage plein ou bloqué:', e);
            showNotification('⚠️ Stockage local plein ou bloqué', 'warning');
        }
    } else {
        console.log('❌ localStorage non disponible');
        showNotification('⚠️ Stockage local non disponible', 'warning');
    }
    
    // IndexedDB
    if ('indexedDB' in window) {
        console.log('✅ IndexedDB disponible');
    }
    
    // Connexion
    console.log('🌐 Connexion internet:', navigator.onLine ? 'OUI' : 'NON');
    
    if (!navigator.onLine) {
        showNotification('📴 Mode offline - Travail local sécurisé', 'info');
    }
    
    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(reg => {
            if (reg) {
                console.log('✅ Service Worker enregistré:', reg.scope);
                showNotification('✅ Mode offline activé', 'success');
            } else {
                console.log('ℹ️ Service Worker non enregistré - mode online seulement');
            }
        }).catch(err => {
            console.log('❌ Erreur Service Worker:', err);
        });
    }
}

// ==================== DÉPANNAGE ET DEBUG ====================

// Fonction de débogage exposée globalement
window.debugApp = {
    showState: () => {
        console.log('État de l\'app:', appState);
        return appState;
    },
    clearAll: () => {
        localStorage.clear();
        location.reload();
    },
    exportJSON: () => {
        const dataStr = JSON.stringify(appState.vaccinations, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', 'vaxitrack_data.json');
        link.click();
    },
    testExcel: () => {
        generateAgentReport();
    },
    testCSV: () => {
        generateCSV();
    }
};

// Vérifie si XLSX est chargé
setTimeout(() => {
    if (window.XLSX) {
        console.log('✅ XLSX (SheetJS) chargé avec succès');
    } else {
        console.error('❌ XLSX (SheetJS) non chargé');
        showNotification('⚠️ Bibliothèque Excel non chargée', 'warning');
    }
}, 2000);

console.log('🚀 VaxiTrack Tchad v2.0.0 - Code prêt');