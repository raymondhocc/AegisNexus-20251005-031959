import React from 'react';
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}
export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between space-y-2 mb-8">
      <div>
        <h1 className="text-4xl font-display font-bold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </div>
  );
}