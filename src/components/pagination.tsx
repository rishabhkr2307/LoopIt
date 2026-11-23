'use client'

import { parseAsInteger, useQueryState } from 'nuqs'
import { Button } from './ui/button'

function Pagination({ nextDisabled }: { nextDisabled: boolean }) {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  )
  return (
    <div className="w-full flex justify-end mt-8">
      <Button
        variant="secondary"
        disabled={!page || page == 1}
        onClick={() => setPage((p) => p - 1)}
      >
        Previous Page
      </Button>

      <Button variant="secondary" disabled={nextDisabled} onClick={() => setPage((p) => p + 1)}>
        Next Page
      </Button>
    </div>
  )
}

export default Pagination
