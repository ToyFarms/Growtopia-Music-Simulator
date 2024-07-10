import { useEffect } from "react";

export const ImageConverterPage = ({title}: {title: string}) => {
  useEffect(() => {
    document.title = title;
  }, []);
  return <p>Image Converter</p>
}
