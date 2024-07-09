import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from "../components";
import { apiRequest } from '../utils';

const AdminRegisterForm = ({ open, setOpen }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        repeatPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check for empty fields
        for (const key in formData) {
            if (formData[key].trim() === '') {
                setError(`${key.charAt(0).toUpperCase() + key.slice(1)} cannot be empty`);
                return;
            }
        }

        if (formData.password !== formData.repeatPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Sending data:', formData); // Log the form data before sending
            const response = await apiRequest({
                url: '/admin/register',
                method: 'POST',
                data: {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                },
            });

            // Check for a 2xx status code to determine success
            if (response.status >= 200 && response.status < 300) {
                toast.success('Admin registered successfully');
                setOpen(false);
                navigate('/admin');
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed with this email!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as='div' className='relative z-50' onClose={() => setOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black bg-opacity-25' />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                <Dialog.Title
                                    as='h3'
                                    className='text-lg font-semibold leading-6 text-gray-900 mb-4'
                                >
                                    Register New Admin
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className='mt-2'>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="repeatPassword">
                                            Repeat Password
                                        </label>
                                        <input
                                            id="repeatPassword"
                                            name="repeatPassword"
                                            type="password"
                                            value={formData.repeatPassword}
                                            onChange={handleChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>

                                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

                                    <div className='mt-4 flex justify-between'>
                                        <button
                                            type='submit'
                                            className={`bg-blue-600 text-white px-4 py-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Registering...' : 'Register Admin'}
                                        </button>
                                        <button
                                            type='button'
                                            className='bg-red-600 text-white px-4 py-2 rounded-md'
                                            onClick={() => setOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AdminRegisterForm;