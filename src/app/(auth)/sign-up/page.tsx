'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, useForm ,FormProvider} from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from "axios"
import { ApiResponse } from '@/types/ApiResponse'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

function page() {
  const [username,setUsername]=useState("");
  const [usernameMessage,setUsernameMessage]=useState("");
  const [isCheckingUsername,setIsCheckingUsername]=useState(false);
  const [isSubmitting,setIsSubmitting]=useState(false);
  const debounced=useDebounceCallback(setUsername,400);
  const {toast} = useToast()
  const router = useRouter()
  const methods = useForm();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: '',
      password: '',
    },
  });
  

  useEffect(()=>{
    const checkUsernameUnique=async () => {
    if(username){
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
            const response = await axios.get<ApiResponse>(
                `/api/check-username-unique?username=${username}`
            );
            setUsernameMessage(response.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            setUsernameMessage(
                axiosError.response?.data.message??'error checking username'
            );
        }finally {
            setIsCheckingUsername(false);
          }
         }        
    };
    checkUsernameUnique();
  },[username]);

  const onSubmit = async (data:z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true);
    try {
        const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
      setIsSubmitting(false)
    } catch (error) {
        console.error('Error during sign-up:', error);

        const axiosError = error as AxiosError<ApiResponse>;
  
        // Default error message
        let errorMessage = axiosError.response?.data.message;
        ('There was a problem with your sign-up. Please try again.');
  
        toast({
          title: 'Sign Up Failed',
          description: errorMessage,
          variant: 'destructive',});
          setIsSubmitting(false);
    }
  }

  return (
    
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Join True Feedback
                </h1>
                <p className="mb-4">Sign up to start your anonymous adventure</p>
            </div>
            <FormProvider {...methods}>
            
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                            <FormItem>
                            <FormLabel>Username</FormLabel>
                            <Input 
                            {...field}
                            onChange={(e)=>{
                            field.onChange(e);
                            debounced(e.target.value);
                            }}/>
                            {isCheckingUsername && <Loader2 className="animate-spin" />}
                            {!isCheckingUsername && usernameMessage && (
                            <p
                                className={`text-sm ${
                                    usernameMessage === 'Username is unique'
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                    }`}
                              >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input {...field}
                    name = "email"></Input>
                    <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                    <FormMessage />
                    </FormItem>
                )}
                />

        <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />

         <Button type="submit" className='w-full' disabled ={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
      </form>
    
    </FormProvider>
    <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
        </div>
  </div>
);
}

export default page