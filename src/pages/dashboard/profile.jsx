import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, updateProfile } from "@/Redux/slices/authslices"; 
import { Card, CardBody, Avatar, Typography, Button } from "@material-tailwind/react";
import { CameraIcon } from "@heroicons/react/24/solid";
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';

export function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    mobile: '',
    email: '',
    image: ''  
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Local loading state

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setFormData({
        fname: user.first_name || '',
        lname: user.last_name || '',
        email: user.email || '',
        image: user.image || '' // Ensure that the `user.image` exists
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));  // Ensure `avatar` is set correctly
      };
      reader.onerror = () => {
        console.error('File reading error');
        alert("Failed to read the image file. Please try again.");
      };
      reader.readAsDataURL(file); // This reads the image as a Data URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fname || !formData.lname) {
      alert("First name and last name are required.");
      return;
    }

    setIsSubmitting(true); // Set loading state to true
    try {
      await dispatch(updateProfile(formData)).unwrap(); // Assuming updateProfile returns a promise
      dispatch(fetchUser()); // Fetch user data after successful update
    } catch (error) {
      alert("Failed to update profile. Please try again."); // Handle error
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-cover bg-center bg-[url('/img/background-image.png')]">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100 shadow-lg">
        <CardBody className="p-6">
          <div className="flex flex-col items-center mb-8">
            <FormLabel className="relative cursor-pointer">
              <Avatar
                src={formData.image||"" }
                size="lg"
                variant="rounded"
                className="rounded-lg shadow-lg"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" // Hide the input, trigger it with the CameraIcon
              />
              <CameraIcon className="absolute bottom-0 right-0 h-6 w-6 text-white bg-blue-500 rounded-full p-1" />
            </FormLabel>
            <div className="text-center">
              <Typography variant="h5" color="blue-gray" className="mb-1">
                {formData.fname || 'Richard Davisa'}  {formData.lname || 'Richard Davisa'}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600">
                {formData.email}
              </Typography>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-6">
              <TextField
                label="First Name"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="bg-gray-100 border-blue-gray-300 focus:border-black"
              />
              <TextField
                label="Last Name"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="bg-gray-100 border-blue-gray-300 focus:border-black"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-100 border-blue-gray-300 focus:border-black"
              />
            </div>
            <Button 
              variant="outlined"
              type="submit" 
              disabled={loading || isSubmitting} 
              className="w-[30vh] hover:bg-black hover:text-white transition justify-center flex-row mx-auto"
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
