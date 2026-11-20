import type { Metadata } from 'next'
import React from 'react'
export const metadata: Metadata = {
  title: 'LoopIt Borrower',
  description:
    'A peer to peer rental marketplace that enables people to borrow and lend everyday items',
}

export default async function BorrowerLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
