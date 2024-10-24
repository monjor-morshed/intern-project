// import { useEffect, useState } from "react";
// import {
//   Button,
//   Spinner,
//   Table,
//   Alert,
//   Modal,
//   TextInput,
//   Textarea,
//   Select,
// } from "flowbite-react";
// import { useNavigate } from "react-router-dom";

// const AdminTemplates = () => {
//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [updatedTemplate, setUpdatedTemplate] = useState({});
//   const navigate = useNavigate();

//   // Fetch all templates on page load
//   useEffect(() => {
//     const fetchTemplates = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/template/get-templates");
//         const data = await res.json();
//         setTemplates(data.latestTemplates);
//         setLoading(false);
//       } catch (error) {
//         setErrorMessage("Failed to fetch templates");
//         setLoading(false);
//       }
//     };

//     fetchTemplates();
//   }, []);

//   // Handle template update
//   const handleEdit = (template) => {
//     setSelectedTemplate(template);
//     setUpdatedTemplate(template); // Pre-fill modal fields with selected template's data
//     setShowModal(true);
//   };

//   const handleUpdateChange = (e) => {
//     setUpdatedTemplate({
//       ...updatedTemplate,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleUpdateTemplate = async () => {
//     try {
//       const res = await fetch(`/api/template/update/${selectedTemplate._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedTemplate),
//       });

//       if (res.ok) {
//         // Update the template in the state
//         setTemplates((prev) =>
//           prev.map((template) =>
//             template._id === selectedTemplate._id ? updatedTemplate : template
//           )
//         );
//         setShowModal(false); // Close modal
//       } else {
//         setErrorMessage("Failed to update the template");
//       }
//     } catch (error) {
//       setErrorMessage(error.message);
//     }
//   };

//   // Handle template deletion
//   const handleDelete = async (templateId) => {
//     try {
//       const res = await fetch(`/api/template/delete/${templateId}`, {
//         method: "DELETE",
//       });

//       if (res.ok) {
//         setTemplates(
//           templates.filter((template) => template._id !== templateId)
//         );
//       } else {
//         setErrorMessage("Failed to delete template");
//       }
//     } catch (error) {
//       setErrorMessage(error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen mt-10 p-5 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-5">Manage Templates</h1>
//       {loading && <Spinner size="lg" color="blue" />}
//       {errorMessage && <Alert color="failure">{errorMessage}</Alert>}

//       <Table>
//         <Table.Head>
//           <Table.HeadCell>Title</Table.HeadCell>
//           <Table.HeadCell>Description</Table.HeadCell>
//           <Table.HeadCell>Topic</Table.HeadCell>
//           <Table.HeadCell>Actions</Table.HeadCell>
//         </Table.Head>
//         <Table.Body>
//           {templates.map((template) => (
//             <Table.Row key={template._id}>
//               <Table.Cell>{template.title}</Table.Cell>
//               <Table.Cell>{template.description}</Table.Cell>
//               <Table.Cell>{template.topic}</Table.Cell>
//               <Table.Cell>
//                 <Button size="xs" onClick={() => handleEdit(template)}>
//                   Edit
//                 </Button>
//                 <Button
//                   size="xs"
//                   color="failure"
//                   className="ml-2"
//                   onClick={() => handleDelete(template._id)}
//                 >
//                   Delete
//                 </Button>
//               </Table.Cell>
//             </Table.Row>
//           ))}
//         </Table.Body>
//       </Table>

//       {/* Modal for editing template */}
//       {showModal && (
//         <Modal show={showModal} onClose={() => setShowModal(false)}>
//           <Modal.Header>Edit Template</Modal.Header>
//           <Modal.Body>
//             <div className="flex flex-col gap-4">
//               <TextInput
//                 type="text"
//                 placeholder="Template Title"
//                 name="title"
//                 value={updatedTemplate.title}
//                 onChange={handleUpdateChange}
//               />
//               <Textarea
//                 placeholder="Template Description"
//                 name="description"
//                 value={updatedTemplate.description}
//                 onChange={handleUpdateChange}
//               />
//               <Select
//                 name="topic"
//                 value={updatedTemplate.topic}
//                 onChange={handleUpdateChange}
//               >
//                 <option value="Education">Education</option>
//                 <option value="Quiz">Quiz</option>
//                 <option value="Other">Other</option>
//               </Select>
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button onClick={handleUpdateTemplate}>Update Template</Button>
//             <Button color="failure" onClick={() => setShowModal(false)}>
//               Cancel
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default AdminTemplates;
