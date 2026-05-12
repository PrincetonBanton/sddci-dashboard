<template>
  <div class="app-container">
    <div class="card">
      <h2>Sodaco Legacy Link</h2>
      <p>Modernizing Access Database (.mdb) to SQLite</p>
      
      <div class="drop-zone" @click="handleFileSelect" :class="{ 'has-file': selectedPath }">
        <div v-if="!selectedPath">
          <p>Click to select the <strong>.mdb</strong> file</p>
          <button class="btn-browse">Browse System Files</button>
        </div>
        <div v-else>
          <p>Targeting: <strong>{{ fileInfo.name }}</strong> 
            <span @click.stop="resetSelection" class="change-link">(Change)</span>
          </p>
          <code>{{ selectedPath }}</code>
        </div>
      </div>

      <div v-if="selectedPath" class="action-area">
        <button @click="confirmPath" :disabled="isMigrating" class="btn-confirm">
          {{ isMigrating ? '⚡ Migrating Data...' : 'Confirm & Connect' }}
        </button>
      </div>

      <div v-if="mainTableInfo.name" class="inspector-card">
        <div class="badge">{{ detectedType }}</div>
        <h3>🛠️ {{ mainTableInfo.name }} Properties</h3>
        <p>The following fields were discovered for future analysis:</p>
        
        <div class="property-tags">
          <span v-for="col in mainTableInfo.columns" :key="col.name" class="tag">
            {{ col.name }}
          </span>
        </div>
        
        <div class="hint-box">
          <span v-if="mainTableInfo.name === 'DRDetails'">
            💡 <strong>Ready:</strong> We can now calculate kilos per Block/Phase.
          </span>
          <span v-else>
            💡 <strong>Ready:</strong> We can now track Material Issuance costs.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMigration } from './composables/useMigration'

const {
  selectedPath, isMigrating, fileInfo, detectedType,
  mainTableInfo, handleFileSelect, confirmPath, resetSelection
} = useMigration()
</script>

<style scoped>
/* Scoped styles remain the same as your previous version */
.app-container { padding: 2rem; background: #f4f7f6; min-height: 100vh; }
.card { background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); max-width: 800px; margin: 0 auto; text-align: center; }
.drop-zone { border: 2px dashed #646cff; padding: 2rem; border-radius: 12px; cursor: pointer; transition: 0.3s; background: #fafaff; }
.drop-zone:hover { background: #f0f0ff; border-color: #535bf2; }
.has-file { border-style: solid; background: #f0fdf4; border-color: #22c55e; }
.btn-confirm { margin-top: 1rem; background: #646cff; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%; }
.btn-confirm:disabled { background: #ccc; cursor: not-allowed; }
.change-link { color: #646cff; cursor: pointer; margin-left: 10px; font-size: 0.8rem; text-decoration: underline; }
.inspector-card { margin-top: 2rem; padding: 1.5rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; text-align: left; }
.badge { display: inline-block; background: #646cff; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; margin-bottom: 10px; }
.property-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; }
.tag { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; color: #475569; font-family: monospace; }
.hint-box { background: #fffbeb; border: 1px solid #fde68a; padding: 10px; border-radius: 8px; font-size: 0.9rem; color: #92400e; }
code { display: block; font-size: 0.7rem; margin-top: 5px; color: #666; }
</style>