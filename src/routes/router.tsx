// routes/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "../screens/signin";
import { ErrorPage } from "../screens/error";
import { PrivateRoute } from "./private-route";
import { PublicRoute } from "./public-route";
import { Users } from "@/screens/users";
import { Advisors } from "@/screens/advisors";
import { Theses } from "@/screens/theses";
import { Home } from "@/screens/home";
import { ThesisDetails } from "@/screens/thesis-details";
import { Navbar } from "@/components/navbar";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/thesis/:thesisId",
    element: (
      <>
        <Navbar />
        <ThesisDetails />,
      </>
    ),
  },
  {
    path: "/signin",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <Theses />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/advisors",
    element: (
      <PrivateRoute>
        <Advisors />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/profile",
    element: (
      <PrivateRoute>
        <div>Profile Page</div>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <PrivateRoute>
        <Users />
      </PrivateRoute>
    ),
  },
]);
