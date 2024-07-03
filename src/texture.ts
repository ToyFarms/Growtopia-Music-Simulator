import { GLObject } from "./gl";

export class Texture extends GLObject {
  src: string;
  texture: WebGLTexture;

  constructor(src: string) {
    super();

    this.src = src;
    this.texture = this.load_texture(src);
  }

  private load_texture(src: string): WebGLTexture {
    const texture = this.gl.createTexture();
    if (!texture) {
      throw new Error;
    }
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      1,
      1,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255]),
    );

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR,
    );

    const image = new Image();
    image.src = src;
    image.onload = () => {
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        image,
      );
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
    };

    return texture;
  }

  bind(): void {
    this.gl.bindTexture(this.id, this.texture);
  }

  unbind(): void {
    this.gl.bindTexture(0, null);
  }

  delete(): void {
    this.gl.deleteTexture(this.texture);
  }
}
