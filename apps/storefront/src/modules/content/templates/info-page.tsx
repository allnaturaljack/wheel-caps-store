import React from "react"

type InfoPageProps = {
  eyebrow: string
  title: string
  intro?: React.ReactNode
  // Shows a notice that the page is placeholder text awaiting final wording.
  draft?: boolean
  children: React.ReactNode
}

const InfoPage = ({ eyebrow, title, intro, draft, children }: InfoPageProps) => {
  return (
    <div className="content-container py-10 small:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex flex-col gap-y-3 border-b border-grey-20 pb-8">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="display-heading text-5xl text-ink-900 small:text-6xl">
            {title}
          </h1>
          {intro && (
            <p className="text-base leading-7 text-grey-60">{intro}</p>
          )}
        </div>
        {draft && (
          <p
            className="mb-10 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            data-testid="draft-notice"
          >
            <strong>Draft.</strong> This page is placeholder text and has not
            been finalized. Highlighted items still need to be decided.
          </p>
        )}
        <div className="flex flex-col gap-y-10">{children}</div>
      </div>
    </div>
  )
}

export const InfoSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <section className="flex flex-col gap-y-3">
      <h2 className="display-heading text-2xl text-ink-900">{title}</h2>
      <div className="flex flex-col gap-y-3 text-base leading-7 text-grey-60 [&_a]:text-ink-900 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </section>
  )
}

// A value that still needs to be decided before the page is final.
export const Blank = ({ children }: { children: React.ReactNode }) => {
  return (
    <mark className="rounded bg-amber-100 px-1 text-amber-900">
      [{children}]
    </mark>
  )
}

export default InfoPage
