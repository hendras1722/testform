import Link from 'next/link'
import { headers } from 'next/headers'

export default async function NotFound() {
  return (
    <div>
      {/* <h2>Not Found: {data.name}</h2> */}
      <p>Could not find requested resource asdsad</p>
      <p>
        View <Link href="/blog">all posts</Link>
      </p>
    </div>
  )
}
