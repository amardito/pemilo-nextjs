'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
