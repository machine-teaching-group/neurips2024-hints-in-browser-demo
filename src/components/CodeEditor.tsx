import Editor from '@monaco-editor/react'
import { twMerge } from 'tailwind-merge'
import { motion } from 'framer-motion'

export default function CodeEditor({
  className,
  code,
  setCode,
}: {
  className?: string
  code: string
  setCode: (s: string) => void
}) {
  return (
    <motion.div className={twMerge(`flex flex-col flex-grow`, className)}>
      <div
        className={twMerge(
          `relative flex-grow rounded-md overflow-hidden border border-veryDarkBlue/5 main-shadow`,
          className
        )}
      >
        <Editor
          height="100%"
          language="python"
          theme="vs-light"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            fontFamily: 'Source Code Pro, monospace',
            fontSize: 14,
            padding: { top: 18 },
            minimap: { enabled: false },
            automaticLayout: true,
            cursorStyle: 'line',
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            lineNumbersMinChars: 4,
            suggest: {
              showWords: false,
            },
          }}
        />
      </div>
    </motion.div>
  )
}
