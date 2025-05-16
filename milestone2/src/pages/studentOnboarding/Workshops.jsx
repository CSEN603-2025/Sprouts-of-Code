import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStudent } from '../../context/StudentContext';
import { useWorkshops } from '../../context/WorkshopContext';
import { Dialog, DialogContent } from '@mui/material';
import Certificate from './Certificate';
import FilterBar from '../../components/shared/FilterBar';
import { jsPDF } from 'jspdf';
import './Workshops.css';

const Workshops = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    isRegisteredForWorkshop, 
    registerForWorkshop, 
    unregisterFromWorkshop,
    getStudentCertificates 
  } = useStudent();
  const { workshops, loading } = useWorkshops();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [certificatesVersion, setCertificatesVersion] = useState(0);
  const [notificationTrigger, setNotificationTrigger] = useState(0);


  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'live', label: 'Live' },
    { value: 'pre-recorded', label: 'Pre-recorded' }
  ];

  useEffect(() => {
    const handleStorage = () => setCertificatesVersion(v => v + 1);
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Filter workshops based on search and type
  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(search.toLowerCase()) ||
                         workshop.speaker.toLowerCase().includes(search.toLowerCase()) ||
                         workshop.topics.some(topic => topic.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || workshop.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleStartWorkshop = (workshopId) => {
    navigate(`/student/workshops/${workshopId}`);
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleCloseCertificate = () => {
    setSelectedCertificate(null);
  };

  const handleDownloadCertificate = (certificate) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 20;
    const lineHeight = 6;
    let cursorY = 20;

    // Add certificate title
    doc.setFontSize(24);
    doc.setFont("Helvetica", "bold");
    const title = "Certificate of Completion";
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, cursorY);
    cursorY += 20;

    // Add student name
    doc.setFontSize(18);
    doc.text(`This is to certify that`, marginLeft, cursorY);
    cursorY += 15;
    doc.setFontSize(24);
    doc.text(user.name, (pageWidth - doc.getTextWidth(user.name)) / 2, cursorY);
    cursorY += 20;

    // Add workshop details
    doc.setFontSize(14);
    doc.text(`has successfully completed the workshop`, marginLeft, cursorY);
    cursorY += 15;
    doc.setFontSize(18);
    doc.text(certificate.title, (pageWidth - doc.getTextWidth(certificate.title)) / 2, cursorY);
    cursorY += 20;
    
    // Add completion date
    doc.setFontSize(14);
    const completionDate = new Date(certificate.date).toLocaleDateString();
    doc.text(`Completed on: ${completionDate}`, (pageWidth - doc.getTextWidth(`Completed on: ${completionDate}`)) / 2, cursorY);
    cursorY += 30;

    // Add signature line
    doc.setFontSize(12);
    doc.text("Workshop Coordinator", pageWidth - 60, cursorY);
    doc.line(pageWidth - 60, cursorY - 5, pageWidth - 20, cursorY - 5);

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("The German University in Cairo", marginLeft, 290);

    // Save the PDF
    doc.save(`${certificate.title}-Certificate.pdf`);
  };

  const handleRegistration = async (workshopId, event) => {
    // Prevent event propagation
    event.preventDefault();
    event.stopPropagation();

    const workshop = workshops.find(w => w.id === workshopId);
    if (!workshop) return;

    const button = event.currentTarget;
    const isRegistered = isRegisteredForWorkshop(user.id, workshopId);
    
    try {
      // Disable the button immediately
      button.disabled = true;



      if (isRegistered) {
        await unregisterFromWorkshop(user.id, workshopId, workshop.title);
      } else {
        await registerForWorkshop(user.id, workshopId, workshop.title);
      }

      // Trigger notification update
      setNotificationTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error handling registration:', error);
    } finally {
      // Re-enable the button after operation completes
      button.disabled = false;
    }
  };

  // Get student's certificates (always for the logged-in user)
  const studentCertificates = user ? getStudentCertificates(user.id) : [];

  // Deduplicate certificates by workshopId (keep the most recent by date)
  const uniqueCertificatesMap = new Map();
  studentCertificates.forEach(cert => {
    const existing = uniqueCertificatesMap.get(cert.workshopId);
    if (!existing || new Date(cert.date) > new Date(existing.date)) {
      uniqueCertificatesMap.set(cert.workshopId, cert);
    }
  });
  const uniqueCertificates = Array.from(uniqueCertificatesMap.values());

  if (loading) {
    return <div className="loading">Loading workshops...</div>;
      }

  return (
    <div className="workshops-page">
      <Dialog
        open={!!selectedCertificate}
        onClose={handleCloseCertificate}
        maxWidth="md"
        fullWidth
        className="certificate-modal"
      >
        <DialogContent className="certificate-modal-content">
          {selectedCertificate && (
            <Certificate
              workshop={selectedCertificate}
              student={user}
              onDownload={handleDownloadCertificate}
            />
          )}
        </DialogContent>
      </Dialog>
      {uniqueCertificates.length > 0 && (
        <div className="certificates-section">
          <h2>My Certificates</h2>
          <div className="certificates-grid">
            {uniqueCertificates.map(certificate => {
              // Check if the workshop still exists
              const workshopExists = workshops.some(w => w.id === certificate.workshopId);
              
              return (
                <div key={certificate.id} className={`certificate-card ${!workshopExists ? 'deleted-workshop' : ''}`}>
                  <h3 className="certificate-card-title">
                    {workshopExists ? certificate.title : 'Workshop No Longer Available'}
                  </h3>
                  <p className="certificate-card-date">
                    Completed on: {new Date(certificate.date).toLocaleDateString()}
                  </p>
                  {!workshopExists && (
                    <p className="deleted-workshop-message">
                      This workshop has been removed from the platform
                    </p>
                  )}
                  <div className="certificate-actions">
                  <button
                    className="view-certificate-button"
                      onClick={() => handleViewCertificate(certificate)}
                  >
                    View Certificate
                  </button>
                    <button
                      className="download-certificate-button"
                      onClick={() => handleDownloadCertificate(certificate)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>Workshops</h1>
        <FilterBar
          searchPlaceholder="Search workshops..."
          searchValue={search}
          onSearchChange={setSearch}
          filterOptions={filterOptions}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      <div className="workshops-grid">
        {filteredWorkshops.length > 0 ? (
          filteredWorkshops.map(workshop => (
            <div key={workshop.id} className={`workshop-card`}>
              <div className="workshop-card-header">
                <h3>{workshop.title}</h3>
                <span className={`type-badge ${workshop.type}`}>{workshop.type}</span>
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
                    {workshop.speakerBio && <p className="speaker-bio">{workshop.speakerBio}</p>}
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
                  {workshop.agenda && workshop.agenda.length > 0 && (
                    <div className="agenda-section">
                      <p><strong>Agenda:</strong></p>
                      <ul className="agenda-list">
                        {workshop.agenda.map((item, index) => (
                          <li key={index}>
                            <span className="agenda-time">{item.time}</span>
                            <span className="agenda-topic">{item.topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="workshop-card-actions">
                {workshop.type === 'live' ? (
                  <button 
                    className="join-btn"
                    onClick={() => handleStartWorkshop(workshop.id)}
                    style={{ width: '100%' }}
                  >
                    Join Now
                  </button>
                ) : (
                  isRegisteredForWorkshop(user.id, workshop.id) ? (
                    <button
                      className="unregister-btn"
                      onClick={e => handleRegistration(workshop.id, e)}
                      style={{ width: '100%' }}
                    >
                      Unregister
                    </button>
                  ) : (
                    <button
                      className="action-btn"
                      onClick={e => handleRegistration(workshop.id, e)}
                      style={{ width: '100%' }}
                    >
                      {workshop.type === 'pre-recorded' ? 'Watch Now' : 'Register Now'}
                    </button>
                  )
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-workshops">
            <p>No workshops found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workshops; 