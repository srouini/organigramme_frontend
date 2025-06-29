import { ProFormDateRangePicker } from "@ant-design/pro-components";

type FilterDataRangeProps = {
  name: string;
  label: string;
};

const FilterDateRange:React.FC<FilterDataRangeProps> = ({label,name}) => {
  return (
    <ProFormDateRangePicker
      name={`${name}__range`}
      label={label}
      transform={(value) => {
        if (Array.isArray(value) && value.length === 2) {
          return {
            [`${name}__gte`]: value[0],
            [`${name}__lte`]: value[1],
          };
        }
        return {};
      }}
    />
  );
};

export default FilterDateRange;
