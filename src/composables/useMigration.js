import { ref } from 'vue'

export function useMigration() {
  const selectedPath = ref('')
  const isMigrating = ref(false)
  const migratedTables = ref([])
  const fileInfo = ref({ name: '' })
  const detectedType = ref('')
  const mainTableInfo = ref({ name: '', columns: [] })

  // Helper to get IPC
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

  const confirmPath = () => {
    const ipc = getIpc()
    if (!ipc) return
    
    isMigrating.value = true
    ipc.once('migration-finished', (event, result) => {
      isMigrating.value = false
      if (result.success) {
        migratedTables.value = result.stats
        detectedType.value = result.dbType
        mainTableInfo.value = { name: result.mainTable, columns: result.schema }
      } else {
        alert("Error: " + result.error)
      }
    })
    ipc.send('save-mdb-path', selectedPath.value)
  }

  const resetState = () => {
    mainTableInfo.value = { name: '', columns: [] }
    migratedTables.value = []
    detectedType.value = ''
  }

  const resetSelection = () => {
    selectedPath.value = ''
    resetState()
  }

  return {
    selectedPath, isMigrating, migratedTables, fileInfo,
    detectedType, mainTableInfo, handleFileSelect, 
    confirmPath, resetSelection
  }
}