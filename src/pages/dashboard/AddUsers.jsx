import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Button, Input } from "@material-tailwind/react";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addUserThunk, editUserThunk } from '@/Redux/slices/User.Slice'; // Adjusted function name
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { Box,Card } from '@mui/material';

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
    e.preventDefault(); // Prevent page refresh on form submission
    const user = { first_name: firstName, last_name: lastName, email };
    console.log(user);
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
      <Card  className="fixed inset-0 flex items-center justify-center">
        <Typography className="mx-auto max-w-lg rounded-lg bg-white p-10 shadow-lg transition-all duration-300 ease-in-out transform">
          <Typography  component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', margin:'20px' }}>
            {userData ? 'Edit User' : 'Add New User'}
          </Typography>
          {/* Wrap form fields inside a form */}
          <Box
            component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <TextField
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormControl>
              <TextField
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormControl>
              <TextField
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              {/* Change button type to submit */}
              <Button
                type="button"
                onClick={onClose}
                color="black"
                variant="outlined"
                className="hover:bg-red-800 transition duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit" // Submit type
                color="black"
                variant="outlined"
                className="hover:bg-light-green-500 transition duration-200"
              >
                {userData ? 'Update User' : 'Add User'}
              </Button>
            </Box>
          </Box>
        </Typography>
      </Card>
    </Dialog>
  );
};

