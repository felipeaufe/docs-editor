'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image'
import { useEditorStore } from '@/store/use-editor-store'
import Underline from '@tiptap/extension-underline'
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";

import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useStorage } from "@liveblocks/react";

import { FontSizeExtension } from "@/extensions/font-size"
import { LineHeightExtension } from '@/extensions/line-height'
import { Ruler } from './ruler'
import { Threads } from './threads'

import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins"
import { PAGE_SIZE } from '@/constants/page-size'

interface EditorProps {
  initialContent?: string
}

const Editor = ({ initialContent }: EditorProps) => {
  const leftMargin = useStorage(root => root.leftMargin ?? LEFT_MARGIN_DEFAULT)
  const rightMargin = useStorage(root => root.rightMargin ?? RIGHT_MARGIN_DEFAULT)

  const liveblocks = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental: true
  })
  const { setEditor } = useEditorStore()

  const editor = useEditor({
    immediatelyRender: false,
    onCreate: ({ editor }) => setEditor(editor),
    editorProps: {
      attributes: {
        style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px; width: ${PAGE_SIZE}px;`,
        class: "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] pt-10 pr-14 cursor-text"
      }
    },
    onDestroy() {
      setEditor(null)
    },
    onUpdate({ editor }) {
      setEditor(editor)
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor)
    },
    onTransaction({ editor }) {
      setEditor(editor)
    },
    onFocus({ editor }) {
      setEditor(editor)
    },
    onBlur({ editor }) {
      setEditor(editor)
    },
    onContentError({ editor }) {
      setEditor(editor)
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false //NOTE: Replaces by liveblocks
      }),
      FontSizeExtension,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https'
      }),
      TaskItem.configure({
        nested: true,
      }),
      TaskList,
      FontFamily,
      TextStyle,
      TextAlign.configure({
        types: ["heading", "paragraph"], 
      }),
      LineHeightExtension,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      Image,
      ImageResize,
      Underline,
      Color,
      Highlight.configure({
        multicolor: true
      }),
    ],
    content: "",
  })

  return (
    <div className='size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-o print:bg-white print:overflow-visible'>
      <Ruler />
      <div
        className="min-w-max flex justify-center py-4 print:py-0 mx-auto print:w-full print:min-w-0"
        style={{ width: `${PAGE_SIZE}px` }}
      >
        <EditorContent editor={editor} />
        <Threads editor={editor} />
      </div>
    </div>
  );
}
 
export default Editor;