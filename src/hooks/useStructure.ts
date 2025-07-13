import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAxios } from '@/context/AxiosContext'
import { API_EDGES_ENDPOINT, API_STRUCTURES_ENDPOINT, API_POSITIONS_ENDPOINT, API_DIAGRAM_POSITIONS_ENDPOINT } from '@/api/api'
import { Structure, GenericNode, Position, OrganigramEdge } from '@/types/reference'

// Add DiagramPosition interface
export interface DiagramPosition {
  id: number;
  content_type: {
    id: number;
    model: string;
    app_label: string;
  };
  object_id: number;
  main_structure: number;
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
}

/* ------------------------------------------------------------------
   Hook: fetch *all* structures (name, state…)
   ------------------------------------------------------------------ */
export const useStructures = () => {
  const axios = useAxios()

  return useQuery<Structure[], Error>({
    queryKey: ['structures'],
    queryFn: async () => {
      const { data } = await axios.get<Structure[]>(API_STRUCTURES_ENDPOINT)
      return data
    },
  })
}

/* ------------------------------------------------------------------
   Hook: fetch a *single* structure with positions & edges expanded
   ------------------------------------------------------------------ */
export const useStructure = (id: string) => {
  const axios = useAxios()

  return useQuery<Structure, Error>({
    queryKey: ['structure', id],
    queryFn: async () => {
      const { data } = await axios.get<Structure>(
        `${API_STRUCTURES_ENDPOINT}${id}/?expand=positions.grade,edges,children,parent,manager,manager.grade`
      )
      console.log('Structure data with manager:', data);
      return data
    },
    enabled: Boolean(id), // don’t fire on undefined
  })
}

/* ------------------------------------------------------------------
   Hook: fetch a single structure by ID
   ------------------------------------------------------------------ */
export const useStructureById = (id: string | number | undefined) => {
  const axios = useAxios()

  return useQuery<Structure, Error>({
    queryKey: ['structure-by-id', id],
    queryFn: async () => {
      const { data } = await axios.get<Structure>(
        `${API_STRUCTURES_ENDPOINT}${id}/?expand=positions.grade,edges,children,parent`
      )
      return data
    },
    enabled: Boolean(id),
  })
}

/* ------------------------------------------------------------------
   Hook: POST /auto-organize/ then refetch that structure
   ------------------------------------------------------------------ */
export const useAutoOrganize = (id: string) => {
  const axios = useAxios()
  const qc = useQueryClient()

  return useMutation<unknown, Error, void>({
    mutationFn: () => axios.post(`${API_STRUCTURES_ENDPOINT}${id}/auto_organize/`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['structure', id] })
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
    mutationFn: (positions) =>
      axios.post(`${API_POSITIONS_ENDPOINT}bulk_update_positions/`, positions).then(r => r.data),
    onSuccess: () => {
      // When this mutation succeeds, we want to optimistically update
      // the relevant structure query, so the UI feels snappy.
      //
      // There’s no great way to know which structure is affected, so
      // we’ll just have to invalidate them all.
      qc.invalidateQueries({ queryKey: ['structure'] })
    },
  })
}

/* ------------------------------------------------------------------
   Hook: create a new StructureEdge (parent -> child link)
   ------------------------------------------------------------------ */
export interface EdgeCreatePayload {
  structure: number
  source: GenericNode
  target: GenericNode
  edge_type?: string
}

export const useCreateEdge = (structureId: string) => {
  const axios = useAxios()
  const qc = useQueryClient()

  return useMutation<OrganigramEdge, Error, EdgeCreatePayload>({
    mutationFn: (payload) =>
      axios
        .post<OrganigramEdge>(`${API_EDGES_ENDPOINT}`, {
          ...payload,
          structure: structureId
        })
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['structure', structureId] })
    },
  })
}

/* ------------------------------------------------------------------
   Hook: delete a StructureEdge
   ------------------------------------------------------------------ */
export const useDeleteEdge = (structureId: string) => {
  const axios = useAxios()
  const qc = useQueryClient()

  return useMutation<unknown, Error, { id: string }>({
    mutationFn: ({ id }) => axios.delete(`${API_EDGES_ENDPOINT}${id}/`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['structure', structureId] })
    },
  })
}

/* ------------------------------------------------------------------
   Hook: fetch diagram positions for a structure
   ------------------------------------------------------------------ */
