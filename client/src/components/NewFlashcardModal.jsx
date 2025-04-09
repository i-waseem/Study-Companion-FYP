import { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';

const { TextArea } = Input;

const NewFlashcardModal = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
      onClose();
      message.success('Flashcard created successfully!');
    } catch (error) {
      console.error('Error creating flashcard:', error);
      message.error('Failed to create flashcard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create New Flashcard"
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          difficulty: 'Medium'
        }}
      >
        <Form.Item
          name="topic"
          label="Topic"
          rules={[{ required: true, message: 'Please enter a topic' }]}
        >
          <Input placeholder="e.g., React Hooks, JavaScript Basics" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select a category">
            <Select.Option value="Programming">Programming</Select.Option>
            <Select.Option value="Mathematics">Mathematics</Select.Option>
            <Select.Option value="Science">Science</Select.Option>
            <Select.Option value="Languages">Languages</Select.Option>
            <Select.Option value="History">History</Select.Option>
            <Select.Option value="Geography">Geography</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="difficulty"
          label="Difficulty"
          rules={[{ required: true, message: 'Please select difficulty' }]}
        >
          <Select>
            <Select.Option value="Easy">Easy</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="Hard">Hard</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="question"
          label="Question"
          rules={[{ required: true, message: 'Please enter a question' }]}
        >
          <TextArea
            rows={3}
            placeholder="Enter your question here"
          />
        </Form.Item>

        <Form.Item
          name="answer"
          label="Answer"
          rules={[{ required: true, message: 'Please enter an answer' }]}
        >
          <TextArea
            rows={4}
            placeholder="Enter the answer here"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewFlashcardModal;
