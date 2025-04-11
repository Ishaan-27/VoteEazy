import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const constituencies = [
  "Varanasi", "Hyderabad", "Amethi", "Lucknow", "Madhubani", "Akola", "Jalandhar", "Haveri", "Viluppuram", "Madurai", "Kallakurichi", "Sivaganga"
];

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    mobileNumber: '', aadharNumber: '', address: '',
    landmark: '', city: '', state: '', pincode: '', constituency: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(formData.email, formData.password);
    navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-cover bg-center" style={{ backgroundImage: "url('https://dktmdipdmljrgorzzlgl.supabase.co/storage/v1/object/sign/img/1713708796-1738.avif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWcvMTcxMzcwODc5Ni0xNzM4LmF2aWYiLCJpYXQiOjE3NDM2NTk2NjYsImV4cCI6MTc3NTE5NTY2Nn0.resN97XdNhz51vpKRbDmAVE7IdjEgnEazJ0gTe64YjE')" }}>
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" placeholder="First Name" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" placeholder="Last Name" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" placeholder="Email Address" />
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md pr-10"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" placeholder="Mobile Number" />
            <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" placeholder="Aadhar Number" />
            
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" placeholder="Address" />
              <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" placeholder="Landmark" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" placeholder="City" />
              <select name="state" value={formData.state} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" placeholder="Pincode" />
            </div>

            <div>
              <select name="constituency" value={formData.constituency} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                <option value="">Select Constituency</option>
                {constituencies.map((constituency) => (
                  <option key={constituency} value={constituency}>{constituency}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="w-full py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
            Register
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;