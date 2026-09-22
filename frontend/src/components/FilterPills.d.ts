import React from 'react';
import { Status } from '../types';
type FilterType = Status | 'ALL';
interface FilterPillsProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    counts: Record<FilterType, number>;
}
declare const FilterPills: React.FC<FilterPillsProps>;
export default FilterPills;
//# sourceMappingURL=FilterPills.d.ts.map