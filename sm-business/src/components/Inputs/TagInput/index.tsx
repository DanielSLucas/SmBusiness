import { FormControl, Tag, Input as ChakraInput, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Control, FieldError, UseFormRegister, useWatch } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { FiltersData } from "../../Filters";
import { TagInputContainer } from "./Container";
import { CustomTag } from "./CustomTag";
import { Dropdown } from "./Dropdown";

export interface Tag {  
  name: string;
  selected: boolean;
}

interface TagInputProps {
  register: UseFormRegister<any>;
  setValue: (value: string) => void;
  control: Control<any>;
  name: string;
  label?: string;
  error?: FieldError;
  separator?: string;
  tagUppercased?: boolean;
  canCreateTags?: boolean;
  tags: Tag[];
  addTag?: (tagName: string) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ 
  name, 
  label, 
  error, 
  register,
  separator = ';',
  tagUppercased = false,
  setValue,
  canCreateTags = false,
  tags: allTags,
  addTag,
  control,
}) => {  
  const [isShowingDropdown, setIsShowingDropdown] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [tagInput, setTagInput] = useState('');  
  const [tags, setTags] = useState<Tag[]>(allTags);
  const hiddenInputValue = useWatch({ control, name })
  
  useEffect(() => {
    if(!hiddenInputValue) {
      setTags(prev => prev.map(tag => ({ ...tag, selected: false })));
    }
  }, [hiddenInputValue]);

  useEffect(() => {
    setTags(prev => {
      const currentTagNames = prev.map(tag => tag.name);
      return [...prev, ...allTags.filter(tag => !currentTagNames.includes(tag.name))];
    });
  }, [allTags]);

  async function handleTagClick (name: string, selected: boolean) {
    const newTags = tags.map(tag => {
      if (tag.name === name) tag.selected = selected;
      return tag;
    });

    setTags(newTags);
    setValue(newTags.filter(tag => tag.selected).map(tag => tag.name).join(separator));
    setIsShowingDropdown(false);
  }

  function handleAddTag () {
    const newTagName = tagUppercased ? tagInput.toUpperCase() : tagInput;
    const tagIndex = tags.findIndex(tag => tag.name === newTagName);  

    if (tagIndex !== -1) {
      handleTagClick(newTagName, true).then(() => setTagInput(""));
      return;
    }

    const newTags = [...tags, { name: newTagName, selected: true }]
    addTag?.(newTagName);
    setTags(newTags);
    setValue(newTags.filter(tag => tag.selected).map(tag => tag.name).join(separator));
    setTagInput("");
    setIsShowingDropdown(false);
  }  

  return (
    <FormControl display="flex" position="relative" flexDirection="column">
      {!!label  && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <TagInputContainer>
        {tags.filter(tag => tag.selected).map(tag => (
          <CustomTag 
            key={`selected_tag_list_${tag.name}`}
            size="sm"
            colorScheme={tag.selected ? 'green' : 'gray'}
            tag={tag}
            closeButton
            OnCloseButtonClick={() => handleTagClick(tag.name, false)}
          />
        ))}

        <ChakraInput 
          placeholder="Adicione uma ou mais tags"
          variant="flushed"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onFocusCapture={() => {
            setIsInputFocused(true);
            setIsShowingDropdown(true);
          }}
          onBlurCapture={() => setIsInputFocused(false)}
        />
      </TagInputContainer>

      <input
        style={{ display: "none"}}
        {...register(name)}
      />

      {!!error && (
        <FormErrorMessage>{error.message}</FormErrorMessage>
      )}

      {isShowingDropdown && (
        <Dropdown setIsShowingDropdown={setIsShowingDropdown} shouldStayOpen={isInputFocused}>
          {tags.filter(tag => tag.name.includes(tagInput.toUpperCase())).map(tag => (
            <CustomTag 
              key={`list_tag_${tag.name}`}              
              tag={tag}
              colorScheme={tag.selected ? 'green' : 'gray'}
              labelButton
              onLabelButtonClick={() => handleTagClick(tag.name, true)}
              closeButton={tag.selected}
              OnCloseButtonClick={() => handleTagClick(tag.name, false)}
            />
          ))}

          {(tagInput && canCreateTags) && (
            <CustomTag
              colorScheme="yellow"
              tag={{ name: tagUppercased ? tagInput.toUpperCase() : tagInput, selected: false }}
              labelButton
              onLabelButtonClick={handleAddTag}
              rightIcon={FiPlus}
            />
          )}
        </Dropdown>
      )}
    </FormControl>
  );
}
