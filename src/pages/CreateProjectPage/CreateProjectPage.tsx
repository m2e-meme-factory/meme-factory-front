import { Text, Button, Flex, Heading, IconButton, Separator, TextField } from '@radix-ui/themes';
import './CreateProjectPage.module.css';
import React, { ChangeEvent, useState } from 'react';
import { TAGS } from '../../shared/consts/tags';
import { CATEGORIES } from '../../shared/consts/categories';
import makeAnimated from 'react-select/animated';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../styles/CustomReactQuill.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon } from '@radix-ui/react-icons';
import CreateSubtaskSection from './components/CreateSubtaskSection/CreateSubstaskSection';
import Select, { MultiValue, SingleValue } from 'react-select';
import {
  CUSTOM_SELECT_STYLES_MULTI,
  CUSTOM_SELECT_STYLES_SINGLE,
} from '../../styles/customSelectStyles';
import { CreateProjectDTO, SubtaskInfo } from '../../@types/api';
import { FormError, Option, Price } from '../../@types/app';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import { useCreateProject } from '../../shared/utils/api/hooks/project/useCreateProject';

const CreateProjectPage = () => {
  const animatedComponents = makeAnimated();
  const user = useSelector((state: RootState) => state.user.user);
  const createProjectMutation = useCreateProject();

  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [priceMode, setPriceMode] = useState<'single' | 'range'>('single');
  const [price, setPrice] = useState<Price>({});
  const [subtasks, setSubtasks] = useState<SubtaskInfo[]>([]);
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<FormError[]>([]);

  const handleSingleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSingleFile(file);
  };

  const handleMultipleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setMultipleFiles(files);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    if (event.target.value) {
      setFormErrors((prevErrors) => prevErrors.filter((error) => error.field !== 'title'));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);

    if (value) {
      setFormErrors((prevErrors) => prevErrors.filter((error) => error.field !== 'description'));
    }
  };

  const handleTagsChange = (selectedTags: MultiValue<Option>) => {
    setTags(selectedTags.map((tag) => tag.value));
  };

  const handleCategoryChange = (selectedCategory: SingleValue<Option>) => {
    setCategory(selectedCategory ? selectedCategory.value : null);

    if (selectedCategory) {
      setFormErrors((prevErrors) => prevErrors.filter((error) => error.field !== 'category'));
    }
  };

  const handlePriceModeChange = () => {
    setPriceMode(priceMode === 'single' ? 'range' : 'single');
    if (priceMode === 'single') {
      setPrice({ single: price.single, min: undefined, max: undefined });
    } else {
      setPrice({ single: undefined, min: price.min, max: price.max });
    }
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numValue = parseInt(value, 10);

    if (priceMode === 'single') {
      setPrice({ single: isNaN(numValue) ? undefined : numValue, min: undefined, max: undefined });
      if (value) {
        setFormErrors((prevErrors) => prevErrors.filter((error) => error.field !== 'price'));
      }
    } else {
      if (name === 'min') {
        setPrice((prevPrice) => ({
          single: undefined,
          min: isNaN(numValue) ? undefined : numValue,
          max: prevPrice.max,
        }));
        if (value) {
          setFormErrors((prevErrors) => prevErrors.filter((error) => error.field !== 'min'));
        }
      } else if (name === 'max') {
        setPrice((prevPrice) => ({
          single: undefined,
          min: prevPrice.min,
          max: isNaN(numValue) ? undefined : numValue,
        }));
        if (value) {
          setFormErrors((prevErrors) => prevErrors.filter((error) => error.field !== 'max'));
        }
      }
    }
  };

  const validateForm = (): FormError[] => {
    const errors: FormError[] = [];

    if (!title) errors.push({ field: 'title', message: 'Title is required' });
    if (!description) errors.push({ field: 'description', message: 'Description is required' });
    if (!category) errors.push({ field: 'category', message: 'Category is required' });

    if (priceMode === 'single' && price.single === undefined) {
      errors.push({ field: 'price', message: 'Price is required' });
    } else if (priceMode === 'range') {
      if (price.min === undefined) errors.push({ field: 'min', message: 'Min price is required' });
      if (price.max === undefined) errors.push({ field: 'max', message: 'Max price is required' });
    }

    return errors;
  };

  const handleCreateProject = () => {
    const errors = validateForm();

    if (errors.length === 0) {
      let projectPrice = priceMode === 'range' ? price.min : price.single;

      const projectData: CreateProjectDTO = {
        authorId: user?.id,
        title,
        description,
        tags,
        category,
        price: projectPrice ? projectPrice : 0,
        subtasks: subtasks.map((subtask) => {
          const { id, ...rest } = subtask;
          return rest;
        }),
        bannerUrl: singleFile ? singleFile.name : null,
        files: multipleFiles.map((file) => file.name),
      };

      console.log('Project Data:', projectData);
      createProjectMutation.mutate({ params: projectData });
      navigate('/projects')
    } else {
      setFormErrors(errors);
    }
  };


  return (
    <Flex m='4' direction='column'>
      <Flex align='center'>
        <IconButton size='2' onClick={() => navigate(-1)} mr='3'>
          <ArrowLeftIcon />
        </IconButton>
        <Heading>Create Project</Heading>
      </Flex>
      <Flex direction='column'>
        <Text weight='medium' mt='3' mb='1'>
          Title
        </Text>
        <TextField.Root value={title} placeholder='Enter a title' onChange={handleTitleChange}>
          <TextField.Slot />
        </TextField.Root>
        {formErrors.find((error) => error.field === 'title') && (
          <Text color='red' mt='1'>
            {formErrors.find((error) => error.field === 'title')?.message}
          </Text>
        )}

        <Text weight='medium' mt='3' mb='1'>
          Description
        </Text>
        <ReactQuill value={description} onChange={handleDescriptionChange} />
        {formErrors.find((error) => error.field === 'description') && (
          <Text color='red' mt='1'>
            {formErrors.find((error) => error.field === 'description')?.message}
          </Text>
        )}

        <Text weight='medium' mt='3' mb='1'>
          Banner
        </Text>
        <input type='file' onChange={handleSingleFileChange} />

        <Text weight='medium' mt='3' mb='1'>
          Files
        </Text>
        <input type='file' multiple onChange={handleMultipleFilesChange} />
        {multipleFiles.length > 0 && (
          <ul>
            {multipleFiles.map((file, index) => (
              <li key={index}>
                <Text>{file.name}</Text>
              </li>
            ))}
          </ul>
        )}

        <Text weight='medium' mt='3' mb='1'>
          Tags
        </Text>
        <Select
          onChange={handleTagsChange}
          placeholder='Select tags'
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={TAGS}
          styles={CUSTOM_SELECT_STYLES_MULTI}
        />

        <Text weight='medium' mt='3' mb='1'>
          Category
        </Text>
        <Select
          onChange={handleCategoryChange}
          placeholder='Select category'
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={CATEGORIES}
          styles={CUSTOM_SELECT_STYLES_SINGLE}
          isMulti={false}
        />
        {formErrors.find((error) => error.field === 'category') && (
          <Text color='red' mt='1'>
            {formErrors.find((error) => error.field === 'category')?.message}
          </Text>
        )}

        {priceMode === 'single' ? (
          <Flex direction='column'>
            <Text weight='medium' mt='3' mb='1'>
              Price
            </Text>
            <TextField.Root
              onChange={handlePriceChange}
              value={price.single ?? ''}
              placeholder='Enter a price'
            >
              <TextField.Slot />
            </TextField.Root>
            {formErrors.find((error) => error.field === 'price') && (
              <Text color='red' mt='1'>
                {formErrors.find((error) => error.field === 'price')?.message}
              </Text>
            )}
          </Flex>
        ) : (
          <>
            <Flex direction='column' mt='3' mb='3'>
              <Text weight='medium'>Min:</Text>
              <TextField.Root
                name='min'
                onChange={handlePriceChange}
                value={price.min ?? ''}
                placeholder='Enter a min price'
              >
                <TextField.Slot />
              </TextField.Root>
              {formErrors.find((error) => error.field === 'min') && (
                <Text color='red' mt='1'>
                  {formErrors.find((error) => error.field === 'min')?.message}
                </Text>
              )}
            </Flex>
            <Flex direction='column'>
              <Text weight='medium'>Max:</Text>
              <TextField.Root
                name='max'
                onChange={handlePriceChange}
                value={price.max ?? ''}
                placeholder='Enter a max price'
              >
                <TextField.Slot />
              </TextField.Root>
              {formErrors.find((error) => error.field === 'max') && (
                <Text color='red' mt='1'>
                  {formErrors.find((error) => error.field === 'max')?.message}
                </Text>
              )}
            </Flex>
          </>
        )}

        <Button variant='surface' mt='3' mb='3' onClick={handlePriceModeChange}>
          {priceMode === 'single' ? 'Set Min/Max Price' : 'Set Single Price'}
        </Button>

        <CreateSubtaskSection setSubtasks={setSubtasks} subtasks={subtasks} />

        <Button style={{ marginTop: 10 }} onClick={handleCreateProject}>
          Create Project
        </Button>
      </Flex>
    </Flex>
  );
};

export default CreateProjectPage;
