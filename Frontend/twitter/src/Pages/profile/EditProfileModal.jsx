import { useState } from "react";
import {useMutation, useMutationState, useQuery, useQueryClient} from "@tanstack/react-query"
import LoadingSpinner from "../../Components/common/LoadingSpinner";
import toast from "react-hot-toast";
const EditProfileModal = () => {
	const queryClient = useQueryClient()

	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const {data:user} = useQuery({queryKey:["authUser"]})

	const { mutate: update, isPending } = useMutation({
		mutationFn: async () => {
		  try {
			const res = await fetch(`/api/user/update/${user.Userdetails._id}`, {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({
				fullName: formData.fullName,
				userName: formData.username,
				email: formData.email,
				bio: formData.bio,
				link: formData.link,
				newPassword: formData.newPassword,
				currentPassword: formData.currentPassword,
			  }),
			});
			const data = await res.json();
			return data;
		  } catch (error) {
			throw new Error(error.message);
		  }
		},
		onSuccess: () => {
		  toast.success("Data updated");
		  document.getElementById("edit_profile_modal").close()
		  queryClient.invalidateQueries(["profile"])
		  
		},
		onError: () => {
		  toast.error("Error in updating");
		},
	  });
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleUpdate = ()=>{
		
		update()
	}

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							handleUpdate()
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white' >
							
							{isPending ? <LoadingSpinner/> : 'Update'}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;