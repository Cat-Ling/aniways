import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/read/$id')({
  component: () => <div>Hello /read/$id!</div>
})