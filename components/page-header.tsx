import type React from "react"

interface PageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    component?: React.ReactNode
  }
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-didot text-[#333333] mb-1 uppercase">{title}</h1>
        {description && <p className="text-gray-700 text-m">{description}</p>}
      </div>
      {action?.component && action.component}
    </div>
  )
}
