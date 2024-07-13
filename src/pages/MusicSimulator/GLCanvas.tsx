import { useEffect, useRef } from "react";
import { WebGLApp } from "./gl";
import { GLContext } from "./gl/context";

export const GLCanvas = () => {
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  const gl_ref = useRef<WebGL2RenderingContext | null>(null);
  useEffect(() => {
    const canvas = canvas_ref.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("Device does not support WebGL2");
      return;
    }

    GLContext.create(gl);
    const app = new WebGLApp(canvas);
    gl_ref.current = gl;

    let last_frame_time = -1;
    const render = (now: number) => {
      const dt = last_frame_time > 0 ? (now - last_frame_time) / 1000 : 0.001;
      last_frame_time = now;
      app.render(dt);

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }, []);

  return <canvas ref={canvas_ref} className="w-full h-screen absolute top-0" />;
};
