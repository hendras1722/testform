'use client'

export default function ErrorCustom({
  error,
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  console.log(error.cause, error.stack)
  return (
    <html lang="en">
      <body>
        <div className="w-full min-h-screen bg-gray-300 flex flex-col items-center justify-center">
          <div className="border-2 border-gray-500 shadow-lg rounded-lg p-5 bg-gray-200 min-h-[300px] grid place-items-center">
            <h1>Error</h1>
            <div
              className="w-[600px] overflow-auto mt-10"
              dangerouslySetInnerHTML={{ __html: error.stack ?? error.message }}
            ></div>
          </div>
        </div>
      </body>
    </html>
  )
}
