import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Register } from "../components/Register.jsx";
import { Login } from "../components/Login.jsx"; 



export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	

	return (
		<div className="text-center mt-5">
			 <Register />
			 <Login /> 
		</div>
	);
}; 