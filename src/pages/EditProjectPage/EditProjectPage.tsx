import {
  Text,
  Button,
  Flex,
  Heading,
  IconButton,
  TextField,
  Card,
  AlertDialog,
  Box,
} from '@radix-ui/themes';
import '../CreateProjectPage/CreateProjectPage.module.css';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { TAGS } from '../../shared/consts/tags';
import { CATEGORIES } from '../../shared/consts/categories';
import makeAnimated from 'react-select/animated';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../styles/CustomReactQuill.css';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '@radix-ui/react-icons';
import Select, { MultiValue, SingleValue } from 'react-select';
import {
  CUSTOM_SELECT_STYLES_MULTI,
  CUSTOM_SELECT_STYLES_SINGLE,
} from '../../styles/customSelectStyles';
import { FormError, Option } from '../../@types/app';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import { useUpdateProject } from '../../shared/utils/api/hooks/project/useUpdateProject';
import ProjectStatusSelect from './components/ProjectStatusSelect';
import { UpdateProjectDTO, UpdateTaskDTO } from 'api';
import toast from 'react-hot-toast';
import { uploadFiles } from '../../shared/utils/api/requests/files/uploadBanner';
import EditSubtaskSection from './components/EditSubtaskSection';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

enum ProjectStatus {
  DRAFT = 'draft',
  MODERATION = 'moderation',
  PUBLISHED = 'published',
  NOT_ACCEPTED = 'not_accepted',
  CLOSED = 'closed',
}

const EditProjectPage = () => {
  const animatedComponents = makeAnimated();
  const user = useSelector((state: RootState) => state.user.user);
  const project = useSelector((state: RootState) => state.project.project);
  const subtasksPrepared = project ? project.project.tasks.map((task) => task.task) : [];

  const navigate = useNavigate();
  const [subtasksToDelete, setSubtasksToDelete] = useState<string[]>([]);
  const [title, setTitle] = useState(project?.project.title);
  const [description, setDescription] = useState(project?.project.description);
  const [tags, setTags] = useState<string[]>(project ? project.project.tags : []);
  const [category, setCategory] = useState<string | null>(
    project ? project.project.category : null
  );
  const [subtasks, setSubtasks] = useState<UpdateTaskDTO[]>(subtasksPrepared);
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(
    project ? project.project.status : ProjectStatus.DRAFT
  );
  const [attachedFiles, setAttachedFiles] = useState<string[]>(
    project ? project.project.files : []
  );
  const [attachedBanner, setAttachedBanner] = useState<string | null>(
    project ? project.project.bannerUrl : null
  );
  const [isProjectSaving, setIsProjectSaving] = useState(false);

  const webapp = useWebApp();

  const [isOpenLeave, setIsOpenLeave] = useState(false);

  const handleLeave = () => {
    navigate(-1);
    webapp.BackButton.hide();
  };

  const handleBack = useCallback(() => {
    setIsOpenLeave(true);
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

  const updateProjectMutation = useUpdateProject(project?.project.id);

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const tagsOptionsSelected = project?.project.tags.map((tag) => ({
    value: tag,
    label: capitalizeFirstLetter(tag),
  }));

  const categoryOptionSelected = {
    value: project?.project.category,
    label: capitalizeFirstLetter(project?.project.category ? project?.project.category : ''),
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

  const handleEditProject = async () => {
    setIsProjectSaving(true);
    const errors = validateForm();

    if (errors.length === 0) {
      let bannerUrl = attachedBanner;
      let files: string[] = [...attachedFiles];

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

        if (Array.isArray(response)) {
          const fileNames = response.map((file) => file.name);
          files = [...files, ...fileNames];
        }
      }

      const projectData: UpdateProjectDTO = {
        authorId: user?.id,
        title: title ? title : '',
        description: description ? description : '',
        tags,
        category,
        subtasks: subtasks.map((subtask) => {
          const { id, ...rest } = subtask;
          if (id?.length === 36) {
            return rest;
          }
          return subtask;
        }),
        deletedTasks: subtasksToDelete,
        bannerUrl: bannerUrl ? bannerUrl : attachedBanner,
        files: files,
      };

      if (project && projectData) {
        updateProjectMutation.mutate({
          params: { projectId: project.project.id, project: projectData },
        });
        setIsProjectSaving(false);
      }
    } else {
      setFormErrors(errors);
      setIsProjectSaving(false);
    }
  };

  return (
    <Flex m='4' direction='column'>
      <Flex align='center'>
        <AlertDialog.Root open={isOpenLeave}>
          <AlertDialog.Trigger>
            <Box></Box>
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
                <Button onClick={() => handleLeave()} variant='solid' color='red'>
                  Leave
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>

        <Heading>Edit Project</Heading>
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
        {attachedBanner && (
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
                {attachedBanner.substring(55)}
              </Text>
              <IconButton ml='3' onClick={() => setAttachedBanner(null)}>
                <TrashIcon></TrashIcon>
              </IconButton>
            </Flex>
          </Card>
        )}
        {!attachedBanner && <input type='file' onChange={handleSingleFileChange} />}

        <Text weight='medium' mt='3'>
          Files
        </Text>
        <Flex direction='column' style={{ maxWidth: '100%', overflow: 'hidden' }}>
          {attachedFiles && (
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {attachedFiles.map((file, index) => (
                <Card mb='3'>
                  <li key={index}>
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
                        {file.substring(37)}
                      </Text>
                      <IconButton
                        onClick={() =>
                          setAttachedFiles((prevState) => prevState.filter((_, i) => i !== index))
                        }
                        ml='3'
                      >
                        <TrashIcon />
                      </IconButton>
                    </Flex>
                  </li>
                </Card>
              ))}
            </ul>
          )}
        </Flex>

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
          defaultValue={tagsOptionsSelected}
          onChange={handleTagsChange}
          placeholder='Select tags'
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          isSearchable={false}
          options={TAGS}
          styles={CUSTOM_SELECT_STYLES_MULTI}
        />

        <Text weight='medium' mt='3' mb='1'>
          Category
        </Text>
        <Select
          defaultValue={categoryOptionSelected}
          onChange={handleCategoryChange}
          placeholder='Select category'
          closeMenuOnSelect={true}
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

        <EditSubtaskSection
          setSubtasks={setSubtasks}
          subtasks={subtasks}
          setTasksToDelete={setSubtasksToDelete}
        />

        <Button
          style={{ padding: '20px' }}
          loading={isProjectSaving}
          mt='4'
          mb='4'
          onClick={handleEditProject}
        >
          Save Project
        </Button>

        {project && (
          <ProjectStatusSelect projectId={project.project.id} projectStatus={projectStatus} />
        )}
      </Flex>
    </Flex>
  );
};

export default EditProjectPage;
