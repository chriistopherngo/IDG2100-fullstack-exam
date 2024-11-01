import { useEffect } from "react";
// Source: https://stackoverflow.com/questions/73507189/how-to-perform-a-beforeunload-event-on-react

// show a warning message when the user tries to refresh the page
export function useBeforeUnload(event) {
    useEffect(() => {
      const handleBeforeUnload = (event) => {
        // Prevent the window from closing
        event.preventDefault();
        // Chrome requires returnValue to be set
        event.returnValue = "";
        return "Are you sure you want to leave? Any unsaved changes will be lost!";
      };
  
      // Adding event listener on component mount
      window.addEventListener("beforeunload", handleBeforeUnload);
  
      // Removing event listener on component unmount
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, []); 
  }