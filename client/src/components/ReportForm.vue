<template>
  <div class="page-wrapper">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
    <div class="main-container">
      <!-- Left Side: Report Form -->
      <div class="form-column">
        <div class="report-form-container">
          <h1>Threat Analysis Report</h1>
          <p class="subtitle">Fill out the form below to start the analysis.</p>
          <form @submit.prevent="submitReportForm">
            <div class="form-group floating-label">
              <input type="datetime-local" id="start-datetime" v-model="reportForm.start" placeholder=" " />
              <label for="start-datetime">Start Date & Time</label>
            </div>
            <div class="form-group floating-label">
              <input type="datetime-local" id="end-datetime" v-model="reportForm.end" placeholder=" " />
              <label for="end-datetime">End Date & Time</label>
            </div>
            
            <div class="form-group">
              <label class="static-label">Target Honeypots</label>
              <div class="checkbox-group scrollable">
                <div v-for="honeypot in honeypotList" :key="honeypot.id" class="checkbox-item">
                  <input type="checkbox" :id="'svc-' + honeypot.id" v-model="reportForm.target[honeypot.id]" />
                  <label :for="'svc-' + honeypot.id">{{ honeypot.name }}</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="svc-other" v-model="reportForm.target.other" />
                  <label for="svc-other">Other</label>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="static-label">Malware Analysis</label>
              <div class="radio-group">
                <div class="radio-item">
                  <input type="radio" id="malware-analysis-yes" value="enable" v-model="reportForm.malware" />
                  <label for="malware-analysis-yes">Enable</label>
                </div>
                <div class="radio-item">
                  <input type="radio" id="malware-analysis-no" value="disable" v-model="reportForm.malware" />
                  <label for="malware-analysis-no">Disable</label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="static-label">Exploit & Vulnerability Investigation</label>
              <div class="radio-group">
                <div class="radio-item">
                  <input type="radio" id="exploit-vuln-yes" value="enable" v-model="reportForm.exploit" />
                  <label for="exploit-vuln-yes">Enable</label>
                </div>
                <div class="radio-item">
                  <input type="radio" id="exploit-vuln-no" value="disable" v-model="reportForm.exploit" />
                  <label for="exploit-vuln-no">Disable</label>
                </div>
              </div>
            </div>
            <div class="form-group floating-label">
                <select id="audience" v-model="reportForm.audience" required>
                  <option value="" disabled selected></option>
                  <option value="beginner_engineer">Beginner Engineer</option>
                  <option value="senior_engineer">Senior Engineer</option>
                  <option value="SOC_operator">SOC Operator</option>
                  <option value="strategy">Strategy</option>
                </select>
                <label for="audience">Audience</label>
            </div>
            <div class="form-group floating-label">
              <select id="language" v-model="reportForm.language">
                <option value="en">English</option>
                <option value="ja">Japanese</option>
              </select>
              <label for="language">Language</label>
            </div>
            <button type="submit">Start Analysis</button>
          </form>
        </div>
      </div>

      <!-- Right Side: Config Form -->
      <div class="form-column">
        <div class="config-form-container">
          <h2>Settings</h2>
          <p class="subtitle">Enter your configuration.</p>
          <form @submit.prevent="settingsId ? updateConfig() : createConfig()">
            <div class="form-group floating-label">
              <input type="text" id="es-url" v-model="configForm.elasticsearchURL" placeholder=" " />
              <label for="es-url">ElasticSearch URL</label>
            </div>
            <div class="form-group floating-label">
              <input type="text" id="basic-user" v-model="configForm.BASICAuthUser" placeholder=" " />
              <label for="basic-user">Basic Auth User</label>
            </div>
            <div class="form-group floating-label">
              <input type="password" id="basic-pass" v-model="configForm.BASICAuthPasswd" placeholder=" " />
              <label for="basic-pass">Basic Auth Password</label>
            </div>
            <div class="form-group floating-label">
              <input type="text" id="api-url" v-model="configForm.APIServerURL" placeholder=" " />
              <label for="api-url">API Server URL</label>
            </div>
            <button type="submit" class="secondary">{{ settingsId ? 'Save Settings' : 'Create Settings' }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ApiService } from '../services/api';

