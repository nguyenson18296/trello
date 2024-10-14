import { type DirectiveBinding } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('on-click-outside', {
    beforeMount(el: any, binding: any) {
      el.clickOutsideEvent = function (event: MouseEvent) {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event, el)
        }
      }
      document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted(el: any) {
      document.body.removeEventListener('click', el.clickOutsideEvent)
    }
  }),

  nuxtApp.vueApp.directive('on-focus', {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      const delay: number = binding.value || 0 // Default delay is 0ms
      setTimeout(() => {
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
          el.focus()
        }
      }, delay)
    }
  })
})
