import { useEffect } from "react";

export const NotFoundPage = ({title}: {title: string}) => {
  useEffect(() => {
    document.title = title;
  }, []);
  return <>
    <p>Page not Found</p>
    <p>{window.location.pathname}</p>
  </>
};
