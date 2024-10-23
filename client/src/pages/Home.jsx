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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
    questions: [
      {
        title: "",
        type: "single-line",
        displayInTable: false,
        required: false,
        options: [],
      },
    ],
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][e.target.name] = e.target.value;
    setFormData({ ...formData, questions: updatedQuestions });
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
            />
          </div>

          {/* Topic */}
          <div>
            <Label value="Topic" />
            <Select id="topic" onChange={handleChange} value={formData.topic}>
              <option value="">Select a topic</option>
              <option value="Education">Education</option>
              <option value="Quiz">Quiz</option>
              <option value="Other">Other</option>
            </Select>
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
                  />
                </div>
                <div>
                  <Label value="Question Type" />
                  <Select
                    name="type"
                    value={question.type}
                    onChange={(e) => handleQuestionChange(index, e)}
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
                <Spinner color="blue" size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Create Template"
            )}
          </Button>
        </form>

        {errorMessage && (
          <Alert className="mt-5" color="failure">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Home;
