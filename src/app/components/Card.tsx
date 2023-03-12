import { ReactNode } from 'react';

type CardProps = {
  className?: string;
  children: ReactNode;
  footer?: ReactNode;
  title: string;
};

export default function Card({
  className,
  footer,
  title,
  children,
}: CardProps) {
  return (
    <div className={`${className} card`}>
      <header className="card-header">
        <p className="card-header-title">{title}</p>
      </header>
      <div className="card-content">
        <div className="content">{children}</div>
      </div>
      {footer}
    </div>
  );
}
