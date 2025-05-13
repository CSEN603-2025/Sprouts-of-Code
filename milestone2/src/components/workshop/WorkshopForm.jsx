import { useState, useEffect } from 'react';
import { useWorkshops } from '../../context/WorkshopContext';
import './WorkshopForm.css';

const WorkshopForm = ({ workshop, onClose }) => {
  const { createWorkshop, updateWorkshop, validateWorkshopDates } = useWorkshops();
  const [formData, setFormData] = useState({
    title: '',
    type: 'upcoming',
    duration: '',
    speaker: '',
    speakerTitle: '',
    speakerBio: '',
    description: '',
    shortDescription: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    topics: [],
    materials: [],
    agenda: []
  });
  const [errors, setErrors] = useState({});
  const [newTopic, setNewTopic] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newAgendaItem, setNewAgendaItem] = useState({ 
    startTime: '', 
    endTime: '', 
    topic: '' 
  });

  useEffect(() => {
    if (workshop) {
      setFormData(workshop);
    }
  }, [workshop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (index) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const handleRemoveMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleAddAgendaItem = () => {
    if (newAgendaItem.startTime.trim() && newAgendaItem.endTime.trim() && newAgendaItem.topic.trim()) {
      setFormData(prev => ({
        ...prev,
        agenda: [...prev.agenda, { ...newAgendaItem }]
      }));
      setNewAgendaItem({ startTime: '', endTime: '', topic: '' });
    }
  };

  const handleRemoveAgendaItem = (index) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const handleAgendaChange = (e) => {
    const { name, value } = e.target;
    setNewAgendaItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.speaker) newErrors.speaker = 'Speaker is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (formData.topics.length === 0) newErrors.topics = 'At least one topic is required';

    if (!validateWorkshopDates(formData)) {
      newErrors.dates = 'Invalid date/time combination for the selected workshop type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (workshop) {
        updateWorkshop(workshop.id, formData);
      } else {
        createWorkshop(formData);
      }
      onClose();
    }
  };

  return (
    <form className="workshop-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{workshop ? 'Edit Workshop' : 'Create Workshop'}</h2>
        <button type="button" className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="shortDescription">Short Description</label>
        <input
          type="text"
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          placeholder="Brief description (max 150 characters)"
          maxLength={150}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Full Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="pre-recorded">Pre-recorded</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={errors.startDate ? 'error' : ''}
          />
          {errors.startDate && <span className="error-message">{errors.startDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={errors.startTime ? 'error' : ''}
          />
          {errors.startTime && <span className="error-message">{errors.startTime}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={errors.endDate ? 'error' : ''}
          />
          {errors.endDate && <span className="error-message">{errors.endDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className={errors.endTime ? 'error' : ''}
          />
          {errors.endTime && <span className="error-message">{errors.endTime}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration (hours)</label>
        <input
          type="number"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          min="0.5"
          step="0.5"
          className={errors.duration ? 'error' : ''}
        />
        {errors.duration && <span className="error-message">{errors.duration}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="speaker">Speaker Name</label>
        <input
          type="text"
          id="speaker"
          name="speaker"
          value={formData.speaker}
          onChange={handleChange}
          className={errors.speaker ? 'error' : ''}
        />
        {errors.speaker && <span className="error-message">{errors.speaker}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="speakerTitle">Speaker Title</label>
        <input
          type="text"
          id="speakerTitle"
          name="speakerTitle"
          value={formData.speakerTitle}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="speakerBio">Speaker Bio</label>
        <textarea
          id="speakerBio"
          name="speakerBio"
          value={formData.speakerBio}
          onChange={handleChange}
          rows="3"
          placeholder="Brief biography of the speaker"
        />
      </div>

      <div className="form-group">
        <label>Workshop Agenda</label>
        <div className="agenda-input">
          <div className="agenda-input-row">
            <div className="time-inputs">
              <input
                type="text"
                name="startTime"
                value={newAgendaItem.startTime}
                onChange={handleAgendaChange}
                placeholder="Start (e.g., 14:00)"
                className="agenda-time-input"
              />
              <span className="time-separator">-</span>
              <input
                type="text"
                name="endTime"
                value={newAgendaItem.endTime}
                onChange={handleAgendaChange}
                placeholder="End (e.g., 14:15)"
                className="agenda-time-input"
              />
            </div>
            <input
              type="text"
              name="topic"
              value={newAgendaItem.topic}
              onChange={handleAgendaChange}
              placeholder="Topic (e.g., Introduction and Workshop Overview)"
              className="agenda-topic-input"
            />
            <button type="button" className="add-agenda-btn" onClick={handleAddAgendaItem}>
              Add
            </button>
          </div>
        </div>
        <ul className="agenda-items">
          {formData.agenda.map((item, index) => (
            <li key={index} className="agenda-item">
              <div className="agenda-time">
                {item.startTime} - {item.endTime}
              </div>
              <div className="agenda-topic">{item.topic}</div>
              <button 
                type="button" 
                className="remove-agenda-btn"
                onClick={() => handleRemoveAgendaItem(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="form-group">
        <label>Topics</label>
        <div className="list-input">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Add a topic"
          />
          <button type="button" onClick={handleAddTopic}>Add</button>
        </div>
        {errors.topics && <span className="error-message">{errors.topics}</span>}
        <ul className="list-items">
          {formData.topics.map((topic, index) => (
            <li key={index}>
              {topic}
              <button type="button" onClick={() => handleRemoveTopic(index)}>×</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="form-group">
        <label>Materials</label>
        <div className="list-input">
          <input
            type="text"
            value={newMaterial}
            onChange={(e) => setNewMaterial(e.target.value)}
            placeholder="Add a material"
          />
          <button type="button" onClick={handleAddMaterial}>Add</button>
        </div>
        <ul className="list-items">
          {formData.materials.map((material, index) => (
            <li key={index}>
              {material}
              <button type="button" onClick={() => handleRemoveMaterial(index)}>×</button>
            </li>
          ))}
        </ul>
      </div>

      {errors.dates && <div className="error-message">{errors.dates}</div>}

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {workshop ? 'Update Workshop' : 'Create Workshop'}
        </button>
      </div>
    </form>
  );
};

export default WorkshopForm; 