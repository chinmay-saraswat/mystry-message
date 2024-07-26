import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

function page() {
  const [username,setUsername]=useState("");
  const [usernameMessage,setUsernameMessage]=useState("");
  const [isCheckingUsername,setIsCheckingUsername]=useState(false);
  const [isSubmitting,setIsSubmitting]=useState(false);
  const debouncedUsername=useDebounceValue(username,400);
  const {toast} = useToast()
  const router = useRouter()
  return (
    <div>page</div>
  )
}

export default page