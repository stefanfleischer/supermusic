import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({
      to: '/songs',
      search: { q: '', key: '', artist: '', tag: '', sort: 'title' },
    })
  },
})
