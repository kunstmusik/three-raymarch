import { Color, UniformsLib, UniformsUtils } from 'three';
import { ObjectSpaceRaymarchMaterial, ObjectSpaceRaymarchMaterialParameters } from './ObjectSpaceRaymarchMaterial';
import { ShaderChunk } from './shaders/ShaderChunk';

export interface ObjectSpaceRaymarchLambertMaterialParameters extends ObjectSpaceRaymarchMaterialParameters {
  color?: Color,
  emissive?: Color,
  getMaterialChunk?: string,
}

export class ObjectSpaceRaymarchLambertMaterial extends ObjectSpaceRaymarchMaterial {
  constructor(parameters: ObjectSpaceRaymarchLambertMaterialParameters = {}) {
    const overrideChunks: {[key: string]: string} = {};
    if (parameters.getColorChunk) {
      overrideChunks.distance_pars_fragment = parameters.getColorChunk;
    }
    if (parameters.getMaterialChunk) {
      overrideChunks.lambert_get_material_pars_fragment = parameters.getMaterialChunk;
    }
    super(
      ShaderChunk.raymarch_lambert_frag,
      {},
      Object.assign({}, parameters, {
      uniforms: UniformsUtils.merge([
        parameters.uniforms ? parameters.uniforms : {},
        UniformsLib.fog,
        UniformsLib.lights,
        {
          'diffuse': { value: parameters.color ? parameters.color : new Color(0xffffff) },
          'emissive': { value: parameters.emissive ? parameters.emissive : new Color(0x000000) },
        }
      ]),
    }));
    this.lights = true;
    this.fog = true;
  }
}