import { Skeleton, Tr, useColorModeValue } from "@chakra-ui/react";

export const TableSkeletonRow: React.FC = () => {
  const borderColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Tr borderBottomWidth={4} borderColor={borderColor} borderRadius="md">
      <Skeleton as="td" height="16" colSpan={6}/>
    </Tr>
  );
}
