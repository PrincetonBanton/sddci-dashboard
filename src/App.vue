<template>
  <div class="app-layout">
    <aside class="sidebar">
  <img src="/sodaco.png" style="width: 80px; margin-bottom: 20px; " />

      <nav class="nav-stack">
        <div class="nav-item active">📊 Dashboard</div>
        <div class="nav-item">📦 Inventory</div>
        <div class="nav-item">📈 Analysis</div>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-status" :class="{ 'connected': selectedPath }">
          <button v-if="!selectedPath" @click="handleFileSelect" class="btn-green">
            BROWSE DATABASE
          </button>
          <div v-else class="file-mini-info">
            <p class="filename">{{ fileInfo.name }}</p>
            <button @click.stop="resetSelection" class="btn-text-reset">DISCONNECT</button>
          </div>
        </div>

        <button v-if="selectedPath" @click="confirmPath" :disabled="isMigrating" class="btn-green">
          {{ isMigrating ? '⚡ Syncing...' : 'SYNC DATABASE' }}
        </button>
      </div>
    </aside>

    <main class="main-canvas">
      <header class="top-header">
        <div class="header-titles">
          <div class="type-badge" v-if="detectedType || locations.length > 0">
            <div v-if="detectedType"><strong> {{ detectedType.toUpperCase() }} : </strong></div>
            <div v-if="locations.length > 0" >
                <div v-for="(loc, i) in locations" :key="loc">
                  {{ loc }}{{ i < locations.length - 1 ? ', ' : '' }}
                </div>
              </div>
          </div>
          <div v-else class="type-badge">LEGACY MIGRATION LINK</div>
        </div>
      </header>

      <section class="workspace">
        <div class="toolbar">
          <div class="date-picker-group">
            <div class="input-field"><label>Start Date</label><input type="date" v-model="dateRange.start" /></div>
            <div class="input-field"><label>End Date</label><input type="date" v-model="dateRange.end" /></div>
            <button class="btn-green" @click="handleDateCheck">GO</button>
          </div>
        </div>

        <div class="insight-item">
          <div v-if="mainTableInfo.name">
            {{ mainTableInfo.name === 'DRDetails' ? 'Production -' : 'Issuance -' }}
            {{ mainTableInfo.name === 'DRDetails' ? 'Ready to process Block/Phase weights.' : 'Ready to track material costs.' }}
          </div>
          <div v-else>Connect a database to view system logic.</div>
        </div>

      </section>
    </main>
  </div>
</template>

<script setup>
import { useMigration } from './composables/useMigration'
const { selectedPath, isMigrating, fileInfo, detectedType, mainTableInfo, handleFileSelect, confirmPath, resetSelection, dateRange, handleDateCheck, locations } = useMigration()
</script>

<style scoped>
/* --- 1. CORE LAYOUT --- */
.app-layout { display: flex; height: 100vh; background: #f9fafb; color: #064e3b; font-family: 'Segoe UI', sans-serif; }
.main-canvas { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* --- 2. SIDEBAR NAVIGATION --- */
.sidebar { width: 260px; background: #ffffff; border-right: 1px solid #d1fae5; display: flex; flex-direction: column; padding: .5rem; }
.nav-stack { flex: 1; }
.nav-item { padding: 12px 16px; border-radius: 8px; cursor: pointer; margin-bottom: 4px; font-weight: 500; color: #374151; transition: 0.2s; }
.nav-item:hover { background: #f0fdf4; color: #10b981; }
.nav-item.active { background: #ecfdf5; color: #059669; }

/* --- 3. SIDEBAR CONNECTION & SYNC --- */
.sidebar-footer { margin-top: auto; display: flex; flex-direction: column; gap: 12px; }
.sidebar-status { background: #f3f4f6; padding: 1rem; border-radius: 12px; font-size: 0.85rem; min-height: 85px; display: flex; flex-direction: column; justify-content: center; transition: 0.3s; }
.sidebar-status.connected { background: #ecfdf5; border: 1px solid #10b981; }
.file-mini-info .filename { font-weight: 600; color: #065f46; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }


/* --- BUTTONS --- */
.btn-text-reset { background: none; border: none; color: #ef4444; padding: 0; cursor: pointer; font-size: 0.75rem; font-weight: 700; text-align: left; }
.btn-green { background: #064e3b; color: white; border: none; padding: 12px; border-radius: 30px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 0.9rem; }
.btn-green:hover { background: #065f46; transform: translateY(-1px); }
.btn-green:disabled { background: #9ca3af; cursor: not-allowed; }

/* --- 4. TOP HEADER & BADGES --- */
.top-header { padding: 1rem; background: white; border-bottom: 1px solid #d1fae5; display: flex; align-items: center; min-height: 10px; }
.type-badge { display: flex; align-items: center; gap: 12px; background: #d1fae5; color: #065f46; padding: 10px 20px; border-radius: 50px; }

/* --- 5. WORKSPACE & TOOLS --- */
.workspace { padding: 2.5rem; overflow-y: auto; flex: 1; }
.toolbar { margin-bottom: 2rem; background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #e5e7eb; }
.date-picker-group { display: flex; gap: 20px; align-items: flex-end; }
.input-field { display: flex; flex-direction: column; gap: 4px; }
.input-field label { font-size: 0.7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; }
.input-field input { border: 1px solid #d1d5db; padding: 6px; border-radius: 4px; outline-color: #10b981; }

/* --- 6. DATA BLOCKS & INSIGHTS --- */
.insight-item { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 1rem; color: #92400e; border-radius: 4px;}
</style>