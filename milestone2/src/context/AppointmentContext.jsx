import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyAppointments, addAppointment as addDummyAppointment, updateAppointmentStatus as updateDummyAppointmentStatus } from '../data/dummyData';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Initialize with dummy data
    setAppointments(dummyAppointments);
  }, []);

  const addAppointment = (appointment) => {
    const newId = addDummyAppointment(appointment);
    setAppointments(prevAppointments => [...prevAppointments, { ...appointment, id: newId }]);
    return newId;
  };

  const updateAppointmentStatus = (id, newStatus) => {
    if (updateDummyAppointmentStatus(id, newStatus)) {
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id.toString() === id.toString()
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      return true;
    }
    return false;
  };

  const getAppointmentsByUserId = (userId) => {
    return appointments.filter(appointment =>
      appointment.senderId === userId || appointment.receiverId === userId
    );
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