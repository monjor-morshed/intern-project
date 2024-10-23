import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Alert, Badge, Button, Table } from "flowbite-react";

const TemplateDashboard = () => {
  const { templateId } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/template/${templateId}`);
        const data = await res.json();

        if (res.ok) {
          setTemplate(data);
        } else {
          setErrorMessage(data.message || "Failed to load template.");
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="blue" size="lg" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert color="failure">{errorMessage}</Alert>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">{template.title}</h1>

      <div className="mb-5">
        <Badge color="info">{template.topic}</Badge>
        <p className="mt-3">{template.description}</p>
        {template.imageUrl && (
          <div className="mt-5">
            <img
              src={template.imageUrl}
              alt={template.title}
              className="w-full max-w-sm"
            />
          </div>
        )}
      </div>

      <div className="mb-5">
        <h2 className="text-2xl font-semibold">Questions</h2>
        {template.questions.length === 0 ? (
          <p>No questions available for this template.</p>
        ) : (
          <Table className="mt-3">
            <Table.Head>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Required</Table.HeadCell>
              <Table.HeadCell>Display in Table</Table.HeadCell>
              {template.questions[0].type === "checkbox" && (
                <Table.HeadCell>Options</Table.HeadCell>
              )}
            </Table.Head>
            <Table.Body>
              {template.questions.map((question, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{question.title}</Table.Cell>
                  <Table.Cell>{question.type}</Table.Cell>
                  <Table.Cell>{question.required ? "Yes" : "No"}</Table.Cell>
                  <Table.Cell>
                    {question.displayInTable ? "Yes" : "No"}
                  </Table.Cell>
                  {question.type === "checkbox" && (
                    <Table.Cell>{question.options.join(", ")}</Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      <div className="mb-5">
        <h2 className="text-2xl font-semibold">Creator</h2>
        <p>{template.creator.name}</p>
      </div>

      <div className="mb-5">
        <h2 className="text-2xl font-semibold">Tags</h2>
        {template.tags.length > 0 ? (
          template.tags.map((tag) => (
            <Badge key={tag._id} color="purple" className="mr-2">
              {tag.name}
            </Badge>
          ))
        ) : (
          <p>No tags added.</p>
        )}
      </div>

      <Button onClick={() => navigate("api/template/")}>
        Back to Templates
      </Button>
    </div>
  );
};

export default TemplateDashboard;
