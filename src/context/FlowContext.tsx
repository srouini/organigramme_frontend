import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Node, Edge, Connection, addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react'

/** ---------- types ---------- */
export type FlowCtx = {
  nodes: Node[]
  edges: Edge[]
  setGraph: (nodes: Node[], edges: Edge[]) => void
  onNodesChange: ReturnType<typeof createNodesChangeHandler>
  onEdgesChange: ReturnType<typeof createEdgesChangeHandler>
  onConnect: (c: Connection) => void
  updateNode: (id: string, pos: { x: number; y: number }) => void
}

const noop = () => {}
const FlowContext = createContext<FlowCtx>({
  nodes: [],
  edges: [],
  setGraph: noop,
  onNodesChange: noop,
  onEdgesChange: noop,
  onConnect: noop,
  updateNode: noop,
})

/** ---------- helpers ---------- */
function createNodesChangeHandler(
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  edges: Edge[],
) {
  return (changes: Parameters<typeof applyNodeChanges>[0]) =>
    setNodes((nds) => applyNodeChanges(changes, nds))
}

function createEdgesChangeHandler(
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  nodes: Node[],
) {
  return (changes: Parameters<typeof applyEdgeChanges>[0]) =>
    setEdges((eds) => applyEdgeChanges(changes, eds))
}

/** ---------- provider ---------- */
export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  /** central API—mirrors the Zustand version */
  const setGraph = useCallback((nds: Node[], eds: Edge[]) => {
    setNodes(nds)
    setEdges(eds)
  }, [])

  const onNodesChange = useMemo(() => createNodesChangeHandler(setNodes, edges), [edges])
  const onEdgesChange = useMemo(() => createEdgesChangeHandler(setEdges, nodes), [nodes])

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [],
  )

  const updateNode = useCallback((id: string, pos: { x: number; y: number }) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, position: pos } : n)),
    )
  }, [])

  const value: FlowCtx = {
    nodes,
    edges,
    setGraph,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateNode,
  }

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}

/** ---------- consumer hook ---------- */
export const useFlow = () => useContext(FlowContext)
