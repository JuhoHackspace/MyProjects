import { useContext } from "react"
import { LoginDataContext } from "./LoginDataContext"

export const useLoginData = () => {
    return useContext(LoginDataContext)
}