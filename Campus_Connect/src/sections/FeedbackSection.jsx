import React, { useState } from "react";
import "../styles/FeedbackSection.css";

export default function FeedbackSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userType: "",
    eventAttended: "",
    rating: "",
    comments: "",
  });

  const [showToast, setShowToast] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("تم إرسال البيانات:", formData);

  
    setShowToast(true);


    setFormData({
      fullName: "",
      email: "",
      userType: "",
      eventAttended: "",
      rating: "",
      comments: "",
    });

   
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="section container feedback" aria-labelledby="feedback-title">
      <h2 id="feedback-title" className="section-title">Feedback</h2>
      <p className="note">Enter the form data
        .</p>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast">
          submission was successfuly
                  </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <select
          className="select"
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          required
        >
          <option value="" disabled>User Type</option>
          <option>Student</option>
          <option>Faculty</option>
        </select>
        <select
          className="select"
          name="eventAttended"
          value={formData.eventAttended}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Event Attended (last month)</option>
          <option>TechFest 2025</option>
          <option>Cultural Week</option>
        </select>
        <select
          className="select"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Rating</option>
          <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
        </select>
        <textarea
          className="textarea"
          name="comments"
          placeholder="Comments"
          value={formData.comments}
          onChange={handleChange}
        ></textarea>

        <button className="btn" type="submit">Submit</button>
      </form>
    </div>
  );
}
