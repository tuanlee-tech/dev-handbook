<template>
  <div class="react-demo">
    <!-- Tab Headers -->
    <div class="demo-tabs">
      <button
        :class="['tab-button', { active: activeTab === 'preview' }]"
        @click="activeTab = 'preview'"
      >
        <svg
          class="tab-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        Preview
      </button>

      <button
        :class="['tab-button', { active: activeTab === 'code' }]"
        @click="activeTab = 'code'"
      >
        <svg
          class="tab-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
        Code
      </button>
    </div>

    <!-- Tab Contents -->
    <div class="tab-content">
      <!-- Preview Tab -->
      <div v-show="activeTab === 'preview'" class="preview-panel">
        <div ref="container"></div>
      </div>

      <!-- Code Tab -->
      <div v-show="activeTab === 'code'" class="code-panel">
        <pre class="language-jsx"><code v-html="escapedCode"></code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { createRoot } from "react-dom/client";
import { createElement } from "react";

const props = defineProps({
  component: Object, // React component
  rawCode: String, // JSX code as string
});

const container = ref(null);
const activeTab = ref("preview");
let root = null;

const renderComponent = () => {
  if (container.value && props.component) {
    if (!root) root = createRoot(container.value);
    root.render(createElement(props.component));
  }
};

onMounted(renderComponent);
watch(() => props.component, renderComponent);
onUnmounted(() => {
  if (root) {
    root.unmount();
    root = null;
  }
});

// Escape HTML for safe JSX display
const escapedCode = computed(() => {
  if (!props.rawCode) return "No code provided";
  return props.rawCode
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
});
</script>

<style scoped>
.react-demo {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

/* Tabs Header */
.demo-tabs {
  display: flex;
  gap: 0;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.tab-button.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.tab-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

/* Tab Content */
.tab-content {
  min-height: 200px;
}

.preview-panel {
  padding: 32px 24px;
  background: var(--vp-c-bg);
}

.code-panel {
  background: var(--vp-code-block-bg);
  overflow-x: auto;
}

/* Remove default margin from code blocks inside */
.code-panel :deep(div[class*="language-"]) {
  margin: 0;
  border-radius: 0;
  background: transparent;
}

/* Dark mode adjustments */
.dark .tab-button:hover {
  background: var(--vp-c-bg-elv);
}

.dark .tab-button.active {
  background: var(--vp-c-bg-elv);
}
</style>
