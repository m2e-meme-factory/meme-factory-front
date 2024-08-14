import { Text, Button, Flex, Heading, IconButton, AlertDialog, TextField } from '@radix-ui/themes';
import './CreateProjectPage.module.css';
import React, { ChangeEvent, useState } from 'react';
import { TAGS } from '../../shared/consts/tags';
import { CATEGORIES } from '../../shared/consts/categories';
import makeAnimated from 'react-select/animated';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../styles/CustomReactQuill.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import CreateSubtaskSection from './components/CreateSubtaskSection/CreateSubstaskSection';
import Select, { MultiValue, SingleValue } from 'react-select';
import {
  CUSTOM_SELECT_STYLES_MULTI,
  CUSTOM_SELECT_STYLES_SINGLE,
} from '../../styles/customSelectStyles';
import { CreateProjectDTO, TaskInfo } from 'api';
import { FormError, Option, Price } from '../../@types/app';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import { useCreateProject } from '../../shared/utils/api/hooks/project/useCreateProject';
import { uploadFiles } from '../../shared/utils/api/requests/files/uploadBanner';
import toast from 'react-hot-toast';

const CreateProjectPage = () => {
  const animatedComponents = makeAnimated();
  const user = useSelector((state: RootState) => state.user.user);

  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [priceMode, setPriceMode] = useState<'single' | 'range'>('single');
  const [price, setPrice] = useState<Price>({});
  const [subtasks, setSubtasks] = useState<TaskInfo[]>([]);
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  const createProjectMutation = useCreateProject(setCreateLoading);

  const handleSingleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSingleFile(files);
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

  const handleCreateProject = async () => {
    const errors = validateForm();

    if (errors.length === 0) {
      setCreateLoading(true);

      try {
        let bannerUrl: string | null = null;
        let files: string[] = [];
        if (singleFile && singleFile.length > 0) {
          const response = await toast.promise(
            uploadFiles(singleFile),
            {
              success: 'Banner uploaded successfully',
              error: 'Error occurred while uploading banner',
              loading: 'Uploading banner',
            },
            {
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }
          );

          bannerUrl = response[0].url;
        }

        if (multipleFiles && multipleFiles.length > 0) {
          const response = await toast.promise(
            uploadFiles(multipleFiles),
            {
              success: 'Files uploaded successfully',
              error: 'Error occurred while uploading files',
              loading: 'Uploading files',
            },
            {
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }
          );
          response.map((file) => files.push(file.name));
        }

        const projectPrice = priceMode === 'range' ? price.min : price.single;

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
          bannerUrl,
          files: files,
        };

        console.log('Project Data:', projectData);
        createProjectMutation.mutate({ params: projectData });
      } catch (error) {
        console.error('Error creating project:', error);
      } finally {
        setCreateLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <Flex m='4' direction='column'>
      <Flex align='center'>
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <IconButton size='2' mr='3'>
              <ArrowLeftIcon />
            </IconButton>
          </AlertDialog.Trigger>
          <AlertDialog.Content maxWidth='450px'>
            <AlertDialog.Title>Exit project editor</AlertDialog.Title>
            <AlertDialog.Description size='2'>
              Are you sure you want to leave? Unsaved changes will be lost.
            </AlertDialog.Description>

            <Flex gap='3' mt='4' justify='end'>
              <AlertDialog.Cancel>
                <Button variant='soft' color='gray'>
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button onClick={() => navigate(-1)} variant='solid' color='red'>
                  Leave
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>

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
        <input
          type='file'
          accept='.jpg, .jpeg, .png, .gif, .bmp, .webp'
          onChange={handleSingleFileChange}
        />

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

        <Button style={{ marginTop: 10 }} onClick={handleCreateProject} loading={createLoading}>
          Create Project
        </Button>
      </Flex>
    </Flex>
  );
};

export default CreateProjectPage;
