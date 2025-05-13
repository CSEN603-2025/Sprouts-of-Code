import { useState, useEffect, useCallback } from 'react';
import { useWorkshops } from '../../context/WorkshopContext';
import WorkshopForm from '../../components/workshop/WorkshopForm';
import './WorkshopManagement.css';

const WorkshopManagement = () => {
  const { workshops, deleteWorkshop } = useWorkshops();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [filter, setFilter] = useState('all');
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);

  // Update filtered workshops when workshops or filter changes
  useEffect(() => {
    const filtered = filter === 'all' 
      ? workshops 
      : workshops.filter(w => w.type === filter);
    setFilteredWorkshops(filtered);
  }, [workshops, filter]);

  const handleCreate = useCallback(() => {
    setSelectedWorkshop(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((workshop) => {
    setSelectedWorkshop(workshop);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this workshop?')) {
      try {
        const success = await deleteWorkshop(id);
        if (!success) {
          console.error('Failed to delete workshop');
          // You could add a toast notification here
        }
      } catch (error) {
        console.error('Error deleting workshop:', error);
        // You could add a toast notification here
      }
    }
  }, [deleteWorkshop]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setSelectedWorkshop(null);
  }, []);

  return (
    <div className="workshop-management">
      <div className="workshop-header">
        <h1>Workshop Management</h1>
        <button className="create-btn" onClick={handleCreate}>
          Create Workshop
        </button>
      </div>

      <div className="filter-section">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Workshops</option>
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="pre-recorded">Pre-recorded</option>
        </select>
      </div>

      <div className="workshops-grid">
        {filteredWorkshops.map(workshop => (
          <div key={workshop.id} className="workshop-card">
            <div className="workshop-card-header">
              <h3>{workshop.title}</h3>
              <span className={`type-badge ${workshop.type}`}>
                {workshop.type}
              </span>
            </div>
            <div className="workshop-card-content">
              <div className="workshop-info">
                <h4 className="workshop-title">{workshop.title}</h4>
                <p className="workshop-short-desc">{workshop.shortDescription}</p>
              </div>

              <div className="workshop-details">
                <div className="speaker-info">
                  <p><strong>Speaker:</strong> {workshop.speaker}</p>
                  <p><strong>Title:</strong> {workshop.speakerTitle}</p>
                  <p className="speaker-bio">{workshop.speakerBio}</p>
                </div>

                <div className="workshop-schedule">
                  <p><strong>Date:</strong> {workshop.startDate}</p>
                  <p><strong>Time:</strong> {workshop.startTime} - {workshop.endTime}</p>
                  <p><strong>Duration:</strong> {workshop.duration} hours</p>
                </div>

                <div className="workshop-description">
                  <p><strong>Description:</strong></p>
                  <p>{workshop.description}</p>
                </div>

                <div className="agenda-section">
                  <p><strong>Agenda:</strong></p>
                  <ul className="agenda-list">
                    {workshop.agenda?.map((item, index) => (
                      <li key={index}>
                        <span className="agenda-time">{item.time}</span>
                        <span className="agenda-topic">{item.topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="workshop-card-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEdit(workshop)}
              >
                Edit
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(workshop.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <WorkshopForm
              workshop={selectedWorkshop}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopManagement; 