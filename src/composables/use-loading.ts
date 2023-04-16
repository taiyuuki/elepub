export const importing = ref(false)

export const generating = ref(false)

export const payload = ref(0)

export const progress = computed(() => {
  return payload.value.toFixed(0) + '%'
})