export const useDiagramPositions = (mainStructureId: string) => {
  const axios = useAxios();

  return useQuery<DiagramPosition[], Error>({
    queryKey: ['diagram-positions', mainStructureId],
    queryFn: async () => {
      if (!mainStructureId) {
        console.log('No mainStructureId provided to useDiagramPositions');
        return [];
      }
      console.log('Fetching diagram positions for structure:', mainStructureId);
      
      console.log('Fetching diagram positions for main structure:', mainStructureId);
      try {
        // First, get all positions for this diagram
        const { data } = await axios.get<{ results: DiagramPosition[] } | DiagramPosition[]>(
          API_DIAGRAM_POSITIONS_ENDPOINT,
          {
            params: {
              main_structure: mainStructureId,
              all: 'true' // Ensure we get all positions without pagination
            }
          }
        );
        
        // Handle both paginated and non-paginated responses
        let allPositions: DiagramPosition[] = [];
        
        if (Array.isArray(data)) {
          allPositions = data;
        } else if (data && 'results' in data && Array.isArray(data.results)) {
          // Handle paginated response
          allPositions = data.results;
        } else if (data && typeof data === 'object') {
          // Fallback for other object types
          allPositions = Object.values(data).filter(Array.isArray).flat();
        }
        
        console.log('All positions for diagram:', allPositions);
        return allPositions;
      } catch (error) {
        console.error('Error fetching diagram positions:', error);
        return [];
      }
    },
    enabled: !!mainStructureId,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

/* ------------------------------------------------------------------
   Hook: update a diagram position
   ------------------------------------------------------------------ */
export interface UpdateDiagramPositionParams {
  contentObject: { 
    id: string | number; 
    type: string 
  }; 
  position: { 
    x: number; 
    y: number; 
  };
  main_structure: string | number;
}

export const useUpdateDiagramPosition = (mainStructureId: string) => {
  const axios = useAxios()
  const queryClient = useQueryClient()

  return useMutation<DiagramPosition, Error, UpdateDiagramPositionParams>({
    mutationFn: async ({ contentObject, main_structure, position }) => {
      console.group('useUpdateDiagramPosition - mutationFn');
      console.log('Input parameters:', { contentObject, main_structure, position });
      
      if (!contentObject?.id || main_structure === undefined) {
        const error = new Error('Missing required parameters');
        console.error('Error:', error);
        console.groupEnd();
        throw error;
      }

      const currentMainStructureId = typeof main_structure === 'string' ? parseInt(main_structure) : main_structure;
      console.log('Current main structure ID:', currentMainStructureId);
      
      try {
        // First, check if a position already exists for this object in this diagram
        console.log('Fetching existing positions for main structure:', currentMainStructureId);
        
        // Get all positions for this diagram first
        const positionsResponse = await axios.get<{ results: DiagramPosition[] } | DiagramPosition[]>(
          API_DIAGRAM_POSITIONS_ENDPOINT,
          { 
            params: { 
              main_structure: currentMainStructureId,
              all: 'true' // Ensure we get all positions without pagination
            } 
          }
        );
        
        console.log('Positions API Response:', positionsResponse);
        
        // Handle both paginated and non-paginated responses
        let allDiagramPositions: DiagramPosition[] = [];
        const responseData = positionsResponse?.data;
        
        if (Array.isArray(responseData)) {
          allDiagramPositions = responseData;
        } else if (responseData && 'results' in responseData && Array.isArray(responseData.results)) {
          // Handle paginated response
          allDiagramPositions = responseData.results;
        } else if (responseData && typeof responseData === 'object') {
          // Fallback for other object types
          allDiagramPositions = Object.values(responseData).filter(Array.isArray).flat();
        }
        
        console.log('All diagram positions from API:', allDiagramPositions);
        
        // Find existing position for this object
        const existingPosition = allDiagramPositions.find((pos: any) => {
          if (!pos) return false;
          
          const contentTypeMatches = pos.content_type?.model?.toLowerCase() === contentObject.type.toLowerCase();
          const objectIdMatches = pos.object_id?.toString() === contentObject.id.toString();
          
          console.log('Checking position:', { 
            position: pos,
            contentTypeMatches,
            objectIdMatches,
            positionContentType: pos.content_type?.model,
            expectedContentType: contentObject.type,
            positionObjectId: pos.object_id,
            expectedObjectId: contentObject.id
          });
          
          return contentTypeMatches && objectIdMatches;
        });
        
        console.log('Found existing position:', existingPosition);
        
        const positionData = {
          content_type: contentObject.type,
          object_id: contentObject.id,
          main_structure: currentMainStructureId,
          position_x: position.x,
          position_y: position.y,
        };

        let updateResponse;

        if (existingPosition?.id) {
          // Update existing position
          console.log('Updating existing position:', { 
            id: existingPosition.id, 
            position,
            positionData 
          });
          
          updateResponse = await axios.patch<DiagramPosition>(
            `${API_DIAGRAM_POSITIONS_ENDPOINT}${existingPosition.id}/`,
            positionData
          );
          
          console.log('Position update response:', updateResponse.data);
        } else {
          // Create new position
          console.log('Creating new position:', positionData);
          
          // Create new position with the model name - let the backend handle content type resolution
          updateResponse = await axios.post<DiagramPosition>(
            API_DIAGRAM_POSITIONS_ENDPOINT,
            positionData
          );
          
          console.log('New position created:', updateResponse.data);
        }
        
        if (!updateResponse?.data) {
          throw new Error('No data in response');
        }
        
        console.log('Position update successful:', updateResponse.data);
        console.groupEnd();
        return updateResponse.data;
      } catch (error) {
        console.error('Error in mutationFn:', { 
          error, 
          contentObject, 
          position, 
          main_structure,
          currentMainStructureId
        });
        console.groupEnd();
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      const currentMainStructureId = variables.main_structure || mainStructureId;
      console.log('Position update successful, invalidating query for:', currentMainStructureId);
      
      // Invalidate the specific diagram's positions
      queryClient.invalidateQueries({ 
        queryKey: ['diagram-positions', currentMainStructureId] 
      }).then(() => {
        console.log('Query cache invalidated for:', currentMainStructureId);
      });
    },
    onError: (error, variables) => {
      console.error('Error updating diagram position:', {
        error,
        contentObject: variables.contentObject,
        position: variables.position,
        main_structure: variables.main_structure || mainStructureId
      });
    },
  });
}
