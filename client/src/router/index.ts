import { createRouter, createWebHistory } from 'vue-router'
import ReportForm from '../components/ReportForm.vue'
import Chat from '../components/Chat.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ReportForm,
    },
    {
      path: '/chat/:chatId',
      name: 'chat',
      component: Chat,
      props: true, // Pass route params as props to the component
    },
  ],
})

export default router
