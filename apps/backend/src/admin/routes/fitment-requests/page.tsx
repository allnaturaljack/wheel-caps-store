import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Button,
  Container,
  Heading,
  StatusBadge,
  Table,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useCallback, useEffect, useState } from "react"

type FitmentRequest = {
  id: string
  name: string
  email: string
  vehicle_year: string
  vehicle_make: string
  vehicle_model: string
  method: "photos" | "mail"
  notes: string | null
  product_handle: string | null
  status: "new" | "code_sent"
  discount_code: string | null
  created_at: string
}

const api = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(path, { credentials: "include", ...init })
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(body?.message ?? `Request failed (${response.status})`)
  }

  return body as T
}

const FitmentRequestsPage = () => {
  const [requests, setRequests] = useState<FitmentRequest[] | null>(null)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const prompt = usePrompt()

  const load = useCallback(async () => {
    try {
      const { fitment_requests } = await api<{
        fitment_requests: FitmentRequest[]
      }>("/admin/fitment-requests")
      setRequests(fitment_requests)
    } catch (error) {
      toast.error((error as Error).message)
      setRequests([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const sendCode = async (request: FitmentRequest) => {
    const confirmed = await prompt({
      title: "Send discount code?",
      description: `This creates a one-time 20% off code and emails it to ${request.email}. Send it once you've received their ${
        request.method === "mail" ? "cap" : "photos"
      }.`,
      confirmText: "Send code",
      cancelText: "Cancel",
    })

    if (!confirmed) {
      return
    }

    setSendingId(request.id)
    try {
      const { fitment_request } = await api<{
        fitment_request: FitmentRequest
      }>(`/admin/fitment-requests/${request.id}/send-code`, { method: "POST" })
      toast.success(`Sent ${fitment_request.discount_code} to ${request.email}`)
      await load()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSendingId(null)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Fitment requests</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Customers asking for a cap to fit a truck you don't cover yet. Send
          their 20% code once their cap or photos arrive.
        </Text>
      </div>
      {requests === null ? (
        <Text className="px-6 py-4 text-ui-fg-subtle">Loading...</Text>
      ) : requests.length === 0 ? (
        <Text className="px-6 py-4 text-ui-fg-subtle">No requests yet.</Text>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Truck</Table.HeaderCell>
              <Table.HeaderCell>Sending</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {requests.map((request) => (
              <Table.Row key={request.id}>
                <Table.Cell>
                  {new Date(request.created_at).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <div>{request.name}</div>
                  <div className="text-ui-fg-subtle">{request.email}</div>
                </Table.Cell>
                <Table.Cell>
                  <div>
                    {request.vehicle_year} {request.vehicle_make}{" "}
                    {request.vehicle_model}
                  </div>
                  {request.notes && (
                    <div className="text-ui-fg-subtle max-w-xs truncate" title={request.notes}>
                      {request.notes}
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {request.method === "mail" ? (
                    <>
                      <div>Mailing the cap</div>
                      <div className="text-ui-fg-subtle">
                        Return it with their order
                      </div>
                    </>
                  ) : (
                    "Photos by email"
                  )}
                </Table.Cell>
                <Table.Cell>
                  {request.status === "code_sent" ? (
                    <StatusBadge color="green">
                      Code sent: {request.discount_code}
                    </StatusBadge>
                  ) : (
                    <StatusBadge color="orange">Waiting</StatusBadge>
                  )}
                </Table.Cell>
                <Table.Cell className="text-right">
                  {request.status === "new" && (
                    <Button
                      size="small"
                      variant="secondary"
                      isLoading={sendingId === request.id}
                      onClick={() => sendCode(request)}
                    >
                      Send 20% code
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Fitment requests",
})

export default FitmentRequestsPage
