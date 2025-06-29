import { useState } from 'react';

function useFilters() {
    const [filters, setFilters] = useState<any>();


    const resetFilters = () => {
        setFilters(null);
    };

    return {
        filters,
        setFilters,
        resetFilters,
    };
}

export default useFilters;