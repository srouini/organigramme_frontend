import { Position } from '@/types/reference';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  Node,
  Edge,
  Connection,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';

export type NodeData = {
  position: Position;
  isHighlighted?: boolean;
};

export type AppNode = Node<NodeData>;

/** ---------- types ---------- */
export type FlowCtx = {
  nodes: AppNode[];
  edges: Edge[];
  setGraph: (nodes: AppNode[], edges: Edge[]) => void;
  onNodesChange: ReturnType<typeof createNodesChangeHandler>;
  onEdgesChange: ReturnType<typeof createEdgesChangeHandler>;
  onConnect: (c: Connection) => void;
  updateNode: (id: string, pos: { x: number; y: number }) => void;
  toggleCollapse: (id: string) => void;
  isCollapsed: (id: string) => boolean;
  searchNodes: (query: string | null, nodeId?: string | null) => void;
  searchResults: string[];
};

const noop = () => {}
const FlowContext = createContext<FlowCtx>({
  nodes: [],
  edges: [],
  setGraph: noop,
  onNodesChange: noop,
  onEdgesChange: noop,
  onConnect: noop,
  updateNode: noop,
  toggleCollapse: noop,
  isCollapsed: () => false,
  searchNodes: () => {},
  searchResults: [],
})

/** ---------- helpers ---------- */
function createNodesChangeHandler(
  setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>,
  _edges: Edge[],
) {
  return (changes: Parameters<typeof applyNodeChanges>[0]) =>
    setNodes((nds) => applyNodeChanges(changes, nds) as AppNode[])
}

function createEdgesChangeHandler(
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  _nodes: Node[],
) {
  return (changes: Parameters<typeof applyEdgeChanges>[0]) =>
    setEdges((eds) => applyEdgeChanges(changes, eds))
}

function getDescendants(rootId: string, edges: Edge[]): string[] {
  const map = new Map<string, string[]>()
  edges.forEach((e) => {
    map.set(e.source, (map.get(e.source) || []).concat(e.target))
  })

  const visited = new Set<string>()
  const queue = [rootId]

  while (queue.length) {
    const current = queue.shift()!
    const children = map.get(current) || []
    for (const child of children) {
      if (!visited.has(child)) {
        visited.add(child)
        queue.push(child)
      }
    }
  }

  return Array.from(visited)
}

/** ---------- provider ---------- */
export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<AppNode[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const setGraph = useCallback((nds: AppNode[], eds: Edge[]) => {
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

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      setNodes((nds) => {
        const descIds = getDescendants(id, edges)
        const hide = !prev.has(id)
        return nds.map((n) =>
          descIds.includes(n.id) ? { ...n, hidden: hide } : n
        )
      })

      setEdges((eds) => {
        const descIds = getDescendants(id, edges)
        return eds.map((e) =>
          descIds.includes(e.source) || descIds.includes(e.target)
            ? { ...e, hidden: !prev.has(id) }
            : e
        )
      })

      return next
    })
  }, [edges])

  const isCollapsed = useCallback((id: string) => collapsed.has(id), [collapsed]);

  const searchNodes = useCallback((query: string | null, nodeId?: string | null) => {
    if (!query && !nodeId) {
      setSearchResults([]);
      setNodes((nds) =>
        nds.map((n) => ({ ...n, data: { ...n.data, isHighlighted: false } }))
      );
      return;
    }

    let results: AppNode[] = [];
    if (nodeId) {
      results = nodes.filter((node) => node.id === nodeId);
    } else if (query) {
      results = nodes.filter((node) =>
        node.data.position?.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    const resultIds = results.map((node) => node.id);
    setSearchResults(resultIds);

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isHighlighted: resultIds.includes(n.id),
        },
      }))
    );
  }, [nodes]);

  const value: FlowCtx = {
    nodes,
    edges,
    setGraph,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateNode,
    toggleCollapse,
    isCollapsed,
    searchNodes,
    searchResults,
  }

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}

/** ---------- consumer hook ---------- */
export const useFlow = () => useContext(FlowContext)
