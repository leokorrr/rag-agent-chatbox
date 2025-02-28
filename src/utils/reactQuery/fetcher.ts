// import { getSession } from "next-auth/react"

export type HTTPMethods = "GET" | "POST" | "PUT" | "DELETE"

export const fetcher = async (
  url: string,
  params: {
    method: HTTPMethods
    body?: string | FormData
    isPublic?: boolean,
    headers?: Record<string, string>,
  } = { method: "GET" },
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(params?.headers && { ...params.headers })
  }

  // * If route is not public send request wit Auth header
  // if (!params.isPublic) {
  //   const session = await getSession()

  //   if (session?.user?.tokens?.accessToken) {
  //     headers.Authorization = `Bearer ${session?.user?.tokens?.accessToken}`
  //   }
  // }

  const response = await fetch(`${url}`, {
    ...params,
    headers,
  })

  if (!response.ok) {
    let message = "Something went wrong"

    const code = response.status

    try {
      const errorBody = await response.json()
      message =
        errorBody.message || response.statusText || "Something went wrong"
    } catch (error) {
      console.error("Error parsing error response:", error)
    }

    throw { message, code }
  }

  return response.json()
}
