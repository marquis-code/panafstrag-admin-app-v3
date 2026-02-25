<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: 'text-[#2E7D32] underline' },
    }),
    Image.configure({
      inline: true,
      HTMLAttributes: { class: 'rounded-lg max-w-full' },
    }),
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: props.placeholder || 'Start writing program content...',
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val || '', false)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const setLink = () => {
  const url = window.prompt('Enter URL:')
  if (url) {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
}

const addImage = () => {
  const url = window.prompt('Enter image URL:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

const toolbarButtons = computed(() => {
  if (!editor.value) return []
  return [
    { icon: 'B', action: () => editor.value!.chain().focus().toggleBold().run(), active: editor.value.isActive('bold'), title: 'Bold' },
    { icon: 'I', action: () => editor.value!.chain().focus().toggleItalic().run(), active: editor.value.isActive('italic'), title: 'Italic', italic: true },
    { icon: 'U', action: () => editor.value!.chain().focus().toggleUnderline().run(), active: editor.value.isActive('underline'), title: 'Underline', underline: true },
    { icon: 'S', action: () => editor.value!.chain().focus().toggleStrike().run(), active: editor.value.isActive('strike'), title: 'Strikethrough', strike: true },
    { divider: true },
    { icon: 'H1', action: () => editor.value!.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.value.isActive('heading', { level: 1 }), title: 'Heading 1' },
    { icon: 'H2', action: () => editor.value!.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.value.isActive('heading', { level: 2 }), title: 'Heading 2' },
    { icon: 'H3', action: () => editor.value!.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.value.isActive('heading', { level: 3 }), title: 'Heading 3' },
    { divider: true },
    { icon: '•', action: () => editor.value!.chain().focus().toggleBulletList().run(), active: editor.value.isActive('bulletList'), title: 'Bullet List' },
    { icon: '1.', action: () => editor.value!.chain().focus().toggleOrderedList().run(), active: editor.value.isActive('orderedList'), title: 'Ordered List' },
    { icon: '❝', action: () => editor.value!.chain().focus().toggleBlockquote().run(), active: editor.value.isActive('blockquote'), title: 'Blockquote' },
    { divider: true },
    { icon: '🔗', action: setLink, active: editor.value.isActive('link'), title: 'Link' },
    { icon: '🖼', action: addImage, active: false, title: 'Image' },
    { divider: true },
    { icon: '⎘', action: () => editor.value!.chain().focus().setHorizontalRule().run(), active: false, title: 'Divider' },
    { icon: '↩', action: () => editor.value!.chain().focus().undo().run(), active: false, title: 'Undo' },
    { icon: '↪', action: () => editor.value!.chain().focus().redo().run(), active: false, title: 'Redo' },
  ]
})
</script>

<template>
  <div class="rich-text-editor border border-gray-200 rounded-lg overflow-hidden bg-white">
    <!-- Toolbar -->
    <div v-if="editor" class="flex flex-wrap items-center gap-0.5 p-2 bg-gray-50 border-b border-gray-200">
      <template v-for="(btn, i) in toolbarButtons" :key="i">
        <div v-if="btn.divider" class="w-px h-6 bg-gray-200 mx-1"></div>
        <button
          v-else
          @click="btn.action"
          :title="btn.title"
          class="px-2 py-1.5 rounded text-xs font-black transition-all min-w-[28px] text-center"
          :class="[
            btn.active ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-200 hover:text-black',
            btn.italic ? 'italic' : '',
            btn.underline ? 'underline' : '',
            btn.strike ? 'line-through' : '',
          ]"
        >
          {{ btn.icon }}
        </button>
      </template>
    </div>

    <!-- Editor -->
    <EditorContent :editor="editor" class="rich-text-content" />
  </div>
</template>

<style>
.rich-text-content .tiptap {
  min-height: 200px;
  padding: 1.5rem;
  outline: none;
  font-size: 0.9375rem;
  line-height: 1.8;
  color: #1a1a1a;
}

.rich-text-content .tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
  font-style: italic;
}

.rich-text-content .tiptap h1 {
  font-size: 2rem;
  font-weight: 900;
  margin: 1.5rem 0 0.75rem;
  letter-spacing: -0.025em;
}

.rich-text-content .tiptap h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 1.25rem 0 0.5rem;
  letter-spacing: -0.015em;
}

.rich-text-content .tiptap h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem;
}

.rich-text-content .tiptap p {
  margin: 0.5rem 0;
}

.rich-text-content .tiptap ul,
.rich-text-content .tiptap ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.rich-text-content .tiptap ul {
  list-style-type: disc;
}

.rich-text-content .tiptap ol {
  list-style-type: decimal;
}

.rich-text-content .tiptap li {
  margin: 0.25rem 0;
}

.rich-text-content .tiptap blockquote {
  border-left: 4px solid #2E7D32;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background: #f9fafb;
  font-style: italic;
  color: #4b5563;
}

.rich-text-content .tiptap a {
  color: #2E7D32;
  text-decoration: underline;
  cursor: pointer;
}

.rich-text-content .tiptap hr {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 1.5rem 0;
}

.rich-text-content .tiptap img {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.rich-text-content .tiptap strong {
  font-weight: 800;
}

.rich-text-content .tiptap code {
  background: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.rich-text-content .tiptap pre {
  background: #1f2937;
  color: #e5e7eb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.rich-text-content .tiptap pre code {
  background: none;
  padding: 0;
  color: inherit;
}
</style>
