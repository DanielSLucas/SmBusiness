import { Skeleton, Tr, useColorModeValue } from "@chakra-ui/react";

interface TableSkeletonRowProps {
  colSpan: number;
  height: string;
}

export const TableSkeletonRow: React.FC<TableSkeletonRowProps> = ({ height, colSpan }) => {
  const borderColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Tr borderBottomWidth={4} borderColor={borderColor} borderRadius="md">
      <Skeleton as="td" height={height} colSpan={colSpan}/>
    </Tr>
  );
}
