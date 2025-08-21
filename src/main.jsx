import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom'
import Homepage from './routes/homepage/Homepage.jsx';
import RootLayout from './layouts/rootLayout/RootLayout.jsx';
import ChatPage from './routes/chatPage/ChatPage.jsx'
import SignInPage from './routes/signInPage/SignInpage.jsx'
import SignUpPage from './routes/signUpPage/SignUpPage.jsx';

const router = createBrowserRouter([
      {
        element: <RootLayout/>,
        children: [
            {
                path: "/", 
                element: <Homepage/>,
            },
            {
                path: "/sign-in/*", 
                element: <SignInPage/>,
            },
            {
                path: "/sign-up/*", 
                element: <SignUpPage/>,
            },
            {
                path: "/chat",
                element: <ChatPage/>,
            },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
