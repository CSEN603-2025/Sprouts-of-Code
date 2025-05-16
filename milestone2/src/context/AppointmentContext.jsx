import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyAppointments, addAppointment as addDummyAppointment, updateAppointmentStatus as updateDummyAppointmentStatus } from '../data/dummyData';
import { useStudent } from './StudentContext';
import { useAuth } from './AuthContext';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const { addNotification } = useStudent();
  const { user } = useAuth();

  // Initialize appointments and create notifications
  useEffect(() => {
    console.log('Initializing appointments and notifications');
    
    // Initialize with dummy data
    setAppointments(dummyAppointments);
    
    if (!user || !user.id) {
      console.log('No user logged in, skipping dummy notifications');
      return;
    }

    // Check if we've already shown dummy notifications for this user
    const hasShownDummyNotifications = localStorage.getItem(`has_shown_dummy_notifications_${user.id}`);
    
    if (!hasShownDummyNotifications) {
      console.log('Creating dummy notifications for user:', user.id);
      
      // Create notifications for existing dummy appointments
      dummyAppointments.forEach(appointment => {
        if (appointment.status === 'accepted' || appointment.status === 'rejected') {
          const date = new Date(appointment.date).toLocaleString();
          const message = `Your appointment with SCAD on ${date} was ${appointment.status}: ${appointment.description}`;
          
          // Create notification for the logged-in user
          console.log('Creating notification for dummy appointment:', appointment.id);
          addNotification(user.id, message);
        }
      });
      
      // Mark that we've shown the dummy notifications for this user
      localStorage.setItem(`has_shown_dummy_notifications_${user.id}`, 'true');
    }
  }, [addNotification, user]);

  const addAppointment = (appointment) => {
    const newId = addDummyAppointment(appointment);
    setAppointments(prevAppointments => [...prevAppointments, { ...appointment, id: newId }]);
    
    // Create notification for the student
    const studentId = appointment.senderId === 'SCAD' ? appointment.receiverId : appointment.senderId;
    const date = new Date(appointment.date).toLocaleString();
    const message = `New appointment request with SCAD on ${date}: ${appointment.description}`;
    addNotification(studentId, message);
    
    return newId;
  };

  const updateAppointmentStatus = (id, newStatus) => {
    if (updateDummyAppointmentStatus(id, newStatus)) {
      setAppointments(prevAppointments => {
        const updatedAppointments = prevAppointments.map(appointment => {
          if (appointment.id === id) {
            // Create notification for the student
            const studentId = appointment.senderId === 'SCAD' ? appointment.receiverId : appointment.senderId;
            const date = new Date(appointment.date).toLocaleString();
            const message = `Your appointment with SCAD on ${date} was ${newStatus}: ${appointment.description}`;
            addNotification(studentId, message);
            
            return { ...appointment, status: newStatus };
          }
          return appointment;
        });
        return updatedAppointments;
      });
      return true;
    }
    return false;
  };

  const getAppointmentsByUserId = (userId) => {
    if (!userId) return [];
    const userIdStr = userId.toString();
    return appointments.filter(appointment => {
      const senderIdStr = appointment.senderId.toString();
      const receiverIdStr = appointment.receiverId.toString();
      return senderIdStr === userIdStr || receiverIdStr === userIdStr;
    });
  };

  const getAppointmentsByStatus = (status) => {
    return appointments.filter(appointment => appointment.status === status);
  };

  const value = {
    appointments,
    addAppointment,
    updateAppointmentStatus,
    getAppointmentsByUserId,
    getAppointmentsByStatus
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}; 