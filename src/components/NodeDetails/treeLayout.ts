import { Node, Edge } from '@xyflow/react';

export const NODE_WIDTH = 250;
export const NODE_HEIGHT = 140;
const HORIZONTAL_SPACING = 150;
const LEVEL_HEIGHT = 300;
const SUBTREE_PADDING = 60;
const ROOT_NODE_TOP_PADDING = 100;

type TreeNode = {
  node: Node;
  children: TreeNode[];
  width: number;
  height: number;
};

export const buildTree = (
  nodeId: string, 
  allNodes: Node[], 
  allEdges: Edge[],
  expandedNodes: Set<string> = new Set(),
  currentDepth: number = 0
): TreeNode | null => {
  const node = allNodes.find(n => n.id === nodeId);
  if (!node) return null;

  const isExpanded = expandedNodes.has(nodeId);
  const shouldShowChildren = isExpanded || currentDepth === 0;

  let children: TreeNode[] = [];
  if (shouldShowChildren) {
    children = allEdges
      .filter(e => e.source === nodeId)
      .map(edge => buildTree(edge.target, allNodes, allEdges, expandedNodes, currentDepth + 1))
      .filter(Boolean) as TreeNode[];
  }

  let width = NODE_WIDTH;
  if (children.length > 0) {
    const childrenWidth = children.reduce((sum, child) => sum + child.width, 0);
    const spacing = Math.max(0, children.length - 1) * HORIZONTAL_SPACING;
    width = Math.max(NODE_WIDTH, childrenWidth + spacing);
  }

  return { 
    node, 
    children,
    width,
    height: NODE_HEIGHT
  };
};

export const calculateLayout = (
  nodeId: string, 
  allNodes: Node[], 
  allEdges: Edge[],
  expandedNodes: Set<string> = new Set()
) => {
  const resultNodes = new Map<string, Node>();
  const resultEdges = new Set<Edge>();
  
  const tree = buildTree(nodeId, allNodes, allEdges, expandedNodes);
  
  const processNode = (treeNode: TreeNode | null, x: number, y: number, depth: number, parentY: number = 0) => {
    if (!treeNode) return { width: 0, x };
    
    let nodeY = depth > 0 ? parentY + LEVEL_HEIGHT : y + ROOT_NODE_TOP_PADDING;
    const nodeX = x + (treeNode.width / 2) - (NODE_WIDTH / 2);
    
    resultNodes.set(treeNode.node.id, {
      ...treeNode.node,
      position: { x: nodeX, y: nodeY },
      data: { ...treeNode.node.data }
    });
    
    if (treeNode.children.length === 0) {
      return { width: NODE_WIDTH, x };
    }
    
    let currentX = x;
    for (const child of treeNode.children) {
      processNode(child, currentX, nodeY, depth + 1, nodeY);
      currentX += child.width + HORIZONTAL_SPACING;
    }
    
    const totalChildrenWidth = currentX - x - HORIZONTAL_SPACING;
    
    if (treeNode.children.length > 0) {
      const parentX = x + (totalChildrenWidth / 2) - (NODE_WIDTH / 2);
      const currentNode = resultNodes.get(treeNode.node.id);
      if (currentNode) {
        resultNodes.set(treeNode.node.id, {
          ...currentNode,
          position: { 
            x: parentX, 
            y: nodeY,
            ...(depth === 0 && { y: nodeY + 50 })
          }
        });
      }
    }
    
    return {
      width: Math.max(NODE_WIDTH, totalChildrenWidth),
      x: x
    };
  };
  
  if (tree) {
    processNode(tree, SUBTREE_PADDING, 0, 0);
    
    const nodes = Array.from(resultNodes.values());
    if (nodes.length > 0) {
      const minX = Math.min(...nodes.map(n => n.position.x));
      const maxX = Math.max(...nodes.map(n => n.position.x + NODE_WIDTH));
      const totalWidth = maxX - minX + (2 * SUBTREE_PADDING);
      const offsetX = (window.innerWidth - totalWidth) / 2 - minX + SUBTREE_PADDING;
      
      nodes.forEach(node => {
        resultNodes.set(node.id, {
          ...node,
          position: {
            ...node.position,
            x: node.position.x + offsetX
          }
        });
      });
    }
  }
  
  allEdges.forEach(edge => {
    if (resultNodes.has(edge.source) && resultNodes.has(edge.target)) {
      resultEdges.add(edge);
    }
  });
  
  return {
    nodes: Array.from(resultNodes.values()),
    edges: Array.from(resultEdges)
  };
};