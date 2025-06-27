import React, { ReactNode } from 'react';

const MaxWidthWrapper = ({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      style={{
        margin: '0 auto',
        width: '100%',
        maxWidth: '1536px', // Equivalente a max-w-screen-2xl (1536px)
        ...(className ? { className } : {}), // Aplicar clases adicionales si existen
      }}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;