import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { CustomButton, Loading, TextInput } from ".";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiRequest, handleFileUpload } from "../utils";
import { toast } from "react-toastify";

const AdminForm = ({ open, setOpen }) => {
  const { user } = useSelector((state) => state.user);

  const schema = yup.object().shape({
    name: yup.string().min(6, "At least 6 characters").required(),
    location: yup.string().min(4, "At least 4 characters").required(),
    contact: yup.string().min(10, "Enter a valid contact number").required(),
    about: yup.string().min(80, "Tell us about your admin").required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user },
    resolver: yupResolver(schema),
  });

  const [profileImage, setProfileImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);

    const logoURL = profileImage && (await handleFileUpload(profileImage));

    const updatedData = logoURL ? { ...data, profileUrl: logoURL } : data;

    const result = await apiRequest({
      url: "/admin/update-admin",
      token: user.token,
      data: updatedData,
      method: "PUT",
    });

    if (result.status === 200) {
      setIsLoading(false);
      toast.success(result.data.message);

      // Update local storage if the name changes
      let storeData = JSON.parse(localStorage.getItem("user"));
      storeData.name = data.name;
      localStorage.setItem("user", JSON.stringify(storeData));

      setTimeout(() => {
        window.location.reload();
      }, 900);
    } else {
      console.log(result);
      setIsLoading(false);
      toast.error("An error occurred");
    }
  };

  const closeModal = () => setOpen(false);

  return (
    <>
      <Transition appear show={open ?? false} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all mt-[100px]">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Edit Admin Profile
                  </Dialog.Title>
                  <form
                    className="w-full mt-2 flex flex-col gap-5"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <TextInput
                      name="name"
                      label="Admin Name"
                      placeholder="Admin Name"
                      type="text"
                      register={register("name")}
                      error={errors.name && errors.name.message}
                    />

                    <TextInput
                      name="location"
                      label="Location/Address"
                      placeholder="e.g., California"
                      type="text"
                      register={register("location")}
                      error={errors.location && errors.location.message}
                    />

                    <div className="w-full sm:flex gap-2">
                      <div className="w-full sm:w-1/2">
                        <TextInput
                          name="contact"
                          label="Contact"
                          placeholder="Contact"
                          length="maxLength"
                          type="text"
                          register={register("contact")}
                          error={errors.contact && errors.contact.message}
                        />
                      </div>
                      <div className="w-full sm:w-1/2">
                        <TextInput
                          name="profileImage"
                          label="Profile Image"
                          placeholder="Profile Image"
                          type="file"
                          register={register("profileImage")}
                          onChange={(e) => setProfileImage(e.target.files[0])}
                        />
                      </div>
                    </div>

                    <TextInput
                      name="about"
                      label="About"
                      placeholder="Tell us about your admin"
                      type="textarea"
                      register={register("about")}
                      error={errors.about && errors.about.message}
                    />

                    <div className="mt-4 flex justify-end gap-3">
                      <CustomButton
                        type="button"
                        text="Cancel"
                        className="bg-gray-400 text-white px-4 py-2 rounded-md"
                        onClick={closeModal}
                      />
                      <CustomButton
                        type="submit"
                        text={isLoading ? <Loading /> : "Save"}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        disabled={isLoading}
                      />
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AdminForm;