const router = useRouter();
const settingsId = ref<string | null>(null);
const isLoading = ref(false);

const honeypotList = [
  { id: 'adbhoney', name: 'ADBHoney' },
  { id: 'beelzebub', name: 'Beelzebub' },
  { id: 'ciscoasa', name: 'CiscoASA' },
  { id: 'citrixhoneypot', name: 'CitrixHoneypot' },
  { id: 'conpot', name: 'Conpot' },
  { id: 'cowrie', name: 'Cowrie' },
  { id: 'ddospot', name: 'Ddospot' },
  { id: 'dicompot', name: 'Dicompot' },
  { id: 'dionaea', name: 'Dionaea' },
  { id: 'elasticpot', name: 'Elasticpot' },
  { id: 'endlessh', name: 'Endlessh' },
  { id: 'galah', name: 'Galah' },
  { id: 'gopot', name: 'Go-pot' },
  { id: 'h0neytr4p', name: 'H0neytr4p' },
  { id: 'heralding', name: 'Heralding' },
  { id: 'honeyaml', name: 'Honeyaml' },
  { id: 'qhoneypots', name: 'qHoneypots' },
  { id: 'ipphoney', name: 'IPPHoney' },
  { id: 'log4pot', name: 'Log4Pot' },
  { id: 'mailoney', name: 'Mailoney' },
  { id: 'medpot', name: 'Medpot' },
  { id: 'miniprint', name: 'Miniprint' },
  { id: 'redishoneypot', name: 'Redishoneypot' },
  { id: 'sentrypeer', name: 'SentryPeer' },
  { id: 'snare', name: 'Snare (Tanner)' },
  { id: 'wordpot', name: 'Wordpot' },
];

const initialTargetServices = honeypotList.reduce((acc, pot) => {
  acc[pot.id] = false;
  return acc;
}, {} as Record<string, boolean>);
initialTargetServices.other = false;

const reportForm = reactive({
  start: '',
  end: '',
  target: initialTargetServices,
  malware: 'disable',
  exploit: 'disable',
  audience: '',
  language: 'en',
});

const configForm = reactive({
  elasticsearchURL: '',
  BASICAuthUser: '',
  BASICAuthPasswd: '',
  APIServerURL: '',
});

onMounted(async () => {
  try {
    const settings = await ApiService.getSettings();
    if (settings) {
      configForm.elasticsearchURL = settings.elasticsearchURL;
      configForm.BASICAuthUser = settings.BASICAuthUser;
      if(settings.BASICAuthPasswd == '********'){
        configForm.BASICAuthPasswd = '';
      }else{
        configForm.BASICAuthPasswd = settings.BASICAuthPasswd;
      }
      configForm.APIServerURL = settings.APIServerURL;
      settingsId.value = settings.id!;
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
    alert('Failed to load settings.');
  }
});

const submitReportForm = async () => {
  const selectedServices: string[] = [];
  for (const pot of honeypotList) {
    if (reportForm.target[pot.id]) {
      selectedServices.push(pot.name);
    }
  }
  // Include "Other" if checked
  if (reportForm.target.other) {
    selectedServices.push('Other');
  }
  const submissionData = { ...reportForm, target: selectedServices };
  
  try {
    const { chatId } = await ApiService.createChat(submissionData);
    router.push({ name: 'chat', params: { chatId } });
  } catch (error) {
    console.error('Failed to create chat session:', error);
    alert('Failed to start analysis. Please check the console for details.');
  }
};

const createConfig = async () => {
  try {
    const result = await ApiService.createSettings(configForm);
    settingsId.value = result.settings.id!;
    alert('Settings created successfully.');
  } catch (error) {
    console.error('Failed to create settings:', error);
    alert('Failed to create settings. Check the console for details.');
  }
};

const updateConfig = async () => {
  if (!settingsId.value) return;
  try {
    await ApiService.updateSettings(settingsId.value, configForm);
    alert('Settings saved successfully.');
  } catch (error) {
    console.error('Failed to save settings:', error);
    alert('Failed to save settings. Check the console for details.');
  }
};
</script>


