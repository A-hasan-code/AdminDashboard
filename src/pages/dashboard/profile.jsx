import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, updateProfile } from "@/Redux/slices/authslices"; 
import { Card, CardBody, Avatar, Typography, Button, Input, Tooltip } from "@material-tailwind/react";
import { PencilIcon, CameraIcon } from "@heroicons/react/24/solid";

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
        avatar: user.image || ''
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
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
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
            <label className="relative cursor-pointer">
              <Avatar
                src={formData.avatar || "/img/default-avatar.png"}
                alt="Profile Image"
                size="lg"
                variant="rounded"
                className="rounded-lg shadow-lg"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <CameraIcon className="absolute bottom-0 right-0 h-6 w-6 text-white bg-blue-500 rounded-full p-1" />
            </label>
            <div className="text-center">
              <Typography variant="h5" color="blue-gray" className="mb-1">
                {formData.fname || 'Richard Davisa'}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600">
                CEO / Co-Founder
              </Typography>
            </div>
            <Tooltip content="Edit Profile" className="cursor-pointer">
              <PencilIcon className="h-5 w-5 text-blue-gray-500 hover:text-blue-500 transition" />
            </Tooltip>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-6">
              <Input
                label="First Name"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="bg-gray-100 border-blue-gray-300 focus:border-blue-500"
              />
              <Input
                label="Last Name"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="bg-gray-100 border-blue-gray-300 focus:border-blue-500"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-100 border-blue-gray-300 focus:border-blue-500"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading || isSubmitting} 
              className="w-full bg-blue-500 hover:bg-blue-600 transition"
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
