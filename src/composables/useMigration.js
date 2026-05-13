import { ref } from 'vue'

export function useMigration() {
  const selectedPath = ref('')
  const isMigrating = ref(false)
  const migratedTables = ref([])
  const fileInfo = ref({ name: '' })
  const detectedType = ref('')
  const mainTableInfo = ref({ name: '', columns: [] })
  const locations = ref([])
  const dateRange = ref({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const getIpc = () => window.require ? window.require('electron').ipcRenderer : null

  const handleFileSelect = async () => {
    const ipc = getIpc()
    if (!ipc) return
    const path = await ipc.invoke('select-file')
    if (path) {
      selectedPath.value = path
      fileInfo.value.name = path.split('\\').pop()
      resetState()
    }
  }

  const fetchLocations = async () => {
    const ipc = getIpc();
    if (!ipc) return;
    locations.value = await ipc.invoke('get-locations');
  };
  
  const confirmPath = () => {
    const ipc = getIpc();
    if (!ipc) return;
    
    isMigrating.value = true;

    ipc.once('migration-finished', (event, result) => {
      isMigrating.value = false;
      if (result.success) {
        migratedTables.value = result.stats;
        detectedType.value = result.dbType;
        mainTableInfo.value = { name: result.mainTable, columns: result.schema };
        
        // This is where we trigger the locations fetch
        fetchLocations(); 
      } else {
        alert("Error: " + result.error);
      }
    });

    ipc.send('save-mdb-path', selectedPath.value);
  };

  const handleDateCheck = () => {
    if (!detectedType.value) {
      alert("Please sync a database first.");
      return;
    }
    const isProduction = detectedType.value === "Production System";
    const config = {
      table: isProduction ? "DRDetails" : "MISDetails",
      dateCol: isProduction ? "DRDate" : "MISDate",
      amountCol: isProduction ? "DRAmount" : "MISAmount"
    };
    alert(
      `🔍 System: ${detectedType.value}\n` +
      `📂 Table: ${config.table}\n` +
      `📑 Date Column: ${config.dateCol}\n` +
      `📅 Range: ${dateRange.value.start} to ${dateRange.value.end}`
    );
  };

  const resetState = () => {
    mainTableInfo.value = { name: '', columns: [] }
    migratedTables.value = []
    detectedType.value = ''
    locations.value = [] // Clear locations too
  }

  const resetSelection = () => {
    selectedPath.value = ''
    resetState()
  }

  return {
    selectedPath, isMigrating, migratedTables, fileInfo,
    detectedType, mainTableInfo, handleFileSelect, 
    confirmPath, resetSelection,
    dateRange, handleDateCheck,
    locations, fetchLocations 
  }
}