import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAxios } from '@/context/AxiosContext'
import { API_ORGANIGRAMMES_EDGE_ENDPOINT, API_ORGANIGRAMMES_ENDPOINT, API_POSITIONS_ENDPOINT } from '@/api/api'

/* ------------------------------------------------------------------
   Minimal shared domain types – extend or replace with your real ones
   ------------------------------------------------------------------ */
export interface Grade {
  name: string
}

export interface Position {
  id: string
  title: string
  position_x: number
  position_y: number
  color: string
  grade: Grade
}

export interface Edge {
  id: string
  source: string
  target: string
  edge_type?: string
}

export interface OrganigramListItem {
  id: string
  name: string
  state: 'Draft' | 'Final' | 'Archived'
  created_at: string
}

export interface OrganigramDetails extends OrganigramListItem {
  positions: Position[]
  edges: Edge[]
}

/* ------------------------------------------------------------------
   Hook: fetch *all* organigrams (name, state…)
   ------------------------------------------------------------------ */
export const useOrganigrams = () => {
  const axios = useAxios()

  return useQuery<OrganigramListItem[], Error>({
    queryKey: ['organigrams'],
    queryFn: async () => {
      const { data } = await axios.get<OrganigramListItem[]>(API_ORGANIGRAMMES_ENDPOINT)
      return data
    },
  })
}

/* ------------------------------------------------------------------
   Hook: fetch a *single* organigram with positions & edges expanded
   ------------------------------------------------------------------ */
export const useOrganigram = (id: string) => {
  const axios = useAxios()

  return useQuery<OrganigramDetails, Error>({
    queryKey: ['organigram', id],
    queryFn: async () => {
      const { data } = await axios.get<OrganigramDetails>(
        `${API_ORGANIGRAMMES_ENDPOINT}${id}/?expand=positions,edges`,
      )
      return data
    },
    enabled: Boolean(id), // don’t fire on undefined
  })
}

/* ------------------------------------------------------------------
   Hook: POST /auto-organize/ then refetch that organigram
   ------------------------------------------------------------------ */
export const useAutoOrganize = (id: string) => {
  const axios = useAxios()
  const qc = useQueryClient()

  return useMutation<unknown, Error, void>({
    mutationFn: () => axios.post(`${API_ORGANIGRAMMES_ENDPOINT}${id}/auto-organize/`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organigram', id] })
    },
  })
}

/* ------------------------------------------------------------------
   Hook: bulk‑update node positions (drag‑and‑drop persistence)
   ------------------------------------------------------------------ */
export interface PositionUpdatePayload {
  id: string
  position_x: number
  position_y: number
}

export const useBulkUpdatePositions = () => {
  const axios = useAxios()
  const qc = useQueryClient()

  return useMutation<unknown, Error, PositionUpdatePayload[]>({
    mutationFn: (payload) =>
      axios.post(`${API_POSITIONS_ENDPOINT}bulk-update/`, { updates: payload }).then(r => r.data),
    onSuccess: (_, variables) => {
      // Invalidate every organigram touched in the payload (cheap set for now)
      qc.invalidateQueries({ queryKey: ['organigram'] })
    },
  })
}

/* ------------------------------------------------------------------
   Hook: create a new OrganigramEdge (parent -> child link)
   ------------------------------------------------------------------ */
export interface EdgeCreatePayload {
  organigram: string
  source: string
  target: string
  edge_type?: string
}

export const useCreateEdge = () => {
  const axios = useAxios()
  const qc = useQueryClient()

  return useMutation<unknown, Error, EdgeCreatePayload>({
    mutationFn: (payload) => axios.post(API_ORGANIGRAMMES_EDGE_ENDPOINT, payload).then(r => r.data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['organigram', variables.organigram] })
    },
  })
}

/* ------------------------------------------------------------------
   Hook: delete an OrganigramEdge
   ------------------------------------------------------------------ */
export const useDeleteEdge = () => {
  const axios = useAxios()

  return useMutation<unknown, Error, { edgeId: string; organigramId: string }>({
    mutationFn: ({ edgeId }) => axios.delete(`${API_ORGANIGRAMMES_EDGE_ENDPOINT}${edgeId}/`),
  })
}

