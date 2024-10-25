import {
  Text,
  Button,
  Flex,
  Heading,
  IconButton,
  AlertDialog,
  TextField,
  Card,
  Box,
} from '@radix-ui/themes';
import './CreateProjectPage.module.css';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { TAGS } from '../../shared/consts/tags';
import { CATEGORIES } from '../../shared/consts/categories';
import makeAnimated from 'react-select/animated';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../styles/CustomReactQuill.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusCircledIcon, TrashIcon } from '@radix-ui/react-icons';
import CreateSubtaskSection from './components/CreateSubtaskSection/CreateSubstaskSection';
import Select, { MultiValue, SingleValue } from 'react-select';
import {
  CUSTOM_SELECT_STYLES_MULTI,
  CUSTOM_SELECT_STYLES_SINGLE,
} from '../../styles/customSelectStyles';
import { CreateProjectDTO, TaskInfo } from 'api';
import { FormError, Option } from '../../@types/app';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import { useCreateProject } from '../../shared/utils/api/hooks/project/useCreateProject';
import { uploadFiles } from '../../shared/utils/api/requests/files/uploadBanner';
import toast from 'react-hot-toast';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { showErrorMessage } from '../../shared/utils/helpers/notify';

const CreateProjectPage = () => {
  const animatedComponents = makeAnimated();
  const user = useSelector((state: RootState) => state.user.user);

  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [subtasks, setSubtasks] = useState<TaskInfo[]>([]);
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const filesInputRef = useRef<HTMLInputElement | null>(null);
  const [leaveAlertOpen, setLeaveAlertOpen] = useState(false);
  const webapp = useWebApp();

  const handleBack = useCallback(() => {
    setLeaveAlertOpen(true);
  }, [navigate, webapp]);

  useEffect(() => {
    webapp.ready();
    webapp.BackButton.show();
    webapp.onEvent('backButtonClicked', handleBack);

    return () => {
      webapp.offEvent('backButtonClicked', handleBack);
      webapp.BackButton.hide();
    };
  }, [handleBack, webapp]);

  const handleLeave = () => {
    navigate(-1);
    webapp.BackButton.hide();
  };

  const createProjectMutation = useCreateProject(setCreateLoading);

  const handleInputFileClick = () => {
    if (filesInputRef.current) {
      filesInputRef.current.click();
    }
  };

  const handleInputBannerClick = () => {
    if (bannerInputRef.current) {
      bannerInputRef.current.click();
    }
  };

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

  const validateForm = (): FormError[] => {
    const errors: FormError[] = [];

    if (!title) errors.push({ field: 'title', message: 'Title is required' });
    if (!description) errors.push({ field: 'description', message: 'Description is required' });
    if (!category) errors.push({ field: 'category', message: 'Category is required' });

    return errors;
  };

  const handleDeleteBanner = () => {
    setSingleFile([]);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = '';
    }
  };

  const handleDeleteFile = () => {
    if (filesInputRef.current) {
      filesInputRef.current.value = '';
    }
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

        const projectData: CreateProjectDTO = {
          authorId: user?.id,
          title,
          description,
          tags,
          category,
          subtasks: subtasks.map((subtask) => {
            const { id, ...rest } = subtask;
            return rest;
          }),
          bannerUrl,
          files: files,
        };

        createProjectMutation.mutate({ params: projectData });
      } catch (error) {
        showErrorMessage('');
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
        <AlertDialog.Root open={leaveAlertOpen} onOpenChange={setLeaveAlertOpen}>
          <AlertDialog.Trigger>
            <Box></Box>
          </AlertDialog.Trigger>
          <AlertDialog.Content maxWidth='450px'>
            <AlertDialog.Title>Exit Quest editor</AlertDialog.Title>
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
                <Button onClick={handleLeave} variant='solid' color='red'>
                  Leave
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>

        <Heading>Create Quest</Heading>
      </Flex>
      <Flex direction='column'>
        <Text weight='medium' mt='3' mb='1'>
          Title
        </Text>
        <TextField.Root
          maxLength={100}
          value={title}
          placeholder='Enter a title'
          onChange={handleTitleChange}
        >
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

        <CreateSubtaskSection setSubtasks={setSubtasks} subtasks={subtasks} />

        <Text weight='medium' mt='3' mb='1'>
          Banner
        </Text>
        {singleFile.length > 0 && (
          <Card mb='3'>
            <Flex align='center' justify='between'>
              <Text
                wrap='pretty'
                style={{
                  maxWidth: '70vw',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {singleFile[0].name.substring(0, 55)}
              </Text>
              <IconButton ml='3' onClick={handleDeleteBanner}>
                <TrashIcon></TrashIcon>
              </IconButton>
            </Flex>
          </Card>
        )}
        {singleFile.length === 0 && (
          <>
            <Button
              mx='2'
              mt='2'
              size='4'
              variant='soft'
              className='gap-1'
              onClick={handleInputBannerClick}
            >
              <PlusCircledIcon width='20' height='20' />
              Change banner
            </Button>
            <input
              type='file'
              ref={bannerInputRef}
              style={{ display: 'none' }}
              onChange={handleSingleFileChange}
              accept='image/*'
            />
          </>
        )}

        <Text weight='medium' mt='3' mb='2'>
          Files
        </Text>

        {multipleFiles.map((file, index) => (
          <Card mb='3' key={index}>
            <Flex align='center' justify='between' style={{ maxWidth: '100%' }}>
              <Text
                wrap='pretty'
                style={{
                  maxWidth: '70vw',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {file.name}
              </Text>
              <IconButton
                onClick={() => {
                  setMultipleFiles((prevState) => prevState.filter((_, i) => i !== index));
                  handleDeleteFile();
                }}
                ml='3'
              >
                <TrashIcon />
              </IconButton>
            </Flex>
          </Card>
        ))}

        <Button
          mx='2'
          mt='2'
          size='4'
          variant='soft'
          className='gap-1'
          onClick={handleInputFileClick}
        >
          <PlusCircledIcon width='20' height='20' />
          Add File
        </Button>
        <input
          type='file'
          ref={filesInputRef}
          style={{ display: 'none' }}
          onChange={handleMultipleFilesChange}
          multiple
        />

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
          isSearchable={false}
          styles={CUSTOM_SELECT_STYLES_MULTI}
        />

        <Text weight='medium' mt='3' mb='1'>
          Category
        </Text>
        <Select
          onChange={handleCategoryChange}
          placeholder='Select social'
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={CATEGORIES}
          styles={CUSTOM_SELECT_STYLES_SINGLE}
          isSearchable={false}
          isMulti={false}
        />
        {formErrors.find((error) => error.field === 'category') && (
          <Text color='red' mt='1'>
            {formErrors.find((error) => error.field === 'category')?.message}
          </Text>
        )}

        <Button
          mt='5'
          style={{ height: '40px', fontSize: '18px' }}
          onClick={handleCreateProject}
          loading={createLoading}
        >
          Create Project
        </Button>
      </Flex>
    </Flex>
  );
};

export default CreateProjectPage;
