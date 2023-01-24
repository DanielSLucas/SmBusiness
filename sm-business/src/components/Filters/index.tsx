import { 
  Button,
  Collapse,
  Drawer,
  DrawerContent,
  Flex,
  Icon, 
  Text,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiFilter, FiX } from "react-icons/fi";
import { useTags } from "../../hooks/useTags";
import { FiltersForm } from "./FiltersForm";

export interface FiltersData {
  orderBy?: 'id' | 'date' | 'description' | 'amount' | 'type';
  order?: 'asc' | 'desc';
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  tags?: string;
}

interface FiltersProps {
  onFilter(filters: Partial<FiltersData>): void;  
  isLoading: boolean;
  showOrderFilters?: boolean;
  showGroupByFilter?: boolean;
  canCreateTags?: boolean;
  resetAfterSubmit?: boolean;
}

export const Filters: React.FC<FiltersProps> = ({ 
  onFilter, 
  isLoading, 
  showOrderFilters = false,
  showGroupByFilter = false,
  canCreateTags = false,
  resetAfterSubmit = false,
}) => {
  const showDrawer = useBreakpointValue({ base: true, lg: false }, { fallback: 'true' });
  const { register, handleSubmit, reset, setValue, control } = useForm<FiltersData>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tags } = useTags();
    
  const onSubmit: SubmitHandler<FiltersData> = (data) => {
    console.log(data)
    const filters = Object.keys(data).reduce((prev, curr) => {
      const key = curr as keyof FiltersData;

      if(data[key]) {
        prev[key] = data[key];
      }

      return prev;
    }, {} as Record<string, any>);

    onFilter(filters);
    resetAfterSubmit && reset();
    onClose();
  }  
  
  return (
    <Flex w="100%" direction="column" position="relative">
      <Button isLoading={isLoading} onClick={isOpen ? onClose : onOpen} w="100%" my="4">
        <Flex gap="2" alignItems="center">
          <Text>{isOpen ? 'Fechar' : 'Filtros'}</Text>
          <Icon as={isOpen ? FiX : FiFilter} />
        </Flex>
      </Button>

      {showDrawer 
        ? (
          <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
            <DrawerContent p="4">          
              <FiltersForm 
                register={register}
                onSubmit={handleSubmit(onSubmit)}
                setValue={(value) => setValue('tags', value)}
                control={control}
                tags={tags}
                showOrderFilters={showOrderFilters}
                showGroupByFilter={showGroupByFilter}
                canCreateTags={canCreateTags}
              />
            </DrawerContent>
          </Drawer>
        ) : (
          <Collapse in={isOpen} animateOpacity>
            <FiltersForm 
              register={register}
              onSubmit={handleSubmit(onSubmit)}
              setValue={(value) => setValue('tags', value)}
              control={control}
              tags={tags}
              showOrderFilters={showOrderFilters}
              showGroupByFilter={showGroupByFilter}
              canCreateTags={canCreateTags}
            />
          </Collapse>
        )
      }
    </Flex>
  );
}
