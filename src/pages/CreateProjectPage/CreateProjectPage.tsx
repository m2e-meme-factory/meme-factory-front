import { Text, Button, Flex, Heading, IconButton, Select, Separator } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import './CreateProjectPage.module.css';
import React, { useState } from 'react';
import { TAGS } from '../../shared/consts/tags';
import { CATEGORIES } from '../../shared/consts/categories';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../styles/CustomReactQuill.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon } from '@radix-ui/react-icons';
import styles from './CreateProjectPage.module.css';
import CreateSubtaskSection from './components/CreateSubtaskSection/CreateSubstaskSection';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState(null);
  const [priceMode, setPriceMode] = useState('single');
  const [price, setPrice] = useState({ single: 0, min: 0, max: 0 });

  const handlePriceModeChange = () => {
    setPriceMode(priceMode === 'single' ? 'range' : 'single');
  };

  return (
    <Flex m='4' direction='column'>
      <Flex align='center'>
        <IconButton size='1' onClick={() => navigate(-1)} mr='3'>
          <ArrowLeftIcon />
        </IconButton>
        <Heading>Create Project</Heading>
      </Flex>
      <Form.Root className='FormRoot'>
        <Flex direction='column'>
          <Heading size='5' mt='3'>
            General Information
          </Heading>
          <Separator my='3' size='4' />
        </Flex>
        <Form.Field className='FormField' name='title'>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className='FormLabel'>Title</Form.Label>
            <Form.Message className='FormMessage' match='valueMissing'>
              Please enter a title
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className='Input' type='text' required />
          </Form.Control>
        </Form.Field>

        <Form.Field className={`FormField ${styles.QuillField}`} name='description'>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className='FormLabel'>Description</Form.Label>
            <Form.Message className='FormMessage' match='valueMissing'>
              Please enter a description
            </Form.Message>
          </div>
          <ReactQuill value={description} onChange={setDescription} />
        </Form.Field>

        <Form.Field className='FormField' name='bannerUrl'>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className='FormLabel'>Banner</Form.Label>
            <Form.Message className='FormMessage' match='valueMissing'>
              Please upload a banner
            </Form.Message>
          </div>
          <Form.Control asChild className={styles.InputField}>
            <input className='Input' type='file' />
          </Form.Control>
        </Form.Field>

        <Form.Field className='FormField' name='files'>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className='FormLabel'>Files</Form.Label>
          </div>
          <Form.Control asChild>
            <input className='Input' type='file' multiple />
          </Form.Control>
        </Form.Field>

        <Form.Field name='tags'>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className='FormLabel'>Tags</Form.Label>
          </div>
          <Form.Control asChild>
            <Select.Root>
              <Select.Trigger style={{ width: '91vw' }} />
              <Select.Content>
                <Select.Group>
                  {TAGS.map((tag, index) => (
                    <Select.Item value={tag.value}>{tag.label}</Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Form.Control>
        </Form.Field>

        <Form.Field name='category'>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className='FormLabel'>Category</Form.Label>
          </div>
          <Form.Control asChild>
            <Select.Root>
              <Select.Trigger style={{ width: '91vw' }} />
              <Select.Content>
                <Select.Group>
                  {CATEGORIES.map((category, index) => (
                    <Select.Item value={category.value}>{category.label}</Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Form.Control>
        </Form.Field>

        <Form.Field className='FormField' name='price'>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className='FormLabel'>Price</Form.Label>
          </div>
          {priceMode === 'single' ? (
            <Form.Control asChild>
              <input
                className={`Input ${styles.Input}`}
                type='number'
                value={price.single}
                onChange={(e) => setPrice({ ...price, single: parseInt(e.target.value, 10) })}
                required
              />
            </Form.Control>
          ) : (
            <>
              <Flex direction='column' mb='3'>
                <Text weight='medium'>Min:</Text>
                <Form.Control asChild>
                  <input
                    className='Input'
                    type='number'
                    placeholder='Min'
                    value={price.min}
                    onChange={(e) => setPrice({ ...price, min: parseInt(e.target.value, 10) })}
                    required
                  />
                </Form.Control>
              </Flex>
              <Flex direction='column'>
                <Text weight='medium'>Max:</Text>
                <Form.Control asChild>
                  <input
                    className='Input'
                    type='number'
                    placeholder='Min'
                    value={price.min}
                    onChange={(e) => setPrice({ ...price, min: parseInt(e.target.value, 10) })}
                    required
                  />
                </Form.Control>
              </Flex>
            </>
          )}
        </Form.Field>

        <Button variant='surface' mb='3' onClick={handlePriceModeChange}>
          {priceMode === 'single' ? 'Set Min/Max Price' : 'Set Single Price'}
        </Button>

        <CreateSubtaskSection />

        <Form.Submit asChild>
          <button className='Button' style={{ marginTop: 10 }}>
            Create Project
          </button>
        </Form.Submit>
      </Form.Root>
    </Flex>
  );
};

export default CreateProjectPage;
