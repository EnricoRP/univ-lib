'use client';
import AuthForm from '@/components/AuthForm';
import { signInSchema } from '@/lib/validations';
import React from 'react'

const page = () => (
  <AuthForm 
    type='SIGN_IN'
    schema={signInSchema}
    defaultValues={{
      email:'',
      password:'' 
    }} 
    onSubmit={async (data) => {
      console.log(data); 
      return { success: true }; 
    }}
  />
);

export default page