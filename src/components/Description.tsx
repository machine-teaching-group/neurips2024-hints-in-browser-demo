import { twMerge } from 'tailwind-merge'
import { useEffect, useRef } from 'react'
import { Separator } from '@/components/ui/separator.tsx'

export default function Description({
  className,
  title,
  text,
  examples,
}: {
  className?: string
  title: string
  text: string[]
  examples?: { input: string; output: string }[]
}) {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    for (const child of divRef.current?.children || []) {
      if (child instanceof HTMLParagraphElement) {
        child.innerHTML = replaceInlineCode(child.innerHTML)
      }
    }
  }, [text])

  return (
    <div
      className={twMerge(
        `w-full flex flex-col bg-white border border-veryDarkBlue/10 rounded-md overflow-hidden main-shadow`,
        className
      )}
    >
      <h2
        className={`text-sm poppins font-bold tracking-[0.7px] text-veryDarkBlue/45 px-4 pt-4 pb-3 uppercase`}
      >
        {title}
      </h2>
      <div className={`px-4 pt-2 pb-4 text-gray-800`}>
        <div className="flex flex-col gap-y-2" ref={divRef}>
          {text.map((t, index) => (
            <p
              key={index}
              className={`text-sm leading-normal text-pretty whitespace-pre-wrap`}
            >
              {t}
            </p>
          ))}
        </div>
        <Separator className={`my-4`} />
        {examples && (
          <div className={`text-sm flex flex-col`}>
            <span
              className={`poppins tracking font-semibold text-xs pb-3 text-veryDarkBlue/50 uppercase`}
            >
              Examples
            </span>
            <ul className={`flex flex-col gap-y-1`}>
              {examples.map((example, index) => (
                <li key={index} className={`py-1 flex flex-row gap-x-2.5`}>
                  <InlineCode>{example.input}</InlineCode>
                  <span className={`text-gray-600`}> → </span>
                  <InlineCode>{example.output}</InlineCode>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function InlineCode({ children }: { children: string }) {
  return (
    <code
      className={`bg-lighterBlue/10 text-semibold px-1 py-0.5 rounded-sm sourcecodepro`}
    >
      {children}
    </code>
  )
}

// Replace $$ in description string with inline code span
function replaceInlineCode(text: string) {
  return text.replace(/\$\$(.*?)\$\$/g, (_, code) => {
    return `<code class="bg-lighterBlue/10 text-semibold px-1 py-0.5 rounded-sm sourcecodepro">${code}</code>`
  })
}
