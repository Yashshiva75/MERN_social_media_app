import { Link } from "react-router-dom";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import RightPanelSkeleton from "../skeletons/RightPanelSkeletons";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../Hooks/useFollow"
import LoadingSpinner from "../common/LoadingSpinner"

const RightPanel = () => {
	const {data:suggestedUsers,isLoading} = useQuery({
		queryKey:["suggestedUser"],
		queryFn:async()=>{
			const res = await fetch("/api/user/suggested")
			const data = await res.json()
			
			return data
		}
	})

	const {follow,isPending} = useFollow()
	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.userName}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileimg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.userName}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault()
											follow(user._id)}
										}
									>
										{isPending ? <LoadingSpinner/> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;