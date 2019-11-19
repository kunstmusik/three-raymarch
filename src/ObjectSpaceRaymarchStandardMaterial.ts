import { Color, UniformsUtils, UniformsLib } from 'three';
import { ObjectSpaceRaymarchMaterial, ObjectSpaceRaymarchMaterialParameters } from './ObjectSpaceRaymarchMaterial';
import { ShaderChunk } from './shaders/ShaderChunk';

export interface ObjectSpaceRaymarchStandardMaterialParameters extends ObjectSpaceRaymarchMaterialParameters {
  color?: Color,
  emissive?: Color,
  metalness?: number,
  roughness?: number,
  getMaterialChunk?: string,
}

export class ObjectSpaceRaymarchStandardMaterial extends ObjectSpaceRaymarchMaterial {
  constructor(parameters: ObjectSpaceRaymarchStandardMaterialParameters = {}) {
    const overrideChunks: {[key: string]: string} = {};
    if (parameters.getDistanceChunk) {
      overrideChunks.distance_pars_fragment = parameters.getDistanceChunk;
    }
    if (parameters.getMaterialChunk) {
      overrideChunks.standard_get_material_pars_fragment = parameters.getMaterialChunk;
    }
    super(
      ShaderChunk.raymarch_standard_frag,
      overrideChunks,
      Object.assign({}, parameters, {
        uniforms: UniformsUtils.merge([
          parameters.uniforms ? parameters.uniforms : {},
          UniformsLib.lights,
          UniformsLib.fog,
          {
            'diffuse': { value: parameters.color ? parameters.color : new Color(0xffffff) },
            'emissive': { value: parameters.emissive ? parameters.emissive : new Color(0x000000) },
            'metalness': { value: parameters.metalness !== undefined ? parameters.metalness : 0.5 },
            'roughness': { value: parameters.roughness !== undefined ? parameters.roughness : 0.5 },
          }
        ]),
      }),
    );
    this.lights = true;
    this.fog = true;
  }

  get color(): Color {
    return this.uniforms['diffuse'].value.clone();
  }

  set color(color: Color) {
    this.uniforms['diffuse'].value = color.clone();
  }

  get emissive(): Color {
    return this.uniforms['emissive'].value.clone();
  }

  set emissive(emissive) {
    this.uniforms['emissive'].value = emissive.clone();
  }

  get metalness(): number {
    return this.uniforms['metalness'].value;
  }

  set metalness(metalness: number) {
    this.uniforms['metalness'].value = metalness;
  }

  get roughness(): number {
    return this.uniforms['roughness'].value;
  }

  set roughness(roughness: number) {
    this.uniforms['roughness'].value = roughness;
  }

}