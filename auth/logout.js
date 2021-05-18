import { auth } from "../store/database.js"

export const logout = async () => {
  try {
    await auth.signOut()
  } catch ({ message }) {
    console.error(message)
  } 
}