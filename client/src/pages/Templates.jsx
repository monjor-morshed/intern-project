// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Label,
//   TextInput,
//   Textarea,
//   Checkbox,
//   Button,
//   Alert,
//   Spinner,
// } from "flowbite-react";

// const FillTemplate = () => {
//   const { templateId } = useParams(); // Get template ID from the URL
//   const [templateData, setTemplateData] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const navigate = useNavigate();

//   // Fetch the template data when the component mounts
//   useEffect(() => {
//     const fetchTemplate = async () => {
//       try {
//         const res = await fetch(`/api/template/${templateId}`);
//         const data = await res.json();
//         if (res.ok) {
//           setTemplateData(data);
//           // Initialize formData state with empty values
//           const initialFormData = {};
//           data.questions.forEach((question, index) => {
//             initialFormData[`question-${index}`] =
//               question.type === "checkbox" ? [] : "";
//           });
//           setFormData(initialFormData);
//         } else {
//           setErrorMessage("Failed to fetch template.");
//         }
//       } catch (error) {
//         setErrorMessage(error.message);
//       }
//     };

//     fetchTemplate();
//   }, [templateId]);

//   const handleInputChange = (index, e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       const updatedValues = [...formData[name]];
//       if (checked) {
//         updatedValues.push(value);
//       } else {
//         const valueIndex = updatedValues.indexOf(value);
//         updatedValues.splice(valueIndex, 1);
//       }
//       setFormData({ ...formData, [name]: updatedValues });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       const res = await fetch(`/api/template/${templateId}/submit`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       setLoading(false);

//       if (res.ok) {
//         navigate(`/template/${templateId}/success`);
//       } else {
//         setErrorMessage(data.message || "Failed to submit template.");
//       }
//     } catch (error) {
//       setErrorMessage(error.message);
//       setLoading(false);
//     }
//   };

//   if (!templateData) {
//     return <Spinner />;
//   }

//   return (
//     <div className="min-h-screen mt-10">
//       <div className="flex p-5 max-w-3xl mx-auto flex-col gap-5">
//         <h1 className="text-3xl font-bold">{templateData.title}</h1>
//         <p className="mb-4">{templateData.description}</p>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           {templateData.questions.map((question, index) => (
//             <div
//               key={index}
//               className="flex flex-col gap-2 p-4 border rounded-lg mb-2"
//             >
//               <Label value={question.title} />

//               {/* Handle different question types */}
//               {question.type === "single-line" && (
//                 <TextInput
//                   type="text"
//                   name={`question-${index}`}
//                   onChange={(e) => handleInputChange(index, e)}
//                   required={question.required}
//                 />
//               )}

//               {question.type === "multi-line" && (
//                 <Textarea
//                   name={`question-${index}`}
//                   onChange={(e) => handleInputChange(index, e)}
//                   required={question.required}
//                 />
//               )}

//               {question.type === "integer" && (
//                 <TextInput
//                   type="number"
//                   name={`question-${index}`}
//                   onChange={(e) => handleInputChange(index, e)}
//                   required={question.required}
//                 />
//               )}

//               {question.type === "checkbox" && (
//                 <div>
//                   {question.options.map((option, optionIndex) => (
//                     <div key={optionIndex} className="flex items-center gap-2">
//                       <Checkbox
//                         value={option}
//                         name={`question-${index}`}
//                         onChange={(e) => handleInputChange(index, e)}
//                       />
//                       <Label value={option} />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}

//           <Button
//             type="submit"
//             gradientDuoTone="purpleToPink"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <Spinner color="blue" size="sm" />
//                 <span className="pl-3">Submitting...</span>
//               </>
//             ) : (
//               "Submit"
//             )}
//           </Button>
//         </form>

//         {errorMessage && (
//           <Alert className="mt-5" color="failure">
//             {errorMessage}
//           </Alert>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FillTemplate;

// src/components/TemplateManager.jsx
import { useEffect, useState } from "react";
import { Table, Button, Modal } from "flowbite-react";

const TemplateView = () => {
  const [templates, setTemplates] = useState([]);
  const [setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/template/get-templates", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any authorization headers if necessary
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if latestTemplates exists and is an array
      setTemplates(data.latestTemplates || []);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      setTemplates([]); // Set to an empty array on error
    }
  };

  const handleEdit = (template) => {
    setCurrentTemplate(template);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/template/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Add any authorization headers if necessary
      },
    });

    if (response.ok) {
      fetchTemplates(); // Refresh the list after deletion
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentTemplate(null);
  };

  const handleUpdate = async () => {
    const response = await fetch(
      `/api/template/update/${currentTemplate._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentTemplate),
      }
    );

    if (response.ok) {
      fetchTemplates(); // Refresh the list after updating
      handleCloseModal();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Templates</h1>
      <Table>
        <Table.Head>
          <Table.HeadCell>Title</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>Topic</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {templates.map((template) => (
            <Table.Row key={template._id}>
              <Table.Cell>{template.title}</Table.Cell>
              <Table.Cell>{template.description}</Table.Cell>
              <Table.Cell>{template.topic}</Table.Cell>
              <Table.Cell>
                <Button onClick={() => handleEdit(template)}>Edit</Button>
                <Button
                  onClick={() => handleDelete(template._id)}
                  className="ml-2"
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {showModal && (
        <Modal show={showModal} onClose={handleCloseModal}>
          <Modal.Header>Edit Template</Modal.Header>
          <Modal.Body>
            {/* Add your form fields to edit the template here */}
            <input
              type="text"
              value={currentTemplate?.title || ""}
              onChange={(e) =>
                setCurrentTemplate({
                  ...currentTemplate,
                  title: e.target.value,
                })
              }
              placeholder="Title"
              className="border rounded p-2 w-full mb-2"
            />
            <textarea
              value={currentTemplate?.description || ""}
              onChange={(e) =>
                setCurrentTemplate({
                  ...currentTemplate,
                  description: e.target.value,
                })
              }
              placeholder="Description"
              className="border rounded p-2 w-full mb-2"
            />
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white rounded p-2"
            >
              Update
            </button>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default TemplateView;
