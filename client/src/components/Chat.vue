<template>
  <div class="page-container">
    <div class="chat-layout">
      <!-- Left Panel: Chat -->
      <div class="chat-panel" ref="chatPanel">
        <div class="chat-container">
          <div class="chat-history">
            <div v-for="msg in messages" :key="msg.id" class="chat-message" :class="`message-${msg.role}`">
              <div class="message-avatar">{{ msg.role === 'user' ? '🧑' : '🤖' }}</div>
              <div class="message-content">
                <p v-if="msg.role === 'user'">{{ msg.content }}</p>
                <div v-else>
                  <div class="message-actions">
                    <button @click="copyMessage(msg.content)" class="action-button">Copy</button>
                    <button @click="previewPdf(msg.content)" class="action-button">PDF</button>
                  </div>
                  <div v-html="renderMarkdown(msg.content)" class="markdown-content"></div>
                </div>
              </div>
            </div>
            <div v-if="loading" class="chat-message message-assistant">
              <div class="message-avatar">🤖</div>
              <div class="message-content"><p>Thinking...</p></div>
            </div>
          </div>
          <div class="chat-input-area">
            <textarea
              v-model="newMessage"
              placeholder="Type your message here..."
              class="chat-input"
              :disabled="loading"
            ></textarea>
            <button @click="sendMessage" class="send-button" :disabled="loading || !newMessage.trim()">送信</button>
          </div>
          <div v-if="error" class="error-message">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Resizer -->
      <div class="resizer" @mousedown="startResize"></div>

      <!-- Right Panels -->
      <div class="right-panels">
        <!-- Top-Right: PDF Viewer -->
        <div class="pdf-viewer-panel" ref="pdfViewerPanel">
          <div class="panel-header">
            <span>Generated PDF</span>
            <div v-if="showPdfPreview">
              <button @click="downloadPdf" class="action-button">Download</button>
              <button @click="closePdfPreview" class="action-button">Close</button>
            </div>
          </div>
          <div class="panel-content">
            <div v-if="showPdfPreview" id="pdf-preview-content" class="pdf-preview-content" v-html="pdfPreviewHtml"></div>
            <p v-else>The PDF generated from the AI's markdown will be displayed here.</p>
          </div>
        </div>

        <!-- Horizontal Resizer -->
        <div class="resizer-horizontal" @mousedown="startResizeHorizontal"></div>

        <!-- Bottom-Right: Query Viewer Placeholder -->
        <div class="query-viewer-panel">
          <div class="panel-header">Executed Queries</div>
          <div class="panel-content">
            <p>Executed queries will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { ApiService, type ChatMessage, type ClaudeMessageResponse } from '../services/api';
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';
import '../styles/chat.css';

const messages = ref<ChatMessage[]>([]);
const newMessage = ref('');
const loading = ref(false);
const error = ref('');
const route = useRoute();
const chatId = ref<string>(route.params.chatId as string);
const chatPanel = ref<HTMLElement | null>(null);
const pdfViewerPanel = ref<HTMLElement | null>(null);
const pdfPreviewHtml = ref('');
const showPdfPreview = ref(false);

onMounted(async () => {
  if (chatId.value) {
    try {
      const chatHistory = await ApiService.getChatHistory(chatId.value);
      messages.value = chatHistory.history;
    } catch (err) {
      error.value = 'Failed to load chat history.';
      console.error(err);
    }
  }
});

const renderMarkdown = (content: string) => {
  return marked(content);
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !chatId.value) return;
  const userMessageContent = newMessage.value;
  newMessage.value = '';
  loading.value = true;
  error.value = '';

  const tempId = crypto.randomUUID();
  messages.value.push({ id: tempId, role: 'user', content: userMessageContent, createdAt: new Date().toISOString(), chatId: chatId.value });

  try {
    const response: ClaudeMessageResponse = await ApiService.sendChat(userMessageContent, chatId.value);
    messages.value.push({ id: crypto.randomUUID(), role: 'assistant', content: response.message, createdAt: new Date().toISOString(), chatId: response.chatId });
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unknown error occurred.';
    messages.value = messages.value.filter(m => m.id !== tempId);
  } finally {
    loading.value = false;
  }
};

// Vertical Resizing logic
const startResize = (event: MouseEvent) => {
  event.preventDefault();
  document.addEventListener('mousemove', doResize);
  document.addEventListener('mouseup', stopResize);
};

const doResize = (event: MouseEvent) => {
  if (chatPanel.value) {
    const containerRect = chatPanel.value.parentElement!.getBoundingClientRect();
    const newWidth = event.clientX - containerRect.left;
    if (newWidth > 300 && newWidth < containerRect.width - 300) { // Enforce min width
      chatPanel.value.style.flex = `0 0 ${newWidth}px`;
    }
  }
};

const stopResize = () => {
  document.removeEventListener('mousemove', doResize);
  document.removeEventListener('mouseup', stopResize);
};

// Horizontal Resizing logic
const startResizeHorizontal = (event: MouseEvent) => {
  event.preventDefault();
  document.addEventListener('mousemove', doResizeHorizontal);
  document.addEventListener('mouseup', stopResizeHorizontal);
};

const doResizeHorizontal = (event: MouseEvent) => {
  if (pdfViewerPanel.value) {
    const containerRect = pdfViewerPanel.value.parentElement!.getBoundingClientRect();
    const newHeight = event.clientY - containerRect.top;
    if (newHeight > 150 && newHeight < containerRect.height - 150) { // Enforce min height
      pdfViewerPanel.value.style.flex = `0 0 ${newHeight}px`;
    }
  }
};

const stopResizeHorizontal = () => {
  document.removeEventListener('mousemove', doResizeHorizontal);
  document.removeEventListener('mouseup', stopResizeHorizontal);
};

// Action button methods
const copyMessage = (content: string) => {
  navigator.clipboard.writeText(content).then(() => {
    alert('Copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
};

const previewPdf = (markdownContent: string) => {
  pdfPreviewHtml.value = marked(markdownContent);
  showPdfPreview.value = true;
};

const closePdfPreview = () => {
  showPdfPreview.value = false;
  pdfPreviewHtml.value = '';
};

const downloadPdf = () => {
  const element = document.getElementById('pdf-preview-content');
  const options = {
    margin:       1,
    filename:     'report.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(element).set(options).save();
};
</script>