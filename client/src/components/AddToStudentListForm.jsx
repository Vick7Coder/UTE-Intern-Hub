import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { CustomButton, Loading, TextInput } from ".";
import { apiRequest } from "../utils";
import { toast } from "react-toastify";

const AddToStudentListForm = ({ open, setOpen, seekerId }) => {
  const { user } = useSelector((state) => state.user);
  const [allLecturers, setAllLecturers] = useState([]);
  const [filteredLecturers, setFilteredLecturers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lecId, setLecId] = useState("");
  const [selectedLecturerId, setSelectedLecturerId] = useState("");
  const [inputMode, setInputMode] = useState("input"); // "input" or "select"

  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchLecturers = async () => {
      const result = await apiRequest({
        url: '/lecturer',
        token: user.token,
        method: "GET"
      });

      if (result.status === 200) {
        setAllLecturers(result.data.lecturers);
        setFilteredLecturers(result.data.lecturers);
      } else {
        toast.error("Failed to fetch lecturers");
      }
    };

    fetchLecturers();
  }, [user.token]);

  useEffect(() => {
    if (lecId) {
      const filtered = allLecturers.filter(lecturer =>
        lecturer.lecId.toLowerCase().includes(lecId.toLowerCase())
      );
      setFilteredLecturers(filtered);
      clearErrors('lecturerId');
    } else {
      setFilteredLecturers(allLecturers);
    }
  }, [lecId, allLecturers, clearErrors]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    let lecturerIdToSubmit = "";

    if (lecId) {
      // Nếu có giá trị trong TextInput, sử dụng nó trực tiếp
      lecturerIdToSubmit = lecId;
    } else if (selectedLecturerId) {
      lecturerIdToSubmit = selectedLecturerId;
    }

    if (!lecturerIdToSubmit) {
      setError("lecturerId", {
        type: "manual",
        message: "Please select a lecturer or enter a Lecturer ID"
      });
      setIsLoading(false);
      return;
    }

    const result = await apiRequest({
      url: '/lecturer/add-seeker-to-lecturer',
      token: user.token,
      data: { lecturerId: lecturerIdToSubmit, seekerId },
      method: "POST"
    });

    if (result.status === 200) {
      toast.success("User added to student list successfully");
      setOpen(false);
    } else {
      toast.error("Failed to add user to student list");
    }
    setIsLoading(false);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={() => setOpen(false)}>
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
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  Add to Student List
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className='mt-2'>
                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='mode'>
                      Select Mode
                    </label>
                    <div className='flex'>
                      <button
                        type='button'
                        onClick={() => setInputMode("input")}
                        className={`mr-2 py-2 px-4 rounded ${inputMode === "input" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      >
                        Input ID
                      </button>
                      <button
                        type='button'
                        onClick={() => setInputMode("select")}
                        className={`py-2 px-4 rounded ${inputMode === "select" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      >
                        Select Lecturer
                      </button>
                    </div>
                  </div>
                  {inputMode === "input" ? (
                    <div className='mb-4'>
                      <TextInput
                        name='lecId'
                        label='Enter Lecturer ID'
                        placeholder='Enter Lecturer ID'
                        type='text'
                        value={lecId}
                        onChange={(e) => {
                          setLecId(e.target.value);
                          setSelectedLecturerId("");
                        }}
                      />
                    </div>
                  ) : (
                    <div className='mb-4'>
                      <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='lecturer'>
                        Select Lecturer
                      </label>
                      <select
                        {...register("lecturerId")}
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        value={selectedLecturerId}
                        onChange={(e) => {
                          setSelectedLecturerId(e.target.value);
                          setLecId("");
                        }}
                      >
                        <option value="">Select a lecturer</option>
                        {filteredLecturers.map((lecturer) => (
                          <option key={lecturer._id} value={lecturer._id}>
                            {lecturer.name} (ID: {lecturer.lecId})
                          </option>
                        ))}
                      </select>
                      {errors.lecturerId && (
                        <p className='text-red-500 text-xs italic'>{errors.lecturerId.message}</p>
                      )}
                    </div>
                  )}
                  <div className='flex items-center justify-between'>
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <>
                        <CustomButton
                          type='submit'
                          containerStyles='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                          title='Add'
                        />
                        <CustomButton
                          type='button'
                          containerStyles='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                          title='Cancel'
                          onClick={() => setOpen(false)}
                        />
                      </>
                    )}
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

export default AddToStudentListForm;