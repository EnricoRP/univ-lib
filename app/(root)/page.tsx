import BookList from '@/components/BookList'
import BookOverview from '@/components/BookOverview'
import { sampleBooks } from '@/constants'
import React from 'react'

const Home = () => {
  return <>
  <BookOverview {...sampleBooks[0]} />

  <BookList />
  </>
}

export default Home