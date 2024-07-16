import React, { useState } from "react";

const StudentForm = () => {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({ name: "", subjects: [{ subject: "", marks: "" }] });
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(null);
  const [search, setSearch] = useState("");

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "name") {
      setStudent({ ...student, [name]: value });
    } else {
      const newSubjects = student.subjects.map((subject, sIndex) => {
        if (index === sIndex) {
          return { ...subject, [name]: value };
        }
        return subject;
      });
      setStudent({ ...student, subjects: newSubjects });
    }
  };

  const handleAddSubject = () => {
    setStudent({ ...student, subjects: [...student.subjects, { subject: "", marks: "" }] });
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = student.subjects.filter((_, sIndex) => sIndex !== index);
    setStudent({ ...student, subjects: newSubjects });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedStudents = students.map((s, index) => (index === currentStudentIndex ? student : s));
      setStudents(updatedStudents);
      setIsEditing(false);
      setCurrentStudentIndex(null);
    } else {
      setStudents([...students, student]);
    }
    setStudent({ name: "", subjects: [{ subject: "", marks: "" }] });
  };

  const handleEdit = (index) => {
    setStudent(students[index]);
    setIsEditing(true);
    setCurrentStudentIndex(index);
  };

  const handleDelete = (index) => {
    const updatedStudents = students.filter((_, sIndex) => sIndex !== index);
    setStudents(updatedStudents);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const calculateTotalMarks = (subjects) => {
    return subjects.reduce((total, subject) => total + parseInt(subject.marks, 10), 0);
  };

  const calculateAveragePercentage = (totalMarks, numSubjects) => {
    return totalMarks / numSubjects;
  };

  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(search));

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Student Marks Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name: </label>
          <input type="text" className="form-control" name="name" value={student.name} onChange={(e) => handleChange(e)} required />
        </div>
        {student.subjects.map((subject, index) => (
          <div className="form-row mb-3" key={index}>
            <div className="col">
              <label>Subject: </label>
              <input type="text" className="form-control" name="subject" value={subject.subject} onChange={(e) => handleChange(e, index)} required />
            </div>
            <div className="col">
              <label>Marks: </label>
              <input type="number" className="form-control" name="marks" value={subject.marks} onChange={(e) => handleChange(e, index)} required min="0" max="100" />
            </div>
            <div className="col-auto align-self-end">
              <button type="button" className="btn btn-danger" onClick={() => handleRemoveSubject(index)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-primary mb-3" onClick={handleAddSubject}>
          Add Subject
        </button>
        <button type="submit" className="btn btn-success">
          {isEditing ? "Update Student" : "Add Student"}
        </button>
      </form>

      <h4 className="mt-5">Search students</h4>
      <input type="text" className="form-control mb-3" name="search" onChange={handleSearch} value={search} />

      <h2>Students List</h2>
      <ul className="list-group">
        {filteredStudents.map((s, index) => {
          const totalMarks = calculateTotalMarks(s.subjects);
          const averagePercentage = calculateAveragePercentage(totalMarks, s.subjects.length);
          const isPass = averagePercentage >= 35;

          return (
            <li key={index} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{s.name}</strong>
                  <ul>
                    {s.subjects.map((sub, subIndex) => (
                      <li key={subIndex}>
                        {sub.subject} - {sub.marks}%
                      </li>
                    ))}
                  </ul>
                  <div>Total Marks: {totalMarks}</div>
                  <div>Average Percentage: {averagePercentage.toFixed(2)}%</div>
                  <div>Status: {isPass ? "Pass" : "Fail"}</div>
                </div>
                <div>
                  <button className="btn btn-warning mr-2" onClick={() => handleEdit(index)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StudentForm;
