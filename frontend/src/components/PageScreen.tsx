import type { ReactNode } from 'react'

type PageScreenProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

function PageScreen({ eyebrow, title, description, children }: PageScreenProps) {
  return (
    <main className="page-shell">
      <section className="page-card">
        <div className="page-header">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children}
      </section>
    </main>
  )
}

export default PageScreen
