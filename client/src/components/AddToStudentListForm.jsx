import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { CustomButton, Loading } from ".";
import { apiRequest } from "../utils";
import { toast } from "react-toastify";

const AddToStudentListForm = ({ open, setOpen, seekerId }) => {
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [lecId, setLecId] = useState("");
  const [lecturerInfo, setLecturerInfo] = useState(null);

  const checkLecturerInfo = async () => {
    setIsLoading(true);
    try {
      const result = await apiRequest({
        url: `/lecturer/get-lecturer-i4/${lecId}`,
        token: user.token,
        method: "GET"
      });

      if (result.status === 200) {
        setLecturerInfo(result.data);
      } else {
        toast.error(result.message || "Failed to fetch lecturer information");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching lecturer information");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const trimmedLecId = lecId.trim();

    if (!trimmedLecId) {
      toast.error("Please enter a Lecturer ID");
      setIsLoading(false);
      return;
    }

    try {
      const result = await apiRequest({
        url: '/lecturer/add-seeker-to-lecturer',
        token: user.token,
        data: { lecturerId: trimmedLecId, seekerId },
        method: "POST"
      });

      if (result.status === 200) {
        toast.success("User added to student list successfully");
        setOpen(false);
      } else {
        toast.error(result.message || "Failed to add user to student list");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while processing your request");
    } finally {
      setIsLoading(false);
    }
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
                <form onSubmit={onSubmit} className='mt-4'>
                  <div className='mb-6'>
                    <label htmlFor='lecId' className='block text-sm font-medium text-gray-700'>
                      Enter Lecturer ID
                    </label>
                    <div className="mt-2 flex rounded-md shadow-sm">
                      <input
                        id='lecId'
                        name='lecId'
                        type='text'
                        placeholder='Enter Lecturer ID'
                        value={lecId}
                        onChange={(e) => {
                          setLecId(e.target.value);
                        }}
                        required
                        className='flex-1 block w-full rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                      <CustomButton
                        type='button'
                        containerStyles='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:shadow-outline'
                        title='Check Info'
                        onClick={checkLecturerInfo}
                      />
                    </div>
                  </div>

                  {lecturerInfo && (
                    <div className="mb-6 p-4 bg-gray-100 rounded-md">
                      <h4 className="font-bold">Lecturer Information:</h4>
                      <p>Name: {lecturerInfo.name}</p>
                      <p>Email: {lecturerInfo.email}</p>
                      <p>Fal: {lecturerInfo.location}</p>
                      <p>Students: {lecturerInfo.studentLists.length}</p>
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