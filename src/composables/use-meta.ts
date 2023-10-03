const meta = reactive<Metadata>({
    id: '0',
    cover: {
        index: false,
        name: '',
        path: '',
        title: '',
        xhtml: '',
        mime: 'image/jpeg',
    },
    title: '',
    author: '',
    images: [],
    output: '',
    creator: '',
    volume: '',
    publisher: '',
    description: '',
    date: '',
})

export const volume = ref('')

export function useMeta() {
    return meta
}
