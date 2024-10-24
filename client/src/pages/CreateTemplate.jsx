import {
  Label,
  TextInput,
  Button,
  Alert,
  Spinner,
  Textarea,
  Select,
  Checkbox,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateTemplate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
    tags: [],
    questions: [
      {
        title: "",
        type: "single-line",
        displayInTable: false,
        required: false,
        options: [],
      },
    ],
    newTag: "", // Added newTag field for adding new tags
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tag/get-tags");
        const data = await response.json();
        if (response.ok) {
          setTags(data);
        } else {
          setErrorMessage("Failed to fetch tags.");
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    fetchTags();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][e.target.name] = e.target.value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleTagChange = (e) => {
    const selectedTags = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({
      ...formData,
      tags: selectedTags,
    });
  };

  const handleNewTagChange = (e) => {
    setFormData({ ...formData, newTag: e.target.value });
  };

  const handleAddNewTag = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.newTag }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        // Add new tag to the tags list
        setTags([...tags, data]);
        // Clear newTag field
        setFormData({ ...formData, newTag: "" });
      } else {
        setErrorMessage(data.message || "Failed to add new tag.");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          title: "",
          type: "single-line",
          displayInTable: false,
          required: false,
          options: [],
        },
      ],
    });
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const validateInput = () => {
    const { title, description, topic, questions } = formData;

    if (!title || !description || !topic || questions.length === 0) {
      return "Please fill all required fields and add at least one question.";
    }

    for (const question of questions) {
      if (!question.title || !question.type) {
        return "Each question must have a title and a type.";
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateInput();
    if (error) {
      return setErrorMessage(error);
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        navigate("/templates");
      } else {
        setErrorMessage(data.message || "Failed to create template.");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-10">
      <div className="flex p-5 max-w-3xl mx-auto flex-col gap-5">
        <h1 className="text-3xl font-bold">Create New Template</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <Label value="Template Title" />
            <TextInput
              type="text"
              placeholder="Template Title"
              id="title"
              onChange={handleChange}
              value={formData.title}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label value="Description" />
            <Textarea
              placeholder="Description of the template"
              id="description"
              onChange={handleChange}
              value={formData.description}
              required
            />
          </div>

          {/* Topic */}
          <div>
            <Label value="Topic" />
            <Select
              id="topic"
              onChange={handleChange}
              value={formData.topic}
              required
            >
              <option value="">Select a topic</option>
              <option value="Education">Education</option>
              <option value="Quiz">Quiz</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <Label value="Tags (Select multiple)" />
            <Select
              id="tags"
              multiple={true}
              onChange={handleTagChange}
              value={formData.tags}
            >
              {tags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Add New Tag */}
          <div className="flex items-center gap-2">
            <TextInput
              type="text"
              placeholder="Add New Tag"
              value={formData.newTag}
              onChange={handleNewTagChange}
            />
            <Button
              type="button"
              onClick={handleAddNewTag}
              disabled={!formData.newTag}
            >
              Add Tag
            </Button>
          </div>

          {/* Questions */}
          <div>
            <h2 className="text-xl font-semibold">Questions</h2>
            {formData.questions.map((question, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 p-4 border rounded-lg mb-2"
              >
                <div>
                  <Label value={`Question ${index + 1} Title`} />
                  <TextInput
                    type="text"
                    name="title"
                    placeholder="Question Title"
                    value={question.title}
                    onChange={(e) => handleQuestionChange(index, e)}
                    required
                  />
                </div>
                <div>
                  <Label value="Question Type" />
                  <Select
                    name="type"
                    value={question.type}
                    onChange={(e) => handleQuestionChange(index, e)}
                    required
                  >
                    <option value="single-line">Single-line</option>
                    <option value="multi-line">Multi-line</option>
                    <option value="integer">Integer</option>
                    <option value="checkbox">Checkbox</option>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Checkbox
                    name="required"
                    checked={question.required}
                    onChange={(e) =>
                      handleQuestionChange(index, {
                        target: { name: "required", value: e.target.checked },
                      })
                    }
                  />
                  <Label value="Required" />
                </div>
                {question.type === "checkbox" && (
                  <div>
                    <Label value="Options (Comma separated)" />
                    <TextInput
                      type="text"
                      name="options"
                      placeholder="Option 1, Option 2, Option 3"
                      value={question.options.join(", ")}
                      onChange={(e) =>
                        handleQuestionChange(index, {
                          target: {
                            name: "options",
                            value: e.target.value
                              .split(",")
                              .map((opt) => opt.trim()),
                          },
                        })
                      }
                    />
                  </div>
                )}
                <Button
                  color="failure"
                  onClick={() => handleDeleteQuestion(index)}
                >
                  Delete Question
                </Button>
              </div>
            ))}
            <Button onClick={handleAddQuestion}>Add Another Question</Button>
          </div>

          <Button
            type="submit"
            gradientDuoTone="purpleToPink"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner color="white" aria-label="Loading..." />
                <span>Creating Template...</span>
              </>
            ) : (
              "Create Template"
            )}
          </Button>

          {/* Error message */}
          {errorMessage && (
            <Alert color="failure">
              <span>{errorMessage}</span>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateTemplate;
