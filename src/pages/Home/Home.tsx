import { useEffect } from "react";
import { Link } from "react-router-dom";

export const HomePage = ({title}: {title: string}) => {
  useEffect(() => {
    document.title = title;
  }, []);
  return (
    <>
      <p>Home</p>
      <ul>
        <li>
          <Link to="/music">Music Simulator</Link>
        </li>
        <li>
          <Link to="/image-converter">Image Converter</Link>
        </li>
      </ul>
    </>
  );
};
