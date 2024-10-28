import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Button, Input } from "@material-tailwind/react";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addUserThunk, editUserThunk } from '@/Redux/slices/User.Slice'; // Adjusted function name

export const AddUsers = ({ isOpen, onClose, userData }) => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (userData) {
      setFirstName(userData.first_name || '');
      setLastName(userData.last_name || '');
      setEmail(userData.email || '');
    } else {
      resetForm();
    }
  }, [userData, isOpen]);

 const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { first_name: firstName, last_name: lastName, email };

        try {
            if (userData) {
                // Update user
                await dispatch(editUserThunk({ id: userData.id, userData: user })).unwrap();
                toast.success('User updated successfully!');
            } else {
                // Add new user
                await dispatch(addUserThunk(user)).unwrap();
                toast.success('User created successfully!');
            }
            resetForm();
            
            onClose(); // Close the modal or form
        } catch (error) {
            toast.error(error.message || 'Error saving user');
        }
    };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="z-90">
      <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="mx-auto max-w-lg rounded-lg bg-white p-10 shadow-lg transition-all duration-300 ease-in-out transform">
          <Dialog.Title className="text-xl font-semibold text-gray-800 mb-8">
            {userData ? 'Edit User' : 'Add New User'}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              type="text" 
              placeholder="First Name" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              required 
              className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <Input 
              type="text" 
              placeholder="Last Name" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              required 
              className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <Input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <div className="flex justify-between mt-8 space-x-4">
              <Button type="button" onClick={onClose} color="red" className="hover:bg-red-600 transition duration-200">
                Cancel
              </Button>
              <Button type="submit" color="lightBlue" className="hover:bg-lightBlue-600 transition duration-200">
                {userData ? 'Update User' : 'Add User'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
