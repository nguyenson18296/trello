<template>
  <div v-if="editor" class="container">
    <div class="control-group">
      <div class="button-group">
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          H1
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          H2
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          H3
        </button>
        <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          <img src="/public/images/bold.svg" class="w-4 h-4" />
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }">
          <img src="/public/images/italic.svg" class="w-4 h-4" />
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }">
          <img src="/public/images/strike.svg" class="w-4 h-4" />
        </button>
        <Button
          @click="editor.chain().focus().toggleBulletList().run()" 
          icon="pi pi-list" severity="contrast" text rounded
          :class="{ 'is-active': editor.isActive('bulletList') }"
          />
        <Button
          @click="editor.chain().focus().toggleOrderedList().run()"
          icon="pi pi-sort-numeric-down" severity="contrast" text rounded
          :class="{ 'is-active': editor.isActive('bulletList') }"
        />
      </div>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup>
import { onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import Text from '@tiptap/extension-text'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'

const { content } = defineProps({
  content: {
    type: String,
    required: false,
  },
})

const emits = defineEmits(['update'])

const editor = useEditor({
  content: content,
  extensions: [StarterKit, Text, Document, Heading, Paragraph, TextAlign],
  onUpdate: ({ editor }) => {
    emits('update', editor.getHTML())
  },
})

onBeforeUnmount(() => {
  editor.value.destroy();
})
</script>

<style lang="scss">
.container {
  .button-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border-bottom: 1px solid #808080;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      font-size: 20px;
      background: #fff;
      color: #333;
      border: none;
      border-radius: 2px;
      margin: .5em 4px;
      -webkit-appearance: none;
      cursor: pointer;
    }
  }
}

/* Basic editor styles */
.container {
  border: 1px solid #8590a2;

  :first-child {
    margin-top: 0;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 0.5rem 1rem 0.5rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  mark {
    background-color: #FAF594;
    border-radius: 0.4rem;
    box-decoration-break: clone;
    padding: 0.1rem 0.3rem;
  }

  blockquote {
    border-left: 3px solid var(--gray-3);
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    margin: 2rem 0;
  }
}
</style>
