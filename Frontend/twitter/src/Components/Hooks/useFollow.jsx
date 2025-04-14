import { useMutation,useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = ()=>{
    const queryClient = useQueryClient()

    const {mutate:follow,isPending} = useMutation({
        mutationFn:async(userId)=>{
            try{
                const res = await fetch(`/api/user/follow/${userId}`,{
                method:"POST",
            })
            const data = await res.json()

            if(!res.ok){
                throw new error(data.message)
            }
            return data
        }catch(error){
            throw new Error(error.message)
        }
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:"suggestedUser"})
            queryClient.invalidateQueries({queryKey:"authUser"})
            toast.success("You followed this")
        },
        onError:()=>{
            toast.error("error in following")
        }
    })
    return {follow,isPending}
}

export default useFollow